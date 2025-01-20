import { BigNumberish } from "starknet";

export interface Location {
  address: BigNumberish;
  city: BigNumberish;
  state: BigNumberish;
  country: BigNumberish;
  latitude: BigNumberish;
  longitude: BigNumberish;
}

export interface Property {
  id: BigNumberish;
  isInvestment: boolean;
  title: BigNumberish;
  description: BigNumberish;
  location: Location;
  price: BigNumberish;
  owner: string;
  asking_price: BigNumberish;
  currency: BigNumberish;
  area: BigNumberish;
  bedrooms: BigNumberish;
  bathrooms: BigNumberish;
  parking_spaces: BigNumberish;
  property_type: BigNumberish;
  status: BigNumberish;
  interested_clients: BigNumberish;
  annual_growth_rate: BigNumberish;
  features_id: BigNumberish;
  images_id: BigNumberish;
  video_tour: BigNumberish;
  agent_id: BigNumberish;
  date_listed: BigNumberish;
  has_garden: boolean;
  has_swimming_pool: boolean;
  pet_friendly: boolean;
  wheelchair_accessible: boolean;
  payment_token: string;
  timestamp: BigNumberish;
}