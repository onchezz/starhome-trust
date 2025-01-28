import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from "sonner";

interface PropertyMapProps {
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
  };
}

export const PropertyMap = ({ location }: PropertyMapProps) => {
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    // Validate coordinates
    const lat = Number(location.latitude);
    const lng = Number(location.longitude);

    console.log("Map coordinates:", { lat, lng });

    // Check if coordinates are valid
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      console.error("Invalid coordinates:", { lat, lng });
      toast.error("Invalid location coordinates");
      return;
    }

    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHM0Z3B2NW0wMWF2MmpxcGlqbHd4YmF2In0.Sn9qrKc7pZUj8VZ6HPoRDg';
    
    try {
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        center: [lng, lat],
        zoom: 12
      });

      // Add marker at property location
      new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map);

      setMapInstance(map);

      return () => {
        map.remove();
      };
    } catch (error) {
      console.error("Error initializing map:", error);
      toast.error("Failed to load map");
    }
  }, [location]);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Location</h2>
      <div className="mb-4">
        <p className="text-gray-600">{location.address}</p>
        <p className="text-gray-600">{location.city}, {location.state}</p>
      </div>
      <div id="map" className="h-[400px] rounded-lg"></div>
    </Card>
  );
};