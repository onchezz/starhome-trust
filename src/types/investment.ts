import { useAccount } from "@starknet-react/core";
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

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
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
  location: Location;
  size: number;
  investor_id: string;
  owner: string;
  construction_status: string;
  asset_value: number;
  available_staking_amount: number;
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
            name: shortString.decodeShortString(starknetProperty.name),
            description: starknetProperty.description,
            is_active: Boolean(starknetProperty.is_active),
            location: {
                address:shortString.decodeShortString(starknetProperty.location.address),
                city:  shortString.decodeShortString(starknetProperty.location.city),
                state: shortString.decodeShortString(starknetProperty.location.state),
                country: shortString.decodeShortString(starknetProperty.location.country),
                latitude: shortString.decodeShortString(starknetProperty.location.latitude),
                longitude: shortString.decodeShortString(starknetProperty.location.longitude),
            },
            size: Number(starknetProperty.size),
            investor_id: num.toHex(starknetProperty.investor_id),
            owner: num.toHex(starknetProperty.owner),
            construction_status: shortString.decodeShortString(starknetProperty.construction_status),
            asset_value: Number(starknetProperty.asset_value),
            available_staking_amount: Number(starknetProperty.available_staking_amount),
            investment_type: shortString.decodeShortString(starknetProperty.investment_type),
            construction_year: Number(starknetProperty.construction_year),
            property_price: Number(starknetProperty.property_price),
            expected_roi: shortString.decodeShortString(starknetProperty.expected_roi),
            rental_income: Number(starknetProperty.rental_income),
            maintenance_costs: Number(starknetProperty.maintenance_costs),
            tax_benefits: shortString.decodeShortString(starknetProperty.tax_benefits),
            highlights: starknetProperty.highlights,
            market_analysis: "none yey",//starknetProperty.market_analysis,
            risk_factors: starknetProperty.risk_factors,
            legal_detail: starknetProperty.legal_detail,
            additional_features: starknetProperty.additional_features,
            images: starknetProperty.images,
            investment_token: num.toHex(starknetProperty.investment_token),
            min_investment_amount: Number(starknetProperty.min_investment_amount)
        };
    }
    static toStarknetProperty(formData: InvestmentAsset, address: string): InvestmentAsset {

        return {
            id: formData.id,
            name: formData.name,
            description: formData.description,
            is_active: formData.is_active,
            location: {
                address: formData.location.address,
                city: formData.location.city,
                state: formData.location.state,
                country: formData.location.country,
                latitude: formData.location.latitude,
                longitude: formData.location.longitude
            },
            size: formData.size,
            investor_id: address|| formData.investor_id,
            owner:address||formData.owner,
            construction_status: formData.construction_status,
            asset_value: formData.available_staking_amount,
            available_staking_amount: formData.available_staking_amount,
            investment_type: formData.investment_type,
            construction_year: formData.construction_year,
            property_price: formData.property_price||formData.available_staking_amount,
            expected_roi: formData.expected_roi,
            rental_income: formData.rental_income,
            maintenance_costs: formData.maintenance_costs,
            tax_benefits: formData.tax_benefits||"none yet",
            highlights: formData.highlights,
            market_analysis: formData.market_analysis,
            risk_factors: formData.risk_factors||"no risk factors",
            legal_detail: formData.legal_detail,
            additional_features: formData.additional_features,
            images: formData.images,
            investment_token: formData.investment_token,
            min_investment_amount: formData.min_investment_amount
        };
    }

    static async getProperty(contract: any, propertyId: BigNumberish): Promise<InvestmentAsset> {
        const starknetProperty = await contract.get_property(propertyId);
        return this.fromStarknetProperty(starknetProperty);
    }
}