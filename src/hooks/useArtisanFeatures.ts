/**
 * Custom Hooks for Artisan Features
 * Optimized for low-end devices and poor networks
 */

import { useState, useEffect, useRef, useCallback } from 'react';
// ── Azure fallback (compression, offline cache, raw voice fallback) ─────────
import {
  isLowEndDevice,
  compressImage,
  uploadFileProgressive,
  negotiateWithBuyer as azureNegotiateWithBuyer,
  saveToOfflineCache,
  loadFromOfflineCache,
} from '../services/AzureAIService';

// ── AWS Primary Services ─────────────────────────────────────────────────────
import {
  analyzeImageFile as rekognitionAnalyzeFile,
  analyzeImage as rekognitionAnalyzeUrl,
  isRekognitionConfigured,
} from '../services/AWSRekognitionService';

import {
  calculateSmartPricing as bedrockCalculateSmartPricing,
  generateMarketingContent as bedrockGenerateMarketingContent,
  generateNegotiationResponse as bedrockNegotiate,
  isBedrockConfigured,
} from '../services/AWSBedrockService';

import {
  speakText as pollySpeakText,
  stopSpeaking as pollyStop,
  isPollyConfigured,
} from '../services/AWSPollyService';

import {
  startVoiceInput as transcribeStartVoice,
  isTranscribeConfigured,
} from '../services/AWSTranscribeService';

import {
  translateText as awsTranslateText,
  isTranslateConfigured,
} from '../services/AWSTranslateService';

// ── OpenAI (secondary fallback when Bedrock not available) ───────────────────
import {
  calculateSmartPricing as openaiCalculateSmartPricing,
  generateMarketingContent as openaiGenerateMarketingContent,
  isOpenAIConfigured,
} from '../services/OpenAIService';

// ── S3 ───────────────────────────────────────────────────────────────────────
import {
  uploadImage as s3UploadImage,
  compressImage as s3CompressImage,
  isS3Configured,
} from '../services/AWSS3Service';

// ========================================
// DEVICE CAPABILITY DETECTION
// ========================================

export function useDeviceCapability() {
  const [capability, setCapability] = useState({
    isLowEnd: false,
    memory: 4, // GB
    cores: 4,
    connectionType: '4g' as '2g' | '3g' | '4g' | 'wifi',
    shouldReduceAnimations: false,
    shouldCompressUploads: false,
  });

  useEffect(() => {
    const memory = (navigator as any).deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    const connection = (navigator as any).connection;
    
    const connectionType = connection?.effectiveType || '4g';
    const isLowEnd = isLowEndDevice();
    
    setCapability({
      isLowEnd,
      memory,
      cores,
      connectionType,
      shouldReduceAnimations: isLowEnd,
      shouldCompressUploads: isLowEnd || connectionType === '2g' || connectionType === '3g',
    });
  }, []);

  return capability;
}

// ========================================
// FILE UPLOAD WITH COMPRESSION
// ========================================

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const capability = useDeviceCapability();

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    setUploadedUrl(null);

    try {
      let fileToUpload: File | Blob = file;
      
      // Compress if needed
      if (capability.shouldCompressUploads && file.type.startsWith('image/')) {
        // Show compression progress
        setProgress(10);
        
        // Try S3 compression first, then Azure
        try {
          const compressed = isS3Configured() 
            ? await s3CompressImage(file, capability.isLowEnd ? 600 : 800)
            : await compressImage(
                file,
                capability.isLowEnd ? 600 : 800,
                capability.isLowEnd ? 0.6 : 0.7
              );
          
          fileToUpload = compressed;
          
          // Log compression savings
          const savings = Math.round((1 - compressed.size / file.size) * 100);
          console.log(`📦 Image compressed: ${savings}% smaller`);
        } catch (compressError) {
          console.warn('Compression failed, uploading original:', compressError);
          fileToUpload = file;
        }
      }
      
      setProgress(20);
      
      // Try S3 upload first, then Azure
      let url: string;
      if (isS3Configured()) {
        console.log('☁️ Uploading to S3');
        url = await s3UploadImage(
          fileToUpload as File,
          'products',
          (percent) => {
            setProgress(20 + (percent * 0.8));
          }
        );
      } else {
        console.log('☁️ Uploading to Azure (S3 not configured)');
        url = await uploadFileProgressive(
          fileToUpload,
          file.name,
          (percent) => {
            setProgress(20 + (percent * 0.8));
          }
        );
      }
      
      setUploadedUrl(url);
      setProgress(100);
      
      return url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  }, [capability]);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
    setUploadedUrl(null);
  }, []);

  return {
    upload,
    uploading,
    progress,
    error,
    uploadedUrl,
    reset,
  };
}

