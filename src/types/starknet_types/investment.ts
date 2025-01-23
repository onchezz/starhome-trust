
export interface MarketAnalysis {
  area_growth: string;
  occupancy_rate: string;
  comparable_properties: string;
  demand_trend: string;
}

export interface LegalDetails {
  ownership: string;
  zoning: string;
  permits: string;
  documents_id: string;
}

export const investmentTypes = [
  "Residential",
  "Commercial",
  "Industrial",
  "Mixed-Use",
  "Land Development",
  "Real Estate Investment Trust (REIT)",
  "Property Development",
  "Hotel & Hospitality",
  "Retail Space",
  "Warehouse & Logistics",
  "Office Building",
  "Multi-Family Housing"
] as const;

export const riskLevels = ["Low", "Medium", "High"] as const;

export const zoningTypes = [
  "Residential",
  "Commercial",
  "Industrial", 
  "Mixed-Use",
  "Special Purpose"
] as const;

export const constructionStatus = [
  "Completed",
  "Under Construction", 
  "Pre-Construction",
  "Renovation"
] as const;

export type InvestmentType = typeof investmentTypes[number];
export type RiskLevel = typeof riskLevels[number];
export type ZoningType = typeof zoningTypes[number];
export type ConstructionStatusType = typeof constructionStatus[number];

export interface InvestmentAsset {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  location: string;
  size: string;
  investor_id: string;
  owner: string;
  asset_value: bigint;
  available_staking_amount: bigint;
  investment_type: InvestmentType;
  construction_status: ConstructionStatusType;  // Added this field
  construction_year: number;
  property_price: bigint;
  expected_roi: string;
  rental_income: bigint;
  maintenance_costs: bigint;
  tax_benefits: string;
  highlights: string;
  market_analysis: MarketAnalysis;
  risk_factors: string;
  legal_details: LegalDetails;
  additional_features: string;
  images: string;
  investment_token: string;
  min_investment_amount: bigint;
}