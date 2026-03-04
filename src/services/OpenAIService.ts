/**
 * OpenAI API Service
 * Replaces Azure OpenAI (simpler for MVP than AWS Bedrock)
 */

const OPENAI_CONFIG = {
  apiKey: import.meta.env?.VITE_OPENAI_API_KEY || '',
  model: import.meta.env?.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
  endpoint: 'https://api.openai.com/v1/chat/completions',
};

// Check if OpenAI is configured
export function isOpenAIConfigured(): boolean {
  return !!OPENAI_CONFIG.apiKey;
}

if (isOpenAIConfigured()) {
  console.log('✅ OpenAI API configured');
} else {
  console.log('🔧 OpenAI not configured - using fallback calculations');
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  messages: Array<{ role: string; content: string }>,
  temperature: number = 0.7
): Promise<string> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI not configured');
  }

  const response = await fetch(OPENAI_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_CONFIG.model,
      messages,
      temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.statusText} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Calculate smart pricing with AI
 */
export async function calculateSmartPricing(
  materialCost: number,
  laborHours: number,
  skillLevel: number,
  uniqueness: number,
  marketDemand: number,
  craftType: string
): Promise<any> {
  // Try OpenAI
  if (isOpenAIConfigured()) {
    try {
      const prompt = `You are an expert in pricing handcrafted Indian artisan products.

Calculate fair pricing for a ${craftType} item with:
- Material cost: ₹${materialCost}
- Labor hours: ${laborHours}
- Skill level: ${skillLevel}/10
- Uniqueness: ${uniqueness}/10
- Market demand: ${marketDemand}/10

Provide:
1. Floor price (minimum to cover costs + 20% margin)
2. Suggested price (fair market value)
3. Premium price (for high-end buyers)
4. Detailed breakdown of calculations
5. Reasoning for each price point

Respond in JSON format only (no markdown, no code blocks):
{
  "floorPrice": number,
  "suggestedPrice": number,
  "premiumPrice": number,
  "breakdown": {
    "materialCost": number,
    "laborCost": number,
    "skillPremium": number,
    "uniquenessPremium": number
  },
  "reasoning": "string explaining the pricing strategy"
}`;

      const messages = [
        { role: 'system', content: 'You are an expert pricing consultant for Indian artisans. Always respond with valid JSON only.' },
        { role: 'user', content: prompt }
      ];

      const response = await callOpenAI(messages, 0.5);
      
      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        console.log('✅ OpenAI pricing calculated');
        return result;
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('OpenAI pricing failed:', error);
      console.log('⚠️ Falling back to formula-based pricing');
      // Fall through to formula-based calculation
    }
  }

  // Fallback: Formula-based calculation
  return calculateFormulaBasedPricing(
    materialCost,
    laborHours,
    skillLevel,
    uniqueness,
    marketDemand
  );
}

/**
 * Generate marketing content with AI
 */
