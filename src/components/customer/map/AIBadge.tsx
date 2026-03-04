import { memo, useMemo } from 'react';
import { AZURE_MAPS_ENABLED, Z_INDEX } from '../../../constants/mapConstants';

// Detect which AI service is configured
const detectAIService = () => {
  const hasAWS = !!(
    import.meta.env?.VITE_AWS_COGNITO_USER_POOL_ID ||
    import.meta.env?.VITE_AWS_S3_BUCKET ||
    import.meta.env?.VITE_OPENAI_API_KEY
  );
  
  const hasAzure = !!(
    import.meta.env?.VITE_AZURE_OPENAI_ENDPOINT ||
    import.meta.env?.VITE_AZURE_VISION_ENDPOINT
  );
  
  if (hasAWS) return { name: 'AWS AI', demo: false };
  if (hasAzure) return { name: 'Azure AI', demo: false };
  return { name: 'AI', demo: true };
};

export const AIBadge = memo(() => {
  const aiService = useMemo(() => detectAIService(), []);
  
  // Memoize badge classes
  const badgeClasses = useMemo(
    () => aiService.demo
      ? "absolute top-2 md:top-4 right-2 md:right-4 bg-gradient-to-r from-blue-500/90 to-indigo-600/90 dark:from-blue-600/90 dark:to-indigo-700/90 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-lg text-xs md:text-sm backdrop-blur-sm shadow-lg"
      : "absolute top-2 md:top-4 right-2 md:right-4 bg-blue-500/90 dark:bg-blue-600/90 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-lg text-xs md:text-sm backdrop-blur-sm shadow-lg",
    [aiService.demo]
  );

  return (
    <div 
      className={badgeClasses}
      style={{ zIndex: Z_INDEX.BADGE }}
    >
      <span className="flex items-center gap-1.5 md:gap-2">
        <span className="text-sm md:text-base">☁️</span>
        <span className="hidden sm:inline font-medium">
          {AZURE_MAPS_ENABLED ? 'Powered by Maps' : `Powered by ${aiService.name}`}
        </span>
        <span className="sm:hidden font-medium">
          {AZURE_MAPS_ENABLED ? 'Maps' : aiService.name}
        </span>
      </span>
    </div>
  );
});

AIBadge.displayName = 'AIBadge';
