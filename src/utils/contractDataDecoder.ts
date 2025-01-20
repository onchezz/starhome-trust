import { BigNumberish } from "starknet";

export const decodeHexString = (hex: BigNumberish): string => {
  if (!hex || typeof hex !== 'object' || !('value' in hex)) {
    return '';
  }

  const hexString = hex.value.toString(16);
  // Convert hex to ASCII, handling odd-length strings
  let str = '';
  for (let i = 0; i < hexString.length; i += 2) {
    const chunk = hexString.slice(i, i + 2);
    if (chunk) {
      str += String.fromCharCode(parseInt(chunk, 16));
    }
  }
  return str.replace(/\x00/g, ''); // Remove null characters
};

export const decodeBigIntValue = (value: BigNumberish): number => {
  if (!value || typeof value !== 'object' || !('value' in value)) {
    return 0;
  }
  return Number(value.value);
};

export const decodePropertyFromContract = (property: any) => {
  if (!property) return null;

  return {
    id: decodeBigIntValue(property.id),
    isInvestment: property.isInvestment,
    title: decodeHexString(property.title),
    description: decodeHexString(property.description),
    location: {
      address: decodeHexString(property.location.address),
      city: decodeHexString(property.location.city),
      state: decodeHexString(property.location.state),
      country: decodeHexString(property.location.country),
      latitude: decodeBigIntValue(property.location.latitude),
      longitude: decodeBigIntValue(property.location.longitude),
    },
    price: decodeBigIntValue(property.price),
    owner: property.owner.value.toString(),
    askingPrice: decodeBigIntValue(property.asking_price),
    currency: decodeHexString(property.currency),
    area: decodeBigIntValue(property.area),
    bedrooms: decodeBigIntValue(property.bedrooms),
    bathrooms: decodeBigIntValue(property.bathrooms),
    parkingSpaces: decodeBigIntValue(property.parking_spaces),
    propertyType: decodeHexString(property.property_type),
    status: decodeHexString(property.status),
    interestedClients: decodeBigIntValue(property.interested_clients),
    annualGrowthRate: decodeBigIntValue(property.annual_growth_rate),
    agent: {
      name: decodeHexString(property.agent.name),
      phone: decodeHexString(property.agent.phone),
      email: decodeHexString(property.agent.email),
      profileImage: decodeHexString(property.agent.profile_image),
    },
    dateListed: decodeHexString(property.date_listed),
    amenities: property.amenities,
    paymentToken: property.payment_token.value.toString(),
    timestamp: decodeBigIntValue(property.timestamp),
  };
};