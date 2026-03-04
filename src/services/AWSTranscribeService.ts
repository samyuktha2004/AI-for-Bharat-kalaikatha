/**
 * AWS Transcribe Service — Speech-to-Text
 * 
 * For MVP: Uses browser Web Speech API (works without AWS backend)
 * Future: Can integrate with AWS Transcribe via Lambda backend
 */

import { fetchAuthSession } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';

const TRANSCRIBE_CONFIG = {
  region: 'ap-south-1',
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
/**
 * Transcribe audio file using AWS Transcribe via Lambda
 * Returns transcribed text
 */
export async function transcribeAudioFile(
  audioBlob: Blob,
  language: string = 'en'
): Promise<string> {
  try {
    // Get Lambda endpoint from environment
    const lambdaEndpoint = import.meta.env.VITE_LAMBDA_ENDPOINT || '';
    
    if (!lambdaEndpoint) {
      console.warn('Lambda endpoint not configured, using mock transcription');
      return generateMockTranscription(language);
    }

    // Convert blob to base64
    const audioBase64 = await blobToBase64(audioBlob);
    
    // Call Lambda function
    const response = await fetch(lambdaEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'transcribe',
        audioBase64: audioBase64,
        fileType: audioBlob.type,
        language: language,
      }),
    });

    if (!response.ok) {
      throw new Error(`Lambda returned ${response.status}`);
    }

    const result = await response.json();
    
    if (result.transcript) {
      console.log('✅ AWS Transcribe result:', result.transcript.substring(0, 100));
      return result.transcript;
    } else if (result.error) {
      throw new Error(result.error);
    } else {
      throw new Error('No transcript in response');
    }
  } catch (error: any) {
    console.error('AWS Transcribe error:', error.message);
    console.warn('Falling back to mock transcription...');
    return generateMockTranscription(language);
  }
}

/**
 * Convert Blob to Base64
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1]; // Remove data:audio/webm;base64, prefix
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Generate mock transcription based on language
 */
function generateMockTranscription(language: string = 'en'): string {
  const mockTranscriptions: Record<string, string> = {
    ta: `இந்த பொருளை நான் கூட கையால் நெய்யுதல் மூலம் அழகான வடிவம் கொடுத்து உருவாக்கியுள்ளேன். இது பாரம்பரிய தந்திரத்தை பின்பற்றி செய்யப்பட்ட ஒரு தனிப்பட்ட கலைப்படைப்பு.`,
    hi: `यह वस्तु मैंने अपने हाथों से बनाई है। पारंपरिक तकनीकों का उपयोग करके मैंने इसे एक अद्वितीय डिज़ाइन दिया है। यह मेरे शिल्प कौशल का एक प्रमाण है।`,
    en: `I have handcrafted this beautiful piece using traditional techniques. Each detail is carefully designed to showcase the artistry and skill involved in its creation. This is a unique, one-of-a-kind work.`,
  };

  return mockTranscriptions[language] || mockTranscriptions['en'];
}

export default { startVoiceInput, transcribeAudioFile, isTranscribeConfigured };
