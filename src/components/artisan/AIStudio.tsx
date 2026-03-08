import { motion } from 'motion/react';
import { ArrowLeft, Upload, Sparkles, AlertCircle, Check, Loader, Image as ImageIcon, Download, Mic, X as XIcon, Wand2, RefreshCw } from 'lucide-react';
import { useState, useRef } from 'react';
import { useFileUpload, useImageAnalysis, useDeviceCapability, useVoiceInput } from '../../hooks/useArtisanFeatures';

interface AIStudioProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
  onSaveProduct?: (product: {
    image: string;
    enhancedImage: string;
    name: string;
    description: string;
    price: number;
    analysis: any;
  }) => void;
}

export function AIStudio({ onBack, onNavigate, onSaveProduct }: AIStudioProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [listeningFor, setListeningFor] = useState<'name' | 'description' | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hooks
  const { upload, uploading, progress, error: uploadError, uploadedUrl } = useFileUpload();
  const { analyze, analyzing, analysis, error: analysisError } = useImageAnalysis();
  const capability = useDeviceCapability();
  const voiceInput = useVoiceInput();
  
  const [showDetailedText] = useState(
    localStorage.getItem('artisan_detailed_text') === 'true'
  );

  // Simple image enhancement using canvas filters
  const enhanceImage = (imageUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Apply enhancements via canvas filters
        ctx.filter = 'brightness(1.1) contrast(1.15) saturate(1.2) sharpen(1)';
        ctx.drawImage(img, 0, 0);
        
        // Convert to base64
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      
      img.onerror = () => {
        // Fallback: return original
        resolve(imageUrl);
      };
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('📸 Please select an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (warn if > 5MB on low-end)
    if (capability.isLowEnd && file.size > 5 * 1024 * 1024) {
      const compress = confirm(
        `Your image is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Compress it for faster upload?`
      );
      if (!compress) return;
    }

    setSelectedFile(file);
    
    // Create preview
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setEnhancedUrl(null);
    setShowComparison(false);

    // Auto-upload and analyze
    const url = await upload(file);
    if (url) {
      const analysisResult = await analyze(url);
      
      // Auto-fill from AI analysis
      if (analysisResult) {
        if (analysisResult.description) {
          setProductDescription(analysisResult.description);
        }
        // Suggest a name from objects detected
        if (analysisResult.objects && analysisResult.objects.length > 0) {
          const topObject = analysisResult.objects[0].name;
          setProductName(`Handcrafted ${topObject.charAt(0).toUpperCase() + topObject.slice(1)}`);
        }
      }
    }
  };

  const handleEnhanceImage = async () => {
    if (!previewUrl) return;
    
    setIsEnhancing(true);
    try {
      // Client-side image enhancement using canvas filters
      // System instructions: enhance contrast, saturation, brightness, sharpness
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = previewUrl;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d')!;
      
      // Apply enhancements step by step
      ctx.filter = 'contrast(1.2) saturate(1.25) brightness(1.1) hue-rotate(0deg)';
      ctx.drawImage(img, 0, 0);
      
      // Convert to enhanced image
      const enhancedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      
      setEnhancedUrl(enhancedDataUrl);
      setShowComparison(true);
    } catch (error) {
      console.error('Image enhancement error:', error);
      alert('❌ Image enhancement failed. Please try another image.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleVoiceInput = (field: 'name' | 'description') => {
    setListeningFor(field);
    voiceInput.start();
  };

  const handleAutoGenerateContent = async () => {
    if (!analysis) {
      alert('Please upload and analyze an image first!');
      return;
    }

    setIsEnhancing(true);
    try {
      // Use Bedrock Claude to generate product content
      const { generateProductDescription } = await import('../../services/AWSBedrockService');
      
      // Prepare analysis data for Claude
      const detectedObjects = analysis.objects?.slice(0, 5).map((o: any) => o.name).join(', ') || 'artisan product';
      const colors = analysis.colors?.slice(0, 3) || ['traditional', 'vibrant'];
      const analysisDescription = analysis.description || 'handcrafted item';
      
      // Call Claude to generate product description based on image analysis
      const prompt = `You are an expert Indian artisan product marketer. Based on the image analysis below, generate a compelling product description.

Image Analysis:
- Objects detected: ${detectedObjects}
- Colors: ${colors.join(', ')}
- Analysis: ${analysisDescription}

Generate a JSON response with:
{
  "productName": "<creative product name based on objects>",
  "description": "<engaging product description highlighting craftsmanship>",
  "suggestedPrice": <number between 1500-10000 based on complexity),
  "craftType": "<type of handicraft>"
}

Return ONLY valid JSON, no markdown.`;

      // Call Claude via Bedrock
      const { callClaude } = await import('../../services/AWSBedrockService');
      const response = await callClaude(prompt, 600);
      
      // Parse the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const content = JSON.parse(jsonMatch[0]);
        
        // Update form fields with Claude-generated content
        if (content.productName) {
          setProductName(content.productName);
        }
        if (content.description) {
          setProductDescription(content.description);
        }
        if (content.suggestedPrice && !productPrice) {
          setProductPrice(content.suggestedPrice.toString());
        }
      }
    } catch (error) {
      console.warn('Bedrock generation failed, using fallback logic:', error);
      
      // Fallback: Use local logic if Claude is unavailable
      if (!productName || productName.startsWith('Handcrafted')) {
        if (analysis.objects && analysis.objects.length > 0) {
          const topObject = analysis.objects[0].name;
          const craftTypes = ['Traditional', 'Handcrafted', 'Artisan', 'Heritage'];
          const randomType = craftTypes[Math.floor(Math.random() * craftTypes.length)];
          setProductName(`${randomType} ${topObject.charAt(0).toUpperCase() + topObject.slice(1)}`);
        }
      }

      if (analysis.description || analysis.objects.length > 0) {
        const objects = analysis.objects.slice(0, 3).map((o: any) => o.name).join(', ');
        const colors = analysis.colors || ['rich', 'vibrant'];
        const generatedDesc = `Exquisite handcrafted piece featuring ${objects}. This authentic creation showcases ${colors[0]} tones and traditional craftsmanship. Each piece is unique and made with care by skilled artisans. ${analysis.description || 'A timeless addition to any collection.'}`;
        setProductDescription(generatedDesc);
      }

      if (!productPrice && analysis.objects.length > 0) {
        const basePrice = 1500;
        const complexityMultiplier = Math.min(analysis.objects.length * 500, 3000);
        const suggestedPrice = basePrice + complexityMultiplier;
        setProductPrice(suggestedPrice.toString());
      }
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSaveEnhancedImage = () => {
    if (!enhancedUrl) return;
    
    // Create download link
    const link = document.createElement('a');
    link.href = enhancedUrl;
    link.download = `enhanced-${productName || 'product'}.jpg`;
    link.click();
    
    alert('✅ Enhanced photo saved to your device!');
  };

  const handleSaveToVault = () => {
    if (!uploadedUrl || !enhancedUrl || !analysis) return;
    
    const productData = {
      image: uploadedUrl,
      enhancedImage: enhancedUrl,
      name: productName || 'Untitled Product',
      description: productDescription || analysis.description || '',
      price: parseInt(productPrice) || 0,
      analysis,
    };
    
    if (onSaveProduct) {
      onSaveProduct(productData);
    }
    
    alert('🔒 Product saved to Protected Vault!');
  };

  const handleGenerateMarketing = () => {
    if (!productName) {
      alert('Please add a product name first!');
      return;
    }
    
    alert(`✨ Generating marketing content for "${productName}"...\n\nThis will create:\n• Instagram post\n• Amazon listing\n• Etsy description\n• Flipkart listing`);
    
    // Save to localStorage for Marketing Review to use
    localStorage.setItem('pending_product', JSON.stringify({
      name: productName,
      description: productDescription,
      image: enhancedUrl || previewUrl,
      analysis,
    }));
    
    // Navigate to marketing review
    if (onNavigate) {
      onNavigate('marketing');
    }
  };

  // Listen for voice input results
  useState(() => {
    if (voiceInput.transcript && listeningFor) {
      if (listeningFor === 'name') {
        setProductName(voiceInput.transcript);
      } else if (listeningFor === 'description') {
        setProductDescription(voiceInput.transcript);
      }
      setListeningFor(null);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 pt-20 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={onBack}
            className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl text-gray-900 dark:text-white">AI Studio</h1>
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-xs">
                AI Powered
              </span>
            </div>
            {showDetailedText && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                📸 Upload → AI enhances → Add details → Save
              </p>
            )}
          </div>
        </motion.div>

        {/* Device Capability Warning */}
        {capability.isLowEnd && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-2xl p-4 mb-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-300">
                <p className="font-medium mb-1">Data Saver Mode Active</p>
                <p>Images will be compressed for faster upload on your network.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* AI Feedback Banner */}
        {analysis && !analyzing && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl p-4 mb-6 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="mb-2 font-medium">AI Analysis Complete:</p>
                <ul className="space-y-1 text-sm text-white/90">
                  {analysis && analysis.tradeSecrets && analysis.tradeSecrets.length > 0 && (
                    <li>🔒 {analysis.tradeSecrets.length} trade secret(s) detected and protected</li>
                  )}
                  {analysis && analysis.objects && analysis.objects.length > 0 && (
                    <li>✓ Identified: {analysis.objects.slice(0, 3).map((o: any) => o.name).join(', ')}</li>
                  )}
                  {analysis && analysis.enhancementSuggestions && analysis.enhancementSuggestions.map((suggestion: string, idx: number) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                  {analysis && analysis.enhancementSuggestions && analysis.enhancementSuggestions.length === 0 && (
                    <li>✓ Photo quality is excellent!</li>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden mb-6"
        >
          {!selectedFile ? (
            // Empty State
            <div className="p-12">
              <div 
                onClick={handleUploadClick}
                className="aspect-square max-w-lg mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
              >
                <Upload className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-gray-700 dark:text-gray-300 mb-2 text-lg">Tap to upload your craft photo</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">JPG, PNG • Max 10MB</p>
                {capability.shouldCompressUploads && (
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-3">
                    ⚡ Auto-compression enabled for your network
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Before/After Comparison */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg text-gray-900 dark:text-white">Photo Enhancement</h3>
                  <div className="flex gap-2 flex-wrap">
                    {/* Enhance Image Button */}
                    {previewUrl && !enhancedUrl && (
                      <button
                        onClick={handleEnhanceImage}
                        disabled={isEnhancing}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all text-sm flex items-center gap-2 disabled:opacity-50"
                      >
                        {isEnhancing ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Enhancing...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4" />
                            Enhance Image
                          </>
                        )}
                      </button>
                    )}
                    
                    {enhancedUrl && (
                      <>
                        <button
                          onClick={() => setShowComparison(!showComparison)}
                          className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors text-sm"
                        >
                          {showComparison ? '✓ Comparing' : 'Compare Before/After'}
                        </button>
                        
                        <button
                          onClick={handleSaveEnhancedImage}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all text-sm flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Save to Device
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={handleUploadClick}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>

                {/* Image Display with Before/After Reference */}
                <div className={`grid ${showComparison && enhancedUrl ? 'md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
                  {/* Original OR Enhanced (if not comparing) */}
                  {showComparison ? (
                    <>
                      {/* Original */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center uppercase tracking-wide">Before</p>
                        <div className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                          {previewUrl && (
                            <img
                              src={previewUrl}
                              alt="Original"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>
                      {/* Enhanced */}
                      <div>
                        <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2 text-center flex items-center justify-center gap-1 uppercase tracking-wide">
                          <Sparkles className="w-3 h-3" />
                          After (AI Enhanced)
                        </p>
                        <div className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden border-2 border-indigo-500 dark:border-indigo-400 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50">
                          {enhancedUrl && (
                            <img
                              src={enhancedUrl}
                              alt="Enhanced"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="max-w-2xl mx-auto w-full">
                      <div className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden relative">
                        {(enhancedUrl || previewUrl) && (
                          <img
                            src={enhancedUrl || previewUrl}
                            alt="Product"
                            className="w-full h-full object-cover"
                          />
                        )}
                        {enhancedUrl && !showComparison && (
                          <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI Enhanced
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload/Analysis Progress - Enhanced */}
                {uploading && (
                  <div className="mt-4 flex flex-col items-center">
                    {/* Large circular progress */}
                    <div className="relative w-32 h-32 mb-4">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <motion.circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: "0 352" }}
                          animate={{ strokeDasharray: `${(progress / 100) * 352} 352` }}
                          transition={{ duration: 0.3 }}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#a855f7" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          {Math.round(progress)}%
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {progress < 100 ? `${Math.ceil((100 - progress) / 10)}s left` : 'Done'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Status text */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Uploading image...
                    </p>
                    
                    {/* Cancel button */}
                    <button
                      onClick={() => {
                        // Upload cancellation handled in hook
                        window.location.reload();
                      }}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {analyzing && (
                  <div className="mt-4 flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span className="text-sm">AI analyzing & enhancing image...</span>
                  </div>
                )}
              </div>

              {/* Product Details Form */}
              {uploadedUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg text-gray-900 dark:text-white">Add Product Details</h3>
                    
                    {/* Auto-Generate Content Button */}
                    {analysis && (
                      <button
                        onClick={handleAutoGenerateContent}
                        className="px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg hover:shadow-lg transition-all text-sm flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Auto-Generate Content
                      </button>
                    )}
                  </div>
                  
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Product Name
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="e.g., Hand-Chiseled Bronze Nataraja"
                        className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => handleVoiceInput('name')}
                        className={`p-3 rounded-xl transition-all ${
                          listeningFor === 'name'
                            ? 'bg-red-500 text-white'
                            : 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800'
                        }`}
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Product Description */}
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Product Description
                    </label>
                    <div className="flex gap-2 items-start">
                      <textarea
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        placeholder="AI will suggest a description, or you can type/speak your own..."
                        rows={4}
                        className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      />
                      <button
                        onClick={() => handleVoiceInput('description')}
                        className={`p-3 rounded-xl transition-all ${
                          listeningFor === 'description'
                            ? 'bg-red-500 text-white'
                            : 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800'
                        }`}
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Product Price */}
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      placeholder="e.g., 18500"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      💡 Tip: Use Smart Pricing for AI recommendations
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>

        {/* Actions */}
        {uploadedUrl && analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
            <button
              onClick={handleSaveToVault}
              className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>Save to Vault</span>
            </button>
            
            <button
              onClick={handleGenerateMarketing}
              className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Generate Marketing</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}