export async function generateMarketingContent(
  productName: string,
  description: string,
  craftType: string,
  materials: string = '',
  dimensions: string = ''
): Promise<any> {
  // Try OpenAI
  if (isOpenAIConfigured()) {
    try {
      const prompt = `Generate marketing content for this handcrafted Indian artisan product:

Product: ${productName}
Craft: ${craftType}
Description: ${description}
Materials: ${materials || 'Traditional materials'}
Size: ${dimensions || 'As shown'}

Create engaging content for:
1. Instagram (captivating, with emojis, hashtags)
2. Amazon (detailed product listing with bullet points)
3. Etsy (storytelling, handmade focus, artisan narrative)

Respond in JSON format only (no markdown, no code blocks):
{
  "instagram": "string with emojis and hashtags",
  "amazon": "string with product details and features",
  "etsy": "string with artisan story and handmade appeal"
}`;

      const messages = [
        { role: 'system', content: 'You are a marketing expert for handcrafted artisan products. Always respond with valid JSON only.' },
        { role: 'user', content: prompt }
      ];

      const response = await callOpenAI(messages, 0.8);
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        console.log('✅ OpenAI marketing content generated');
        return result;
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('OpenAI marketing failed:', error);
      console.log('⚠️ Falling back to template-based content');
    }
  }

  // Fallback: Template-based content
  return {
    instagram: `✨ ${productName} ✨

${description}

🎨 Handcrafted with ${craftType} techniques
💎 Each piece is unique
🇮🇳 Made in India with love

#${craftType.replace(/\s/g, '')} #HandmadeInIndia #IndianArt #ArtisanCraft #HandcraftedWithLove #TraditionalCraft`,

    amazon: `${productName} - Authentic Handcrafted ${craftType}

PRODUCT DESCRIPTION:
${description}

FEATURES:
• Handcrafted by skilled artisan
• Traditional ${craftType} techniques
• 100% authentic Indian craft
• Materials: ${materials || 'Traditional materials'}
• Size: ${dimensions || 'Custom size available'}
• Each piece is unique

CARE INSTRUCTIONS:
Handle with care. Clean with soft cloth. Avoid harsh chemicals.

SHIPPING:
Ships within 3-5 business days from India. Carefully packaged to ensure safe delivery.`,

    etsy: `${productName}

${description}

This ${craftType} piece is handcrafted by a skilled Indian artisan using traditional techniques passed down through generations. Each item carries the soul of the maker and the heritage of Indian craftsmanship.

MATERIALS: ${materials || 'Traditional materials'}
SIZE: ${dimensions || 'Custom size available'}
ORIGIN: India
TECHNIQUE: ${craftType}

Each piece is unique and may have slight variations that add to its handmade charm and authenticity.

Perfect for home decor, gifting, or collectors of authentic handcrafted art.

Tags: ${craftType}, Indian handicraft, handmade art, traditional craft, artisan made, heritage craft`
  };
}

/**
 * Analyze product for trade secrets
 */
export async function analyzeForTradeSecrets(
  productDescription: string,
  craftType: string
): Promise<string[]> {
  if (isOpenAIConfigured()) {
    try {
      const prompt = `Analyze this ${craftType} product description for potential trade secrets that should be protected:

"${productDescription}"

Identify any mentions of:
- Secret techniques
- Unique formulas or ratios
- Proprietary processes
- Family recipes
- Specialized tools or methods

Respond with JSON array only (no markdown, no code blocks):
["trade secret 1", "trade secret 2", ...]

If no trade secrets found, return empty array: []`;

      const messages = [
        { role: 'system', content: 'You are an expert in identifying trade secrets in artisan crafts. Always respond with valid JSON array only.' },
        { role: 'user', content: prompt }
      ];

      const response = await callOpenAI(messages, 0.3);
      
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('OpenAI trade secret analysis failed:', error);
    }
  }

  // Fallback: Simple keyword matching
  const secrets: string[] = [];
  const keywords = ['secret', 'formula', 'ratio', 'technique', 'proprietary', 'family recipe'];
  
  keywords.forEach(keyword => {
    if (productDescription.toLowerCase().includes(keyword)) {
      secrets.push(`Potential ${keyword} detected`);
    }
  });

  return secrets;
}

/**
 * Fallback: Formula-based pricing
 */
function calculateFormulaBasedPricing(
  materialCost: number,
  laborHours: number,
  skillLevel: number,
  uniqueness: number,
  marketDemand: number
): any {
  const laborCost = laborHours * 150; // ₹150/hour average for Indian artisans
  const baseCost = materialCost + laborCost;
  
  // Multipliers based on inputs
  const skillMultiplier = 1 + (skillLevel * 0.1); // 10% per skill point
  const uniquenessMultiplier = 1 + (uniqueness * 0.05); // 5% per uniqueness point
  const demandMultiplier = 1 + (marketDemand * 0.03); // 3% per demand point
  
  const floorPrice = Math.round(baseCost * 1.2); // 20% minimum margin
  const suggestedPrice = Math.round(
    baseCost * skillMultiplier * uniquenessMultiplier * demandMultiplier
  );
  const premiumPrice = Math.round(suggestedPrice * 1.3); // 30% premium
  
  return {
    floorPrice,
    suggestedPrice,
    premiumPrice,
    breakdown: {
      materialCost,
      laborCost,
      skillPremium: Math.round(baseCost * (skillMultiplier - 1)),
      uniquenessPremium: Math.round(baseCost * (uniquenessMultiplier - 1)),
    },
    reasoning: 'Calculated using standard artisan pricing formula: base cost (materials + labor) adjusted for skill level, uniqueness, and market demand. Formula ensures fair pricing while preventing exploitation.',
  };
}
