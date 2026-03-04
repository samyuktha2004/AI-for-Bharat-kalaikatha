# Requirements Specification

> **Generated via Kiro's spec-driven workflow**  
> Detailing problem statement, target users, and core features

---

## 📋 Document Information

- **Project:** Kalaikatha - AI-Powered Artisan Marketplace
- **Version:** 1.0.0
- **Status:** Approved
- **Last Updated:** January 2026
- **Owner:** Product Team
- **Stakeholders:** Artisans, Buyers, Development Team, Investors

---

## 🎯 Problem Statement

### The Challenge

Indian artisans face systemic barriers that prevent them from reaching their full economic potential:

**1. Digital Illiteracy Crisis**
- 60% of artisans have limited reading/writing skills (Class 5-10 education)
- Cannot use existing e-commerce platforms (text-heavy, complex navigation)
- Excluded from digital economy opportunities
- Dependent on middlemen for market access

**2. Economic Exploitation**
- Middlemen take 40-60% margins on artisan products
- Artisans earn below fair value for their craftsmanship
- No transparency in pricing mechanisms
- Lack of market knowledge leads to underpricing

**3. Market Access Limitations**
- Reach limited to local markets and tourist spots
- No direct connection to urban/international buyers
- Unable to showcase full portfolio of work
- Seasonal demand fluctuations impact income

**4. Technology Barriers**
- Complex interfaces designed for literate users
- English-only platforms exclude regional language speakers
- High data consumption unsuitable for 2G/3G networks
- Expensive smartphones required for most apps

**5. Trust & Authenticity Issues**
- Buyers uncertain about product authenticity
- No verification of traditional craftsmanship
- Trade secrets at risk when sharing online
- Intellectual property concerns

### Impact

- **10 million artisans** in India struggle with digital access
- **₹50,000 crore** potential market underserved
- **40-60% income loss** to middlemen exploitation
- **Traditional crafts dying** due to lack of economic viability

### Why Now?

- Smartphone penetration: 750M+ users in India
- 4G/5G expansion reaching rural areas
- AI technology mature enough for voice interfaces
- Government focus on digital India and artisan welfare
- Post-pandemic shift to online shopping

---

## 👥 Target Users

### Primary User: Artisans

**Demographics:**
- **Age:** 25-60 years
- **Gender:** 60% male, 40% female
- **Location:** Rural and semi-urban India (Tier 2/3 cities)
- **Education:** Limited literacy (Class 5-10)
- **Income:** ₹10,000-30,000/month
- **Language:** Tamil, Hindi, or regional languages (limited English)

**Technology Profile:**
- **Device:** Android smartphone (₹8,000-15,000 range)
- **RAM:** 2-4GB
- **Internet:** 2G/3G connectivity (limited 4G)
- **Skills:** Basic smartphone usage (WhatsApp, camera, YouTube)
- **Data:** Limited data plans (1-2GB/month)

**Craft Categories:**
- Bronze casting (Tamil Nadu)
- Pottery (Rajasthan, Gujarat)
- Weaving (Varanasi, Kanchipuram)
- Wood carving (Kerala, Karnataka)
- Stone sculpture (Odisha, Tamil Nadu)
- Jewelry making (Rajasthan, Gujarat)
- Leather work (Tamil Nadu, Uttar Pradesh)
- Textile printing (Rajasthan, Gujarat)

**Pain Points:**
- Cannot read/write product descriptions
- Struggle with complex app navigation
- Fear of technology and making mistakes
- Worried about trade secret theft
- Don't know fair pricing for products
- Cannot create marketing content
- Miss government scheme opportunities
- Exploited by middlemen

**Goals:**
- Earn fair income for craftsmanship
- Reach buyers directly (eliminate middlemen)
- Protect traditional knowledge and trade secrets
- Learn about government schemes and benefits
- Grow business sustainably
- Pass craft to next generation

**User Persona: Ramesh**
- 45-year-old bronze caster from Tamil Nadu
- Class 8 education, speaks Tamil (limited English)
- Uses WhatsApp to share photos with family
- Earns ₹18,000/month (₹30,000 potential without middlemen)
- Wants to sell directly to buyers but doesn't know how
- Worried about sharing trade secrets online
- Needs help with pricing and marketing

### Secondary User: Buyers

