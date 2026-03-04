import { useState, useEffect } from 'react';
import { getStateVideo, StateVideoResult } from '../services/AzureAIService';

interface UseStateVideoOptions {
  stateName: string;
  stateId: string;
  description?: string;
  fallbackUrl?: string;
  fallbackImage?: string;
  enabled?: boolean;
}

export function useStateVideo(options: UseStateVideoOptions) {
  const { stateName, stateId, description, fallbackUrl, fallbackImage, enabled = true } = options;
  const [videoResult, setVideoResult] = useState<StateVideoResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadVideo = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getStateVideo({
          stateName,
          stateId,
          description,
          fallbackUrl,
        });

        if (!cancelled) {
          setVideoResult(result);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load state video:', err);
          setError('Failed to load video');
          setVideoResult({
            videoUrl: fallbackUrl || null,
            source: 'error',
            cached: false,
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadVideo();

    return () => {
      cancelled = true;
    };
  }, [stateName, stateId, description, fallbackUrl, enabled]);

  return {
    videoUrl: videoResult?.videoUrl || fallbackUrl || null,
    fallbackImage,
    source: videoResult?.source || 'fallback',
    cached: videoResult?.cached || false,
    loading,
    error,
    isAIGenerated: videoResult?.source === 'ai-generated',
  };
}
