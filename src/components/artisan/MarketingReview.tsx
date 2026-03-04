import { motion } from 'motion/react';
import { ArrowLeft, Instagram, ShoppingBag, Globe, Check, Sparkles, Copy } from 'lucide-react';
import { useState } from 'react';

import productimg from 'figma:asset/852ca5c1ac40dbd85cdb673b76a77225c11846b5.png';

interface MarketingReviewProps {
  onBack: () => void;
}

export function MarketingReview({ onBack }: MarketingReviewProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'amazon' | 'etsy'>('instagram');
  const [posted, setPosted] = useState(false);
  const [showDetailedText, setShowDetailedText] = useState(
    localStorage.getItem('artisan_detailed_text') === 'true'
  );

  // Load product from AI Studio if available
  const pendingProduct = localStorage.getItem('pending_product');
  const productData = pendingProduct ? JSON.parse(pendingProduct) : null;
  
  const productName = productData?.name || 'Hand-Chiselled Bronze Nataraja (12")';
  const productDescription = productData?.description || 'A beautiful handcrafted bronze sculpture';
  const productImage = productData?.image || productimg;

  const marketingContent = {
    instagram: {
      title: `The Sacred Dance: ${productName} ✨🕉️`,
      caption: `Witness the divine dance of Shiva in solid bronze. Each chisel mark tells a story passed down through 9 generations.`,
      description: `${productDescription}\n\nUnlike hollow machine-molds, this piece is a Solid Lost-Wax Cast, carrying a unique weight and over nine generations of craftsmanship history.\n\nCrafted using the traditional lost-wax method passed down from my grandfather. Each piece takes days of intensive hand-chisel work.\n\n#BronzeArt #Nataraja #ThanjavurBronze #LostWaxCasting #IndianHeritageCrafts #SacredArt #TempleBronze #HandmadeInIndia #SupportArtisans #TamilNaduCrafts`,
      hashtags: ['#BronzeArt', '#Nataraja', '#ThanjavurBronze', '#LostWaxCasting', '#IndianHeritageCrafts', '#SacredArt', '#TempleBronze', '#HandmadeInIndia'],
      image: productImage,
    },
    amazon: {
      title: `${productName} - Solid Lost-Wax Cast | Thanjavur Heritage`,
      description: `Authentic Thanjavur bronze sculpture crafted by 9th generation master artisan. ${productDescription}. Unlike hollow machine-molds, this is a SOLID LOST-WAX CAST. Traditional hand-chisel work. Premium golden patina finish. Perfect for temple worship, meditation spaces, or luxury home decor. GI Tagged heritage craft from Tamil Nadu. Free shipping. Certificate of authenticity included.`,
      keywords: 'thanjavur bronze, nataraja statue, lost wax casting, tamil nadu handicraft, temple bronze, solid bronze sculpture, indian religious art, heritage craft, handmade statue, shiva nataraja',
      image: productImage,
    },
    etsy: {
      title: `Sacred ${productName} | 9th Generation Lost-Wax Cast | Thanjavur Temple Art`,
      description: `This is not a mass-produced replica. Every curve, every detail is hand-chiselled using the traditional lost-wax method passed down through my family for 9 generations in Thanjavur, Tamil Nadu.\n\n${productDescription}\n\nThe golden patina is achieved through a family secret technique.\n\nEach piece is unique and made to order. Ships worldwide with certificate of authenticity. Supporting traditional metal-casting communities in South India.`,
      tags: ['thanjavur bronze', 'nataraja statue', 'lost wax casting', 'tamil nadu craft', 'temple bronze', 'hindu deity', 'sacred art', 'heritage craft', 'shiva statue', 'indian sculpture'],
      image: productImage,
    },
  };

  const content = marketingContent[selectedPlatform];

  const handlePost = () => {
    setPosted(true);
    setTimeout(() => setPosted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 p-4 pt-20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={onBack}
            className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl text-gray-900 dark:text-white">Marketing Review</h1>
            <p className="text-gray-600 dark:text-gray-400">AI-generated content optimized for each platform</p>
          </div>
        </motion.div>

        {/* Platform Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg mb-6 flex gap-2"
        >
          <button
            onClick={() => setSelectedPlatform('instagram')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
              selectedPlatform === 'instagram'
                ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Instagram className="w-5 h-5" />
            <span>Instagram</span>
          </button>

          <button
            onClick={() => setSelectedPlatform('amazon')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
              selectedPlatform === 'amazon'
                ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Amazon</span>
          </button>

          <button
            onClick={() => setSelectedPlatform('etsy')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
              selectedPlatform === 'etsy'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Globe className="w-5 h-5" />
            <span>Etsy</span>
          </button>
        </motion.div>

        {/* Content Preview */}
        <motion.div
          key={selectedPlatform}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden mb-6"
        >
          <div className="grid md:grid-cols-2">
            {/* Left: Preview Image */}
            <div className="relative aspect-square md:aspect-auto">
              <img
                src={content.image}
                alt="Product"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Enhanced
              </div>
            </div>

            {/* Right: Content */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {selectedPlatform === 'instagram' && 'Instagram Post'}
                  {selectedPlatform === 'amazon' && 'Amazon Listing'}
                  {selectedPlatform === 'etsy' && 'Etsy Product'}
                </h3>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => {
                    const content = selectedPlatform === 'instagram' 
                      ? marketingContent.instagram.caption + '\n\n' + marketingContent.instagram.hashtags.join(' ')
                      : selectedPlatform === 'amazon'
                      ? marketingContent.amazon.title + '\n\n' + marketingContent.amazon.description
                      : marketingContent.etsy.title + '\n\n' + marketingContent.etsy.description;
                    
                    navigator.clipboard.writeText(content).then(() => {
                      alert('✅ Copied!\n\nPaste into ' + 
                        (selectedPlatform === 'instagram' ? 'Instagram' : 
                         selectedPlatform === 'amazon' ? 'Amazon' : 'Etsy'));
                      console.log('📋 Copied content for:', selectedPlatform);
                    });
                  }}
                >
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <h2 className="text-xl text-gray-900 dark:text-white mb-4">{content.title}</h2>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{content.description}</p>
              </div>

              {/* Platform-specific metadata */}
              {selectedPlatform === 'instagram' && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Recommended Hashtags:</p>
                  <div className="flex flex-wrap gap-2">
                    {marketingContent.instagram.hashtags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedPlatform === 'amazon' && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">SEO Keywords:</p>
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{marketingContent.amazon.keywords}</p>
                  </div>
                </div>
              )}

              {selectedPlatform === 'etsy' && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Product Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {marketingContent.etsy.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl p-6 mb-6 shadow-xl"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg mb-2">AI Marketing Insights</h3>
              <ul className="space-y-1 text-sm text-white/90">
                <li>✓ Content optimized for {selectedPlatform} algorithm</li>
                <li>✓ Best posting time: Today, 6:00 PM (Peak engagement)</li>
                <li>✓ Predicted reach: 2,500-3,000 users</li>
                <li>✓ Recommended price point: ₹2,200-2,800</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Execute Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={handlePost}
          disabled={posted}
          className={`w-full py-5 rounded-2xl shadow-2xl transition-all relative overflow-hidden ${
            posted
              ? 'bg-green-600'
              : 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:shadow-3xl'
          }`}
        >
          <div className="flex items-center justify-center gap-3 text-white">
            {posted ? (
              <>
                <Check className="w-6 h-6" />
                <span className="text-lg font-medium">Posted Successfully!</span>
              </>
            ) : (
              <>
                <motion.div
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <span className="relative text-lg font-medium">Execute Posting</span>
              </>
            )}
          </div>
        </motion.button>

        {/* Preview Warning */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4"
        >
          Review content carefully before posting. You can edit and customize as needed.
        </motion.p>
      </div>
    </div>
  );
}