**Demographics:**
- **Age:** 25-45 years
- **Gender:** 55% female, 45% male
- **Location:** Urban India (Tier 1 cities) + International
- **Education:** College educated
- **Income:** ₹50,000-200,000/month
- **Language:** English, Hindi (comfortable with both)

**Technology Profile:**
- **Device:** Smartphone (iOS/Android) or Desktop
- **Internet:** 4G/WiFi (high-speed)
- **Skills:** Comfortable with e-commerce platforms
- **Usage:** Regular online shoppers

**Buyer Types:**
- **Home Decorators:** Seeking authentic handcrafted items
- **Gift Buyers:** Looking for unique, meaningful gifts
- **Interior Designers:** Sourcing for client projects
- **Collectors:** Interested in traditional art forms
- **Conscious Consumers:** Supporting artisan livelihoods

**Pain Points:**
- Difficulty finding authentic handcrafted products
- Uncertainty about artisan credibility
- Limited information about craft techniques
- No direct communication with artisans
- Concerns about fair pricing to artisans
- Want customization but no easy way to request

**Goals:**
- Discover authentic handcrafted products
- Support artisan livelihoods directly
- Get customized products for specific needs
- Learn about craft traditions and stories
- Ensure fair payment to artisans
- Build relationships with artisans

**User Persona: Priya**
- 32-year-old interior designer from Mumbai
- Seeks authentic crafts for client projects
- Values sustainability and fair trade
- Willing to pay premium for quality and authenticity
- Wants to know artisan's story
- Needs custom pieces for specific requirements

### Tertiary User: Administrators (Future)

**Role:** Platform moderators, support staff, scheme coordinators

**Responsibilities:**
- Content moderation
- User support
- Scheme management
- Analytics and reporting
- Quality assurance

---

## ✨ Core Features

### Feature 1: Voice-First Interface (Vani AI Assistant)

**Problem Solved:** Artisans with limited literacy cannot navigate text-heavy apps

**Description:**
Vani is an AI-powered voice assistant that enables hands-free navigation and interaction. Artisans can speak commands in their native language (Tamil, Hindi, English) to perform any action in the app.

**User Stories:**
- As an artisan, I want to navigate the app using voice commands so I don't need to read text
- As an artisan, I want Vani to speak instructions so I understand what to do
- As an artisan, I want to use my native language so I feel comfortable

**Acceptance Criteria:**
- ✅ Recognizes voice commands in Tamil, Hindi, English
- ✅ Supports 20+ common commands ("Upload photo", "Check orders", "Calculate price")
- ✅ Provides voice feedback for all actions
- ✅ Shows real-time transcription of speech
- ✅ Works in noisy environments (>80% accuracy)
- ✅ Response time <2 seconds
- ✅ Large, accessible button (80px) always visible
- ✅ Visual feedback (pulsing animation) when listening

**Technical Requirements:**
- AWS Transcribe for speech-to-text (fallback: Browser Web Speech API)
- AWS Polly for text-to-speech (fallback: Browser speechSynthesis)
- Natural language processing for command interpretation
- Context-aware responses

**Success Metrics:**
- 70% of artisans use voice commands regularly
- 90% task completion rate via voice
- <5% voice recognition errors
- 4.5+ star rating for voice feature

---

### Feature 2: AI-Powered Smart Pricing

**Problem Solved:** Artisans underpriced due to lack of market knowledge, leading to exploitation

**Description:**
AI analyzes material costs, labor hours, skill level, and market rates to suggest fair pricing. Prevents artisans from pricing below cost and provides reasoning for suggested prices.

**User Stories:**
- As an artisan, I want AI to suggest fair prices so I don't get exploited
- As an artisan, I want to understand why a price is suggested so I can learn
- As an artisan, I want warnings if I price too low so I don't lose money

**Acceptance Criteria:**
- ✅ Input: Material cost, labor hours, skill level, craft type, location
- ✅ Output: Floor price (minimum), suggested price, premium price
- ✅ Provides reasoning for each price point
- ✅ Warns if pricing below cost
- ✅ Compares with market rates for similar products
- ✅ Saves pricing history for reference
- ✅ Response time <3 seconds
- ✅ Works offline with formula-based fallback

**Technical Requirements:**
- OpenAI GPT-3.5-turbo for AI analysis (primary)
- Formula-based calculation as fallback: (material + labor × hourly_rate) × 2.5
- Cache results for 24 hours
- Market data integration (future)

