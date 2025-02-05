

import { BigNumberish, num, shortString } from "starknet";
export const propertyTypes = [
  "House",
  "Apartment",
  "Condo",
  "Townhouse",
  "Villa",
  "Land",
  "Commercial",
  "Other",
] as const;

export const statusOptions = [
  "Available",
  "Sold",
  "Under Contract",
  "Pending",
  "Off Market",
] as const;

// export interface StarknetProperty {
//   id: string;
//   title: string;
//   description: string;
//   location_address: string;
//   city: string;
//   state: string;
//   country: string;
//   latitude: string;
//   longitude: string;
//   price: BigNumberish;
//   // owner: string;
//   asking_price: BigNumberish;
//   currency: string;
//   area: number;
//   bedrooms: number;
//   bathrooms: number;
//   parking_spaces: number;
//   property_type: string;
//   status: string;
//   interested_clients: number;
//   annual_growth_rate: number;
//   features_id: string;
//   images_id: string;
//   video_tour: string;
//   agent_id: string;
//   date_listed: number;
//   has_garden: boolean;
//   has_swimming_pool: boolean;
//   pet_friendly: boolean;
//   wheelchair_accessible: boolean;
//   asset_token: string;
// }

export interface Property {
  id: string;
  title: string;
  description: string;
  locationAddress: string;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  price: number;
  asking_price: number;
  currency: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  propertyType: string;
  status: string;
  interestedClients: number;
  annualGrowthRate: number;
  featuresId: string;
  imagesId: string;
  videoId: string;
  agentId: string;
  dateListed: number;
  hasGarden: boolean;
  hasSwimmingPool: boolean;
  petFriendly: boolean;
  wheelchairAccessible: boolean;
  assetToken: string;
}

export class PropertyConverter {
    static feltToString(felt: string): string {
        return shortString.decodeShortString(felt);
    }

    static addressToString(address: BigNumberish): string {
        return num.toHex(address);
    }

    static fromStarknetProperty(starknetProperty: any): Property {
        return  {
            id: shortString.decodeShortString(starknetProperty.id),
            title: this.feltToString(starknetProperty.title),
            description: starknetProperty.description,
            locationAddress: this.feltToString(starknetProperty.location_address),
            city: this.feltToString(starknetProperty.city),
            state: this.feltToString(starknetProperty.state),
            country: this.feltToString(starknetProperty.country),
            latitude: this.feltToString(starknetProperty.latitude),
            longitude: this.feltToString(starknetProperty.longitude),
            price: Number(starknetProperty.price)/ Math.pow(10, 6),
            asking_price: Number(starknetProperty.asking_price)/Math.pow(10, 6),
            currency: this.feltToString(starknetProperty.currency),
            area: Number(starknetProperty.area),
            bedrooms: Number(starknetProperty.bedrooms),
            bathrooms: Number(starknetProperty.bathrooms),
            parkingSpaces: Number(starknetProperty.parking_spaces),
            propertyType: this.feltToString(starknetProperty.property_type),
            status: this.feltToString(starknetProperty.status),
            interestedClients: Number(starknetProperty.interested_clients),
            annualGrowthRate: Number(this.feltToString(starknetProperty.annual_growth_rate)),
            featuresId: this.feltToString(starknetProperty.features_id),
            imagesId: starknetProperty.images_id,
            videoId: this.feltToString(starknetProperty.video_tour),
            agentId: this.addressToString(starknetProperty.agent_id),
            dateListed: Number(starknetProperty.date_listed),
            hasGarden: Boolean(starknetProperty.has_garden),
            hasSwimmingPool: Boolean(starknetProperty.has_swimming_pool),
            petFriendly: Boolean(starknetProperty.pet_friendly),
            wheelchairAccessible: Boolean(starknetProperty.wheelchair_accessible),
            assetToken: this.addressToString(starknetProperty.asset_token),
        };
    }
    static convertToStarknetProperty(property:Partial<Property>, address:string){
       const convertPrice = (price: number | undefined): bigint => {
    if (typeof price !== 'number') {
      return BigInt(0);
    }
    return BigInt(Math.floor(price * Math.pow(10, 6)));
  };
        return {
        id: property.id || "",
        title: property.title || "",
        description: property.description || "",
        location_address: property.locationAddress?.split(",")[0] || "",
        city: property.city || "",
        state: property.state || "",
        country: property.country || "",
        latitude: property.latitude || "",
        longitude: property.longitude || "",
        price: property.price * Math.pow(10, 6)||0 ,
        asking_price: property.asking_price * Math.pow(10, 6)|| 0,
        currency: property.currency || "USD",
        area: property.area || 0,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        parking_spaces: property.parkingSpaces || 0,
        property_type: property.propertyType || "",
        status: property.status || "",
        interested_clients: property.interestedClients || 0,
        annual_growth_rate: property.annualGrowthRate || 0,
        features_id: "00",
        images_id: property.imagesId.toString() || "",
        video_tour: property.videoId || "none",
        agent_id: address || "",
        date_listed: Math.floor(Date.now() / 1000),
        has_garden: property.hasGarden || false,
        has_swimming_pool: property.hasSwimmingPool || false,
        pet_friendly: property.petFriendly || false,
        wheelchair_accessible: property.wheelchairAccessible || false,
        asset_token: property.assetToken || ""
      };
    }

    // Example usage:
    static async getProperty(contract: any, propertyId: BigNumberish): Promise<Property> {
        const starknetProperty = await contract.get_property(propertyId);
        return this.fromStarknetProperty(starknetProperty);
    }
}