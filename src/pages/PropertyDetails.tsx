import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import propertiesData from "@/data/properties.json";
import { PropertyHero } from "@/components/property/PropertyHero";
import { PropertyMap } from "@/components/property/PropertyMap";
import { PropertyInvestment } from "@/components/property/PropertyInvestment";
import { PropertySchedule } from "@/components/property/PropertySchedule";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyAbout } from "@/components/property/PropertyAbout";
import { SimilarProperties } from "@/components/property/SimilarProperties";

interface Property {
  id: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  price: number;
  askingPrice: number;
  features: string[];
  images: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
    profileImage: string;
  };
  dateListed: string;
  propertyType: string;
  status: string;
  interestedClients: number;
  annualGrowthRate: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
}

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const foundProperty = propertiesData.properties.find(
      (p) => p.id === id
    );
    if (foundProperty) {
      setProperty(foundProperty as Property);
    }
  }, [id]);

  if (!property) {
    return <div>Loading...</div>;
  }

  const formattedLocation = `${property.location.address}, ${property.location.city}, ${property.location.state}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <PropertyHero 
        title={property.title}
        location={formattedLocation}
        images={property.images}
        totalInvestment={property.price}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <PropertyAbout 
              description={property.description}
              features={property.features}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              parkingSpaces={property.parkingSpaces}
              area={property.area}
              dateListed={property.dateListed}
              propertyType={property.propertyType}
              status={property.status}
              interestedClients={property.interestedClients}
            />

            <PropertyMap location={property.location} />
            
            <PropertyGallery 
              images={property.images}
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

      {/* Image Modal */}
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