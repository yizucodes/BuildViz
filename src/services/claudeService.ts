import Anthropic from '@anthropic-ai/sdk';
import type { BuildingSpecs, CostBreakdown } from '../types';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function estimateConstructionCosts(
  specs: BuildingSpecs
): Promise<CostBreakdown> {
  
  const prompt = `You are a construction cost estimator. Calculate construction costs for the following building project using the baseline rates and multipliers provided.

Building Specifications:
- Type: ${specs.buildingType}
- Stories: ${specs.stories}
- Square Footage: ${specs.squareFootage.toLocaleString()} sq ft
- Location: ${specs.location}
- Material Quality: ${specs.materialQuality}
- Style: ${specs.stylePreference}

BASELINE RATES (per square foot):
- Foundation: $17
- Structure: $58
- Envelope: $36
- MEP (Mechanical, Electrical, Plumbing): $30
- Interiors: $24

LOCATION MULTIPLIERS:
- San Francisco: 1.4x
- New York City: 1.3x
- Los Angeles: 1.2x
- Austin: 0.85x
- Miami: 1.0x

QUALITY MULTIPLIERS:
- Basic: 0.85x
- Standard: 1.0x
- Premium: 1.25x

INSTRUCTIONS:
1. For each category (foundation, structure, envelope, mep, interiors):
   - Multiply baseline rate × square footage × location multiplier × quality multiplier
2. Calculate subtotal (sum of all five categories)
3. Add 10% contingency (10% of subtotal)
4. Calculate total (subtotal + contingency)
5. Calculate costPerSqFt (total ÷ square footage)
6. Estimate timeline based on stories: 1-3 stories = "8-12 months", 4-8 stories = "12-18 months", 9+ stories = "18-24 months"

Return ONLY valid JSON with integer values (no decimals except costPerSqFt), no explanatory text. Use this exact format:
{
  "foundation": 850000,
  "structure": 2900000,
  "envelope": 1800000,
  "mep": 1500000,
  "interiors": 1200000,
  "contingency": 825000,
  "total": 9075000,
  "costPerSqFt": 181,
  "timeline": "14-18 months"
}`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  // Parse JSON response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to extract JSON from Claude response');
  }

  const costs: CostBreakdown = JSON.parse(jsonMatch[0]);
  
  return costs;
}



