import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface PropertyFiltersProps {
  onFilterChange: (filters: {
    priceRange: number[];
    bedrooms: string;
    bathrooms: string;
    propertyType: string;
  }) => void;
}

export const PropertyFilters = ({ onFilterChange }: PropertyFiltersProps) => {
  const [priceRange, setPriceRange] = useState([0, 15000000]);
  const [bedrooms, setBedrooms] = useState("any");
  const [bathrooms, setBathrooms] = useState("any");
  const [propertyType, setPropertyType] = useState("any");

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
    updateFilters({ priceRange: value });
  };

  const handleBedroomsChange = (value: string) => {
    setBedrooms(value);
    updateFilters({ bedrooms: value });
  };

  const handleBathroomsChange = (value: string) => {
    setBathrooms(value);
    updateFilters({ bathrooms: value });
  };

  const handlePropertyTypeChange = (value: string) => {
    setPropertyType(value);
    updateFilters({ propertyType: value });
  };

  const updateFilters = (updatedValues: Partial<{
    priceRange: number[];
    bedrooms: string;
    bathrooms: string;
    propertyType: string;
  }>) => {
    onFilterChange({
      priceRange: updatedValues.priceRange || priceRange,
      bedrooms: updatedValues.bedrooms || bedrooms,
      bathrooms: updatedValues.bathrooms || bathrooms,
      propertyType: updatedValues.propertyType || propertyType,
    });
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="space-y-8">
          <div className="space-y-4">
            <Label>Price Range</Label>
            <Slider
              defaultValue={[0, 15000000]}
              max={15000000}
              step={100000}
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              className="mt-2"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Bedrooms</Label>
            <Select value={bedrooms} onValueChange={handleBedroomsChange}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Bathrooms</Label>
            <Select value={bathrooms} onValueChange={handleBathroomsChange}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Property Type</Label>
            <RadioGroup value={propertyType} onValueChange={handlePropertyTypeChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="any" />
                <Label htmlFor="any">Any</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Commercial" id="commercial" />
                <Label htmlFor="commercial">Commercial</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Residential" id="residential" />
                <Label htmlFor="residential">Residential</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Mixed-Use" id="mixed-use" />
                <Label htmlFor="mixed-use">Mixed-Use</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </Card>
  );
};