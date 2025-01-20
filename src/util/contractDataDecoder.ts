/* eslint-disable no-control-regex */
import { BigNumberish } from "starknet";

export const decodeHexString = (hex: BigNumberish | null | undefined): string => {
  if (!hex) return '';
  
  try {
    const hexString = hex.toString(16);
    // Convert hex to ASCII, handling odd-length strings
    let str = '';
    for (let i = 0; i < hexString.length; i += 2) {
      const chunk = hexString.slice(i, i + 2);
      if (chunk) {
        str += String.fromCharCode(parseInt(chunk, 16));
      }
    }
    return str.replace(/\x00/g, ''); // Remove null characters
  } catch (error) {
    console.error('Error decoding hex string:', error);
    return '';
  }
};

export const decodeBigIntValue = (value: BigNumberish | null | undefined): number => {
  if (!value) return 0;
  
  try {
    return Number(value.toString());
  } catch (error) {
    console.error('Error decoding BigInt value:', error);
    return 0;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const decodePropertyFromContract = (property: any) => {
  if (!property) {
    console.log('No property data received');
    return null;
  }

  console.log('Raw property data:', property);

  try {
    return {
      id: decodeBigIntValue(property?.id),
      isInvestment: property?.isInvestment || false,
      title: decodeHexString(property?.title),
      description: decodeHexString(property?.description),
      location: {
        address: decodeHexString(property?.location?.address),
        city: decodeHexString(property?.location?.city),
        state: decodeHexString(property?.location?.state),
        country: decodeHexString(property?.location?.country),
        latitude: decodeBigIntValue(property?.location?.latitude),
        longitude: decodeBigIntValue(property?.location?.longitude),
      },
      price: decodeBigIntValue(property?.price),
      owner: property?.owner?.toString() || '',
      askingPrice: decodeBigIntValue(property?.asking_price),
      currency: decodeHexString(property?.currency),
      area: decodeBigIntValue(property?.area),
      bedrooms: decodeBigIntValue(property?.bedrooms),
      bathrooms: decodeBigIntValue(property?.bathrooms),
      parkingSpaces: decodeBigIntValue(property?.parking_spaces),
      propertyType: decodeHexString(property?.property_type),
      status: decodeHexString(property?.status),
      interestedClients: decodeBigIntValue(property?.interested_clients),
      annualGrowthRate: decodeBigIntValue(property?.annual_growth_rate),
      agent: {
        name: decodeHexString(property?.agent?.name),
        phone: decodeHexString(property?.agent?.phone),
        email: decodeHexString(property?.agent?.email),
        profileImage: decodeHexString(property?.agent?.profile_image),
      },
      dateListed: decodeHexString(property?.date_listed),
      amenities: property?.amenities || {
        hasGarden: false,
        hasSwimmingPool: false,
        petFriendly: false,
        wheelchairAccessible: false
      },
      paymentToken: property?.payment_token?.toString() || '',
      timestamp: decodeBigIntValue(property?.timestamp),
    };
  } catch (error) {
    console.error('Error decoding property:', error);
    return null;
  }
};