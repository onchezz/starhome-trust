// import { BigNumberish, num,  } from "starknet";

// // Using string for ContractAddress since we'll convert it when sending to contract
// export interface StarknetProperty {
//   id: BigNumberish;
//   title: BigNumberish;
//   description: string;
//   location_address: BigNumberish;
//   city: BigNumberish;
//   state: BigNumberish;
//   country: BigNumberish;
//   latitude: BigNumberish;
//   longitude: BigNumberish;
//   price: BigNumberish;
//   owner: BigNumberish; // ContractAddress as string
//   asking_price: BigNumberish;
//   currency: BigNumberish;
//   area: BigNumberish;
//   bedrooms: BigNumberish;
//   bathrooms: BigNumberish;
//   parking_spaces: BigNumberish;
//   property_type: BigNumberish;
//   status: BigNumberish;
//   interested_clients: BigNumberish;
//   annual_growth_rate: BigNumberish;
//   features_id: BigNumberish;
//   images_id: string;
//   video_tour: BigNumberish;
//   agent_id: BigNumberish; // ContractAddress as string
//   date_listed: BigNumberish;
//   has_garden: boolean;
//   has_swimming_pool: boolean;
//   pet_friendly: boolean;
//   wheelchair_accessible: boolean;
//   asset_token: string; // ContractAddress as string
// }

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
