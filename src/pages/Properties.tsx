import { usePropertyRead } from "@/hooks/contract_interactions/usePropertiesReads";
import PropertyCard from "@/components/property/PropertyCard";
import { PageLoader } from "@/components/ui/page-loader";
import PropertySearch from "@/components/property/PropertySearch";
import { useState } from "react";

const Properties = () => {
  const { saleProperties, isLoading, error } = usePropertyRead();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) return <PageLoader />;
  if (error) return <div>Error loading properties</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Properties</h1>
      
      <PropertySearch 
        searchTerm={searchTerm}
        onSearchChange={(value) => setSearchTerm(value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {saleProperties?.map((property) => (
          <PropertyCard 
            key={property.id} 
            propertyData={property}
          />
        ))}
      </div>
    </div>
  );
};

export default Properties;