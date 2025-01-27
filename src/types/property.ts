import { BigNumberish } from "starknet";
import { shortString, num } from "starknet";

export interface Property {
  id: string;            // felt252
  title: string;         // felt252
  description: string;   // ByteArray
  location_address: string; // felt252
  city: string;         // felt252
  state: string;        // felt252
  country: string;      // felt252
  latitude: string;     // felt252
  longitude: string;    // felt252
  price: number;        // u256
  asking_price: number; // u256
  currency: string;     // felt252
  area: number;         // u64
  bedrooms: number;     // u64
  bathrooms: number;    // u64
  parking_spaces: number; // u64
  property_type: string; // felt252
  status: string;       // felt252
  interested_clients: number; // u256
  annual_growth_rate: number; // u256
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
}

export const PropertyConverter = {
    feltToString: (felt: string): string => {
        return shortString.decodeShortString(felt);
    },

    addressToString: (address: BigNumberish): string => {
        return num.toHex(address);
    },

    fromStarknetProperty: (starknetProperty: any): Property => {
        if (!starknetProperty) {
            console.error('Received null or undefined starknetProperty');
            return null;
        }

        try {
            return {
                id: PropertyConverter.feltToString(starknetProperty.id),
                title: PropertyConverter.feltToString(starknetProperty.title),
                description: starknetProperty.description,
                location_address: PropertyConverter.feltToString(starknetProperty.location_address),
                city: PropertyConverter.feltToString(starknetProperty.city),
                state: PropertyConverter.feltToString(starknetProperty.state),
                country: PropertyConverter.feltToString(starknetProperty.country),
                latitude: PropertyConverter.feltToString(starknetProperty.latitude),
                longitude: PropertyConverter.feltToString(starknetProperty.longitude),
                price: Number(starknetProperty.price),
                asking_price: Number(starknetProperty.asking_price),
                currency: PropertyConverter.feltToString(starknetProperty.currency),
                area: Number(starknetProperty.area),
                bedrooms: Number(starknetProperty.bedrooms),
                bathrooms: Number(starknetProperty.bathrooms),
                parking_spaces: Number(starknetProperty.parking_spaces),
                property_type: PropertyConverter.feltToString(starknetProperty.property_type),
                status: PropertyConverter.feltToString(starknetProperty.status),
                interested_clients: Number(starknetProperty.interested_clients),
                annual_growth_rate: Number(starknetProperty.annual_growth_rate),
                features_id: PropertyConverter.feltToString(starknetProperty.features_id),
                images_id: starknetProperty.images_id,
                video_tour: PropertyConverter.feltToString(starknetProperty.video_tour),
                agent_id: PropertyConverter.addressToString(starknetProperty.agent_id),
                date_listed: Number(starknetProperty.date_listed),
                has_garden: Boolean(starknetProperty.has_garden),
                has_swimming_pool: Boolean(starknetProperty.has_swimming_pool),
                pet_friendly: Boolean(starknetProperty.pet_friendly),
                wheelchair_accessible: Boolean(starknetProperty.wheelchair_accessible),
                asset_token: PropertyConverter.addressToString(starknetProperty.asset_token),
            };
        } catch (error) {
            console.error('Error converting property:', error);
            return null;
        }
    },

    getProperty: async (contract: any, propertyId: BigNumberish): Promise<Property> => {
        const starknetProperty = await contract.get_property(propertyId);
        return PropertyConverter.fromStarknetProperty(starknetProperty);
    }
};