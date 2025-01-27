import { StarknetProperty } from "@/types/starknet_types/propertyStartknet";

export interface Property {
  id: string;
  title: string;
  description: string;
  location_address: string;
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
  parking_spaces: number;
  property_type: string;
  status: string;
  interested_clients: number;
  annual_growth_rate: number;
  features_id: string;
  images_id: string;
  video_tour: string;
  agent_id: string;
  date_listed: number;
  has_garden: boolean;
  has_swimming_pool: boolean;
  pet_friendly: boolean;
  wheelchair_accessible: boolean;
  asset_token: string;
}

export const PropertyConverter = {
  fromStarknetProperty: (property: StarknetProperty): Property => {
    console.log("Converting property:", property);
    
    if (!property) {
      console.error("Property is undefined");
      throw new Error("Property is undefined");
    }

    // Convert the title to string if it's not already
    const title = property.title ? property.title.toString() : "";

    return {
      id: property.id.toString(),
      title,
      description: property.description.toString(),
      location_address: property.location_address.toString(),
      city: property.city.toString(),
      state: property.state.toString(),
      country: property.country.toString(),
      latitude: property.latitude.toString(),
      longitude: property.longitude.toString(),
      price: Number(property.price),
      asking_price: Number(property.asking_price),
      currency: property.currency.toString(),
      area: Number(property.area),
      bedrooms: Number(property.bedrooms),
      bathrooms: Number(property.bathrooms),
      parking_spaces: Number(property.parking_spaces),
      property_type: property.property_type.toString(),
      status: property.status.toString(),
      interested_clients: Number(property.interested_clients),
      annual_growth_rate: Number(property.annual_growth_rate),
      features_id: property.features_id.toString(),
      images_id: property.images_id.toString(),
      video_tour: property.video_tour.toString(),
      agent_id: property.agent_id.toString(),
      date_listed: Number(property.date_listed),
      has_garden: Boolean(property.has_garden),
      has_swimming_pool: Boolean(property.has_swimming_pool),
      pet_friendly: Boolean(property.pet_friendly),
      wheelchair_accessible: Boolean(property.wheelchair_accessible),
      asset_token: property.asset_token.toString(),
    };
  }
};