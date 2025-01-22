/* eslint-disable @typescript-eslint/no-explicit-any */
import { Property } from "@/types/property";
import { shortString, num } from "starknet";
import { v4 as uuidv4 } from "uuid";
// Type definition for Starknet property data
export interface StarknetProperty {
  id: string;            // felt252
  title: string;         // felt252
  description: string;   // ByteArray
  location_address: string; // felt252
  city: string;         // felt252
  state: string;        // felt252
  country: string;      // felt252
  latitude: string;     // felt252
  longitude: string;    // felt252
  price: bigint;        // u256
  owner: string;        // ContractAddress
  asking_price: bigint; // u256
  currency: string;     // felt252
  area: number;         // u64
  bedrooms: number;     // u64
  bathrooms: number;    // u64
  parking_spaces: number; // u64
  property_type: string; // felt252
  status: string;       // felt252
  interested_clients: bigint; // u256
  annual_growth_rate: bigint; // u256
  features_id: string;  // felt252
  images_id: string;    // felt252
  video_tour: string;   // felt252
  agent_id: string;     // ContractAddress
  date_listed: number;  // u64
  has_garden: boolean;
  has_swimming_pool: boolean;
  pet_friendly: boolean;
  wheelchair_accessible: boolean;
  asset_token: string;  // ContractAddress
  // is_investment: boolean;
}

export const transformToStarknetProperty = (formData: Partial<Property>): StarknetProperty => {
  // Helper function to convert string to felt252
  const toFelt252 = (value: string | undefined): string => {
    if (!value) return "0";
    try {
      return shortString.encodeShortString(value);
    } catch (error) {
      console.warn(`Error converting ${value} to felt252:`, error);
      return "0";
    }
  };

  // Helper function to ensure bigint
  const toBigInt = (value: string | number | bigint | undefined): bigint => {
    if (!value) return BigInt(0);
    return typeof value === 'bigint' ? value : BigInt(value);
  };

  // Helper function to ensure number (u64)
  const toU64 = (value: number | undefined): number => {
    if (!value) return 0;
    return Math.max(0, Math.min(value, Number.MAX_SAFE_INTEGER));
  };

  // Convert all properties to their appropriate Starknet types
  const starknetProperty: StarknetProperty = {

    id: toFelt252(uuidv4()),
    title: toFelt252(formData.title),
    description: formData.description?.toString() || "",  // ByteArray will be handled by contract
    location_address: toFelt252(formData.location_address),
    city: toFelt252(formData.city),
    state: toFelt252(formData.state),
    country: toFelt252(formData.country),
    latitude: toFelt252(formData.latitude),
    longitude: toFelt252(formData.longitude),
    price: toBigInt(formData.price),
    owner: formData.owner || "0x0", // ContractAddress
    asking_price: toBigInt(formData.asking_price),
    currency: toFelt252(formData.currency),
    area: toU64(formData.area),
    bedrooms: toU64(formData.bedrooms),
    bathrooms: toU64(formData.bathrooms),
    parking_spaces: toU64(formData.parking_spaces),
    property_type: toFelt252(formData.property_type),
    status: toFelt252(formData.status),
    interested_clients: toBigInt(formData.interested_clients),
    annual_growth_rate: toBigInt(formData.annual_growth_rate),
    features_id: toFelt252(formData.features_id),
    images_id: toFelt252(formData.images_id),
    video_tour: toFelt252(formData.video_tour),
    agent_id: formData.agent_id || "0x0", // ContractAddress
    date_listed: toU64(formData.date_listed),
    has_garden: Boolean(formData.has_garden),
    has_swimming_pool: Boolean(formData.has_swimming_pool),
    pet_friendly: Boolean(formData.pet_friendly),
    wheelchair_accessible: Boolean(formData.wheelchair_accessible),
    asset_token: formData.asset_token || "0x0", // ContractAddress
    // is_investment: Boolean(formData.is_investment),
  };

  return starknetProperty;
};

// Validation function to check if required fields are present
export const validatePropertyData = (data: StarknetProperty): boolean => {
  const requiredFields = [
    'id', 'title', 'description', 'location_address',
    'city', 'state', 'country', 'price', 'owner',
    'asking_price', 'area', 'bedrooms', 'bathrooms',
    'property_type', 'status'
  ];

  return requiredFields.every(field => {
    const value = data[field as keyof StarknetProperty];
    return value !== undefined && value !== null && value !== '' && value !== '0';
  });
};


