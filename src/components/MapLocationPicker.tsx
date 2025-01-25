/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import useSearchLoacation from "@/hooks/useSearchLocation";

// Set your Mapbox token here
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface MapPickerProps {
  onLocationSelect: (location: {
    latitude: string;
    longitude: string;
    address: string;
    city: string;
    state: string;
    country: string;
  }) => void;
  initialLocation?: {
    latitude: string;
    longitude: string;
  };
}

const MapLocationPicker: React.FC<MapPickerProps> = ({
  onLocationSelect,
  initialLocation,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  // const [isSearching, setIsSearching] = useState(false);

  const defaultCenter: [number, number] = initialLocation
    ? [
        parseFloat(initialLocation.longitude),
        parseFloat(initialLocation.latitude),
      ]
    : [-73.935242, 40.73061]; // Default to New York

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: defaultCenter,
      zoom: 13,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Initialize marker
    marker.current = new mapboxgl.Marker({
      draggable: true,
    });

    if (initialLocation) {
      marker.current.setLngLat(defaultCenter).addTo(map.current);
    }

    // Add click handler
    map.current.on("click", handleMapClick);

    // Add marker dragend handler
    marker.current.on("dragend", () => {
      const lngLat = marker.current?.getLngLat();
      if (lngLat) {
        handleCoordinateSelect(lngLat);
      }
    });

    return () => {
      marker.current?.remove();
      map.current?.remove();
    };
  }, []);

  const handleMapClick = (
    e: mapboxgl.MapMouseEvent & { lngLat: mapboxgl.LngLat }
  ) => {
    handleCoordinateSelect(e.lngLat);
  };

  const handleCoordinateSelect = async (lngLat: mapboxgl.LngLat) => {
    if (!map.current || !marker.current) return;

    // Update marker position
    marker.current.setLngLat(lngLat).addTo(map.current);

    // Reverse geocode the coordinates
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}`
      );

      if (!response.ok) throw new Error("Geocoding failed");

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const context = feature.context || [];

        // Extract address components
        const address = feature.place_name;
        const city =
          context.find((c: any) => c.id.startsWith("place"))?.text || "";
        const state =
          context.find((c: any) => c.id.startsWith("region"))?.text || "";
        const country =
          context.find((c: any) => c.id.startsWith("country"))?.text || "";

        onLocationSelect({
          latitude: lngLat.lat.toString(),
          longitude: lngLat.lng.toString(),
          address,
          city,
          state,
          country,
        });
      }
    } catch (error) {
      console.error("Error getting location details:", error);
      toast.error("Failed to get location details");
    }
  };

  const { isSearching, searchQuery, setSearchQuery } = useSearchLoacation(
    map,
    marker,
    handleCoordinateSelect
  );
  const [searchLocation, setSearchLocation] = useState(searchQuery);
  const searchPlace = () => {
    setSearchQuery(searchLocation);
  };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchPlace}
          placeholder="Search for a location..."
          className="flex"
        />
        <Button onClick={searchPlace} disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      <div
        ref={mapContainer}
        className="h-96 rounded-lg overflow-hidden border border-gray-200"
      />

      <p className="text-sm text-gray-500">
        Click on the map to select a location or drag the marker to adjust
        position
      </p>
    </div>
  );
};

export default MapLocationPicker;
// export default ;
