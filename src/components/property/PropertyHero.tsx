import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Share2, BookmarkPlus } from "lucide-react";
import { toast } from "sonner";

interface PropertyHeroProps {
  title: string;
  location: string;
  images: string[];
  totalInvestment: number;
}

export const PropertyHero = ({ title, location, images, totalInvestment }: PropertyHeroProps) => {
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

  return (
    <div className="container mx-auto pt-24 px-4">
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-[16/9]">
                  <img
                    src={image}
                    alt={`${title} - View ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="secondary" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" onClick={handleSave}>
            <BookmarkPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <span>{location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {formatPrice(totalInvestment)}
            </div>
            <div className="text-sm text-gray-600">Investment Required</div>
          </div>
        </div>
      </div>
    </div>
  );
};