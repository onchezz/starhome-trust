import { ByteArray, ContractAddress } from "starknet";

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
  owner: ContractAddress;
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
  agent_id: ContractAddress;
  date_listed: number;
  has_garden: boolean;
  has_swimming_pool: boolean;
  pet_friendly: boolean;
  wheelchair_accessible: boolean;
  asset_token: ContractAddress;
  is_investment: boolean;
}