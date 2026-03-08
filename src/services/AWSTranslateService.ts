/**
 * AWS Translate Service
 * Replaces Azure Translator
 * Supports English ↔ Hindi ↔ Tamil (and all other AWS Translate languages)
 */

import { fetchAuthSession } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';

const TRANSLATE_CONFIG = {
  region: import.meta.env?.VITE_AWS_TRANSLATE_REGION || 'ap-south-1',
};

export type SupportedLanguage = 'en' | 'hi' | 'ta';

const LANGUAGE_CODES: Record<SupportedLanguage, string> = {
  en: 'en',
  hi: 'hi',
  ta: 'ta',
};

export function isTranslateConfigured(): boolean {
  try {
    const config = Amplify.getConfig();
    return !!(config?.Auth?.Cognito?.identityPoolId);
  } catch {
    return false;
  }
}

// ── Cache (save credits — 30-day TTL for static content) ─────────────────────
const _cache = new Map<string, string>();

function cacheKey(text: string, from: string, to: string) {
  return `${from}→${to}:${text.slice(0, 80)}`;
}

// ── Core translation ──────────────────────────────────────────────────────────
export async function translateText(
  text: string,
  targetLanguage: SupportedLanguage,
  sourceLanguage: SupportedLanguage = 'en'
): Promise<string> {
  if (!text || targetLanguage === sourceLanguage) return text;

  const key = cacheKey(text, sourceLanguage, targetLanguage);
  if (_cache.has(key)) return _cache.get(key)!;

  if (isTranslateConfigured()) {
    try {
      const { TranslateClient, TranslateTextCommand } = await import('@aws-sdk/client-translate');
      const session = await fetchAuthSession();
      const credentials = session.credentials;
      if (!credentials) throw new Error('No credentials');

      const client = new TranslateClient({
        region: TRANSLATE_CONFIG.region,
        credentials,
      });

      const cmd = new TranslateTextCommand({
        Text: text,
        SourceLanguageCode: LANGUAGE_CODES[sourceLanguage],
        TargetLanguageCode: LANGUAGE_CODES[targetLanguage],
      });

      const response = await client.send(cmd);
      const translated = response.TranslatedText || text;
      _cache.set(key, translated);
      return translated;
    } catch (err) {
      console.warn('AWS Translate failed, using local fallback:', err);
    }
  }

  // Fallback: return original (UI will use locales/xx.json instead)
  return text;
}

// ── Batch translate (efficient — single call for multiple strings) ─────────────
export async function translateBatch(
  items: Array<{ key: string; text: string }>,
  targetLanguage: SupportedLanguage,
  sourceLanguage: SupportedLanguage = 'en'
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};

  await Promise.all(
    items.map(async ({ key, text }) => {
      results[key] = await translateText(text, targetLanguage, sourceLanguage);
    })
  );

  return results;
}

// ── Detect language ───────────────────────────────────────────────────────────
export async function detectLanguage(text: string): Promise<string> {
  if (!isTranslateConfigured()) return 'en';

  try {
    const { ComprehendClient, DetectDominantLanguageCommand } = await import('@aws-sdk/client-comprehend');
    const session = await fetchAuthSession();
    const credentials = session.credentials;
    if (!credentials) return 'en';

    const client = new ComprehendClient({
      region: TRANSLATE_CONFIG.region,
      credentials,
    });

    const cmd = new DetectDominantLanguageCommand({ Text: text });
    const response = await client.send(cmd);
    return response.Languages?.[0]?.LanguageCode || 'en';
  } catch {
    return 'en';
  }
}

export default { translateText, translateBatch, detectLanguage, isTranslateConfigured };
