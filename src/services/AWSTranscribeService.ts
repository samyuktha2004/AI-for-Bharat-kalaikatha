/**
 * AWS Transcribe Service — Speech-to-Text
 * Replaces Azure Cognitive Speech STT
 * Supports real-time transcription for voice input
 *
 * For hackathon MVP:
 * - If Transcribe is configured → uses AWS Transcribe Streaming
 * - Fallback → browser Web Speech API (works without AWS)
 */

import { fetchAuthSession } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';

const TRANSCRIBE_CONFIG = {
  region: import.meta.env?.VITE_AWS_TRANSCRIBE_REGION || 'ap-south-1',
};

type TranscribeLanguage = 'en-IN' | 'hi-IN' | 'ta-IN';

const LANG_CODE_MAP: Record<string, TranscribeLanguage> = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
};

export function isTranscribeConfigured(): boolean {
  try {
    const config = Amplify.getConfig();
    return !!(config?.Auth?.Cognito?.identityPoolId);
  } catch {
    return false;
  }
}

// ── Browser Web Speech API fallback ──────────────────────────────────────────
function startBrowserSpeech(
  language: string,
  onResult: (text: string, isFinal: boolean) => void,
  onError: (error: string) => void
): () => void {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    onError('Voice input not supported in this browser. Please use Chrome or Edge.');
    return () => {};
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = LANG_CODE_MAP[language] || 'en-IN';

  recognition.onresult = (event: any) => {
    let interim = '';
    let final = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        final += transcript;
      } else {
        interim += transcript;
      }
    }

    if (final) onResult(final, true);
    else if (interim) onResult(interim, false);
  };

  recognition.onerror = (event: any) => onError(event.error || 'Voice recognition error');

  recognition.start();

  return () => recognition.stop();
}

// ── Main voice input function ─────────────────────────────────────────────────
/**
 * Start voice input.
 * Returns a stop function — call it to end recording.
 */
export function startVoiceInput(
  language: string = 'en',
  onResult: (text: string, isFinal: boolean) => void,
  onError: (error: string) => void
): () => void {
  // For hackathon MVP: always use browser speech first (it's free and simpler)
  // AWS Transcribe Streaming requires WebSocket + complex setup
  // Browser STT works great for demo purposes
  return startBrowserSpeech(language, onResult, onError);
}

// ── Transcribe audio file (batch, non-streaming) ──────────────────────────────
export async function transcribeAudioFile(
  audioBlob: Blob,
  language: string = 'en'
): Promise<string> {
  // Note: For full AWS Transcribe job-based transcription, audio must be uploaded to S3 first.
  // For hackathon, browser speech API is sufficient. This is a placeholder for production.
  console.log('Batch transcription: For production, upload audio to S3 then start Transcribe job.');
  return '';
}

export default { startVoiceInput, transcribeAudioFile, isTranscribeConfigured };
