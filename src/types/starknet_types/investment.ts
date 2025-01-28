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

export interface Investment {
  id: string;
  name: string;
  description: string;
  location: string;
  size: string;
  investor_id: string;
  owner: string;
  asset_value: string;
  available_staking_amount: string;
  investment_type: string;
  construction_year: number;
  property_price: string;
  expected_roi: string;
  rental_income: string;
  maintenance_costs: string;
  tax_benefits: string;
  highlights: string;
  market_analysis: MarketAnalysis;
  risk_factors: string;
  legal_details: LegalDetails;
  additional_features: string;
  images: string[];
  investment_token: string;
  min_investment_amount: string;
}