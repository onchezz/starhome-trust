import { Card } from "@/components/ui/card";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  onImageClick: (image: string) => void;
}

export const PropertyGallery = ({ images, title, onImageClick }: PropertyGalleryProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Property Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="aspect-square relative cursor-pointer overflow-hidden rounded-lg"
            onClick={() => onImageClick(image)}
          >
            <img
              src={image}
              alt={`${title} - View ${index + 1}`}
              className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </Card>
  );
};