import { motion } from 'motion/react';
import { Download, Copy, Share2, Instagram, ShoppingBag, Check, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface MarketingContent {
  instagram: {
    caption: string;
    hashtags: string[];
  };
  amazon: {
    title: string;
    bulletPoints: string[];
    description: string;
    keywords: string[];
  };
  etsy: {
    title: string;
    description: string;
    tags: string[];
  };
}

interface MarketingExportProps {
  content: MarketingContent;
  productName: string;
  images: string[];
  onDownloadImage?: (imageUrl: string) => void;
}

export function MarketingExport({
  content,
  productName,
  images,
  onDownloadImage,
}: MarketingExportProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      toast.success(`✓ Copied ${section} to clipboard!`);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (error) {
      toast.error('Failed to copy. Please select and copy manually.');
    }
  };

  const downloadAsText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`✓ Downloaded ${filename}`);
  };

  const shareContent = async (text: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
        toast.success('✓ Shared successfully!');
      } catch (error) {
        // User cancelled, no error needed
      }
    } else {
      copyToClipboard(text, title);
    }
  };

  const handleDownloadImage = (imageUrl: string, index: number) => {
    if (onDownloadImage) {
      onDownloadImage(imageUrl);
    } else {
      // Fallback: open in new tab
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = `${productName}-${index + 1}.jpg`;
      a.target = '_blank';
      a.click();
    }
    toast.success('✓ Image downloaded!');
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Images */}
      {images.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Enhanced Images ({images.length})
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((imageUrl, idx) => (
              <div key={idx} className="group relative">
                <div className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`${productName} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <button
                    onClick={() => handleDownloadImage(imageUrl, idx)}
                    className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instagram */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 shadow-lg border border-purple-200 dark:border-purple-800"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg text-gray-900 dark:text-white">Instagram</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                copyToClipboard(
                  `${content.instagram.caption}\n\n${content.instagram.hashtags.join(' ')}`,
                  'Instagram post'
                )
              }
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
            >
              {copiedSection === 'Instagram post' ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              Copy
            </button>
            {navigator.share && (
              <button
                onClick={() =>
                  shareContent(
                    `${content.instagram.caption}\n\n${content.instagram.hashtags.join(' ')}`,
                    'Instagram Post'
                  )
                }
                className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
              Caption
            </label>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {content.instagram.caption}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
              Hashtags ({content.instagram.hashtags.length})
            </label>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
              <p className="text-purple-600 dark:text-purple-400">
                {content.instagram.hashtags.join(' ')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Amazon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-orange-800"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg text-gray-900 dark:text-white">Amazon</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                copyToClipboard(
                  `Title: ${content.amazon.title}\n\nBullet Points:\n${content.amazon.bulletPoints.map((b) => `• ${b}`).join('\n')}\n\nDescription:\n${content.amazon.description}\n\nKeywords: ${content.amazon.keywords.join(', ')}`,
                  'Amazon listing'
                )
              }
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
            >
              {copiedSection === 'Amazon listing' ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              Copy All
            </button>
            <button
              onClick={() =>
                downloadAsText(
                  `Title: ${content.amazon.title}\n\nBullet Points:\n${content.amazon.bulletPoints.map((b) => `• ${b}`).join('\n')}\n\nDescription:\n${content.amazon.description}\n\nKeywords: ${content.amazon.keywords.join(', ')}`,
                  `${productName}-amazon.txt`
                )
              }
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
              Title
            </label>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
              <p className="text-gray-900 dark:text-white">{content.amazon.title}</p>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
              Bullet Points
            </label>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
              <ul className="space-y-2">
                {content.amazon.bulletPoints.map((point, idx) => (
                  <li key={idx} className="flex gap-2 text-gray-900 dark:text-white">
                    <span className="text-orange-500 flex-shrink-0">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
              Description
            </label>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {content.amazon.description}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
              Keywords ({content.amazon.keywords.length})
            </label>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
              <div className="flex flex-wrap gap-2">
                {content.amazon.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Etsy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-6 shadow-lg border border-amber-200 dark:border-amber-800"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center text-white text-lg font-bold">
              E
            </div>
            <h3 className="text-lg text-gray-900 dark:text-white">Etsy</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                copyToClipboard(
                  `Title: ${content.etsy.title}\n\nDescription:\n${content.etsy.description}\n\nTags: ${content.etsy.tags.join(', ')}`,
                  'Etsy listing'
                )
              }
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
            >
              {copiedSection === 'Etsy listing' ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              Copy All
            </button>
            <button
              onClick={() =>
                downloadAsText(
                  `Title: ${content.etsy.title}\n\nDescription:\n${content.etsy.description}\n\nTags: ${content.etsy.tags.join(', ')}`,
                  `${productName}-etsy.txt`
                )
              }
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
              Title
            </label>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
              <p className="text-gray-900 dark:text-white">{content.etsy.title}</p>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
              Story Description
            </label>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {content.etsy.description}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
              Tags ({content.etsy.tags.length}/13)
            </label>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
              <div className="flex flex-wrap gap-2">
                {content.etsy.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