**Success Metrics:**
- 80% of artisans use smart pricing
- 30% increase in average product price
- 95% of prices above cost
- 85% artisan satisfaction with pricing

---

### Feature 3: AI Photo Studio

**Problem Solved:** Artisans lack professional photography skills and equipment

**Description:**
Transform smartphone photos into professional product images using AI. Auto-enhance quality, detect trade secrets, and optimize for web display.

**User Stories:**
- As an artisan, I want to upload photos easily so I can showcase my products
- As an artisan, I want AI to improve photo quality so they look professional
- As an artisan, I want trade secrets detected so I don't accidentally expose them

**Acceptance Criteria:**
- ✅ Camera capture or gallery selection
- ✅ Auto-compress images (target: 500KB)
- ✅ AI enhancement (brightness, contrast, sharpness)
- ✅ Trade secret detection with confidence scores
- ✅ Quality assessment (blur, lighting)
- ✅ Progress indicator during upload
- ✅ Upload time <5 seconds on 3G
- ✅ Supports JPEG, PNG, WebP (max 5MB)

**Technical Requirements:**
- Amazon S3 for storage (fallback: localStorage base64)
- Amazon Rekognition for image analysis
- OpenAI GPT-4-vision for trade secret detection
- Client-side canvas API for compression
- Lazy loading for image display

**Success Metrics:**
- 90% of products have photos
- 70% of photos AI-enhanced
- 50% reduction in upload time
- 4.0+ star rating for photo quality

---

### Feature 4: Marketing Automation

**Problem Solved:** Artisans cannot create marketing content for multiple platforms

**Description:**
Generate multi-platform marketing content from a single voice story. AI creates Instagram captions, Amazon descriptions, WhatsApp messages, and video scripts.

**User Stories:**
- As an artisan, I want to record my product story in voice so I don't need to write
- As an artisan, I want AI to create marketing content so I can sell on multiple platforms
- As an artisan, I want to edit generated content so it matches my style

**Acceptance Criteria:**
- ✅ Record voice story (up to 2 minutes)
- ✅ Auto-transcription of voice
- ✅ Generate Instagram caption (100 chars, emojis)
- ✅ Generate Amazon description (300 words, SEO-optimized)
- ✅ Generate WhatsApp message (50 words, conversational)
- ✅ Generate video script (60 seconds, shot-by-shot)
- ✅ Edit before export
- ✅ Copy to clipboard or share
- ✅ Generation time <10 seconds

**Technical Requirements:**
- AWS Transcribe for voice-to-text
- OpenAI GPT-3.5-turbo for content generation
- Template-based fallback
- Cache generated content for 7 days

**Success Metrics:**
- 60% of artisans use marketing automation
- 5x increase in product listings on external platforms
- 40% increase in product views
- 4.5+ star rating for generated content quality

---

### Feature 5: Bargain Bot (Autonomous Negotiation)

**Problem Solved:** Artisans miss orders while sleeping or working, lose negotiation leverage

**Description:**
AI bot negotiates with buyers on behalf of artisans. Starts high, concedes gradually, never goes below floor price. Artisan reviews and approves final offer.

**User Stories:**
- As an artisan, I want a bot to negotiate for me so I don't miss orders
- As an artisan, I want to set minimum price so I never lose money
- As an artisan, I want to approve final offers so I stay in control

**Acceptance Criteria:**
- ✅ Set floor price (minimum acceptable)
- ✅ Set target price (ideal)
- ✅ Enable/disable auto-negotiation
- ✅ Bot negotiates in 3-5 rounds
- ✅ Never goes below floor price
- ✅ Analyzes buyer profile and history
- ✅ Mimics human negotiation patterns
- ✅ Artisan reviews before acceptance
- ✅ Negotiation history tracking

**Technical Requirements:**
- OpenAI GPT-3.5-turbo for negotiation logic
- Simple counter-offer algorithm as fallback
- Store negotiation history in localStorage (future: DynamoDB)

**Success Metrics:**
- 50% of artisans enable bargain bot
- 78% negotiation success rate
- 15% higher final prices vs manual
- 3-5 rounds average to close

---

### Feature 6: Protected Vault (Trade Secret Storage)

**Problem Solved:** Artisans fear sharing trade secrets online, risk intellectual property theft

