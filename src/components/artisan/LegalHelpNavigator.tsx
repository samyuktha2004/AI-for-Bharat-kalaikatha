/**
 * LegalHelpNavigator - Connects artisans to REAL legal help
 * 
 * IMPORTANT: We are NOT lawyers! We don't:
 * - Generate patents
 * - Provide legal advice
 * - Create legal documents
 * - File applications on behalf of users
 * 
 * We DO:
 * - Find government schemes and programs
 * - Explain what's available
 * - Provide official helpline numbers
 * - Redirect to free legal aid services
 * - Simplify complex legal information (in plain language)
 */

import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Phone, ExternalLink, FileText, Shield, IndianRupee, Landmark, AlertCircle, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useTextToSpeech } from '../../hooks/useArtisanFeatures';

interface LegalHelpNavigatorProps {
  onBack: () => void;
}

// Government schemes and official helplines
const GOVERNMENT_RESOURCES = {
  patents: {
    icon: Shield,
    titleHindi: 'पेटेंट और बौद्धिक संपदा',
    titleEnglish: 'Patents & Intellectual Property',
    color: 'from-blue-500 to-indigo-500',
    resources: [
      {
        name: 'Office of Controller General of Patents (India)',
        nameHindi: 'पेटेंट नियंत्रक कार्यालय',
        phone: '011-26512300',
        website: 'https://ipindia.gov.in',
        description: 'Official government office for patent registration',
        descriptionHindi: 'पेटेंट पंजीकरण के लिए सरकारी कार्यालय',
      },
      {
        name: 'National Innovation Foundation',
        nameHindi: 'राष्ट्रीय नवाचार संस्थान',
        phone: '079-26730913',
        website: 'https://nif.org.in',
        description: 'Helps grassroots innovators protect their work',
        descriptionHindi: 'जमीनी स्तर के नवप्रवर्तकों को उनके काम की रक्षा में मदद करता है',
      },
      {
        name: 'Geographical Indication Registry',
        nameHindi: 'भौगोलिक संकेत रजिस्ट्री',
        phone: '044-28336583',
        website: 'https://ipindia.gov.in/gi-application.htm',
        description: 'Protects traditional crafts by region (e.g., Banarasi silk)',
        descriptionHindi: 'क्षेत्र के अनुसार पारंपरिक शिल्प की रक्षा करता है (जैसे बनारसी रेशम)',
      },
    ],
  },
  schemes: {
    icon: IndianRupee,
    titleHindi: 'सरकारी योजनाएं और सहायता',
    titleEnglish: 'Government Schemes & Aid',
    color: 'from-green-500 to-emerald-500',
    resources: [
      {
        name: 'Pradhan Mantri Mudra Yojana',
        nameHindi: 'प्रधानमंत्री मुद्रा योजना',
        phone: '1800-180-0001',
        website: 'https://www.mudra.org.in',
        description: 'Loans up to ₹10 lakh for small businesses',
        descriptionHindi: 'छोटे व्यवसायों के लिए ₹10 लाख तक का ऋण',
      },
      {
        name: 'National Handicraft Development Programme',
        nameHindi: 'राष्ट्रीय हस्तशिल्प विकास कार्यक्रम',
        phone: '011-23062129',
        website: 'https://handicrafts.nic.in',
        description: 'Financial assistance and training for artisans',
        descriptionHindi: 'कारीगरों के लिए वित्तीय सहायता और प्रशिक्षण',
      },
      {
        name: 'Ambedkar Hastshilp Vikas Yojana',
        nameHindi: 'अम्बेडकर हस्तशिल्प विकास योजना',
        phone: '011-23062188',
        website: 'https://handicrafts.nic.in/ahvy.html',
        description: 'Support for SC/ST artisans',
        descriptionHindi: 'अनुसूचित जाति/जनजाति कारीगरों के लिए सहायता',
      },
      {
        name: 'Stand Up India Scheme',
        nameHindi: 'स्टैंड अप इंडिया योजना',
        phone: '1800-180-0111',
        website: 'https://www.standupmitra.in',
        description: 'Loans for women and SC/ST entrepreneurs',
        descriptionHindi: 'महिला और अनुसूचित जाति/जनजाति उद्यमियों के लिए ऋण',
      },
    ],
  },
  legalAid: {
    icon: Landmark,
    titleHindi: 'मुफ्त कानूनी सहायता',
    titleEnglish: 'Free Legal Aid',
    color: 'from-purple-500 to-pink-500',
    resources: [
      {
        name: 'National Legal Services Authority (NALSA)',
        nameHindi: 'राष्ट्रीय विधिक सेवा प्राधिकरण',
        phone: '1516 (Toll-free)',
        website: 'https://nalsa.gov.in',
        description: 'Free legal aid for artisans and low-income individuals',
        descriptionHindi: 'कारीगरों और कम आय वाले व्यक्तियों के लिए मुफ्त कानूनी सहायता',
      },
      {
        name: 'State Legal Services Authority',
        nameHindi: 'राज्य विधिक सेवा प्राधिकरण',
        phone: 'Contact your state office',
        website: 'https://nalsa.gov.in/slsa',
        description: 'Free legal consultations in your state',
        descriptionHindi: 'आपके राज्य में मुफ्त कानूनी परामर्श',
      },
    ],
  },
  training: {
    icon: FileText,
    titleHindi: 'प्रशिक्षण और जागरूकता',
    titleEnglish: 'Training & Awareness',
    color: 'from-orange-500 to-amber-500',
    resources: [
      {
        name: 'CIPAM (Cell for IPR Promotion & Management)',
        nameHindi: 'बौद्धिक संपदा संवर्धन एवं प्रबंधन प्रकोष्ठ',
        phone: '011-23380560',
        website: 'https://ipindia.gov.in/cipam.htm',
        description: 'Free workshops on intellectual property rights',
        descriptionHindi: 'बौद्धिक संपदा अधिकारों पर मुफ्त कार्यशालाएं',
      },
      {
        name: 'Ministry of MSME - Udyam Registration',
        nameHindi: 'सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय - उद्यम पंजीकरण',
        phone: '1800-111-6666',
        website: 'https://udyamregistration.gov.in',
        description: 'Register your craft business (required for schemes)',
        descriptionHindi: 'अपने शिल्प व्यवसाय को पंजीकृत करें (योजनाओं के लिए आवश्यक)',
      },
    ],
  },
};

