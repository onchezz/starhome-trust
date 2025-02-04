import { usePropertyRead } from "@/hooks/contract_interactions/usePropertiesReads";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertySearch } from "@/components/property/PropertySearch";
import { PageLoader } from "@/components/ui/page-loader";

const Properties = () => {
  const { saleProperties, isLoading, error } = usePropertyRead();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    console.error("Error loading properties:", error);
    return <div>Error loading properties</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <PropertySearch />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {saleProperties?.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default Properties;