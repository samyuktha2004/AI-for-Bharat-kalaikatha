/**
 * Bargain Bot Service — Autonomous Negotiation Engine
 * 
 * Features:
 * - Automatic negotiation (always on)
 * - Moderate counter-offer strategy (₹500-1000 steps)
 * - Soft floor protection (5-10% flexibility below floor price)
 * - AI-generated persuasive messages
 * - Negotiation history tracking
 */

import { generateNegotiationResponse } from './AWSBedrockService';
import { generateMockTranscription } from './AWSTranscribeService';

export interface NegotiationRound {
  id: string;
  timestamp: number;
  buyerOffer: number;
  counterOffer: number | null;
  action: 'accept' | 'counter' | 'decline';
  message: string;
  reasoning: string;
}

export interface BargainBotConfig {
  productId: string;
  productName: string;
  floorPrice: number;
  suggestedPrice: number;
  negotiationStyle: 'firm' | 'friendly' | 'flexible';
  autoNegotiate: boolean; // Always on
  urgencyLevel: number; // 1-10 (affects countering speed)
  isActive: boolean;
}

export interface NegotiationResult {
  action: 'accept' | 'counter' | 'decline';
  counterOffer: number | null;
  message: string;
  reasoning: string;
  softFloorApplied: boolean;
}

/**
 * Generate counter-offer with soft floor logic
 * Soft floor = 5-10% below hard floor price
 */
function calculateCounterOffer(
  buyerOffer: number,
  floorPrice: number,
  suggestedPrice: number,
  urgencyLevel: number = 5
): number {
  const softFloor = floorPrice * 0.95; // 5% below floor
  const softFloorMax = floorPrice * 0.90; // Maximum 10% below floor

  // If buyer offer is within acceptable range, improve towards their offer
  if (buyerOffer >= softFloorMax) {
    // Moderate strategy: Move toward buyer offer in ₹500-1000 steps
    const stepSize = 500 + (urgencyLevel * 50); // ₹500-₹1000 based on urgency
    const midpoint = (buyerOffer + suggestedPrice) / 2;
    const counter = Math.max(Math.round(buyerOffer + stepSize / 100 * (suggestedPrice - buyerOffer)), softFloorMax);
    return Math.round(counter / 100) * 100; // Round to nearest 100
  }

  // Below soft floor max - at the edge of flexibility
  return Math.round(softFloorMax);
}

/**
 * Get soft floor price (5-10% below hard floor)
 */
export function getSoftFloor(floorPrice: number): number {
  return Math.round(floorPrice * 0.95); // 5% flexibility
}

/**
 * Get hard floor price minimum
 */
export function getHardFloor(floorPrice: number): number {
  return Math.round(floorPrice * 0.90); // 10% flexibility
}

/**
 * Main negotiation logic - called when buyer makes an offer
 */
export async function processNegotiation(
  buyerOffer: number,
  config: BargainBotConfig
): Promise<NegotiationResult> {
  const { floorPrice, suggestedPrice, productName, negotiationStyle, urgencyLevel } = config;
  const softFloor = getSoftFloor(floorPrice);
  const hardFloor = getHardFloor(floorPrice);

  console.log('🤖 Bargain Bot negotiating:', {
    buyerOffer,
    floorPrice,
    softFloor,
    hardFloor,
    suggestedPrice,
  });

  // 1. Check if offer is above suggested price - AUTO ACCEPT
  if (buyerOffer >= suggestedPrice) {
    return {
      action: 'accept',
      counterOffer: null,
      message: `🎉 Fantastic! I'm happy to proceed at ₹${buyerOffer} for ${productName}. Thank you for recognizing the value of handcrafted artistry!`,
      reasoning: 'Buyer offer meets or exceeds asking price.',
      softFloorApplied: false,
    };
  }

  // 2. Check if offer is between soft floor and hard floor - SOFT FLOOR ZONE
  if (buyerOffer >= hardFloor && buyerOffer < softFloor) {
    // This is in the "soft flexibility" zone - allow with explanation
    return {
      action: 'accept',
      counterOffer: null,
      message: `✅ I appreciate your offer of ₹${buyerOffer}. While this is slightly below my target, I value fair business relationships. Let's go forward with this!`,
      reasoning: 'Within soft floor flexibility zone (5-10% below floor).',
      softFloorApplied: true,
    };
  }

  // 3. Check if offer is below hard floor - GENERATE COUNTER
  if (buyerOffer < hardFloor) {
    const counterOffer = calculateCounterOffer(
      buyerOffer,
      floorPrice,
      suggestedPrice,
      urgencyLevel
    );

    try {
      // Try to use AI for persuasive message
      const aiResponse = await generateNegotiationResponse(
        buyerOffer,
        floorPrice,
        suggestedPrice,
        productName,
        negotiationStyle
      );

      return {
        action: 'counter',
        counterOffer,
        message: aiResponse.message,
        reasoning: aiResponse.reasoning,
        softFloorApplied: false,
      };
    } catch (error) {
      console.warn('AI negotiation failed, using fallback message');
      // Fallback message templates
      const templates = {
        firm: `I appreciate your offer of ₹${buyerOffer}, but ${productName} requires significant skill and materials. I can offer ₹${counterOffer} - a fair price for quality craftsmanship.`,
        friendly: `Thank you for your interest in my ${productName}! Your budget is ₹${buyerOffer}, and I'm committed to working with you. How about ₹${counterOffer}? This reflects the true value.`,
        flexible: `I understand you're working with a budget of ₹${buyerOffer}. I'm flexible - let's meet at ₹${counterOffer} for ${productName}. This is my best offer.`,
      };

      return {
        action: 'counter',
        counterOffer,
        message: templates[negotiationStyle],
        reasoning: 'Soft floor counter-offer for buyer consideration.',
        softFloorApplied: false,
      };
    }
  }

  // 4. Between soft floor and suggested price - COUNTER WITH AI
  const counterOffer = calculateCounterOffer(
    buyerOffer,
    floorPrice,
    suggestedPrice,
    urgencyLevel
  );

  try {
    const aiResponse = await generateNegotiationResponse(
      buyerOffer,
      floorPrice,
      suggestedPrice,
      productName,
      negotiationStyle
    );

    return {
      action: aiResponse.action as 'counter' | 'accept',
      counterOffer: aiResponse.counterOffer || counterOffer,
      message: aiResponse.message,
      reasoning: aiResponse.reasoning,
      softFloorApplied: false,
    };
  } catch (error) {
    return {
      action: 'counter',
      counterOffer,
      message: `Thank you for your offer of ₹${buyerOffer}! I'd like to suggest ₹${counterOffer} for the ${productName}. This reflects my investment in quality materials and traditional craftsmanship.`,
      reasoning: 'Moderate counter-offer between soft floor and suggested price.',
      softFloorApplied: false,
    };
  }
}

