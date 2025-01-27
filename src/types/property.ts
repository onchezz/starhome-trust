import { Property as StarknetProperty } from "@/types/starknet_types/propertyStartknet";

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  asking_price: number;
  images_id: string;
  property_type: string;
  status: string;
  interested_clients: number;
  annual_growth_rate: number;
  city: string;
  state: string;
  country: string;
}

export const PropertyConverter = {
  fromStarknetProperty: (property: StarknetProperty): Property => {
    console.log("Converting property:", property);
    
    if (!property) {
      console.error("Property is undefined");
      throw new Error("Property is undefined");
    }

    return {
      id: property.id.toString(),
      title: property.title,
      description: property.description,
      price: Number(property.price),
      asking_price: Number(property.asking_price),
      images_id: property.images_id,
      property_type: property.property_type,
      status: property.status,
      interested_clients: Number(property.interested_clients),
      annual_growth_rate: Number(property.annual_growth_rate),
      city: property.city,
      state: property.state,
      country: property.country,
    };
  }
};