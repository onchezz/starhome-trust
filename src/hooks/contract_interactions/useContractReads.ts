import { StarknetProperty } from '@/types/starknet_types/propertyStartknet';
import { useStarHomeReadContract } from '../contract_hooks/useStarHomeReadContract';
import { PropertyConverter } from '@/types/property';
import { UserConverter } from '@/types/starknet_types/user_agent';

export const usePropertyRead = () => {
  const { data: propertiesData, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties",
  });

  console.log("Sale properties:", propertiesData);

  // Ensure we always return an array for properties
  const properties = Array.isArray(propertiesData) 
    ? propertiesData.map((property: any) => {
        // Create a properly typed StarknetProperty object
        const starknetProperty: StarknetProperty = {
          id: property.id?.toString() || "",
          title: property.title?.toString() || "",
          description: property.description?.toString() || "",
          location_address: property.location_address?.toString() || "",
          city: property.city?.toString() || "",
          state: property.state?.toString() || "",
          country: property.country?.toString() || "",
          latitude: property.latitude?.toString() || "",
          longitude: property.longitude?.toString() || "",
          price: Number(property.price) || 0,
          asking_price: Number(property.asking_price) || 0,
          currency: property.currency?.toString() || "",
          area: Number(property.area) || 0,
          bedrooms: Number(property.bedrooms) || 0,
          bathrooms: Number(property.bathrooms) || 0,
          parking_spaces: Number(property.parking_spaces) || 0,
          property_type: property.property_type?.toString() || "",
          status: property.status?.toString() || "",
          interested_clients: Number(property.interested_clients) || 0,
          annual_growth_rate: Number(property.annual_growth_rate) || 0,
          features_id: property.features_id?.toString() || "",
          images_id: property.images_id?.toString() || "",
          video_tour: property.video_tour?.toString() || "",
          agent_id: property.agent_id?.toString() || "",
          date_listed: Number(property.date_listed) || 0,
          has_garden: Boolean(property.has_garden),
          has_swimming_pool: Boolean(property.has_swimming_pool),
          pet_friendly: Boolean(property.pet_friendly),
          wheelchair_accessible: Boolean(property.wheelchair_accessible),
          asset_token: property.asset_token?.toString() || ""
        };
        console.log("Converting property:", starknetProperty);
        return PropertyConverter.fromStarknetProperty(starknetProperty);
      })
    : [];
 
  return {
    properties,
    isLoading,
    error,
  };
};

export const usePropertyReadById = (id: string) => {
  const { data: propertyData, isLoading, error } = useStarHomeReadContract({
    functionName: "get_property",
    args: [id],
  });

  console.log("Property by ID:", propertyData);

  let property = null;
  if (propertyData) {
    // Create a properly typed StarknetProperty object
    const starknetProperty: StarknetProperty = {
      id: propertyData.id?.toString() || "",
      title: propertyData.title?.toString() || "",
      description: propertyData.description?.toString() || "",
      location_address: propertyData.location_address?.toString() || "",
      city: propertyData.city?.toString() || "",
      state: propertyData.state?.toString() || "",
      country: propertyData.country?.toString() || "",
      latitude: propertyData.latitude?.toString() || "",
      longitude: propertyData.longitude?.toString() || "",
      price: Number(propertyData.price) || 0,
      asking_price: Number(propertyData.asking_price) || 0,
      currency: propertyData.currency?.toString() || "",
      area: Number(propertyData.area) || 0,
      bedrooms: Number(propertyData.bedrooms) || 0,
      bathrooms: Number(propertyData.bathrooms) || 0,
      parking_spaces: Number(propertyData.parking_spaces) || 0,
      property_type: propertyData.property_type?.toString() || "",
      status: propertyData.status?.toString() || "",
      interested_clients: Number(propertyData.interested_clients) || 0,
      annual_growth_rate: Number(propertyData.annual_growth_rate) || 0,
      features_id: propertyData.features_id?.toString() || "",
      images_id: propertyData.images_id?.toString() || "",
      video_tour: propertyData.video_tour?.toString() || "",
      agent_id: propertyData.agent_id?.toString() || "",
      date_listed: Number(propertyData.date_listed) || 0,
      has_garden: Boolean(propertyData.has_garden),
      has_swimming_pool: Boolean(propertyData.has_swimming_pool),
      pet_friendly: Boolean(propertyData.pet_friendly),
      wheelchair_accessible: Boolean(propertyData.wheelchair_accessible),
      asset_token: propertyData.asset_token?.toString() || ""
    };
    property = PropertyConverter.fromStarknetProperty(starknetProperty);
  }

  return {
    property,
    isLoading,
    error,
  };
};

export const useUserReadByAddress = (address: string) => {
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_user_by_address",
    args: [address],
  });
  const agentData = data ? UserConverter.fromStarknetUser(data) : null;
  console.log("agent data is :", agentData);

  return {
    agent: agentData,
    isLoading,
    error,
  };
};