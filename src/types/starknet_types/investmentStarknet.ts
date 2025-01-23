import { shortString } from "starknet";
import { Investment } from "../investment";



export interface StarknetInvestment {
  id: string;                     // felt252
  name: string;                   // felt252
  location: string;               // felt252
  size: string;                   // felt252
  investment_type: string;        // felt252
  construction_year: number;      // u64
  asking_price: bigint;          // u256
  expected_roi: string;          // felt252
  rental_income: bigint;         // u256
  maintenance_costs: bigint;     // u256
  tax_benefits: string;          // felt252
  highlights: string[]; 
  is_active:boolean;         // Array<felt252>
  market_analysis: {
    area_growth: string;         // felt252
    occupancy_rate: string;      // felt252
    comparable_properties: string;// felt252
    demand_trend: string;        // felt252
  };
  risk_factors: string[];        // Array<felt252>
  legal_details: {
    ownership: string;           // felt252
    zoning: string;             // felt252
    permits: string;            // felt252
    documents: string[];        // Array<felt252>
  };
  additional_features: string[]; // Array<felt252>
  images: string[];             // Array<felt252>
  min_amount: bigint;           // u256
}

export const transformToStarknetInvestment = (formData: Partial<Investment>): StarknetInvestment => {
  const toFelt252 = (value: string | undefined): string => {
    if (!value) return "0";
    try {
      return shortString.encodeShortString(value);
    } catch (error) {
      console.warn(`Error converting ${value} to felt252:`, error);
      return "0";
    }
  };

  const toBigInt = (value: string | number | bigint | undefined): bigint => {
    if (!value) return BigInt(0);
    return typeof value === 'bigint' ? value : BigInt(value);
  };

  const toU64 = (value: number | undefined): number => {
    if (!value) return 0;
    return Math.max(0, Math.min(value, Number.MAX_SAFE_INTEGER));
  };

  const toFelt252Array = (arr: string[] | undefined): string[] => {
    if (!arr) return [];
    return arr.map(item => toFelt252(item));
  };

  return {
    id: toFelt252(formData.id?.toString()),
    name: toFelt252(formData.name),
    location: toFelt252(formData.location),
    size: toFelt252(formData.size),
    investment_type: toFelt252(formData.type),
    is_active:Boolean(formData.is_active),
    construction_year: toU64(formData.constructionYear),
    asking_price: toBigInt(formData.askingPrice),
    expected_roi: toFelt252(formData.expectedROI),
    rental_income: toBigInt(formData.rentalIncome),
    maintenance_costs: toBigInt(formData.maintenanceCosts),
    tax_benefits: toFelt252(formData.taxBenefits),
    highlights: toFelt252Array(formData.highlights),
    market_analysis: {
      area_growth: toFelt252(formData.marketAnalysis.areaGrowth),
      occupancy_rate: toFelt252(formData.marketAnalysis.occupancyRate),
      comparable_properties: toFelt252(formData.marketAnalysis.comparableProperties),
      demand_trend: toFelt252(formData.marketAnalysis.demandTrend)
    },
    risk_factors: toFelt252Array(formData.riskFactors),
    legal_details: {
      ownership: toFelt252(formData.legalDetails.ownership),
      zoning: toFelt252(formData.legalDetails.zoning),
      permits: toFelt252(formData.legalDetails.permits),
      documents: toFelt252Array(formData.legalDetails.documents)
    },
    additional_features: toFelt252Array(formData.additionalFeatures),
    images: toFelt252Array(formData.images),
    min_amount: toBigInt(formData.minAmount)
  };
};

export const validateInvestmentData = (data: StarknetInvestment): boolean => {
  const requiredFields = [
    'id', 'name', 'location', 'investment_type', 
    'asking_price', 'rental_income', 'maintenance_costs'
  ];

  return requiredFields.every(field => {
    const value = data[field as keyof StarknetInvestment];
    return value !== undefined && value !== null && value !== '' && value !== '0';
  });
};