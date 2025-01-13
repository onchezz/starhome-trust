import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Bed, Bath, Car, Maximize, MapPin, Calendar, Share2, BookmarkPlus, Phone } from "lucide-react";
import { toast } from "sonner";
import propertiesData from "@/data/properties.json";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Property {
  id: number;
  title: string;
  location: string;
  totalInvestment: number;
  currentInvestment: number;
  investors: number;
  minInvestment: number;
  roi: string;
  type: string;
  images: string[];
  description: string;
}

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    // Find the property based on the ID
    const foundProperty = propertiesData.properties.find(
      (p) => p.id === Number(id)
    );
    if (foundProperty) {
      setProperty(foundProperty);
    }
  }, [id]);

  useEffect(() => {
    if (!property) return;

    // Initialize Mapbox map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHM0Z3B2NW0wMWF2MmpxcGlqbHd4YmF2In0.Sn9qrKc7pZUj8VZ6HPoRDg';
    
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-118.2437, 34.0522], // Default to LA coordinates
      zoom: 12
    });

    setMapInstance(map);

    return () => {
      map.remove();
    };
  }, [property]);

  const handleScheduleViewing = () => {
    toast.success("Viewing request sent successfully!");
  };

  const handleShare = () => {
    toast.success("Share options opened!");
  };

  const handleSave = () => {
    toast.success("Property saved to favorites!");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section with Carousel */}
      <div className="container mx-auto pt-24 px-4">
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {property.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-[16/9]">
                    <img
                      src={image}
                      alt={`${property.title} - View ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="secondary" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={handleSave}>
              <BookmarkPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Property Header */}
        <div className="mt-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {formatPrice(property.totalInvestment)}
              </div>
              <div className="text-sm text-gray-600">Investment Required</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Features */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Property Highlights</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-semibold">4</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-semibold">3</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-semibold">2</div>
                    <div className="text-sm text-gray-600">Parking</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-semibold">2,500</div>
                    <div className="text-sm text-gray-600">Sq Ft</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">About This Property</h2>
              <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
            </Card>

            {/* Location Map */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div id="map" className="h-[400px] rounded-lg"></div>
            </Card>
          </div>

          {/* Right Column - Contact and Investment */}
          <div className="space-y-8">
            {/* Investment Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Investment Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum Investment</span>
                  <span className="font-semibold">{formatPrice(property.minInvestment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Investors</span>
                  <span className="font-semibold">{property.investors}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected ROI</span>
                  <span className="font-semibold text-green-600">{property.roi}</span>
                </div>
                <Button className="w-full" size="lg">
                  Invest Now
                </Button>
              </div>
            </Card>

            {/* Schedule Viewing */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Schedule a Viewing</h2>
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                  onClick={handleScheduleViewing}
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Tour
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Contact Agent
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Similar Properties */}
        <div className="my-12">
          <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {propertiesData.properties
              .filter(p => p.id !== property.id)
              .slice(0, 3)
              .map(similarProperty => (
                <Card key={similarProperty.id} className="overflow-hidden">
                  <img
                    src={similarProperty.images[0]}
                    alt={similarProperty.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">{similarProperty.title}</h3>
                    <p className="text-sm text-gray-600">{similarProperty.location}</p>
                    <div className="mt-2 font-bold text-primary">
                      {formatPrice(similarProperty.totalInvestment)}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;