**Description:**
Secure storage for trade secrets with AI detection and legal protection. Artisan explicitly confirms what's secret, creating audit trail for legal disputes.

**User Stories:**
- As an artisan, I want to store trade secrets securely so they're not stolen
- As an artisan, I want AI to detect potential secrets so I don't miss any
- As an artisan, I want legal documentation so I can prove ownership

**Acceptance Criteria:**
- ✅ Upload images/videos/documents to vault
- ✅ AI detects potential trade secrets (tools, techniques, ingredients)
- ✅ Artisan confirms which are actual secrets (checkboxes)
- ✅ Encrypted storage (S3 server-side encryption)
- ✅ Access control (artisan only)
- ✅ Watermark option for protected images
- ✅ Audit log of all access
- ✅ Generate legal documentation (trade secret declaration)

**Technical Requirements:**
- Amazon S3 with encryption for storage
- Amazon Rekognition + OpenAI for detection
- IAM policies for access control
- Audit logging to CloudWatch

**Success Metrics:**
- 40% of artisans use protected vault
- 500+ trade secrets protected
- 0 reported theft incidents
- 4.8+ star rating for security

---

### Feature 7: Government Scheme Matching

**Problem Solved:** Artisans unaware of government schemes they qualify for

**Description:**
AI matches artisan profile to 500+ government schemes (central and state). Provides eligibility scoring, application assistance, and deadline reminders.

**User Stories:**
- As an artisan, I want to see schemes I qualify for so I don't miss opportunities
- As an artisan, I want help applying so I can complete forms correctly
- As an artisan, I want deadline reminders so I don't miss cutoffs

**Acceptance Criteria:**
- ✅ Analyze artisan profile (craft, location, income, experience)
- ✅ Match to 500+ schemes with eligibility scores
- ✅ Sort by relevance and deadline
- ✅ Show eligibility criteria and benefits
- ✅ Pre-fill application forms
- ✅ Document checklist
- ✅ Track application status
- ✅ Deadline reminders (email/SMS)

**Technical Requirements:**
- OpenAI GPT-3.5-turbo for matching logic
- Static JSON database of schemes (future: DynamoDB)
- Hardcoded scheme list as fallback

**Success Metrics:**
- 30% of artisans explore schemes
- 100+ scheme applications submitted
- 50+ schemes successfully obtained
- ₹10 lakh+ in benefits secured

---

### Feature 8: Interactive Map Discovery

**Problem Solved:** Buyers cannot easily discover artisans by location and craft

**Description:**
Instagram-style browsing experience with interactive India map. Click state to see artisans, swipe through profiles, view products, place custom orders.

**User Stories:**
- As a buyer, I want to browse artisans by state so I can find local crafts
- As a buyer, I want to swipe through profiles so I can discover easily
- As a buyer, I want to place custom orders so I can get exactly what I need

**Acceptance Criteria:**
- ✅ Interactive India map with clickable states
- ✅ Show artisan count per state
- ✅ Swipeable artisan cards (Instagram-style)
- ✅ Lazy load images for performance
- ✅ Show name, craft, location, rating
- ✅ Tap to view full profile
- ✅ Save/favorite artisans
- ✅ Custom order form with voice/text input
- ✅ Upload reference images
- ✅ Set budget and deadline

**Technical Requirements:**
- SVG India map with state boundaries
- React lazy loading for images
- localStorage for saved artisans
- Mock data for MVP (future: DynamoDB)

**Success Metrics:**
- 80% of buyers use map to discover
- 5+ artisans viewed per session
- 20% conversion to custom order
- 4.5+ star rating for discovery experience

---

### Feature 9: Multilingual Support

**Problem Solved:** Language barrier excludes non-English speakers

**Description:**
Full UI and voice support for Tamil, Hindi, English. Real-time translation of dynamic content. Audio read-out for every screen.

**User Stories:**
- As an artisan, I want to use my native language so I feel comfortable
- As an artisan, I want text read aloud so I don't need to read
- As an artisan, I want to switch languages anytime so I can learn

**Acceptance Criteria:**
- ✅ Support Tamil, Hindi, English
- ✅ 100% UI text translated
- ✅ Voice commands in all 3 languages
- ✅ Audio read-out for every screen (auto-play)
- ✅ Bilingual prompts (English + local language)
- ✅ Instant language switching
- ✅ Translate dynamic content (product descriptions, bios)
- ✅ Cache translations for 30 days

