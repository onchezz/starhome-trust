import { BigNumberish, num, shortString } from "starknet";

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
export interface MarketAnalysis {
  area_growth: string;
  occupancy_rate: string;
  comparable_properties: string;
  demand_trend: string;
}


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
  latitude: string;
  longitude: string;
  size: number;
  investor_id: string;
  owner: string;
  construction_status: string;
  asset_value: number;
  available_staking_amount: number;
  min_investment:number;
  investment_type: string;
  construction_year: number;
  property_price: number;
  expected_roi: string;
  rental_income: number;
  maintenance_costs: number;
  tax_benefits: string;
  highlights: string;
  market_analysis: string;
  risk_factors: string;
  legal_detail: string;
  additional_features: string;
  images: string;
  investment_token: string;
  min_investment_amount: number;
}

export class InvestmentAssetConverter {
    static feltToString(felt: string): string {
        return shortString.decodeShortString(felt);
    }

    static addressToString(address: BigNumberish): string {
        return num.toHex(address);
    }

    static fromStarknetProperty(starknetProperty: any): InvestmentAsset {
        return {
            id: shortString.decodeShortString(starknetProperty.id),
            name: this.feltToString(starknetProperty.name),
            description: starknetProperty.description,
            is_active: Boolean(starknetProperty.is_active),
            location: this.feltToString(starknetProperty.location),
            size: Number(starknetProperty.size),
            investor_id: this.addressToString(starknetProperty.investor_id),
            owner: this.addressToString(starknetProperty.owner),
            construction_status: this.feltToString(starknetProperty.construction_status),
            asset_value: Number(starknetProperty.asset_value),
            available_staking_amount: Number(starknetProperty.available_staking_amount),
            min_investment:Number(starknetProperty.min_investment),
            investment_type: this.feltToString(starknetProperty.investment_type),
            construction_year: Number(starknetProperty.construction_year),
            property_price: Number(starknetProperty.property_price),
            expected_roi: this.feltToString(starknetProperty.expected_roi),
            rental_income: Number(starknetProperty.rental_income),
            maintenance_costs: Number(starknetProperty.maintenance_costs),
            tax_benefits: this.feltToString(starknetProperty.tax_benefits),
            highlights: starknetProperty.highlights,
            market_analysis:starknetProperty.market_analysis,
            risk_factors: starknetProperty.risk_factors,
            legal_detail: starknetProperty.legal_detail,
            additional_features: starknetProperty.additional_features,
            images: starknetProperty.images,
            investment_token: this.addressToString(starknetProperty.investment_token),
            min_investment_amount: Number(starknetProperty.min_investment_amount)
        };
    }

    static async getProperty(contract: any, propertyId: BigNumberish): Promise<InvestmentAsset> {
        const starknetProperty = await contract.get_property(propertyId);
        return this.fromStarknetProperty(starknetProperty);
    }
}