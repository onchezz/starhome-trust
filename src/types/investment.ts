// TypeScript Interface
export interface MarketAnalysis {
  areaGrowth: string;
  occupancyRate: string;
  comparableProperties: string;
  demandTrend: string;
}

 export interface LegalDetails {
  ownership: string;
  zoning: string;
  permits: string;
  documents: string[];
}

export interface Investment {
  id: number;
  name: string;
  location: string;
  size: string;
  type: string;
  is_active:boolean;
  constructionYear: number;
  askingPrice: number;
  expectedROI: string;
  rentalIncome: number;
  maintenanceCosts: number;
  taxBenefits: string;
  highlights: string[];
  marketAnalysis: MarketAnalysis;
  riskFactors: string[];
  legalDetails: LegalDetails;
  additionalFeatures: string[];
  images: string[];
  minAmount: number;
}