// ========================================
// IMAGE ANALYSIS
// ========================================

export function useImageAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (imageUrl: string) => {
    setAnalyzing(true);
    setError(null);

    try {
      // Try Rekognition first, fall back to cached/offline
      const result = isRekognitionConfigured()
        ? await rekognitionAnalyzeUrl(imageUrl)
        : { tags: [], description: 'Analysis pending AWS setup', colors: [], quality: 'medium', craftType: 'Handicraft', suggestedTitle: 'Handcraft', confidence: 0 };
      setAnalysis(result);

      // Cache offline
      saveToOfflineCache(`analysis_${imageUrl}`, result);
      
      return result;
    } catch (err) {
      // Try offline cache
      const cached = loadFromOfflineCache(`analysis_${imageUrl}`);
      if (cached) {
        setAnalysis(cached);
        return cached;
      }
      
      setError(err instanceof Error ? err.message : 'Analysis failed');
      return null;
    } finally {
      setAnalyzing(false);
    }
  }, []);

  return { analyze, analyzing, analysis, error };
}

// ========================================
// VOICE INPUT (Multi-Language)
// ========================================

export function useVoiceInput(language: string = 'hi-IN') {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Convert locale (hi-IN) to lang code (hi) for AWS Transcribe
  const langCode = language.split('-')[0];

  const start = useCallback(() => {
    setListening(true);
    setError(null);

    // AWS Transcribe (uses browser STT as streamlined MVP impl)
    recognitionRef.current = transcribeStartVoice(
      langCode,
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal) setListening(false);
      },
      (err) => {
        setError(err);
        setListening(false);
      }
    );
  }, [langCode]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    listening,
    transcript,
    error,
    start,
    stop,
    reset,
  };
}

// ========================================
// TEXT-TO-SPEECH (For Illiterate Users)
// ========================================

