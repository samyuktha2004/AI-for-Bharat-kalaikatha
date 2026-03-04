import { motion } from 'motion/react';
import { ArrowLeft, Instagram, ShoppingBag, Globe, Check, Sparkles, Copy } from 'lucide-react';
import { useState } from 'react';

import productimg from 'figma:asset/852ca5c1ac40dbd85cdb673b76a77225c11846b5.png';

interface MarketingReviewProps {
  onBack: () => void;
}

export function MarketingReview({ onBack }: MarketingReviewProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'amazon' | 'etsy' | 'flipkart'>('instagram');
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
      title: `${productName} ✨`,
      caption: `Handcrafted with love and precision. Every piece tells a unique story. Made with passion by skilled artisans. 🇮🇳\n\n#HandmadeInIndia #IndianArtisan #ArtisanCraft #Handcrafted #SupportLocal #EthicalFashion #SustainableLiving #TraditionalCraft #MadeWithLove #Etsy #Amazon #Flipkart`,
      hashtags: ['#HandmadeInIndia', '#IndianArtisan', '#ArtisanCraft', '#Handcrafted', '#SupportLocal', '#TraditionalCraft', '#Etsy', '#Amazon', '#Flipkart'],
      image: productImage,
    },
    amazon: {
      title: `${productName} - Handmade Authentic Indian Craft`,
      bulletPoints: [
        'Authentic handcrafted by skilled Indian artisans',
        'Made from premium natural materials',
        'Each piece is unique and one-of-a-kind',
        'Perfect for home décor, gifts, or personal collection',
        'Fair trade - supports traditional craft communities'
      ],
      description: `${productDescription}\n\nThis stunning ${productName} is an authentic handcrafted piece made by skilled Indian artisans using traditional techniques. Each item is carefully crafted with attention to detail, ensuring exceptional quality.\n\nWhy choose this product?\n• Authentic - Made by traditional artisans\n• Unique - Each piece is one-of-a-kind\n• Fair Trade - Supports artisan communities\n• Quality - Premium natural materials\n• Perfect Gift - For anyone who appreciates authentic craftsmanship\n\nSupport traditional Indian handicrafts today!`,
      keywords: 'handmade, Indian, artisan, authentic, handicraft, traditional, fair trade, handcrafted, unique',
      image: productImage,
    },
    etsy: {
      title: `${productName} - Handmade Indian Artisan Craft`,
      description: `This beautiful ${productName} is an authentic handcrafted product, made by skilled Indian artisans using traditional techniques passed down through generations.\n\n${productDescription}\n\nEach piece is individually crafted with premium natural materials and exceptional attention to detail. Unlike mass-produced items, this product carries the uniqueness and soul of traditional Indian craftsmanship.\n\nPerfect for:\n• Home decoration\n• Gift-giving\n• Personal collection\n• Anyone appreciating authentic craftsmanship\n\nFair Trade: This purchase directly supports traditional artisan communities in India.\n\nShips worldwide with certificate of authenticity.`,
      tags: ['handmade', 'Indian', 'artisan', 'authentic', 'handicraft', 'traditional', 'fair trade', 'unique', 'handcrafted'],
      image: productImage,
    },
    flipkart: {
      title: `${productName} | Authentic Handmade Indian Craft`,
      highlights: [
        'Handcrafted by skilled artisans',
        'Premium natural materials',
        'Authentic traditional craft',
        'Unique one-of-a-kind piece',
        'Fair trade certified'
      ],
      description: `Experience authentic Indian craftsmanship with this beautiful ${productName}.\n\n${productDescription}\n\nThis is a genuine handcrafted product made by traditional artisans using time-tested techniques. Each piece is unique and carries the mark of true craftsmanship.\n\nKey Features:\n✓ Handmade with premium materials\n✓ Authentic traditional design\n✓ Each piece is one-of-a-kind\n✓ Fair trade - supports artisans\n✓ Perfect for home décor and gifting\n\nMake a conscious choice. Support traditional Indian handicrafts. Free shipping on orders above ₹500.`,
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
          className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg mb-6 grid grid-cols-2 md:grid-cols-4 gap-2"
        >
          <button
            onClick={() => setSelectedPlatform('instagram')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
              selectedPlatform === 'instagram'
                ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Instagram className="w-5 h-5" />
            <span className="text-sm">Instagram</span>
          </button>

          <button
            onClick={() => setSelectedPlatform('amazon')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
              selectedPlatform === 'amazon'
                ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-sm">Amazon</span>
          </button>

          <button
            onClick={() => setSelectedPlatform('etsy')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
              selectedPlatform === 'etsy'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm">Etsy</span>
          </button>

          <button
            onClick={() => setSelectedPlatform('flipkart')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
              selectedPlatform === 'flipkart'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-sm">Flipkart</span>
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
                  {selectedPlatform === 'flipkart' && 'Flipkart Listing'}
                </h3>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => {
                    const content = selectedPlatform === 'instagram' 
                      ? marketingContent.instagram.caption + '\n\n' + marketingContent.instagram.hashtags.join(' ')
                      : selectedPlatform === 'amazon'
                      ? marketingContent.amazon.title + '\n\n' + marketingContent.amazon.bulletPoints.join('\n') + '\n\n' + marketingContent.amazon.description
                      : selectedPlatform === 'etsy'
                      ? marketingContent.etsy.title + '\n\n' + marketingContent.etsy.description
                      : marketingContent.flipkart.title + '\n\n' + marketingContent.flipkart.highlights.join('\n') + '\n\n' + marketingContent.flipkart.description;
                    
                    navigator.clipboard.writeText(content).then(() => {
                      alert('✅ Copied!\n\nPaste into ' + 
                        (selectedPlatform === 'instagram' ? 'Instagram' : 
                         selectedPlatform === 'amazon' ? 'Amazon' : 
                         selectedPlatform === 'etsy' ? 'Etsy' : 'Flipkart'));
                      console.log('📋 Copied content for:', selectedPlatform);
                    });
                  }}
                >
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <h2 className="text-xl text-gray-900 dark:text-white mb-4">{content.title}</h2>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                {selectedPlatform === 'amazon' ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-2">Description:</p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">{content.description}</p>
                    </div>
                  </div>
                ) : selectedPlatform === 'flipkart' ? (
                  <div className="space-y-3">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">{content.description}</p>
                  </div>
                ) : selectedPlatform === 'instagram' ? (
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{content.caption}</p>
                  </div>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{content.description}</p>
                )}
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Key Bullet Points:</p>
                  <div className="space-y-2">
                    {marketingContent.amazon.bulletPoints.map((point, i) => (
                      <div key={i} className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700 dark:text-gray-300">{point}</p>
                      </div>
                    ))}
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

              {selectedPlatform === 'flipkart' && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Product Highlights:</p>
                  <div className="flex flex-wrap gap-2">
                    {marketingContent.flipkart.highlights.map((highlight, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                        {highlight}
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