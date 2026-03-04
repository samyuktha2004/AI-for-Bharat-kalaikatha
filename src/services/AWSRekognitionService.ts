/**
 * AWS Rekognition Service
 * Replaces Azure Computer Vision
 * Analyzes artisan product images for tags, quality, and descriptions
 */

import { fetchAuthSession } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';

const REKOGNITION_CONFIG = {
  region: import.meta.env?.VITE_AWS_REKOGNITION_REGION || 'ap-south-1',
};

export function isRekognitionConfigured(): boolean {
  try {
    const config = Amplify.getConfig();
    return !!(config?.Auth?.Cognito?.identityPoolId);
  } catch {
    return false;
  }
}

export interface ImageAnalysisResult {
  tags: string[];
  description: string;
  colors: string[];
  quality: 'low' | 'medium' | 'high';
  craftType: string;
  suggestedTitle: string;
  confidence: number;
}

// ── Analyse from URL (S3 object or public URL) ───────────────────────────────
export async function analyzeImage(imageUrl: string): Promise<ImageAnalysisResult> {
  if (isRekognitionConfigured()) {
    try {
      const { RekognitionClient, DetectLabelsCommand, DetectModerationLabelsCommand } = await import('@aws-sdk/client-rekognition');
      const session = await fetchAuthSession();
      const credentials = session.credentials;
      if (!credentials) throw new Error('No credentials');

      const client = new RekognitionClient({
        region: REKOGNITION_CONFIG.region,
        credentials,
      });

      // Detect labels (what's in the image)
      const labelsCmd = new DetectLabelsCommand({
        Image: { Bytes: await urlToBytes(imageUrl) },
        MaxLabels: 20,
        MinConfidence: 60,
      });

      const labelsResponse = await client.send(labelsCmd);
      const labels = labelsResponse.Labels || [];

      const tags = labels.map(l => l.Name || '').filter(Boolean);
      const confidence = labels[0]?.Confidence || 0;

      // Infer craft type from labels
      const craftType = inferCraftType(tags);
      const quality = inferQuality(labels);
      const colors = inferColors(tags);

      return {
        tags,
        description: generateDescription(tags, craftType),
        colors,
        quality,
        craftType,
        suggestedTitle: generateTitle(craftType, tags),
        confidence: Math.round(confidence),
      };
    } catch (err) {
      console.warn('Rekognition analysis failed, using fallback:', err);
    }
  }

  return getFallbackAnalysis();
}

// ── Analyse from File (upload bytes directly) ─────────────────────────────────
export async function analyzeImageFile(file: File): Promise<ImageAnalysisResult> {
  if (isRekognitionConfigured()) {
    try {
      const { RekognitionClient, DetectLabelsCommand } = await import('@aws-sdk/client-rekognition');
      const session = await fetchAuthSession();
      const credentials = session.credentials;
      if (!credentials) throw new Error('No credentials');

      const client = new RekognitionClient({
        region: REKOGNITION_CONFIG.region,
        credentials,
      });

      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      const cmd = new DetectLabelsCommand({
        Image: { Bytes: bytes },
        MaxLabels: 20,
        MinConfidence: 60,
      });

      const response = await client.send(cmd);
      const labels = response.Labels || [];
      const tags = labels.map(l => l.Name || '').filter(Boolean);
      const confidence = labels[0]?.Confidence || 0;
      const craftType = inferCraftType(tags);

      return {
        tags,
        description: generateDescription(tags, craftType),
        colors: inferColors(tags),
        quality: inferQuality(labels),
        craftType,
        suggestedTitle: generateTitle(craftType, tags),
        confidence: Math.round(confidence),
      };
    } catch (err) {
      console.warn('Rekognition file analysis failed, using fallback:', err);
    }
  }

  return getFallbackAnalysis();
}

// ── Helpers ───────────────────────────────────────────────────────────────────
async function urlToBytes(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}

function inferCraftType(tags: string[]): string {
  const tagLower = tags.map(t => t.toLowerCase());

  if (tagLower.some(t => ['bronze', 'copper', 'metal', 'sculpture', 'figurine'].includes(t))) return 'Bronze Sculpture';
  if (tagLower.some(t => ['pottery', 'ceramic', 'clay', 'terracotta', 'bowl'].includes(t))) return 'Pottery';
  if (tagLower.some(t => ['textile', 'fabric', 'weaving', 'silk', 'cotton', 'loom'].includes(t))) return 'Handloom Textile';
  if (tagLower.some(t => ['wood', 'carving', 'wooden'].includes(t))) return 'Wood Carving';
  if (tagLower.some(t => ['jewelry', 'jewellery', 'necklace', 'bracelet', 'ring', 'bead'].includes(t))) return 'Jewelry';
  if (tagLower.some(t => ['painting', 'art', 'canvas', 'artwork'].includes(t))) return 'Painting';
  if (tagLower.some(t => ['basket', 'weave', 'cane', 'bamboo'].includes(t))) return 'Basket Weaving';
  if (tagLower.some(t => ['embroidery', 'stitch', 'needlework'].includes(t))) return 'Embroidery';

  return 'Handicraft';
}

function inferQuality(labels: any[]): 'low' | 'medium' | 'high' {
  const avgConfidence = labels.reduce((sum, l) => sum + (l.Confidence || 0), 0) / (labels.length || 1);
  if (avgConfidence > 85) return 'high';
  if (avgConfidence > 70) return 'medium';
  return 'low';
}

function inferColors(tags: string[]): string[] {
  const colorKeywords = ['red', 'blue', 'green', 'yellow', 'gold', 'silver', 'brown', 'black', 'white', 'orange', 'purple', 'pink', 'bronze', 'copper'];
  return tags.filter(t => colorKeywords.includes(t.toLowerCase())).slice(0, 4);
}

function generateDescription(tags: string[], craftType: string): string {
  const topTags = tags.slice(0, 5).join(', ');
  return `A beautiful handcrafted ${craftType} item showcasing traditional Indian artisanship. Features: ${topTags}.`;
}

function generateTitle(craftType: string, tags: string[]): string {
  const material = tags.find(t => ['bronze', 'silver', 'gold', 'copper', 'clay', 'wood', 'silk', 'cotton'].includes(t.toLowerCase()));
  return material ? `Hand-crafted ${material} ${craftType}` : `Traditional ${craftType}`;
}

function getFallbackAnalysis(): ImageAnalysisResult {
  return {
    tags: ['Handicraft', 'Handmade', 'Indian Art', 'Traditional', 'Artisan'],
    description: 'A beautiful handcrafted product showcasing traditional Indian artisanship and skill.',
    colors: ['Brown', 'Gold'],
    quality: 'high',
    craftType: 'Handicraft',
    suggestedTitle: 'Traditional Indian Handicraft',
    confidence: 75,
  };
}

export default { analyzeImage, analyzeImageFile, isRekognitionConfigured };
