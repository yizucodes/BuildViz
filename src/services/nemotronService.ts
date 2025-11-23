import type { BuildingSpecs, Interpretation, PermitConsideration } from '../types';

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

export async function analyzePermitConsiderations(
  buildingSpecs: BuildingSpecs
): Promise<PermitConsideration[] | null> {
  const prompt = `Analyze potential permitting challenges for this building project:

Building: ${buildingSpecs.stories}-story ${buildingSpecs.buildingType}
Size: ${buildingSpecs.squareFootage.toLocaleString()} square feet
Location: ${buildingSpecs.location}
Style: ${buildingSpecs.stylePreference}

Based on typical urban planning regulations for ${buildingSpecs.location}, identify 5 common permitting considerations this project might face.

For each consideration, provide:
- Issue category (the regulatory area)
- Typical requirement (what's usually required)
- Potential risk level (Low, Medium, or High)
- Common resolution approach (how to address it)

Return ONLY a JSON array with exactly 5 objects. Each object must have these exact keys:
- Issue category
- Typical requirement
- Potential risk level
- Common resolution approach

Return only the JSON array, no other text.`;

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
        temperature: 0.5,
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

    const considerations: PermitConsideration[] = JSON.parse(jsonText);

    // Validate we have exactly 5 considerations with required fields
    if (!Array.isArray(considerations) || considerations.length !== 5) {
      console.error('Invalid number of considerations:', considerations.length);
      return null;
    }

    for (const consideration of considerations) {
      if (
        !consideration['Issue category'] ||
        !consideration['Typical requirement'] ||
        !consideration['Potential risk level'] ||
        !consideration['Common resolution approach']
      ) {
        console.error('Missing required fields in consideration:', consideration);
        return null;
      }
      
      // Validate risk level
      const validRiskLevels = ['Low', 'Medium', 'High'];
      if (!validRiskLevels.includes(consideration['Potential risk level'])) {
        console.error('Invalid risk level:', consideration['Potential risk level']);
        return null;
      }
    }

    return considerations;
  } catch (error) {
    console.error('Error calling Nemotron API for permits:', error);
    return null;
  }
}