export function LegalHelpNavigator({ onBack }: LegalHelpNavigatorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [language, setLanguage] = useState<'hindi' | 'english'>('hindi');
  const { speak } = useTextToSpeech();

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const categoryData = GOVERNMENT_RESOURCES[category as keyof typeof GOVERNMENT_RESOURCES];
    speak(
      language === 'hindi' ? categoryData.titleHindi : categoryData.titleEnglish,
      language === 'hindi' ? 'hi-IN' : 'en-IN'
    );
  };

  const handleCallClick = (phone: string, name: string) => {
    speak(
      language === 'hindi' 
        ? `${name} को कॉल कर रहे हैं: ${phone}`
        : `Calling ${name}: ${phone}`,
      language === 'hindi' ? 'hi-IN' : 'en-IN'
    );
    window.location.href = `tel:${phone}`;
  };

  const handleWebsiteClick = (url: string, name: string) => {
    speak(
      language === 'hindi'
        ? `${name} की वेबसाइट खोल रहे हैं`
        : `Opening ${name} website`,
      language === 'hindi' ? 'hi-IN' : 'en-IN'
    );
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <button
            onClick={onBack}
            className="w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center"
          >
            <ArrowLeft className="w-7 h-7 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === 'hindi' ? 'english' : 'hindi')}
            className="px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center gap-2"
          >
            <span className="text-2xl">{language === 'hindi' ? '🇮🇳' : '🇬🇧'}</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {language === 'hindi' ? 'हिन्दी' : 'English'}
            </span>
          </button>
        </motion.div>

        {/* Disclaimer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-400 dark:border-amber-600 rounded-3xl p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="text-amber-900 dark:text-amber-300 font-bold text-lg mb-2">
                {language === 'hindi' ? '⚠️ महत्वपूर्ण जानकारी' : '⚠️ Important Notice'}
              </h3>
              <p className="text-amber-800 dark:text-amber-400 text-sm">
                {language === 'hindi'
                  ? 'हम वकील नहीं हैं। हम केवल आपको सरकारी सहायता और मुफ्त कानूनी सेवाओं से जोड़ते हैं। कृपया आधिकारिक सरकारी कार्यालयों से संपर्क करें।'
                  : 'We are NOT lawyers. We only connect you to government help and free legal services. Please contact official government offices.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Category Grid */}
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {Object.entries(GOVERNMENT_RESOURCES).map(([key, category]) => {
                const Icon = category.icon;
                return (
                  <motion.button
                    key={key}
                    onClick={() => handleCategorySelect(key)}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-gradient-to-br ${category.color} rounded-3xl p-8 shadow-2xl text-left`}
                  >
                    <Icon className="w-16 h-16 text-white mb-4" />
                    <h3 className="text-white text-2xl font-bold mb-2">
                      {language === 'hindi' ? category.titleHindi : category.titleEnglish}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {language === 'hindi' ? 'टैप करके देखें' : 'Tap to view'}
                    </p>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            // Resource List
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Back to categories */}
              <button
                onClick={() => setSelectedCategory(null)}
                className="mb-4 px-6 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">
                  {language === 'hindi' ? 'वापस' : 'Back'}
                </span>
              </button>

              {GOVERNMENT_RESOURCES[selectedCategory as keyof typeof GOVERNMENT_RESOURCES].resources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl"
                >
                  {/* Resource name */}
                  <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2">
                    {language === 'hindi' ? resource.nameHindi : resource.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {language === 'hindi' ? resource.descriptionHindi : resource.description}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {/* Call button */}
                    {resource.phone && (
                      <button
                        onClick={() => handleCallClick(resource.phone, resource.name)}
                        className="flex-1 min-w-[150px] bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-3 font-bold shadow-lg"
                      >
                        <Phone className="w-5 h-5" />
                        <span>{resource.phone}</span>
                      </button>
                    )}

                    {/* Website button */}
                    {resource.website && (
                      <button
                        onClick={() => handleWebsiteClick(resource.website, resource.name)}
                        className="flex-1 min-w-[150px] bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-3 font-bold shadow-lg"
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span>
                          {language === 'hindi' ? 'वेबसाइट' : 'Website'}
                        </span>
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => speak(
            language === 'hindi'
              ? 'ये सभी सरकारी संसाधन मुफ्त हैं। कोई भी नंबर पर कॉल करें या वेबसाइट खोलें।'
              : 'All these government resources are free. Call any number or open the website.',
            language === 'hindi' ? 'hi-IN' : 'en-IN'
          )}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center"
        >
          <HelpCircle className="w-8 h-8 text-white" />
        </motion.button>
      </div>
    </div>
  );
}
