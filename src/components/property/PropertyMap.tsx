import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface PropertyMapProps {
  location: string;
}

export const PropertyMap = ({ location }: PropertyMapProps) => {
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHM0Z3B2NW0wMWF2MmpxcGlqbHd4YmF2In0.Sn9qrKc7pZUj8VZ6HPoRDg';
    
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-118.2437, 34.0522],
      zoom: 12
    });

    setMapInstance(map);

    return () => {
      map.remove();
    };
  }, [location]);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Location</h2>
      <div id="map" className="h-[400px] rounded-lg"></div>
    </Card>
  );
};