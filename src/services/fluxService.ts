import { fal } from "@fal-ai/client";
import type { BuildingSpecs } from '../types';

fal.config({
  credentials: import.meta.env.VITE_FAL_KEY,
});

export async function generateArchitecturalRender(
  specs: BuildingSpecs
): Promise<string> {
  
  const styleDescriptions = {
    'modern-glass': 'glass and steel facade, minimalist design, floor-to-ceiling windows, sleek metal panels',
    'traditional-brick': 'red brick facade, traditional masonry, symmetrical windows, classical proportions',
    'industrial': 'exposed steel, concrete panels, large industrial windows, warehouse aesthetic'
  };

  const buildingDescriptions = {
    'office': 'commercial office building with professional aesthetic',
    'warehouse': 'industrial warehouse with loading docks',
    'residential': 'multi-family residential building with balconies',
    'retail': 'retail commercial building with large storefront windows'
  };

  const prompt = `Photorealistic architectural rendering of a ${specs.buildingType} building, ${specs.stories}-story, ${specs.squareFootage.toLocaleString()} square feet, ${styleDescriptions[specs.stylePreference]}, ${buildingDescriptions[specs.buildingType]}, urban setting with street context, professional architectural visualization, golden hour lighting with warm tones, shot on Canon EOS R5 with 24mm tilt-shift lens, ultra high resolution 8k, architectural photography style, sharp focus, depth of field, modern city context with sidewalks and landscaping, no people, no text overlays`;

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

