import { useState, useEffect } from "react";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyShimmerCard } from "@/components/ui/shimmer-cards";
import { usePropertyRead } from "@/hooks/contract_interactions/useContractReads";
import { Property, PropertyConverter } from "@/types/property";
import { PropertySearch } from "@/components/property/PropertySearch";
import { PropertyFilters } from "@/components/property/PropertyFilters";

const Properties = () => {
  const { properties, isLoading } = usePropertyRead();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priceRange: [0, 15000000],
    bedrooms: "any",
    bathrooms: "any",
    propertyType: "any",
  });

  const filteredProperties = properties
    ?.filter((starknetProperty: Property) => {
      const property = PropertyConverter.fromStarknetProperty(starknetProperty);
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.country.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriceRange =
        property.price >= filters.priceRange[0] &&
        property.price <= filters.priceRange[1];

      const matchesBedrooms =
        filters.bedrooms === "any" ||
        property.bedrooms.toString() === filters.bedrooms;

      const matchesBathrooms =
        filters.bathrooms === "any" ||
        property.bathrooms.toString() === filters.bathrooms;

      const matchesPropertyType =
        filters.propertyType === "any" ||
        property.property_type === filters.propertyType;

      return (
        matchesSearch &&
        matchesPriceRange &&
        matchesBedrooms &&
        matchesBathrooms &&
        matchesPropertyType
      );
    })
    .map(PropertyConverter.fromStarknetProperty);

  console.log("Filtered properties:", filteredProperties);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">Properties</h1>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <PropertyFilters
                onFilterChange={(newFilters) => setFilters(newFilters)}
              />
            </div>
            <div className="lg:col-span-3">
              <PropertySearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <PropertyShimmerCard key={index} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties?.map((property) => (
                    <PropertyCard
                      key={property.id}
                      location={{
                        city: property.city,
                        state: property.state,
                        country: property.country,
                      }}
                      askingPrice={property.asking_price}
                      interestedClients={property.interested_clients}
                      annualGrowthRate={property.annual_growth_rate}
                      imagesUrl={property.images_id}
                      propertyType={property.property_type}
                      {...property}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;