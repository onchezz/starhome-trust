import { BigNumberish } from "starknet";

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Agent {
  name: string;
  phone: string;
  email: string;
  profileImage: string;
}

export interface Amenities {
  hasGarden: boolean;
  hasSwimmingPool: boolean;
  petFriendly: boolean;
  wheelchairAccessible: boolean;
}

export interface Property {
  id: string;
  isInvestment: boolean;
  title: string;
  description: string;
  location: Location;
  price: BigNumberish;
  owner: string;
  askingPrice: BigNumberish;
  currency: string;
  area: BigNumberish;
  bedrooms: BigNumberish;
  bathrooms: BigNumberish;
  parkingSpaces: BigNumberish;
  propertyType: string;
  status: string;
  interestedClients: BigNumberish;
  annualGrowthRate: BigNumberish;
  featuresId: string;
  imagesId: string;
  videoTour: string;
  agent: Agent;
  dateListed: string;
  amenities: Amenities;
  paymentToken: string;
  timestamp: number;
}

export interface Investor {
  investorAddress: string;
  names: string;
  investorId: string;
  timestamp: number;
}