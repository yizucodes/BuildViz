import { fal } from "@fal-ai/client";
import type { BuildingSpecs, BuildingType, StylePreference, Interpretation } from '../types';

fal.config({
  credentials: import.meta.env.VITE_FAL_KEY,
});

const STYLE_ENRICHMENT: Record<StylePreference, string> = {
  'modern-glass': 'Guardian Glass low-iron curtain wall with charcoal aluminum mullions at 5-foot spacing, structural steel W14 columns visible through glazing, floor-to-ceiling windows',
  'traditional-brick': 'red clay brick facade with limestone accents, symmetrical window arrangement, classical proportions, traditional masonry detailing',
  'industrial': 'exposed steel frame with corrugated metal panels, large industrial windows, concrete base, weathered steel aesthetic',
  'brutalist': 'board-formed concrete showing formwork texture, minimal fenestration, massive geometric volumes, raw concrete finish',
  'futuristic': 'parametric facade with dynamic geometry, curved glass panels, metallic cladding, LED-integrated surfaces',
};

const BUILDING_ENRICHMENT: Record<BuildingType, string> = {
  'office': 'commercial office building with ground floor lobby entrance, open office layouts visible through glass, professional aesthetic',
  'warehouse': 'industrial warehouse with loading docks, high bay ceilings, roll-up doors, utilitarian design',
  'residential': 'multi-family residential building with balconies on upper floors, varied window patterns, ground floor retail',
  'retail': 'retail commercial building with large storefront windows, pedestrian-friendly street level, display areas',
  'hotel': 'hospitality building with grand entrance canopy, uniform window rhythm, rooftop amenities',
};

export function buildFluxPrompt(specs: BuildingSpecs): string {
  const styleDetails = STYLE_ENRICHMENT[specs.stylePreference];
  const buildingDetails = BUILDING_ENRICHMENT[specs.buildingType];
  
  // Helper to reinforce height context
  let heightDescription = "low-rise";
  if (specs.stories >= 4) heightDescription = "mid-rise";
  if (specs.stories >= 12) heightDescription = "high-rise";
  if (specs.stories >= 40) heightDescription = "skyscraper";

  return `Photorealistic architectural rendering of a single ${specs.stories}-story ${specs.buildingType} building, ${heightDescription}, exactly ${specs.stories} levels above ground, ${specs.squareFootage.toLocaleString()} square feet, ${styleDetails}, ${buildingDetails}, located in ${specs.location}, distinct from surrounding urban context, street level showing autumn afternoon with business professionals, yellow taxi cabs, street trees with autumn foliage, Tuesday October 22nd 2024 at 4:35 PM, sun at 18 degrees elevation creating warm golden 3400K light, partly cloudy 35% coverage, office lights beginning to activate on upper floors, atmospheric haze at 65% humidity, wet pavement from rain 2 hours prior with puddle reflections, shot on Phase One XF IQ4 150MP medium format camera with Schneider 28mm f/4.5 tilt-shift lens, f/8 aperture, ISO 64, 2-degree upward tilt, pedestrians at accurate 5'6" to 6'2" height for scale, professional architectural photography in style of Iwan Baan, ultra-high resolution, photojournalistic authenticity, no text, no labels, no overlays, maintaining physical accuracy throughout`;
}

export async function generateArchitecturalRender(
  specs: BuildingSpecs
): Promise<string> {
  const prompt = buildFluxPrompt(specs);

  const result = await fal.subscribe('fal-ai/beta-image-232', {
    input: {
      prompt,
      image_size: {
        width: 1024,
        height: 768,
      },
      num_inference_steps: 30,
      guidance_scale: 2.5,
      num_images: 1,
      enable_safety_checker: true,
      output_format: "png",
    },
    logs: true,
    onQueueUpdate: (update: any) => {
      if (update.status === "IN_PROGRESS") {
        update.logs?.map((log: any) => log.message).forEach(console.log);
      }
    },
  });

  if (!result.data?.images || result.data.images.length === 0) {
    throw new Error('No image generated');
  }

  return result.data.images[0].url;
}

export function buildInterpretationPrompt(
  specs: BuildingSpecs,
  interpretation: Interpretation
): string {
  const buildingDetails = BUILDING_ENRICHMENT[specs.buildingType];
  
  // Helper to reinforce height context
  let heightDescription = "low-rise";
  if (specs.stories >= 4) heightDescription = "mid-rise";
  if (specs.stories >= 12) heightDescription = "high-rise";
  if (specs.stories >= 40) heightDescription = "skyscraper";

  return `Photorealistic architectural rendering of a single ${specs.stories}-story ${specs.buildingType} building, ${heightDescription}, exactly ${specs.stories} levels above ground, ${specs.squareFootage.toLocaleString()} square feet, ${interpretation.materials}, ${interpretation.aesthetic}, ${buildingDetails}, located in ${specs.location}, distinct from surrounding urban context, street level showing autumn afternoon with business professionals, yellow taxi cabs, street trees with autumn foliage, Tuesday October 22nd 2024 at 4:35 PM, sun at 18 degrees elevation creating warm golden 3400K light, partly cloudy 35% coverage, office lights beginning to activate on upper floors, atmospheric haze at 65% humidity, wet pavement from rain 2 hours prior with puddle reflections, shot on Phase One XF IQ4 150MP medium format camera with Schneider 28mm f/4.5 tilt-shift lens, f/8 aperture, ISO 64, 2-degree upward tilt, pedestrians at accurate 5'6" to 6'2" height for scale, professional architectural photography in style of Iwan Baan, ultra-high resolution, photojournalistic authenticity, no text, no labels, no overlays, maintaining physical accuracy throughout`;
}

async function generateSingleInterpretationImage(
  specs: BuildingSpecs,
  interpretation: Interpretation
): Promise<string> {
  const prompt = buildInterpretationPrompt(specs, interpretation);

  const result = await fal.subscribe('fal-ai/beta-image-232', {
    input: {
      prompt,
      image_size: {
        width: 1024,
        height: 768,
      },
      num_inference_steps: 30,
      guidance_scale: 2.5,
      num_images: 1,
      enable_safety_checker: true,
      output_format: "png",
    },
    logs: true,
    onQueueUpdate: (update: any) => {
      if (update.status === "IN_PROGRESS") {
        update.logs?.map((log: any) => log.message).forEach(console.log);
      }
    },
  });

  if (!result.data?.images || result.data.images.length === 0) {
    throw new Error('No image generated');
  }

  return result.data.images[0].url;
}

export async function generateInterpretationImages(
  interpretations: Interpretation[],
  specs: BuildingSpecs,
  onProgress?: (completedCount: number) => void
): Promise<(string | null)[]> {
  const imagePromises = interpretations.map(async (interpretation, index) => {
    try {
      const imageUrl = await generateSingleInterpretationImage(specs, interpretation);
      if (onProgress) {
        onProgress(index + 1);
      }
      return imageUrl;
    } catch (error) {
      console.error(`Failed to generate image for interpretation ${index}:`, error);
      // Retry once
      try {
        const imageUrl = await generateSingleInterpretationImage(specs, interpretation);
        if (onProgress) {
          onProgress(index + 1);
        }
        return imageUrl;
      } catch (retryError) {
        console.error(`Retry failed for interpretation ${index}:`, retryError);
        return null;
      }
    }
  });

  return Promise.all(imagePromises);
}
