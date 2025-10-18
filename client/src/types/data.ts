// Type definitions for TSH Research Platform data structures

export interface SentimentPlatform {
  Subject: string;
  "What makes people happy": string;
  "What frustrates people": string;
  "What people wish for": string;
  "Pricing discovered": string;
  "Target audience observed": string;
  "Key quotes": string;
  "Sample size": string;
  "Data quality notes": string;
  Error: string;
}

export interface SentimentData {
  platforms: SentimentPlatform[];
}

export interface SentimentSummary {
  total_records: number;
  successful: number;
  failed: number;
  brands: Record<string, number>;
}

export interface BrandInfo {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  color: string;
}

export interface PersonaData {
  name: string;
  percentage: number;
  demographics: {
    age: string;
    income: string;
    location: string;
  };
  psychographics: {
    values: string[];
    motivations: string[];
  };
  wtp: string; // Willingness to Pay
  primaryUse: string[];
  painPoints: string[];
  evidenceQuotes: string[];
}

export const BRANDS: BrandInfo[] = [
  { id: 'the-social-hub', name: 'The Social Hub', slug: 'the_social_hub', color: '#76a9f9' },
  { id: 'the-hoxton', name: 'The Hoxton', slug: 'the_hoxton', color: '#7cbd8e' },
  { id: 'citizenm', name: 'CitizenM', slug: 'citizenm', color: '#a4a4a5' },
  { id: 'mama-shelter', name: 'Mama Shelter', slug: 'mama_shelter', color: '#FFE0B2' },
  { id: 'soho-house', name: 'Soho House', slug: 'soho_house', color: '#C8E6C9' },
  { id: 'zoku', name: 'Zoku', slug: 'zoku', color: '#E1E7FF' },
  { id: 'working-from', name: 'Working From_', slug: 'working_from_', color: '#76a9f9' },
  { id: 'conservatorium', name: 'Conservatorium Hotel', slug: 'conservatorium_hotel', color: '#7cbd8e' },
];

