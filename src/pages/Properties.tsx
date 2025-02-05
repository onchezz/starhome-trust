import { usePropertyRead } from "@/hooks/contract_interactions/usePropertiesReads";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PageLoader } from "@/components/ui/page-loader";
import PropertySearch from "@/components/property/PropertySearch";
import { useState } from "react";
import { Property } from "@/types/property";

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { saleProperties, isLoading, error } = usePropertyRead();

  if (isLoading) {
    return <PageLoader />;
  }

  const filteredProperties = saleProperties?.filter((property: Property) =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <PropertySearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties?.map((property: Property) => (
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
            imagesUrl={Array.isArray(property.imagesId) ? property.imagesId : [property.imagesId]}
            propertyType={property.propertyType}
            status={property.status}
          />
        ))}
      </div>
    </div>
  );
};

export default Properties;