export interface BuildingSpecs {
  buildingType: 'office' | 'warehouse' | 'residential' | 'retail';
  stories: number;
  squareFootage: number;
  location: string;
  materialQuality: 'basic' | 'standard' | 'premium';
  stylePreference: 'modern-glass' | 'traditional-brick' | 'industrial';
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

export interface GenerationResult {
  imageUrl: string;
  costs: CostBreakdown | null;
  specs: BuildingSpecs;
  timestamp: Date;
}



