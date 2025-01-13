import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// This would typically come from an API/database
const propertyDetails = {
  id: 1,
  title: "Modern Downtown Apartment",
  location: "123 Downtown Ave, Los Angeles",
  price: 750000,
  bedrooms: 2,
  bathrooms: 2,
  sqft: 1200,
  description: "Luxurious modern apartment in the heart of downtown, featuring high-end finishes, floor-to-ceiling windows, and stunning city views. The open-concept layout creates a seamless flow between living spaces.",
  features: [
    "Floor-to-ceiling windows",
    "Gourmet kitchen",
    "Hardwood floors",
    "Central air conditioning",
    "In-unit laundry",
    "24/7 security"
  ],
  images: [
    "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    "https://images.unsplash.com/photo-1466721591366-2d5fba72006d",
    "https://images.unsplash.com/photo-1493962853295-0fd70327578a"
  ],
  coordinates: [-118.2437, 34.0522] as [number, number] // Type assertion to ensure it's a tuple
};

const PropertyDetails = () => {
  const { id } = useParams();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { address } = useAccount();
  const [investmentAmount, setInvestmentAmount] = useState("");

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHM0Z3B2NW0wMWF2MmpxcGlqbHd4YmF2In0.Sn9qrKc7pZUj8VZ6HPoRDg';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: propertyDetails.coordinates,
      zoom: 12
    });

    new mapboxgl.Marker()
      .setLngLat(propertyDetails.coordinates)
      .addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleBuyNow = () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }
    toast.success("Purchase initiated");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {propertyDetails.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Property view ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            <Card className="p-6">
              <h1 className="text-3xl font-bold mb-2">{propertyDetails.title}</h1>
              <p className="text-gray-600 mb-4">{propertyDetails.location}</p>
              <p className="text-4xl font-bold text-primary mb-6">
                {formatPrice(propertyDetails.price)}
              </p>

              <Button 
                onClick={handleBuyNow} 
                className="w-full mb-6"
                size="lg"
              >
                Buy Now
              </Button>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-100 rounded-lg">
                  <p className="font-semibold">{propertyDetails.bedrooms}</p>
                  <p className="text-gray-600">Bedrooms</p>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded-lg">
                  <p className="font-semibold">{propertyDetails.bathrooms}</p>
                  <p className="text-gray-600">Bathrooms</p>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded-lg">
                  <p className="font-semibold">{propertyDetails.sqft}</p>
                  <p className="text-gray-600">Sq Ft</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{propertyDetails.description}</p>

              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <ul className="grid grid-cols-2 gap-2">
                {propertyDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Map */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div ref={mapContainer} className="w-full h-[300px] rounded-lg" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
