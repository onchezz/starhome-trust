import React, { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Property } from "@/types/property";
import { Loader2 } from "lucide-react";
import MapLocationPicker from "@/components/MapLocationPicker";
import ErrorBoundary from "@/components/errrorBoundary";

interface PropertyLocationProps {
  formData: Partial<Property>;
  handleInputChange: (field: keyof Property, value: any) => void;
  handleLocationSelect: (location: {
    latitude: string;
    longitude: string;
    address: string;
    city: string;
    state: string;
    country: string;
  }) => void;
  isLocationLoading: boolean;
}

const PropertyLocation = ({
  formData,
  handleLocationSelect,
  isLocationLoading,
}: PropertyLocationProps) => {
  return (
    <div className="rounded-lg bg-white/40 backdrop-blur-sm p-6 space-y-6 animate-fade-in delay-300">
      <h3 className="text-lg font-semibold text-gray-900">Location Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Address</Label>
          <Input
            required
            value={formData.location_address || ""}
            disabled
            placeholder="Select location on map"
          />
        </div>

        <div className="space-y-2">
          <Label>City</Label>
          <Input
            disabled
            value={formData.city || ""}
            placeholder="City will be set automatically"
          />
        </div>

        <div className="space-y-2">
          <Label>State</Label>
          <Input
            disabled
            value={formData.state || ""}
            placeholder="State will be set automatically"
          />
        </div>

        <div className="space-y-2">
          <Label>Country</Label>
          <Input
            disabled
            value={formData.country || ""}
            placeholder="Country will be set automatically"
          />
        </div>
      </div>

      <div className="mt-6">
        <Suspense
          fallback={
            <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto" />
                <p className="text-sm text-gray-500">Loading Map...</p>
              </div>
            </div>
          }
        >
          <ErrorBoundary
            fallback={
              <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-sm text-red-500">Error loading map. Please try again.</p>
              </div>
            }
          >
            <MapLocationPicker
              onLocationSelect={handleLocationSelect}
              initialLocation={
                formData.latitude && formData.longitude
                  ? {
                      latitude: formData.latitude.toString(),
                      longitude: formData.longitude.toString(),
                    }
                  : undefined
              }
            />
          </ErrorBoundary>
        </Suspense>
      </div>
    </div>
  );
};

export default PropertyLocation;