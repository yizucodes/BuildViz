export type BuildingType = 'office' | 'warehouse' | 'residential' | 'retail' | 'hotel';
export type StylePreference = 'modern-glass' | 'traditional-brick' | 'industrial' | 'brutalist' | 'futuristic';
export type MaterialQuality = 'basic' | 'standard' | 'premium';

export interface BuildingSpecs {
  buildingType: BuildingType;
  stories: number;
  squareFootage: number;
  location: string;
  materialQuality: MaterialQuality;
  stylePreference: StylePreference;
  visionDescription?: string;
}

export interface CostBreakdown {
  foundation: number;
  structure: number;
  envelope: number; // exterior walls, windows
  mep: number; // mechanical, electrical, plumbing
  interiors: number;
  contingency: number;
  total: number;
  costPerSqFt: number;
  timeline: string; // e.g., "12-16 months"
}

export interface Interpretation {
  title: string;
  approach: string;
  materials: string;
  aesthetic: string;
}

export interface GenerationResult {
  imageUrl: string;
  costs: CostBreakdown | null;
  specs: BuildingSpecs;
  timestamp: Date;
  interpretation?: Interpretation;
}
