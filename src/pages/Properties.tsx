import { usePropertiesRead } from "@/hooks/staker/usePropertiesRead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAccount } from "@starknet-react/core";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function Properties() {
  const { properties, isLoading } = usePropertiesRead();
  const { address } = useAccount();

  console.log("Rendered properties:", properties);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Properties</h1>
          {address && (
            <Link to="/properties/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Button>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="text-center">Loading properties...</div>
        ) : properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(
              (property, index) =>
                property && (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>
                        {property.title ||
                          `Property ${property.id || index + 1}`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">
                          {property.description || "No description available"}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Price:</span>
                          <span>{property.price || 0} ETH</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Location:</span>
                          <span>
                            {property.location?.city || "N/A"},{" "}
                            {property.location?.state || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Bedrooms:</span>
                          <span>{property.bedrooms || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Bathrooms:</span>
                          <span>{property.bathrooms || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Area:</span>
                          <span>{property.area || 0} sq ft</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500">No properties found</div>
        )}
      </div>
    </div>
  );
}
