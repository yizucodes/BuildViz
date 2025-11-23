import type { BuildingSpecs, Interpretation } from '../types';

// Use API route (works with Vercel dev and production)
const NVIDIA_API_URL = '/api/nvidia';

export async function interpretVision(
  visionDescription: string,
  buildingSpecs: BuildingSpecs
): Promise<Interpretation[] | null> {

  const prompt = `A client described their building vision as: "${visionDescription}"

Building context:
- Type: ${buildingSpecs.buildingType}
- Stories: ${buildingSpecs.stories}
- Size: ${buildingSpecs.squareFootage.toLocaleString()} sq ft
- Location: ${buildingSpecs.location}

This description is ambiguous. Generate exactly 3 distinct architectural interpretations:

INTERPRETATION A: Emphasize the first key aspect of their description
INTERPRETATION B: Emphasize a different aspect
INTERPRETATION C: Create a balanced approach between aspects

For each interpretation, return JSON with these exact fields:
- title: (3-5 words, catchy interpretation name)
- approach: (2-3 sentences describing architectural strategy)
- materials: (specific materials and finishes to use)
- aesthetic: (1-2 sentences describing overall feel)

Return ONLY a JSON array with 3 objects. No other text.`;

  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'nvidia/llama-3.3-nemotron-super-49b-v1.5',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      console.error('Nemotron API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in Nemotron response');
      return null;
    }

    // Extract JSON from response (might have markdown code blocks)
    let jsonText = content.trim();
    
    // Remove markdown code blocks if present
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }

    // Try to find array in text
    const arrayMatch = jsonText.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      jsonText = arrayMatch[0];
    }

    const interpretations: Interpretation[] = JSON.parse(jsonText);

    // Validate we have exactly 3 interpretations with required fields
    if (!Array.isArray(interpretations) || interpretations.length !== 3) {
      console.error('Invalid number of interpretations:', interpretations.length);
      return null;
    }

    for (const interp of interpretations) {
      if (!interp.title || !interp.approach || !interp.materials || !interp.aesthetic) {
        console.error('Missing required fields in interpretation:', interp);
        return null;
      }
    }

    return interpretations;
  } catch (error) {
    console.error('Error calling Nemotron API:', error);
    return null;
  }
}

