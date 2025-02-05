import { usePropertyRead } from "@/hooks/contract_interactions/usePropertiesReads";
import { PropertyCard } from "@/components/property/PropertyCard";
import PropertySearch from "@/components/property/PropertySearch";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { useState } from "react";
import { Property } from "@/types/property";
import { parseImagesData } from "@/utils/imageUtils";

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priceRange: [0, 15000000],
    bedrooms: "any",
    bathrooms: "any",
    propertyType: "any"
  });

  const { saleProperties, isLoading, error } = usePropertyRead();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading properties</div>;
  }

  const filteredProperties = saleProperties?.filter((property: Property) => {
    // Search term filter
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.country.toLowerCase().includes(searchTerm.toLowerCase());

    // Price range filter
    const matchesPrice = property.price >= filters.priceRange[0] && 
                        property.price <= filters.priceRange[1];

    // Property type filter
    const matchesType = filters.propertyType === "any" || 
                       property.propertyType === filters.propertyType;

    // Bedrooms filter
    const matchesBedrooms = filters.bedrooms === "any" || 
                           property.bedrooms === Number(filters.bedrooms);

    // Bathrooms filter
    const matchesBathrooms = filters.bathrooms === "any" || 
                            property.bathrooms === Number(filters.bathrooms);

    return matchesSearch && matchesPrice && matchesType && 
           matchesBedrooms && matchesBathrooms;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <PropertyFilters 
            onFilterChange={setFilters}
          />
        </div>
        <div className="lg:col-span-3">
          <PropertySearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredProperties?.map((property: Property) => {
              const { imageUrls } = parseImagesData(property.imagesId);
              console.log("Property images:", imageUrls);
              
              return (
                <PropertyCard 
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  location={{
                    city: property.city,
                    state: property.state,
                    country: property.country
                  }}
                  price={property.price}
                  askingPrice={property.asking_price}
                  interestedClients={property.interestedClients}
                  annualGrowthRate={property.annualGrowthRate}
                  imagesUrl={imageUrls}
                  propertyType={property.propertyType}
                  status={property.status}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;