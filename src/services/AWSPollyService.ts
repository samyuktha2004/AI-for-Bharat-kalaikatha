/**
 * AWS Polly Service — Text-to-Speech
 * Replaces Azure Cognitive Speech TTS
 * Supports: English (Aditi), Hindi (Kajal), Tamil (Aditi)
 */

import { fetchAuthSession } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';

const POLLY_CONFIG = {
  region: import.meta.env?.VITE_AWS_POLLY_REGION || 'ap-south-1',
  voices: {
    en: import.meta.env?.VITE_AWS_POLLY_VOICE_ENGLISH || 'Aditi',
    hi: import.meta.env?.VITE_AWS_POLLY_VOICE_HINDI || 'Kajal',
    ta: import.meta.env?.VITE_AWS_POLLY_VOICE_TAMIL || 'Aditi',
  } as Record<string, string>,
};

export function isPollyConfigured(): boolean {
  try {
    const config = Amplify.getConfig();
    return !!(config?.Auth?.Cognito?.identityPoolId);
  } catch {
    return false;
  }
}

// ── Audio cache (avoid repeated API calls for same text) ─────────────────────
const _audioCache = new Map<string, string>(); // text+lang → objectURL

let _currentAudio: HTMLAudioElement | null = null;

// ── Speak text ────────────────────────────────────────────────────────────────
export async function speakText(text: string, language: string = 'en'): Promise<void> {
  stopSpeaking();

  // Check cache first
  const key = `${language}:${text.slice(0, 200)}`;
  if (_audioCache.has(key)) {
    _currentAudio = new Audio(_audioCache.get(key)!);
    await _currentAudio.play();
    return;
  }

  if (isPollyConfigured()) {
    try {
      const { PollyClient, SynthesizeSpeechCommand, Engine, OutputFormat, VoiceId } = await import('@aws-sdk/client-polly');
      const session = await fetchAuthSession();
      const credentials = session.credentials;
      if (!credentials) throw new Error('No credentials');

      const client = new PollyClient({
        region: POLLY_CONFIG.region,
        credentials,
      });

      const voiceId = (POLLY_CONFIG.voices[language] || POLLY_CONFIG.voices['en']) as typeof VoiceId[keyof typeof VoiceId];

      const cmd = new SynthesizeSpeechCommand({
        Text: text.slice(0, 3000), // Polly limit
        VoiceId: voiceId,
        OutputFormat: OutputFormat.MP3,
        Engine: Engine.STANDARD,
      });

      const response = await client.send(cmd);

      if (response.AudioStream) {
        const chunks: Uint8Array[] = [];
        const reader = (response.AudioStream as any).getReader?.();

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
          }
        } else {
          // Node-like stream — only happens in non-browser; fallback
          throw new Error('Stream reader unavailable');
        }

        const blob = new Blob(chunks, { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        _audioCache.set(key, url);

        _currentAudio = new Audio(url);
        await _currentAudio.play();
        return;
      }
    } catch (err) {
      console.warn('Polly TTS failed, using browser speechSynthesis:', err);
    }
  }

  // Fallback: browser Web Speech API
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  }
}

// ── Stop speaking ─────────────────────────────────────────────────────────────
export function stopSpeaking(): void {
  if (_currentAudio) {
    _currentAudio.pause();
    _currentAudio.currentTime = 0;
    _currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}

// ── Check if speaking ─────────────────────────────────────────────────────────
export function isSpeaking(): boolean {
  if (_currentAudio && !_currentAudio.paused) return true;
  if ('speechSynthesis' in window) return speechSynthesis.speaking;
  return false;
}

export default { speakText, stopSpeaking, isSpeaking, isPollyConfigured };
