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
        try {
            return shortString.decodeShortString(felt);
        } catch (error) {
            console.error('[PropertyConverter] Error decoding felt:', error);
            return '';
        }
    }

    static addressToString(address: BigNumberish): string {
        try {
            return num.toHex(address);
        } catch (error) {
            console.error('[PropertyConverter] Error converting address:', error);
            return '';
        }
    }

    static fromStarknetProperty(starknetProperty: any): Property {
        try {
            console.log('[PropertyConverter] Converting Starknet property:', starknetProperty);
            
            // Convert BigInt values to numbers before storing
            const price = typeof starknetProperty.price === 'bigint' 
                ? Number(starknetProperty.price) / Math.pow(10, 6)
                : Number(starknetProperty.price) / Math.pow(10, 6);
                
            const askingPrice = typeof starknetProperty.asking_price === 'bigint'
                ? Number(starknetProperty.asking_price) / Math.pow(10, 6)
                : Number(starknetProperty.asking_price) / Math.pow(10, 6);

            const property = {
                id: this.feltToString(starknetProperty.id),
                title: this.feltToString(starknetProperty.title),
                description: starknetProperty.description,
                locationAddress: this.feltToString(starknetProperty.location_address),
                city: this.feltToString(starknetProperty.city),
                state: this.feltToString(starknetProperty.state),
                country: this.feltToString(starknetProperty.country),
                latitude: this.feltToString(starknetProperty.latitude),
                longitude: this.feltToString(starknetProperty.longitude),
                price,
                asking_price: askingPrice,
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

            console.log('[PropertyConverter] Converted property:', property);
            return property;
        } catch (error) {
            console.error('[PropertyConverter] Error converting property:', error);
            throw error;
        }
    }
}