/**
 * Save negotiation round to history
 */
export function saveNegotiationRound(
  config: BargainBotConfig,
  result: NegotiationResult
): NegotiationRound {
  const round: NegotiationRound = {
    id: `neg_${config.productId}_${Date.now()}`,
    timestamp: Date.now(),
    buyerOffer: 0, // Will be set by caller
    counterOffer: result.counterOffer,
    action: result.action,
    message: result.message,
    reasoning: result.reasoning,
  };

  // Save to localStorage
  const key = `bargain_history_${config.productId}`;
  const history = JSON.parse(localStorage.getItem(key) || '[]');
  history.push(round);
  localStorage.setItem(key, JSON.stringify(history));

  return round;
}

/**
 * Get negotiation history for a product
 */
export function getNegotiationHistory(productId: string): NegotiationRound[] {
  const key = `bargain_history_${productId}`;
  return JSON.parse(localStorage.getItem(key) || '[]');
}

/**
 * Clear negotiation history
 */
export function clearNegotiationHistory(productId: string): void {
  const key = `bargain_history_${productId}`;
  localStorage.removeItem(key);
}

/**
 * Get negotiation statistics
 */
export function getNegotiationStats(productId: string) {
  const history = getNegotiationHistory(productId);
  
  const stats = {
    totalRounds: history.length,
    accepted: history.filter((r) => r.action === 'accept').length,
    countered: history.filter((r) => r.action === 'counter').length,
    declined: history.filter((r) => r.action === 'decline').length,
    averageCounterOffer:
      history
        .filter((r) => r.counterOffer)
        .reduce((sum, r) => sum + (r.counterOffer || 0), 0) /
      Math.max(
        history.filter((r) => r.counterOffer).length,
        1
      ),
  };

  return stats;
}

/**
 * Save Bargain Bot configuration
 */
export function saveBargainBotConfig(config: BargainBotConfig): void {
  const key = `bargain_config_${config.productId}`;
  localStorage.setItem(key, JSON.stringify(config));
  console.log('✅ Bargain Bot config saved:', config);
}

/**
 * Load Bargain Bot configuration
 */
export function loadBargainBotConfig(productId: string): BargainBotConfig | null {
  const key = `bargain_config_${productId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

/**
 * Activate Bargain Bot for a product
 */
export function activateBargainBot(productId: string): void {
  const config = loadBargainBotConfig(productId);
  if (config) {
    config.isActive = true;
    config.autoNegotiate = true;
    saveBargainBotConfig(config);
    console.log('🤖 Bargain Bot activated for product:', productId);
  }
}

/**
 * Deactivate Bargain Bot for a product
 */
export function deactivateBargainBot(productId: string): void {
  const config = loadBargainBotConfig(productId);
  if (config) {
    config.isActive = false;
    config.autoNegotiate = false;
    saveBargainBotConfig(config);
    console.log('🔕 Bargain Bot deactivated for product:', productId);
  }
}

/**
 * Mock negotiation round (for demo/testing)
 */
export function generateMockNegotiationRound(config: BargainBotConfig): NegotiationRound {
  const mockOffers = [
    config.suggestedPrice * 0.7,
    config.suggestedPrice * 0.75,
    config.suggestedPrice * 0.8,
    config.suggestedPrice * 0.85,
    config.suggestedPrice * 0.9,
  ];

  const buyerOffer = mockOffers[Math.floor(Math.random() * mockOffers.length)];

  const actions: Array<'accept' | 'counter' | 'decline'> = ['counter', 'counter', 'accept'];
  const action = actions[Math.floor(Math.random() * actions.length)];

  const counterOffer =
    action === 'counter' ? Math.round(config.suggestedPrice * 0.88) : null;

  return {
    id: `mock_${Date.now()}`,
    timestamp: Date.now(),
    buyerOffer: Math.round(buyerOffer),
    counterOffer,
    action,
    message: `Sample negotiation message for ₹${Math.round(buyerOffer)} offer.`,
    reasoning: 'Mock negotiation round for demonstration.',
  };
}

export default {
  processNegotiation,
  saveNegotiationRound,
  getNegotiationHistory,
  clearNegotiationHistory,
  getNegotiationStats,
  saveBargainBotConfig,
  loadBargainBotConfig,
  activateBargainBot,
  deactivateBargainBot,
  generateMockNegotiationRound,
  getSoftFloor,
  getHardFloor,
};
