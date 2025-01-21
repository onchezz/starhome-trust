import { ByteArray } from "starknet";

// Using string for ContractAddress since we'll convert it when sending to contract
export interface Property {
  id: string;
  title: string;
  description: ByteArray;
  location_address: string;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  price: bigint;
  owner: string; // ContractAddress as string
  asking_price: bigint;
  currency: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  property_type: string;
  status: string;
  interested_clients: bigint;
  annual_growth_rate: bigint;
  features_id: string;
  images_id: string;
  video_tour: string;
  agent_id: string; // ContractAddress as string
  date_listed: number;
  has_garden: boolean;
  has_swimming_pool: boolean;
  pet_friendly: boolean;
  wheelchair_accessible: boolean;
  asset_token: string; // ContractAddress as string
  is_investment: boolean;
}