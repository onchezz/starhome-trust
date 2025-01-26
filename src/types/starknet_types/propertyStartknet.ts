
export interface StarknetProperty {
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
  // owner: string;
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

