import React from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { PropertySearch } from "@/components/property/PropertySearch";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Filter, Search } from "lucide-react";
import propertiesData from "@/data/properties.json";
import { useEffect, useState } from "react";
import { usePropertyRead } from "@/hooks/contract_interactions/usePropertyRead";
import { Property } from "@/types/property";

const Properties = () => {
  // const [properties] = usePropertyRead();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priceRange: [0, 15000000],
    bedrooms: "any",
    bathrooms: "any",
    propertyType: "any",
  });
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [contract_properties, setProperties] = useState([]);
  // useEffect(() => {
  //   properties.map((property) => {});
  //   setProperties(properties);
  //   console.log("Properties:", properties);
  //   console.log("Investment Properties:", investmentProperties);
  // }, [properties, investmentProperties]);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const filteredProperties = propertiesData.properties.filter((property) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      property.title.toLowerCase().includes(searchLower) ||
      `${property.location.city}, ${property.location.state}`
        .toLowerCase()
        .includes(searchLower);

    const matchesPrice =
      property.price >= filters.priceRange[0] &&
      property.price <= filters.priceRange[1];

    const matchesBedrooms =
      filters.bedrooms === "any" ||
      property.bedrooms?.toString() === filters.bedrooms;

    const matchesBathrooms =
      filters.bathrooms === "any" ||
      property.bathrooms?.toString() === filters.bathrooms;

    const matchesType =
      filters.propertyType === "any" ||
      property.propertyType === filters.propertyType;

    return (
      matchesSearch &&
      matchesPrice &&
      matchesBedrooms &&
      matchesBathrooms &&
      matchesType
    );
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-24">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Available Properties
        </h1>

        {/* Mobile Search and Filter Buttons */}
        <div className="md:hidden flex gap-2 mb-4">
          <Button
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-4 w-4" />
            Search
            {showSearch ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
            {showFilters ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Search Bar - Desktop always visible, Mobile collapsible */}
        <div className={`md:block ${showSearch ? "block" : "hidden"}`}>
          <PropertySearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop always visible, Mobile collapsible */}
          <div
            className={`md:block md:w-80 md:flex-shrink-0 ${
              showFilters ? "block" : "hidden"
            }`}
          >
            <PropertyFilters onFilterChange={setFilters} />
          </div>

          <ScrollArea className="h-[800px] w-full rounded-md border p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden relative">
                  <Badge
                    variant="secondary"
                    className="absolute top-4 right-4 bg-green-500 text-white hover:bg-green-600"
                  >
                    {property.status}
                  </Badge>
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <CardTitle>{property.title}</CardTitle>
                    <CardDescription>
                      {property.location.city}, {property.location.state}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(property.price)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-semibold">
                          {property.interestedClients}
                        </p>
                        <p className="text-muted-foreground">
                          Interested Clients
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">
                          {property.annualGrowthRate}%
                        </p>
                        <p className="text-muted-foreground">Annual Growth</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/properties/${property.id}`} className="w-full">
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
      <PropertyList />
    </div>
  );
};

export default Properties;

// import { usePropertyRead } from "../hooks/usePropertyRead";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PropertyList = () => {
  const { properties, isLoading, error } = usePropertyRead();

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading properties: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const renderPropertyCard = (property: Property) => (
    <Card key={property.id} className="mb-4">
      <CardHeader>
        <CardTitle>{property.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="font-medium">{property.price} ETH</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{property.location_address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Size</p>
            <p className="font-medium">{property.area} sq ft</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium">{property.status}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Properties for Sale</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map(renderPropertyCard)}
          {/* renderPropertyCard */}
        </div>
      </div>

      {/* <div>
        <h2 className="text-2xl font-bold mb-4">Investment Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {investmentProperties?.map(renderPropertyCard)}
        </div>
      </div> */}
    </div>
  );
};