**Technical Requirements:**
- Amazon Translate for dynamic content
- Pre-translated locale files for static UI
- Amazon Polly for text-to-speech
- Language-specific fonts (Noto Sans Tamil, Devanagari)

**Success Metrics:**
- 60% of artisans use non-English language
- 40% use Tamil, 20% use Hindi
- 90% enable audio read-out
- 4.7+ star rating for language support

---

### Feature 10: Simplified Onboarding

**Problem Solved:** Complex onboarding deters low-literacy users

**Description:**
7-slide interactive tutorial with voice narration, visual illustrations, and minimal text. Confirms name, selects languages, explains features.

**User Stories:**
- As an artisan, I want voice-guided onboarding so I understand without reading
- As an artisan, I want to skip if I'm confident so I don't waste time
- As an artisan, I want to replay anytime so I can learn at my pace

**Acceptance Criteria:**
- ✅ Name confirmation (voice or text input)
- ✅ Language selection (1-3 languages)
- ✅ 7-slide tutorial with voice narration
- ✅ Visual illustrations (minimal text)
- ✅ Progress indicator (1/7, 2/7, etc.)
- ✅ Skip option
- ✅ Replay option in settings
- ✅ Mark as completed
- ✅ Total time <5 minutes

**Technical Requirements:**
- Amazon Polly for narration
- React state management for progress
- localStorage to track completion

**Success Metrics:**
- 85% complete onboarding
- 70% watch all 7 slides
- 15% skip (confident users)
- 4.5+ star rating for onboarding experience

---

## 🎯 Success Criteria

### MVP Success (3 Months)

**User Acquisition:**
- 100 artisans onboarded
- 1,000 products listed
- 500 custom orders placed
- 50% artisan retention (month 2-3)

**Technical Performance:**
- <2s page load time on 3G
- 99.9% uptime
- <5% error rate
- Lighthouse score >80

**User Satisfaction:**
- 4.5+ star average rating
- 80% task completion rate
- <10% bounce rate
- 5+ minutes average session

**Business Metrics:**
- ₹10 lakh GMV
- ₹1,500 average order value
- 5% commission revenue
- <$10/month AWS costs

### Year 1 Success

**User Acquisition:**
- 5,000 artisans
- 50,000 products
- 100,000 orders
- 70% artisan retention

**Technical Performance:**
- <1.5s page load time on 4G
- 99.95% uptime
- <2% error rate
- Lighthouse score >90

**User Satisfaction:**
- 4.7+ star average rating
- 90% task completion rate
- <5% bounce rate
- 10+ minutes average session

**Business Metrics:**
- ₹10 crore GMV
- ₹2,000 average order value
- ₹50 lakh commission revenue
- <₹5 lakh/month operating costs

---

## 🚫 Out of Scope (Future Phases)

### Not in MVP
- Payment integration (manual payment for MVP)
- Real-time chat (WhatsApp integration future)
- Video product demos
- Offline mode (PWA)
- Mobile apps (iOS/Android native)
- Multi-artisan collaboration
- Inventory tracking
- Analytics dashboard
- Admin panel
- B2B wholesale portal

### Future Considerations
- International shipping
- Multi-currency support
- AI video generation
- Virtual craft fair
- Craft tutorial marketplace
- Artisan training programs

---

## 📊 Assumptions & Constraints

### Assumptions
- Artisans have smartphones (Android 8+, 2GB RAM)
- Artisans have basic smartphone skills (WhatsApp, camera)
- Artisans have 2G/3G internet access
- Buyers are comfortable with e-commerce
- AWS free tier sufficient for MVP
- OpenAI API costs <$5/month for MVP
- Market size: 10M artisans in India

### Constraints
- **Budget:** $0-10/month (MVP), <₹5 lakh/month (Year 1)
- **Time:** 3 months to MVP launch
- **Technical:** Must work on 2G, support low-end devices
- **Resources:** Small team (1-3 developers), no dedicated QA

---

## 📝 Approval

**Approved by:**
- [ ] Product Owner
- [ ] Technical Lead
- [ ] Stakeholder Representative

**Date:** _________________

**Next Review:** March 2026

---

**Generated via Kiro's spec-driven workflow**  
**Version:** 1.0.0 | **Status:** Approved | **Last Updated:** January 2026
