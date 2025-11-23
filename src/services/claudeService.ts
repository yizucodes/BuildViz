import Anthropic from '@anthropic-ai/sdk';
import type { BuildingSpecs, CostBreakdown } from '../types';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
});

export async function estimateConstructionCosts(
  specs: BuildingSpecs
): Promise<CostBreakdown> {
  
  const prompt = `You are a construction cost estimator. Provide a detailed cost breakdown for the following building project.

Building Specifications:
- Type: ${specs.buildingType}
- Stories: ${specs.stories}
- Square Footage: ${specs.squareFootage.toLocaleString()} sq ft
- Location: ${specs.location}
- Material Quality: ${specs.materialQuality}
- Style: ${specs.stylePreference}

Provide itemized construction cost estimates in JSON format with these categories:
- foundation (site work, excavation, foundation)
- structure (steel/concrete frame, columns, floors)
- envelope (exterior walls, windows, curtain wall)
- mep (mechanical, electrical, plumbing, HVAC)
- interiors (drywall, flooring, finishes, fixtures)
- contingency (10% of subtotal)
- total (sum of all above)
- costPerSqFt (total divided by square footage)
- timeline (estimated construction duration in months)

Consider:
1. Regional cost multipliers (San Francisco 1.4x, NYC 1.3x, Texas 0.8x, etc.)
2. Material quality impacts (premium adds 25%, basic reduces 15%)
3. Current 2024 construction cost trends
4. Realistic market rates

Return ONLY valid JSON, no other text. Use this exact format:
{
  "foundation": 850000,
  "structure": 2900000,
  "envelope": 1800000,
  "mep": 1500000,
  "interiors": 1200000,
  "contingency": 825000,
  "total": 9075000,
  "costPerSqFt": 181.50,
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



