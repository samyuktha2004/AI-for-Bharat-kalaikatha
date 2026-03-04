import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { ArrowLeft, CheckCircle, FileText, Download, Copy, Sparkles, AlertCircle, Award, IndianRupee, Calendar, FileCheck, HelpCircle, Lightbulb } from 'lucide-react';

interface GovernmentSchemesProps {
  onBack: () => void;
}

interface Scheme {
  id: string;
  title: string;
  titleTamil?: string;
  description: string;
  benefit: string;
  deadline: string;
  isNew: boolean;
  matched: boolean;
  matchReason: string;
  jargon?: {
    term: string;
    explanation: string;
    explanationTamil?: string;
  }[];
  requiredDocs: string[];
  applicationSteps: string[];
  aiDraftedLetter?: string;
  benefitAmount?: string;
  eligibility: string[];
}

export function GovernmentSchemes({ onBack }: GovernmentSchemesProps) {
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [showJargonBuster, setShowJargonBuster] = useState<string | null>(null);
  const [showDocHelper, setShowDocHelper] = useState(false);
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [draftGenerated, setDraftGenerated] = useState(false);

  // Ramesh's matched schemes (Bronze artisan from Thanjavur)
  const schemes: Scheme[] = [
    {
      id: 'odop-export',
      title: 'ODOP Export Subsidy for Bronze Work',
      titleTamil: 'வெண்கல வேலைக்கான ஏற்றுமதி மானியம்',
      description: 'One District One Product (ODOP) initiative provides export subsidies for GI-tagged bronze handicrafts from Thanjavur district.',
      benefit: 'Get 25% subsidy on export shipping costs + Marketing support',
      benefitAmount: '₹50,000 - ₹2,00,000',
      deadline: 'March 31, 2026',
      isNew: true,
      matched: true,
      matchReason: 'You are a bronze artisan from Thanjavur - perfect match for ODOP bronze exports!',
      jargon: [
        {
          term: 'GI Tag',
          explanation: "It's like a digital fingerprint that proves your bronze is the real Thanjavur art, making it 2x more valuable to foreign buyers.",
          explanationTamil: 'உங்கள் வெண்கலம் உண்மையான தஞ்சாவூர் கலை என்பதை நிரூபிக்கும் டிஜிட்டல் கைரேகை போன்றது. வெளிநாட்டு வாங்குபவர்களுக்கு 2 மடங்கு மதிப்புமிக்கது.'
        },
        {
          term: 'ODOP',
          explanation: 'One District One Product - Government picks one special craft from each district to promote globally. For Thanjavur, it\'s Bronze work!',
          explanationTamil: 'ஒரு மாவட்டம் ஒரு தயாரிப்பு - அரசாங்கம் ஒவ்வொரு மாவட்டத்திலிருந்தும் ஒரு சிறப்பு கைவினைப் பொருளை உலகளவில் ஊக்குவிக்கிறது. தஞ்சாவூருக்கு, அது வெண்கல வேலை!'
        },
        {
          term: 'Export Subsidy',
          explanation: 'Government pays part of your shipping cost when you send products to other countries. Like getting a discount on courier charges.',
          explanationTamil: 'நீங்கள் பொருட்களை பிற நாடுகளுக்கு அனுப்பும்போது அரசாங்கம் உங்கள் ஷிப்பிங் செலவில் ஒரு பகுதியை செலுத்துகிறது.'
        }
      ],
      requiredDocs: [
        'Aadhar Card',
        'Artisan Card (from Development Commissioner Handicrafts)',
        'GI Tag Certificate (for Thanjavur Bronze)',
        'Bank Account Details (for subsidy transfer)',
        'Photos of your bronze products',
        'Export order invoice (if you have international buyers)'
      ],
      applicationSteps: [
        'Register on ODOP Portal (odopindia.in)',
        'Upload Artisan Card and GI Certificate',
        'Submit product catalog with photos',
        'Get your craft verified by District Officer',
        'Receive approval within 15 days',
        'Start exporting with subsidy benefits'
      ],
      eligibility: [
        '✅ You are from Thanjavur district',
        '✅ You create GI-tagged bronze handicrafts',
        '✅ You have an Artisan Card',
        '✅ Your products are handmade (not machine-made)'
      ],
      aiDraftedLetter: `To,
The District ODOP Nodal Officer,
Thanjavur District Industries Centre,
Thanjavur - 613001

Subject: Application for ODOP Export Subsidy - Thanjavur Bronze Work

Respected Sir/Madam,

I am Ramesh, a 9th generation bronze artisan from Thanjavur, Tamil Nadu. My family has been creating traditional Thanjavur bronze sculptures using the ancient lost-wax casting technique for over 200 years.

I specialize in:
• Hand-chiselled Bronze Nataraja sculptures (12" to 36")
• Traditional temple bells using bell metal alloy
• Sacred vessels and oil lamps

My craft is registered under the GI Tag for Thanjavur Bronze (GI Tag No: [Your Certificate Number]). I recently received an export order from Al Habtoor Palace Hotel in Dubai for 15 Dancing Nataraja sculptures worth ₹2,22,000.

I wish to apply for the ODOP Export Subsidy to help cover shipping costs and promote Thanjavur's heritage globally. I have attached all required documents including:
1. Aadhar Card (Copy attached)
2. Artisan Card (Copy attached)
3. GI Tag Certificate for Thanjavur Bronze
4. Bank account details (for subsidy transfer)
5. Product catalog with photos
6. Export order invoice from Dubai buyer

I kindly request you to consider my application and help me grow my ancestral craft business while representing India's heritage abroad.

Thank you for your support.

Yours faithfully,
Ramesh
Mobile: [Your Number]
Email: ramesh@thanjavur.com

Date: ${new Date().toLocaleDateString('en-IN')}
Place: Thanjavur`
    },
    {
      id: 'gi-tag-registration',
      title: 'GI Tag Registration for Bronze Artisans',
      titleTamil: 'வெண்கல கைவினைஞர்களுக்கான ஜிஐ டேக் பதிவு',
      description: 'Register your bronze work under the Geographical Indication (GI) tag to increase value and authenticity.',
      benefit: 'Increase product value by 50-100% + Legal protection',
      benefitAmount: 'Free registration (₹0)',
      deadline: 'Rolling (Apply anytime)',
      isNew: false,
      matched: true,
      matchReason: 'Your bronze work from Thanjavur qualifies for GI tag protection!',
      jargon: [
        {
          term: 'GI Tag',
          explanation: "It's like a digital fingerprint that proves your bronze is the real Thanjavur art, making it 2x more valuable to foreign buyers.",
          explanationTamil: 'உங்கள் வெண்கலம் உண்மையான தஞ்சாவூர் கலை என்பதை நிரூபிக்கும் டிஜிட்டல் கைரேகை போன்றது.'
        }
      ],
      requiredDocs: [
        'Aadhar Card',
        'Proof of residence in Thanjavur district',
        'Photos showing your crafting process',
        'Artisan lineage proof (optional but helpful)'
      ],
      applicationSteps: [
        'Visit District Industries Centre',
        'Fill GI Tag application form',
        'Submit required documents',
        'Demonstrate your bronze casting technique',
        'Receive certificate within 30 days'
      ],
      eligibility: [
        '✅ You create bronze handicrafts',
        '✅ You are based in Thanjavur or nearby areas',
        '✅ You use traditional lost-wax casting method'
      ]
    },
    {
      id: 'pm-vishwakarma',
      title: 'PM Vishwakarma Yojana for Artisans',
      titleTamil: 'கைவினைஞர்களுக்கான பிஎம் விஸ்வகர்மா திட்டம்',
      description: 'Central Government scheme providing skill training, toolkit support, and low-interest loans to traditional artisans.',
      benefit: 'Get ₹10,000 toolkit + ₹3 lakh loan at 5% interest',
      benefitAmount: '₹10,000 + ₹3,00,000 loan',
      deadline: 'March 31, 2026',
      isNew: false,
      matched: true,
      matchReason: 'You are a traditional metal artisan - eligible for toolkit and loan benefits!',
      jargon: [
        {
          term: 'Toolkit Support',
          explanation: 'Government gives you ₹10,000 to buy new tools like chisels, hammers, furnace materials - whatever you need for better work.',
          explanationTamil: 'சிறந்த வேலைக்கு நீங்கள் தேவைப்படும் புதிய கருவிகள் வாங்க அரசாங்கம் உங்களுக்கு ₹10,000 கொடுக்கிறது.'
        },
        {
          term: 'Collateral-Free Loan',
          explanation: 'You can borrow ₹3 lakh without giving your house/land as guarantee. Just your Artisan Card is enough.',
          explanationTamil: 'உங்கள் வீடு/நிலத்தை உத்தரவாதமாக கொடுக்காமல் ₹3 லட்சம் கடன் வாங்கலாம். உங்கள் கைவினைஞர் அட்டை போதும்.'
        }
      ],
      requiredDocs: [
        'Aadhar Card',
        'Artisan Card',
        'Bank account details',
        'Caste certificate (if applicable)',
        'Mobile number for OTP verification'
      ],
      applicationSteps: [
        'Visit pmvishwakarma.gov.in',
        'Register with mobile number',
        'Upload Aadhar and Artisan Card',
        'Complete biometric verification at CSC center',
        'Attend 5-day skill training (optional)',
        'Receive toolkit grant within 30 days',
        'Apply for loan after toolkit'
      ],
      eligibility: [
        '✅ You are a traditional artisan (bronze worker)',
        '✅ Age between 18-65 years',
        '✅ You do handwork (not machine-based)'
      ]
    }
  ];

  const handleGenerateDraft = () => {
    setGeneratingDraft(true);
    // Simulate AI generation (2 seconds)
    setTimeout(() => {
      setGeneratingDraft(false);
      setDraftGenerated(true);
    }, 2000);
  };

  const handleCopyDraft = () => {
    if (selectedScheme?.aiDraftedLetter) {
      navigator.clipboard.writeText(selectedScheme.aiDraftedLetter);
      alert('✅ Application letter copied to clipboard!\n\nYou can now paste it in your email or print it.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 pb-20">
      <div className="max-w-4xl mx-auto">
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
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl text-gray-900 dark:text-white">Government Schemes</h1>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                ☁️ AI Assisted
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              🎯 AI-matched subsidies and benefits for you
            </p>
          </div>
        </motion.div>

        {/* New Scheme Alert */}
        {schemes.filter(s => s.isNew).length > 0 && !selectedScheme && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl p-6 mb-6 shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">🎉 New Scheme Alert, Ramesh!</h3>
                <p className="text-white/90 text-sm mb-3">
                  There is a new export subsidy for GI-tagged bronze work under the ODOP initiative. 
                  This could give you ₹50,000 - ₹2,00,000 for shipping to Dubai!
                </p>
                <button
                  onClick={() => setSelectedScheme(schemes[0])}
                  className="px-6 py-2 bg-white text-orange-600 rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  View Details →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Schemes List */}
        {!selectedScheme && (
          <div className="space-y-4">
            {schemes.map((scheme, index) => (
              <motion.button
                key={scheme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedScheme(scheme)}
                className="w-full bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all text-left relative overflow-hidden"
              >
                {/* Matched Badge */}
                {scheme.matched && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs">
                      <CheckCircle className="w-3 h-3" />
                      <span>Matched</span>
                    </div>
                  </div>
                )}

                {/* New Badge */}
                {scheme.isNew && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full text-xs animate-pulse">
                      <Sparkles className="w-3 h-3" />
                      <span>NEW</span>
                    </div>
                  </div>
                )}

                <div className="pr-24">
                  <h3 className="text-lg text-gray-900 dark:text-white mb-2">{scheme.title}</h3>
                  {scheme.titleTamil && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{scheme.titleTamil}</p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{scheme.description}</p>

                  {/* Benefit Highlight */}
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700 dark:text-green-400 font-medium">{scheme.benefit}</span>
                  </div>

                  {/* Match Reason */}
                  {scheme.matched && (
                    <div className="flex items-start gap-2 bg-green-50 dark:bg-green-900/20 rounded-xl p-3 mb-3">
                      <Lightbulb className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-green-800 dark:text-green-300">{scheme.matchReason}</p>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      <span>{scheme.benefitAmount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Deadline: {scheme.deadline}</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Scheme Details View */}
        <AnimatePresence>
          {selectedScheme && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-6"
            >
              {/* Back Button */}
              <button
                onClick={() => {
                  setSelectedScheme(null);
                  setShowJargonBuster(null);
                  setShowDocHelper(false);
                  setDraftGenerated(false);
                }}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to all schemes</span>
              </button>

              {/* Scheme Header */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl text-gray-900 dark:text-white mb-2">{selectedScheme.title}</h2>
                    {selectedScheme.titleTamil && (
                      <p className="text-gray-600 dark:text-gray-400">{selectedScheme.titleTamil}</p>
                    )}
                  </div>
                  {selectedScheme.isNew && (
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs">NEW</span>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedScheme.description}</p>

                {/* Benefit Box */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-green-600" />
                    <h4 className="text-green-900 dark:text-green-300 font-medium">Benefit</h4>
                  </div>
                  <p className="text-green-800 dark:text-green-400 mb-2">{selectedScheme.benefit}</p>
                  <div className="flex items-center gap-2 text-2xl text-green-700 dark:text-green-300">
                    <IndianRupee className="w-6 h-6" />
                    <span className="font-bold">{selectedScheme.benefitAmount}</span>
                  </div>
                </div>

                {/* Match Reason */}
                {selectedScheme.matched && (
                  <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
                    <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-blue-900 dark:text-blue-300 font-medium mb-1">Why This Matches You</h4>
                      <p className="text-blue-800 dark:text-blue-400 text-sm">{selectedScheme.matchReason}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Eligibility */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl">
                <h3 className="text-lg text-gray-900 dark:text-white mb-4">✅ Eligibility Check</h3>
                <ul className="space-y-2">
                  {selectedScheme.eligibility.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Jargon Buster */}
              {selectedScheme.jargon && selectedScheme.jargon.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg text-gray-900 dark:text-white">Jargon Buster</h3>
                    <span className="text-xs text-purple-600 dark:text-purple-400">Click to understand</span>
                  </div>
                  <div className="space-y-3">
                    {selectedScheme.jargon.map((item, idx) => (
                      <div key={idx}>
                        <button
                          onClick={() => setShowJargonBuster(showJargonBuster === item.term ? null : item.term)}
                          className="w-full text-left flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                        >
                          <span className="text-purple-900 dark:text-purple-300 font-medium">{item.term}</span>
                          <motion.span
                            animate={{ rotate: showJargonBuster === item.term ? 180 : 0 }}
                            className="text-purple-600"
                          >
                            ▼
                          </motion.span>
                        </button>
                        <AnimatePresence>
                          {showJargonBuster === item.term && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl mt-2">
                                <p className="text-gray-700 dark:text-gray-300 mb-2">{item.explanation}</p>
                                {item.explanationTamil && (
                                  <p className="text-gray-600 dark:text-gray-400 text-sm italic border-t border-purple-200 dark:border-purple-800 pt-2">
                                    தமிழில்: {item.explanationTamil}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Document Helper */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl">
                <button
                  onClick={() => setShowDocHelper(!showDocHelper)}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg text-gray-900 dark:text-white">Required Documents</h3>
                  </div>
                  <motion.span
                    animate={{ rotate: showDocHelper ? 180 : 0 }}
                    className="text-gray-600"
                  >
                    ▼
                  </motion.span>
                </button>

                <AnimatePresence>
                  {showDocHelper && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 mb-4">
                        {selectedScheme.requiredDocs.map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{doc}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="text-amber-800 dark:text-amber-300 text-sm">
                            💡 Tip: Keep scanned copies of all documents on your phone. You can upload them directly from Kalaikatha!
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Application Steps */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl">
                <h3 className="text-lg text-gray-900 dark:text-white mb-4">📝 How to Apply</h3>
                <ol className="space-y-3">
                  {selectedScheme.applicationSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0 text-indigo-700 dark:text-indigo-300 font-medium">
                        {idx + 1}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* AI Draft Letter (if available) */}
              {selectedScheme.aiDraftedLetter && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-lg text-gray-900 dark:text-white">AI-Generated Application Letter</h3>
                    </div>
                    {!draftGenerated && (
                      <button
                        onClick={handleGenerateDraft}
                        disabled={generatingDraft}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm flex items-center gap-2"
                      >
                        {generatingDraft ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                              ⚙️
                            </motion.div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Generate Draft
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {draftGenerated && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-4 max-h-96 overflow-y-auto">
                        <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                          {selectedScheme.aiDraftedLetter}
                        </pre>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleCopyDraft}
                          className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copy to Clipboard
                        </button>
                        <button
                          onClick={() => alert('📧 Email Draft\n\nOpening your email app with the draft...\n\n(In production, this would open mailto: with pre-filled content)')}
                          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          Send via Email
                        </button>
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                        💡 AI-generated - Review and customize before sending
                      </p>
                    </motion.div>
                  )}

                  {!draftGenerated && !generatingDraft && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Vani can write a professional application letter for you in seconds. Just click "Generate Draft" above!
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
