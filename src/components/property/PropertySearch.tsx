import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface PropertySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const PropertySearch = ({ searchTerm, onSearchChange }: PropertySearchProps) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Search properties by title or location..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default PropertySearch;