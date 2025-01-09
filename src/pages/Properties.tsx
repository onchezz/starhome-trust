import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/Navbar";

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  imageUrl: string;
}

const properties: Property[] = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    location: "123 Downtown Ave, Los Angeles",
    price: 750000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
  },
  {
    id: 2,
    title: "Luxury Beach House",
    location: "456 Ocean Drive, Miami",
    price: 1500000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2800,
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
  },
  {
    id: 3,
    title: "Suburban Family Home",
    location: "789 Maple Street, Seattle",
    price: 950000,
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 2200,
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
  }
];

const Properties = () => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-24">
        <h1 className="text-4xl font-bold mb-8 text-center">Available Properties</h1>
        <ScrollArea className="h-[800px] w-full rounded-md border p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>{property.title}</CardTitle>
                  <CardDescription>{property.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(property.price)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-semibold">{property.bedrooms}</p>
                      <p className="text-muted-foreground">Beds</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{property.bathrooms}</p>
                      <p className="text-muted-foreground">Baths</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{property.sqft}</p>
                      <p className="text-muted-foreground">Sq Ft</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md">
                    View Details
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Properties;