export function useTextToSpeech() {
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback(async (text: string, language: string = 'hi-IN') => {
    setSpeaking(true);
    const langCode = language.split('-')[0]; // 'hi-IN' → 'hi'
    try {
      // Use AWS Polly (falls back to browser speechSynthesis automatically)
      await pollySpeakText(text, langCode);
    } catch (error) {
      console.error('TTS failed:', error);
    } finally {
      setSpeaking(false);
    }
  }, []);

  const stop = useCallback(() => {
    pollyStop();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking };
}

// ========================================
// TRANSLATION
// ========================================

export function useTranslation() {
  const [translating, setTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState('');

  const translate = useCallback(async (text: string, targetLang: string) => {
    setTranslating(true);
    
    try {
      // AWS Translate (falls back to returning original text)
      const result = await awsTranslateText(text, targetLang as any);
      setTranslatedText(result);
      return result;
    } catch (error) {
      console.error('Translation failed:', error);
      return text;
    } finally {
      setTranslating(false);
    }
  }, []);

  return { translate, translating, translatedText };
}

// ========================================
// SMART PRICING
// ========================================

export function useSmartPricing() {
  const [calculating, setCalculating] = useState(false);
  const [pricing, setPricing] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const calculatePrice = useCallback(async (factors: any) => {
    setCalculating(true);
    setError(null);

    try {
      let result;

      if (isBedrockConfigured()) {
        console.log('🤖 Using AWS Bedrock (Claude) for smart pricing');
        result = await bedrockCalculateSmartPricing(
          factors.materialCost || 0,
          factors.laborHours || 0,
          factors.skillLevel || 5,
          factors.uniqueness || 5,
          factors.marketDemand || 5,
          factors.craftType || 'Handcraft'
        );
      } else if (isOpenAIConfigured()) {
        console.log('🤖 Using OpenAI for smart pricing (Bedrock fallback)');
        result = await openaiCalculateSmartPricing(
          factors.materialCost || 0,
          factors.laborHours || 0,
          factors.skillLevel || 5,
          factors.uniqueness || 5,
          factors.marketDemand || 5,
          factors.craftType || 'Handcraft'
        );
      } else {
        console.log('🤖 Using rule-based pricing (no AI configured)');
        // Use Bedrock service's built-in fallback
        result = await bedrockCalculateSmartPricing(
          factors.materialCost || 0,
          factors.laborHours || 0,
          factors.skillLevel || 5,
          factors.uniqueness || 5,
          factors.marketDemand || 5,
          factors.craftType || 'Handcraft'
        );
      }
      
      setPricing(result);
      
      // Cache offline
      saveToOfflineCache('last_pricing', result);
      
      return result;
    } catch (err) {
      console.error('Smart pricing failed:', err);
      
      // Try offline cache
      const cached = loadFromOfflineCache('last_pricing');
      if (cached) {
        console.log('📦 Using cached pricing');
        setPricing(cached);
        return cached;
      }
      
      setError(err instanceof Error ? err.message : 'Pricing calculation failed');
      return null;
    } finally {
      setCalculating(false);
    }
  }, []);

  return { calculatePrice, calculating, pricing, error };
}

// ========================================
// NEGOTIATION BOT
// ========================================

export function useNegotiationBot() {
  const [negotiating, setNegotiating] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [decision, setDecision] = useState<any>(null);

  const negotiate = useCallback(
    async (
      buyerMessage: string,
      currentOffer: number,
      floorPrice: number,
      targetPrice: number,
      artisanName: string,
      productName: string
    ) => {
      setNegotiating(true);

      try {
        // Use AWS Bedrock negotiation (falls back to rule-based)
        const result = await bedrockNegotiate(
          currentOffer,
          floorPrice,
          targetPrice,
          productName,
          'friendly'
        );
        
        setDecision(result);
        
        // Add messages to history
        setMessages(prev => [
          ...prev,
          { from: 'buyer', text: buyerMessage, offer: currentOffer, timestamp: new Date() },
          { from: 'bot', text: result.message, offer: result.counterOffer, timestamp: new Date() },
        ]);
        
        return result;
      } catch (error) {
        console.error('Negotiation failed:', error);
        return null;
      } finally {
        setNegotiating(false);
      }
    },
    [messages]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setDecision(null);
  }, []);

  return {
    negotiate,
    negotiating,
    messages,
    decision,
    reset,
  };
}

// ========================================
// MARKETING CONTENT GENERATION
// ========================================

export function useMarketingGeneration() {
  const [generating, setGenerating] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (
      productName: string,
      craftType: string,
      materials: string[],
      artisanName: string,
      artisanLocation: string,
      productImages: string[]
    ) => {
      setGenerating(true);
      setError(null);

      try {
        let result;
        
        // Try OpenAI first (if configured)
        const description = `Handcrafted ${craftType} by ${artisanName} from ${artisanLocation}. Materials: ${materials.join(', ')}`;

        if (isBedrockConfigured()) {
          console.log('🤖 Using AWS Bedrock (Claude) for marketing content');
          result = await bedrockGenerateMarketingContent(productName, craftType, description, 0);
        } else if (isOpenAIConfigured()) {
          console.log('🤖 Using OpenAI for marketing content (Bedrock fallback)');
          result = await openaiGenerateMarketingContent(productName, description, craftType, materials.join(', '), '');
        } else {
          console.log('🤖 Using Bedrock rule-based fallback for marketing content');
          result = await bedrockGenerateMarketingContent(productName, craftType, description, 0);
        }
        
        setContent(result);
        
        // Cache offline
        saveToOfflineCache(`marketing_${productName}`, result);
        
        return result;
      } catch (err) {
        // Try offline cache
        const cached = loadFromOfflineCache(`marketing_${productName}`);
        if (cached) {
          setContent(cached);
          return cached;
        }
        
        setError(err instanceof Error ? err.message : 'Marketing generation failed');
        return null;
      } finally {
        setGenerating(false);
      }
    },
    []
  );

  return { generate, generating, content, error };
}

// ========================================
// OFFLINE DETECTION
// ========================================

export function useOfflineDetection() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// ========================================
// DEBOUNCED VALUE (For Search/Filter)
// ========================================

export function useDebouncedValue<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ========================================
// PAGE VISIBILITY (Pause animations when hidden)
// ========================================

export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible;
}