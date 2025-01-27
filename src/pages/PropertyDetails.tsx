import { useParams } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { PropertyHero } from "@/components/property/PropertyHero";
import { PropertyMap } from "@/components/property/PropertyMap";
import { PropertyInvestment } from "@/components/property/PropertyInvestment";
import { PropertySchedule } from "@/components/property/PropertySchedule";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyAbout } from "@/components/property/PropertyAbout";
import { SimilarProperties } from "@/components/property/SimilarProperties";
import { usePropertyReadById } from "@/hooks/contract_interactions/useContractReads";
import { PageLoader } from "@/components/ui/page-loader";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const { property, isLoading, error } = usePropertyReadById(id || "");

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !property) {
    return <div>Error loading property details</div>;
  }

  // Convert features string to array
  const features = property.features_id ? property.features_id.split(',') : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PropertyHero 
        title={property.title}
        location={`${property.location_address}, ${property.city}, ${property.state}`}
        images={[property.images_id]} // Assuming images_id is the URL
        totalInvestment={property.price}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <PropertyAbout 
              description={property.description}
              features={features}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              parkingSpaces={property.parking_spaces}
              area={property.area}
              dateListed={new Date(property.date_listed * 1000).toISOString()}
              propertyType={property.property_type}
              status={property.status}
              interestedClients={property.interested_clients}
            />

            <PropertyMap 
              location={{
                latitude: Number(property.latitude),
                longitude: Number(property.longitude),
                address: property.location_address,
                city: property.city,
                state: property.state
              }} 
            />
            
            <PropertyGallery 
              images={[property.images_id]} // Assuming images_id is the URL
              title={property.title}
              onImageClick={setSelectedImage}
            />
          </div>

          <div className="space-y-6">
            <PropertyInvestment propertyId={property.id} />
            <PropertySchedule />
          </div>
        </div>

        <div className="mt-12">
          <SimilarProperties currentPropertyId={property.id} />
        </div>
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full">
            <img
              src={selectedImage}
              alt="Property view"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;