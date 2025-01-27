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
  
  console.log("Property ID:", id); // Debug log
  const { property, isLoading, error } = usePropertyReadById(id || "");
  console.log("Property data:", property); // Debug log

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !property) {
    console.error("Error loading property:", error);
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Error Loading Property</h2>
        <p className="text-gray-600">Unable to load property details. Please try again later.</p>
      </div>
    </div>;
  }

  // Convert features string to array and ensure it's not empty
  const features = property.features_id ? property.features_id.toString().split(',').filter(Boolean) : [];
  
  // Ensure we have a valid date
  const dateListed = property.date_listed ? new Date(property.date_listed * 1000).toISOString() : new Date().toISOString();

  // Ensure we have a valid image URL
  const imageUrl = property.images_id || '/placeholder.svg';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PropertyHero 
        title={property.title.toString()}
        location={`${property.location_address}, ${property.city}, ${property.state}`}
        images={[imageUrl]}
        totalInvestment={Number(property.price)}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <PropertyAbout 
              description={property.description.toString()}
              features={features}
              bedrooms={Number(property.bedrooms)}
              bathrooms={Number(property.bathrooms)}
              parkingSpaces={Number(property.parking_spaces)}
              area={Number(property.area)}
              dateListed={dateListed}
              propertyType={property.property_type.toString()}
              status={property.status.toString()}
              interestedClients={Number(property.interested_clients)}
            />

            <PropertyMap 
              location={{
                latitude: Number(property.latitude),
                longitude: Number(property.longitude),
                address: property.location_address.toString(),
                city: property.city.toString(),
                state: property.state.toString()
              }} 
            />
            
            <PropertyGallery 
              images={[imageUrl]}
              title={property.title.toString()}
              onImageClick={setSelectedImage}
            />
          </div>

          <div className="space-y-6">
            <PropertyInvestment propertyId={property.id.toString()} />
            <PropertySchedule />
          </div>
        </div>

        <div className="mt-12">
          <SimilarProperties currentPropertyId={property.id.toString()} />
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