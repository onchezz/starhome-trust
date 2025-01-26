import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PropertyShimmerCard } from "@/components/ui/shimmer-cards";
import { usePropertyRead } from "@/hooks/contract_interactions/usePropertyRead";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import { shortString } from "starknet";

const Properties = () => {
  // const [properties] = usePropertyRead();
  const { properties } = usePropertyRead();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priceRange: [0, 15000000],
    bedrooms: "any",
    bathrooms: "any",
    propertyType: "any",
  });
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // if (error) {
  //   return (
  //     <div className="p-4 text-red-500">
  //       Error loading properties: {error.message}
  //     </div>
  //   );
  // }
  const [isLoading, setIsLoading] = useState(true);
  // const { properties, isLoading: propertiesLoading } = usePropertyRead();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* <Navbar /> */}
      <div className="container mx-auto py-24">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <PropertyShimmerCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(
              (property: Property) => (
                console.log(`
                  
                title  ${shortString.decodeShortString(property.title)}
                country  ${shortString.decodeShortString(property.country)}
               city   ${shortString.decodeShortString(property.city)}
              address  ${shortString.decodeShortString(
                property.location_address
              )}
                cur  ${shortString.decodeShortString(property.currency)}
              price     ${Number(property.price)}
               area     ${Number(property.area)}
                 id   ${BigInt(property.id)}
                  beds  ${Number(property.bedrooms)}
                    
                    `),
                (
                  <Card key={property.id}>
                    <CardHeader>
                      <CardTitle>{property.title}</CardTitle>
                      <CardDescription>{property.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price</span>
                        <span className="font-semibold">
                          {formatPrice(property.price)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size</span>
                        <span className="font-semibold">
                          {property.area} sq ft
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )
              )
            )}
          </div>
        )}
      </div>
      {/* <Button onClick={() => console.log(result)}>Get items</Button> */}

      {/* <PropertyList /> */}
    </div>
  );
};

export default Properties;

// import { usePropertyRead } from "../hooks/usePropertyRead";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// const PropertyList = () => {
//   // const { saleProperties, isLoading, error } = usePropertyRead();

//   // const property = parseStarknetProperty(saleProperties as string[]);
//   // console.log(property);

//   if (error) {
//     return (
//       <div className="p-4 text-red-500">
//         Error loading properties: {error.message}
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   const renderPropertyCard = (property: Property) => (
//     <Card key={property.id} className="mb-4">
//       <CardHeader>
//         <CardTitle>{property.title}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <p className="text-sm text-gray-500">Price</p>
//             <p className="font-medium">{property.price} ETH</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Location</p>
//             <p className="font-medium">{property.location_address}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Size</p>
//             <p className="font-medium">{property.area} sq ft</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Status</p>
//             <p className="font-medium">{property.status}</p>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <div className="container mx-auto p-4">
//       <div className="mb-8">
//         <h2 className="text-2xl font-bold mb-4">Properties for Sale</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {/* {saleProperties.map(renderPropertyCard)} */}
//           {/* renderPropertyCard */}
//         </div>
//       </div>

//       {/* <div>
//         <h2 className="text-2xl font-bold mb-4">Investment Properties</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {investmentProperties?.map(renderPropertyCard)}
//         </div>
//       </div> */}
//     </div>
//   );
// };
// function parseStarknetProperty(arg0: string[]) {
//   throw new Error("Function not implemented.");
// }
