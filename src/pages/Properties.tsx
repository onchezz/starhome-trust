import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PropertyShimmerCard } from "@/components/ui/shimmer-cards";
import { usePropertyRead } from "@/hooks/contract_interactions/useContractReads";
import { Button } from "@/components/ui/button";
import { Property, PropertyConverter } from "@/types/property";
import { num, shortString } from "starknet";
import { PropertyCard } from "@/components/property/PropertyCard";
import { readImages } from "@/hooks/services_hooks/pinata";
import { set } from "date-fns";
import { GetCIDResponse } from "pinata-web3";

const Properties = () => {
  // const [properties] = usePropertyRead();
  const { properties, isLoading } = usePropertyRead();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priceRange: [0, 15000000],
    bedrooms: "any",
    bathrooms: "any",
    propertyType: "any",
  });
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoadingProperties, setIsLoading] = useState(true);
  const [image, setImage] = useState();

  // Usage

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* <Navbar /> */}
      <div className="container mx-auto py-24">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <PropertyShimmerCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((starknetProperty: Property) => {
              const property =
                PropertyConverter.fromStarknetProperty(starknetProperty);
              const img = readImages(
                "bafybeibikptpzc7iyxggjsngsunzkb25xfyifwogwfbbu36xdw7jpx3gga"
              );
              //  setImage(img);

              console.log(property);

              return (
                <PropertyCard
                  location={{
                    city: property.city,
                    state: property.state,
                    country: property.country,
                  }}
                  askingPrice={property.asking_price}
                  interestedClients={property.interested_clients}
                  annualGrowthRate={property.annual_growth_rate}
                  imagesUrl={image}
                  propertyType={property.property_type}
                  key={property.id}
                  {...property}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
