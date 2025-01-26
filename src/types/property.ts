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
  // owner: string;        // ContractAddress
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


export class PropertyConverter {
    static feltToString(felt: string): string {
        return shortString.decodeShortString(felt);
    }

    // static byteArrayToString(byteArray: BigNumberish[]): string {
    //     return shortString.decodeShortString(byteArray);
    // }

    static addressToString(address: BigNumberish): string {
        return num.toHex(address);
    }

    static fromStarknetProperty(starknetProperty: any): Property {
        return {
            id: this.feltToString(starknetProperty.id),
            title: this.feltToString(starknetProperty.title),
            description: starknetProperty.description,
            location_address: this.feltToString(starknetProperty.location_address),
            city: this.feltToString(starknetProperty.city),
            state: this.feltToString(starknetProperty.state),
            country: this.feltToString(starknetProperty.country),
            latitude: this.feltToString(starknetProperty.latitude),
            longitude: this.feltToString(starknetProperty.longitude),
            price: Number(starknetProperty.price),
            asking_price: Number(starknetProperty.asking_price),
            currency: this.feltToString(starknetProperty.currency),
            area: Number(starknetProperty.area),
            bedrooms: Number(starknetProperty.bedrooms),
            bathrooms: Number(starknetProperty.bathrooms),
            parking_spaces: Number(starknetProperty.parking_spaces),
            property_type: this.feltToString(starknetProperty.property_type),
            status: this.feltToString(starknetProperty.status),
            interested_clients: Number(starknetProperty.interested_clients),
            annual_growth_rate: Number(starknetProperty.annual_growth_rate),
            // this.feltToString(starknetProperty.annual_growth_rate),
            features_id: this.feltToString(starknetProperty.features_id),
            images_id: starknetProperty.images_id,
            video_tour: this.feltToString(starknetProperty.video_tour),
            agent_id: this.addressToString(starknetProperty.agent_id),
            date_listed: Number(starknetProperty.date_listed),
            has_garden: Boolean(starknetProperty.has_garden),
            has_swimming_pool: Boolean(starknetProperty.has_swimming_pool),
            pet_friendly: Boolean(starknetProperty.pet_friendly),
            wheelchair_accessible: Boolean(starknetProperty.wheelchair_accessible),
            asset_token: this.addressToString(starknetProperty.asset_token),
        };
    }

    // Example usage:
    static async getProperty(contract: any, propertyId: BigNumberish): Promise<Property> {
        const starknetProperty = await contract.get_property(propertyId);
        return this.fromStarknetProperty(starknetProperty);
    }
}