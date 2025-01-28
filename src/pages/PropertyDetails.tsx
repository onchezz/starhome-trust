import { useParams } from "react-router-dom";
import { useState } from "react";
import { PropertyHero } from "@/components/property/PropertyHero";
import { PropertyMap } from "@/components/property/PropertyMap";
import { PropertyInvestment } from "@/components/property/PropertyInvestment";
import { PropertySchedule } from "@/components/property/PropertySchedule";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyAbout } from "@/components/property/PropertyAbout";
import { SimilarProperties } from "@/components/property/SimilarProperties";
import { usePropertyReadById } from "@/hooks/contract_interactions/usePropertiesReads";
import { useUserReadByAddress } from "@/hooks/contract_interactions/useUserRead";
import { PageLoader } from "@/components/ui/page-loader";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  console.log("Property ID:", id);
  const { property, isLoading, error } = usePropertyReadById(id || "");
  const { user: agent, isLoading: isLoadingAgent } = useUserReadByAddress(
    property?.agentId || ""
  );

  const handleCopyAddress = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Address copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy address");
    }
  };

  if (isLoading || isLoadingAgent) {
    return <PageLoader />;
  }

  if (error || !property) {
    console.error("Error loading property:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Property</h2>
          <p className="text-gray-600">
            Unable to load property details. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const features = property.featuresId
    ? property.featuresId.toString().split(",").filter(Boolean)
    : [];

  const dateListed = property.dateListed
    ? new Date(property.dateListed * 1000).toISOString()
    : new Date().toISOString();

  const imageUrl = property.imagesId || "/placeholder.svg";

  return (
    <div className="min-h-screen bg-background">
      <PropertyHero
        title={property.title.toString()}
        location={`${property.locationAddress}, ${property.city}, ${property.state}`}
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
              parkingSpaces={Number(property.parkingSpaces)}
              area={Number(property.area)}
              dateListed={dateListed}
              propertyType={property.propertyType.toString()}
              status={property.status.toString()}
              interestedClients={Number(property.interestedClients)}
            />

            {agent && (
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Agent Information</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span> {agent.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {agent.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span> {agent.phone}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Agent Address:</span>
                    <span className="text-sm font-mono">{agent.id}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyAddress(agent.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <PropertyMap
              location={{
                latitude: Number(property.latitude),
                longitude: Number(property.longitude),
                address: property.locationAddress.toString(),
                city: property.city.toString(),
                state: property.state.toString(),
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