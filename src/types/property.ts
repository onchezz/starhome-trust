import { BigNumberish } from "starknet";

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
}

export interface Property {
  id: string;
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
  agentId: string;
  dateListed: string;
  hasGarden: boolean;
  hasSwimmingPool: boolean;
  petFriendly: boolean;
  wheelchairAccessible: boolean;
  assetToken: string;
  isInvestment: boolean;
}