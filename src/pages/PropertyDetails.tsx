import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PropertyHero } from "@/components/property/PropertyHero";
import { PropertyMap } from "@/components/property/PropertyMap";
import { PropertyInvestment } from "@/components/property/PropertyInvestment";
import { PropertySchedule } from "@/components/property/PropertySchedule";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyAbout } from "@/components/property/PropertyAbout";
import { SimilarProperties } from "@/components/property/SimilarProperties";
import { usePropertyReadById } from "@/hooks/contract_interactions/usePropertiesReads";
import { useUserReadByAddress } from "@/hooks/contract_interactions/useUserRead";
import { Copy, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { parseImagesData } from "@/utils/imageUtils";
import { useProperty } from "@/hooks/useProperty";
import { usePropertyWrite } from "@/hooks/contract_interactions/usePropertiesWrite";
import { Property } from "@/types/property";

const PropertyDetailsShimmer = () => {
  return (
    <div className="min-h-screen bg-background animate-pulse container mx-auto pt-24 px-4">
      <div className="h-[400px] bg-gray-200 w-full" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg p-6 h-[300px]">
              <div className="h-8 bg-gray-200 w-1/3 mb-4 rounded" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 w-full rounded" />
                <div className="h-4 bg-gray-200 w-5/6 rounded" />
                <div className="h-4 bg-gray-200 w-4/6 rounded" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 h-[200px]">
              <div className="h-8 bg-gray-200 w-1/2 mb-4 rounded" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 w-full rounded" />
                <div className="h-4 bg-gray-200 w-3/4 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PropertyDetailsProps {
  property: Property;
  // isLoading: boolean;
  // error: string;
}

// const InvestmentDetails = ({ pro }: PropertyDetailsProps
const PropertyDetails = ({
  property,
}: // isLoading,
// error,
PropertyDetailsProps) => {
  const { id } = useParams<{ id: string }>();
  const { sendVisitPropertyRequest, contractStatus } = usePropertyWrite();
  const [tokenAddresses, setTokenAddress] = useState<string>("");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  console.log("Property ID:", id);
  // const { property, isLoading, error } = usePropertyReadById(id || "");
  const { user: agent, isLoading: isLoadingAgent } = useUserReadByAddress(
    property?.agentId || ""
  );
  // Parse images data using our utility
  const { imageUrls } = parseImagesData(property?.imagesId || "");
  console.log("Parsed image URLs:", imageUrls);
  const {
    handlePayForProperty,
    isWaitingApproval,
    isWaitingTransactionExecution,
    contractStatus: buyingStatus,
  } = useProperty(property.assetToken || "");
  const handleCopyAddress = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Address copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy address");
    }
  };

  if (isLoadingAgent) {
    return <PropertyDetailsShimmer />;
  }

  if (!property) {
    // console.error("Error loading property:", error);
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

  return (
    <div className="min-h-screen bg-background">
      <PropertyHero
        title={property.title.toString()}
        location={`${property.locationAddress}, ${property.city}, ${property.state}`}
        images={imageUrls.length > 0 ? imageUrls : ["/placeholder.svg"]}
        totalInvestment={Number(property.asking_price)}
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
                <h3 className="text-lg font-semibold mb-4">
                  Agent Information
                </h3>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={agent.profile_image} alt={agent.name} />
                    <AvatarFallback>
                      <UserRound className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 flex-1">
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
                      <span className="text-sm font-medium">
                        Agent Address:
                      </span>
                      <span className="text-sm font-mono truncate">
                        {agent.id}
                      </span>
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
              images={imageUrls.length > 0 ? imageUrls : ["/placeholder.svg"]}
              title={property.title.toString()}
              onImageClick={setSelectedImage}
            />
          </div>
          {/* <PropertyInvestment property={property} /> */}
          <div className="space-y-6">
            <PropertyInvestment
              property={property}
              handlePayForProperty={handlePayForProperty}
              isLoadingTx={isWaitingApproval || isWaitingTransactionExecution}
              status={buyingStatus}
            />
            <PropertySchedule
              property_id={property.id}
              agent_id={property.agentId}
              sendVisitPropertyRequest={sendVisitPropertyRequest}
              contractStatus={contractStatus}
            />
          </div>
        </div>

        {/* <div className="mt-12">
          <SimilarProperties currentPropertyId={property.id.toString()} />
        </div> */}
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

// export default PropertyDetails;

import { useLocation, Navigate } from "react-router-dom";
// import { InvestmentDetails } from "./InvestmentDetails";

export const PropertyDetailsPage = () => {
  const location = useLocation();
  const property = location.state?.property;

  if (!property) {
    return <Navigate to="/" replace />; // Redirect if no investment data
  }

  return <PropertyDetails property={property} />;
};
