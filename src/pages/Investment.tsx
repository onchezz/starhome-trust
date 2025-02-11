import React, { useState, useEffect, Dispatch, SetStateAction, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Building, 
  Users, 
  TrendingUp, 
  DollarSign,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { InvestmentCard } from "@/components/investment/InvestmentCard";
import { EmptyInvestmentState } from "@/components/investment/EmptyInvestmentState";
import InvestmentPageShimmer from "@/components/investment/InvestmentPageLoader";
import { useAccount } from "@starknet-react/core";
import { useInvestmentAssetsRead } from "@/hooks/contract_interactions/useInvestmentReads";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { formatCurrency } from "@/utils/utils";

interface FilterState {
  propertyType: string;
  minInvestment: number;
  minROI: number;
  location: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  className?: string;
  availableLocations: string[];
  availablePropertyTypes: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  filters, 
  setFilters, 
  className = '',
  availableLocations, 
  availablePropertyTypes
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-2">
        <Label>Property Type</Label>
        <Select
          value={filters.propertyType}
          onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {availablePropertyTypes.map((type) => (
              <SelectItem key={type} value={type.toLowerCase()}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Min Investment</Label>
        <div className="pt-2">
          <Slider
            defaultValue={[filters.minInvestment]}
            max={1000000}
            step={1000}
            onValueChange={(value) => setFilters({ ...filters, minInvestment: value[0] })}
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>$0</span>
            <span>${filters.minInvestment.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Min ROI</Label>
        <div className="pt-2">
          <Slider
            defaultValue={[filters.minROI]}
            max={20}
            step={0.5}
            onValueChange={(value) => setFilters({ ...filters, minROI: value[0] })}
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>0%</span>
            <span>{filters.minROI}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <Select
          value={filters.location}
          onValueChange={(value) => setFilters({ ...filters, location: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {availableLocations.map((location) => (
              <SelectItem key={location} value={location.toLowerCase()}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        className="w-full"
        variant="outline"
        onClick={() => {
          setFilters({
            propertyType: 'all',
            minInvestment: 0,
            minROI: 0,
            location: 'all'
          });
        }}
      >
        Reset Filters
      </Button>
    </div>
  );
};

export const Investment = () => {
  const { address } = useAccount();
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const { investmentProperties, isLoading, error } = useInvestmentAssetsRead();
  const { connectWallet } = useWalletConnect();
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    propertyType: "all",
    minInvestment: 0,
    minROI: 0,
    location: "all"
  });

  // Get unique locations and property types from properties
  const { availableLocations, availablePropertyTypes } = useMemo(() => {
    if (!investmentProperties) return { availableLocations: [], availablePropertyTypes: [] };
    
    const locations = new Set(
      investmentProperties.map(property => property.location.country)
    );
    
    const propertyTypes = new Set(
      investmentProperties.map(property => property.investment_type)
    );
    
    return {
      availableLocations: Array.from(locations).sort(),
      availablePropertyTypes: Array.from(propertyTypes).sort()
    };
  }, [investmentProperties]);

  // Filter properties based on search and filters
  const filteredProperties = investmentProperties?.filter(property => {
    // Search query filter
    const searchMatch = 
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.country.toLowerCase().includes(searchQuery.toLowerCase());

    // Property type filter
    const typeMatch = 
      filters.propertyType === "all" || 
      property.investment_type.toLowerCase() === filters.propertyType.toLowerCase();

    // Investment amount filter
    const investmentMatch = 
      property.min_investment_amount >= filters.minInvestment;

    // ROI filter
    const roiMatch = 
     Number( property.expected_roi) >= filters.minROI;

    // Location filter
    const locationMatch =
      filters.location === "all" ||
      property.location.country.toLowerCase().includes(filters.location.toLowerCase());

    return searchMatch && typeMatch && investmentMatch && roiMatch && locationMatch;
  }) || [];

  if (isLoading) {
    return <InvestmentPageShimmer />;
  }

  if (error) {
    console.error("Error loading investments:", error);
    return <div>Error loading investments</div>;
  }

  if (!investmentProperties?.length) {
    return <EmptyInvestmentState />;
  }

  // Calculate stats based on filtered properties
  const totalStats = {
    totalInvestors: filteredProperties.reduce(
      (acc, property) => acc + Number(property.investors || 0),
      0
    ),
    averageROI: filteredProperties.reduce(
      (acc, property) => acc + Number(property.expected_roi || 0),
      0
    ),
    totalInvestment: filteredProperties.reduce(
      (acc, property) => acc + Number(property.asset_value || 0),
      0
    ),
  };

  const averageROI = filteredProperties.length
    ? (totalStats.averageROI / filteredProperties.length).toFixed(1)
    : "0";

  return (
    <div className="flex min-h-screen bg-background pt-20"> {/* Added pt-20 for navbar spacing */}
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden lg:block w-64 p-6 border-r top-20 bottom-16 left-10 px-10 overflow-y-auto "> {/* Adjusted height and added overflow */}
        <FilterSidebar 
          filters={filters} 
          setFilters={setFilters}
          availableLocations={availableLocations}
          availablePropertyTypes={availablePropertyTypes}
        />
      </div>

      <div className="flex-1 p-6 "> {/* Added lg:ml-64 to offset sidebar */}
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Properties",
              value: filteredProperties.length,
              icon: Building,
            },
            {
              title: "Total Investors",
              value: totalStats.totalInvestors,
              icon: Users,
            },
            {
              title: "Average ROI",
              value: `${averageROI}%`,
              icon: TrendingUp,
            },
            {
              title: "Total Investment",
              value: formatCurrency(totalStats.totalInvestment),
              icon: DollarSign,
            },
          ].map((stat, i) => (
            <Card
              key={stat.title}
              className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Mobile Filter */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterSidebar 
                  filters={filters}
                  setFilters={setFilters}
                  availableLocations={availableLocations} availablePropertyTypes={[]}                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <InvestmentCard
                key={property.id}
                property={property}
                expandedCardId={expandedCardId}
                setExpandedCardId={setExpandedCardId}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground">
                No properties match your search criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Investment;
// import React, { useState, useEffect, Dispatch, SetStateAction, useMemo } from 'react';
// import { 
//   Card, 
//   CardContent, 
//   CardHeader, 
//   CardTitle 
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Slider } from "@/components/ui/slider";
// import { Label } from "@/components/ui/label";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { 
//   Building, 
//   Users, 
//   TrendingUp, 
//   DollarSign,
//   Search,
//   SlidersHorizontal
// } from 'lucide-react';
// import { InvestmentCard } from "@/components/investment/InvestmentCard";
// import { EmptyInvestmentState } from "@/components/investment/EmptyInvestmentState";
// import InvestmentPageShimmer from "@/components/investment/InvestmentPageLoader";
// import { useAccount } from "@starknet-react/core";
// import { useInvestmentAssetsRead } from "@/hooks/contract_interactions/useInvestmentReads";
// import { useWalletConnect } from "@/hooks/useWalletConnect";
// import { formatCurrency } from "@/utils/utils";

// interface FilterState {
//   propertyType: string;
//   minInvestment: number;
//   minROI: number;
//   location: string;
// }

// interface FilterSidebarProps {
//   filters: FilterState;
//   setFilters: Dispatch<SetStateAction<FilterState>>;
//   className?: string;
//   availableLocations: string[];
// }

// const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
//   filters, 
//   setFilters, 
//   className = '',
//   availableLocations 
// }) => {
//   return (
//     <div className={`space-y-6 ${className}`}>
//       <div className="space-y-2">
//         <Label>Property Type</Label>
//         <Select
//           value={filters.propertyType}
//           onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Select type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Types</SelectItem>
//             <SelectItem value="residential">Residential</SelectItem>
//             <SelectItem value="commercial">Commercial</SelectItem>
//             <SelectItem value="development">Development</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="space-y-2">
//         <Label>Min Investment</Label>
//         <div className="pt-2">
//           <Slider
//             defaultValue={[filters.minInvestment]}
//             max={1000000}
//             step={1000}
//             onValueChange={(value) => setFilters({ ...filters, minInvestment: value[0] })}
//           />
//           <div className="flex justify-between mt-2 text-sm text-muted-foreground">
//             <span>$0</span>
//             <span>${filters.minInvestment.toLocaleString()}</span>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label>Min ROI</Label>
//         <div className="pt-2">
//           <Slider
//             defaultValue={[filters.minROI]}
//             max={20}
//             step={0.5}
//             onValueChange={(value) => setFilters({ ...filters, minROI: value[0] })}
//           />
//           <div className="flex justify-between mt-2 text-sm text-muted-foreground">
//             <span>0%</span>
//             <span>{filters.minROI}%</span>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label>Location</Label>
//         <Select
//           value={filters.location}
//           onValueChange={(value) => setFilters({ ...filters, location: value })}
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Select location" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Locations</SelectItem>
//             {availableLocations.map((location) => (
//               <SelectItem key={location} value={location.toLowerCase()}>
//                 {location}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       <Button 
//         className="w-full"
//         variant="outline"
//         onClick={() => {
//           setFilters({
//             propertyType: 'all',
//             minInvestment: 0,
//             minROI: 0,
//             location: 'all'
//           });
//         }}
//       >
//         Reset Filters
//       </Button>
//     </div>
//   );
// };

// export const Investment = () => {
//   const { address } = useAccount();
//   const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
//   const { investmentProperties, isLoading, error } = useInvestmentAssetsRead();
//   const { connectWallet } = useWalletConnect();
  
//   // Search and filter states
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filters, setFilters] = useState<FilterState>({
//     propertyType: "all",
//     minInvestment: 0,
//     minROI: 0,
//     location: "all"
//   });

//   // Get unique locations from properties
//   const availableLocations = useMemo(() => {
//     if (!investmentProperties) return [];
//     const locations = new Set(
//       investmentProperties.map(property => property.location.country)
//     );
//     return Array.from(locations).sort();
//   }, [investmentProperties]);

//   // Filter properties based on search and filters
//   const filteredProperties = investmentProperties?.filter(property => {
//     // Search query filter
//     const searchMatch = 
//       property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       property.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       property.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       property.location.country.toLowerCase().includes(searchQuery.toLowerCase());

//     // Property type filter
//     const typeMatch = 
//       filters.propertyType === "all" || 
//       property.investment_type.toLowerCase() === filters.propertyType.toLowerCase();

//     // Investment amount filter
//     const investmentMatch = 
//       property.min_investment_amount >= filters.minInvestment;

//     // ROI filter
//     const roiMatch = 
//       Number(property.expected_roi) >= filters.minROI;

//     // Location filter
//     const locationMatch =
//       filters.location === "all" ||
//       property.location.country.toLowerCase().includes(filters.location.toLowerCase());

//     return searchMatch && typeMatch && investmentMatch && roiMatch && locationMatch;
//   }) || [];

//   if (isLoading) {
//     return <InvestmentPageShimmer />;
//   }

//   if (error) {
//     console.error("Error loading investments:", error);
//     return <div>Error loading investments</div>;
//   }

//   if (!investmentProperties?.length) {
//     return <EmptyInvestmentState />;
//   }

//   // Calculate stats based on filtered properties
//   const totalStats = {
//     totalInvestors: filteredProperties.reduce(
//       (acc, property) => acc + Number(property.investors || 0),
//       0
//     ),
//     averageROI: filteredProperties.reduce(
//       (acc, property) => acc + Number(property.expected_roi || 0),
//       0
//     ),
//     totalInvestment: filteredProperties.reduce(
//       (acc, property) => acc + Number(property.asset_value || 0),
//       0
//     ),
//   };

//   const averageROI = filteredProperties.length
//     ? (totalStats.averageROI / filteredProperties.length).toFixed(1)
//     : "0";

//   return (
//     <div className="flex min-h-screen bg-background pt-20"> {/* Added pt-20 for navbar spacing */}
//       {/* Sidebar - Hidden on mobile */}
//       <div className="hidden lg:block w-64 p-6 border-r min-h-screen fixed top-20 left-0 bottom-20"> {/* Added top-20 */}
//         <FilterSidebar 
//           filters={filters} 
//           setFilters={setFilters}
//           availableLocations={availableLocations}
//         />
//       </div>

//       <div className="flex-1 p-6 lg:ml-64"> {/* Added lg:ml-64 to offset sidebar */}
//         {/* Stats Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {[
//             {
//               title: "Total Properties",
//               value: filteredProperties.length,
//               icon: Building,
//             },
//             {
//               title: "Total Investors",
//               value: totalStats.totalInvestors,
//               icon: Users,
//             },
//             {
//               title: "Average ROI",
//               value: `${averageROI}%`,
//               icon: TrendingUp,
//             },
//             {
//               title: "Total Investment",
//               value: formatCurrency(totalStats.totalInvestment),
//               icon: DollarSign,
//             },
//           ].map((stat, i) => (
//             <Card
//               key={stat.title}
//               className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
//             >
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   {stat.title}
//                 </CardTitle>
//                 <stat.icon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{stat.value}</div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Search and Mobile Filter */}
//         <div className="flex gap-4 mb-8">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//             <Input
//               placeholder="Search properties..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//           </div>
          
//           {/* Mobile Filter Button */}
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="outline" className="lg:hidden" size="icon">
//                 <SlidersHorizontal className="h-4 w-4" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent>
//               <SheetHeader>
//                 <SheetTitle>Filters</SheetTitle>
//               </SheetHeader>
//               <div className="mt-6">
//                 <FilterSidebar 
//                   filters={filters} 
//                   setFilters={setFilters}
//                   availableLocations={availableLocations}
//                 />
//               </div>
//             </SheetContent>
//           </Sheet>
//         </div>

//         {/* Properties Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {filteredProperties.length > 0 ? (
//             filteredProperties.map((property) => (
//               <InvestmentCard
//                 key={property.id}
//                 property={property}
//                 expandedCardId={expandedCardId}
//                 setExpandedCardId={setExpandedCardId}
//               />
//             ))
//           ) : (
//             <div className="col-span-full text-center py-12">
//               <p className="text-lg text-muted-foreground">
//                 No properties match your search criteria
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Investment;
// import React, { useState, useEffect } from 'react';
// import { 
//   Card, 
//   CardContent, 
//   CardHeader, 
//   CardTitle 
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Slider } from "@/components/ui/slider";
// import { Label } from "@/components/ui/label";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { 
//   Building, 
//   Users, 
//   TrendingUp, 
//   DollarSign,
//   Search,
//   SlidersHorizontal
// } from 'lucide-react';
// import { InvestmentCard } from "@/components/investment/InvestmentCard";
// import { EmptyInvestmentState } from "@/components/investment/EmptyInvestmentState";
// import InvestmentPageShimmer from "@/components/investment/InvestmentPageLoader";
// import { useAccount } from "@starknet-react/core";
// import { useInvestmentAssetsRead } from "@/hooks/contract_interactions/useInvestmentReads";
// import { useWalletConnect } from "@/hooks/useWalletConnect";
// import { formatCurrency } from "@/utils/utils";

// const FilterSidebar = ({ filters, setFilters, className }) => {
//   return (
//     <div className={`space-y-6 ${className}`}>
//       <div className="space-y-2">
//         <Label>Property Type</Label>
//         <Select
//           value={filters.propertyType}
//           onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Select type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Types</SelectItem>
//             <SelectItem value="residential">Residential</SelectItem>
//             <SelectItem value="commercial">Commercial</SelectItem>
//             <SelectItem value="development">Development</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="space-y-2">
//         <Label>Min Investment</Label>
//         <div className="pt-2">
//           <Slider
//             defaultValue={[filters.minInvestment]}
//             max={1000000}
//             step={1000}
//             onValueChange={(value) => setFilters({ ...filters, minInvestment: value[0] })}
//           />
//           <div className="flex justify-between mt-2 text-sm text-muted-foreground">
//             <span>$0</span>
//             <span>${filters.minInvestment.toLocaleString()}</span>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label>Min ROI</Label>
//         <div className="pt-2">
//           <Slider
//             defaultValue={[filters.minROI]}
//             max={20}
//             step={0.5}
//             onValueChange={(value) => setFilters({ ...filters, minROI: value[0] })}
//           />
//           <div className="flex justify-between mt-2 text-sm text-muted-foreground">
//             <span>0%</span>
//             <span>{filters.minROI}%</span>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label>Location</Label>
//         <Select
//           value={filters.location}
//           onValueChange={(value) => setFilters({ ...filters, location: value })}
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Select location" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Locations</SelectItem>
//             <SelectItem value="dubai">Dubai</SelectItem>
//             <SelectItem value="canada">Canada</SelectItem>
//             <SelectItem value="usa">USA</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <Button 
//         className="w-full"
//         variant="outline"
//         onClick={() => {
//           setFilters({
//             propertyType: 'all',
//             minInvestment: 0,
//             minROI: 0,
//             location: 'all'
//           });
//         }}
//       >
//         Reset Filters
//       </Button>
//     </div>
//   );
// };

// export const Investment = () => {
//   const { address } = useAccount();
//   const [expandedCardId, setExpandedCardId] = useState(null);
//   const { investmentProperties, isLoading, error } = useInvestmentAssetsRead();
//   const { connectWallet } = useWalletConnect();
  
//   // Search and filter states
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filters, setFilters] = useState({
//     propertyType: "all",
//     minInvestment: 0,
//     minROI: 0,
//     location: "all"
//   });

//   // Filter properties based on search and filters
//   const filteredProperties = investmentProperties?.filter(property => {
//     // Search query filter
//     const searchMatch = 
//       property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       property.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       property.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       property.location.country.toLowerCase().includes(searchQuery.toLowerCase());

//     // Property type filter
//     const typeMatch = 
//       filters.propertyType === "all" || 
//       property.investment_type.toLowerCase() === filters.propertyType.toLowerCase();

//     // Investment amount filter
//     const investmentMatch = 
//       property.min_investment_amount >= filters.minInvestment;

//     // ROI filter
//     const roiMatch = 
//       Number(property.expected_roi) >= filters.minROI;

//     // Location filter
//     const locationMatch =
//       filters.location === "all" ||
//       property.location.country.toLowerCase().includes(filters.location.toLowerCase());

//     return searchMatch && typeMatch && investmentMatch && roiMatch && locationMatch;
//   }) || [];

//   if (isLoading) {
//     return <InvestmentPageShimmer />;
//   }

//   if (error) {
//     console.error("Error loading investments:", error);
//     return <div>Error loading investments</div>;
//   }

//   if (!investmentProperties?.length) {
//     return <EmptyInvestmentState />;
//   }

//   // Calculate stats based on filtered properties
//   const totalStats = {
//     totalInvestors: filteredProperties.reduce(
//       (acc, property) => acc + Number(property.investors || 0),
//       0
//     ),
//     averageROI: filteredProperties.reduce(
//       (acc, property) => acc + Number(property.expected_roi || 0),
//       0
//     ),
//     totalInvestment: filteredProperties.reduce(
//       (acc, property) => acc + Number(property.asset_value || 0),
//       0
//     ),
//   };

//   const averageROI = filteredProperties.length
//     ? (totalStats.averageROI / filteredProperties.length).toFixed(1)
//     : "0";

//   return (
//     <div className="flex min-h-screen bg-background">
//       {/* Sidebar - Hidden on mobile */}
//       <div className="hidden lg:block w-64 p-6 border-r min-h-screen">
//         <FilterSidebar 
//           filters={filters} 
//           setFilters={setFilters} 
//         />
//       </div>

//       <div className="flex-1 p-6">
//         {/* Stats Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {[
//             {
//               title: "Total Properties",
//               value: filteredProperties.length,
//               icon: Building,
//             },
//             {
//               title: "Total Investors",
//               value: totalStats.totalInvestors,
//               icon: Users,
//             },
//             {
//               title: "Average ROI",
//               value: `${averageROI}%`,
//               icon: TrendingUp,
//             },
//             {
//               title: "Total Investment",
//               value: formatCurrency(totalStats.totalInvestment),
//               icon: DollarSign,
//             },
//           ].map((stat, i) => (
//             <Card
//               key={stat.title}
//               className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
//             >
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   {stat.title}
//                 </CardTitle>
//                 <stat.icon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{stat.value}</div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Search and Mobile Filter */}
//         <div className="flex gap-4 mb-8">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//             <Input
//               placeholder="Search properties..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//           </div>
          
//           {/* Mobile Filter Button */}
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="outline" className="lg:hidden" size="icon">
//                 <SlidersHorizontal className="h-4 w-4" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent>
//               <SheetHeader>
//                 <SheetTitle>Filters</SheetTitle>
//               </SheetHeader>
//               <div className="mt-6">
//                 <FilterSidebar 
//                   filters={filters} 
//                   setFilters={setFilters} 
//                 />
//               </div>
//             </SheetContent>
//           </Sheet>
//         </div>

//         {/* Properties Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {filteredProperties.length > 0 ? (
//             filteredProperties.map((property) => (
//               <InvestmentCard
//                 key={property.id}
//                 property={property}
//                 expandedCardId={expandedCardId}
//                 setExpandedCardId={setExpandedCardId}
//               />
//             ))
//           ) : (
//             <div className="col-span-full text-center py-12">
//               <p className="text-lg text-muted-foreground">
//                 No properties match your search criteria
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Investment;
// import { InvestmentCard } from "@/components/investment/InvestmentCard";
// import { EmptyInvestmentState } from "@/components/investment/EmptyInvestmentState";
// import { PageLoader } from "@/components/ui/page-loader";
// import { useEffect, useState } from "react";
// import { useAccount, useConnect } from "@starknet-react/core";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Shimmer } from "@/components/ui/shimmer";
// import { formatCurrency } from "@/utils/utils";
// import { inView } from "framer-motion";
// import { Building, Users, TrendingUp, DollarSign } from "lucide-react";
// import { useInvestmentAssetsRead } from "@/hooks/contract_interactions/useInvestmentReads";
// import { useWalletConnect } from "@/hooks/useWalletConnect";
// import InvestmentPageShimmer from "@/components/investment/InvestmentPageLoader";

// export const Investment = () => {
//   const { address } = useAccount();
//   const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
//   const { investmentProperties, isLoading, error } = useInvestmentAssetsRead();
//   const { connectWallet } = useWalletConnect();

//   if (isLoading) {
//     return (
//       <InvestmentPageShimmer/>
//       // <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       //   {/* <PageLoader />; */}
       
//       // </div>
//     );
//   }

//   if (error) {
//     console.error("Error loading investments:", error);
//     return <div>Error loading investments</div>;
//   }

//   if (!investmentProperties?.length) {
//     return <EmptyInvestmentState />;
//   }
//   const totalStats = {
//     totalInvestors:
//       investmentProperties?.reduce(
//         (acc, property) => acc + Number(property.investors || 0),
//         0
//       ) || 0,
//     averageROI:
//       investmentProperties?.reduce(
//         (acc, property) => acc + Number(property.expected_roi || 0),
//         0
//       ) || 0,
//     totalInvestment:
//       investmentProperties?.reduce(
//         (acc, property) => acc + Number(property.asset_value || 0),
//         0
//       ) || 0,
//   };

//   const averageROI = investmentProperties?.length
//     ? (totalStats.averageROI / investmentProperties.length).toFixed(1)
//     : "0";

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   return (
//     <div className="container mx-auto py-24">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//         {isLoading ? (
//           Array.from({ length: 4 }).map((_, i) => (
//             <Card key={i}>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <Shimmer className="h-6 w-24" />
//                 <Shimmer className="h-4 w-4" />
//               </CardHeader>
//               <CardContent>
//                 <Shimmer className="h-8 w-full" />
//               </CardContent>
//             </Card>
//           ))
//         ) : (
//           <>
//             {[
//               {
//                 title: "Total Properties",
//                 value: investmentProperties?.length || 0,
//                 icon: Building,
//               },
//               {
//                 title: "Total Investors",
//                 value: totalStats.totalInvestors || 0,
//                 icon: Users,
//               },
//               {
//                 title: "Average ROI",
//                 value: `${averageROI}%`,
//                 icon: TrendingUp,
//               },
//               {
//                 title: "Total Investment",
//                 value: formatCurrency(totalStats.totalInvestment || 0),
//                 icon: DollarSign,
//               },
//             ].map((stat, i) => (
//               <Card
//                 key={stat.title}
//                 className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
//                 style={{
//                   opacity: inView ? 1 : 0,
//                   transform: inView
//                     ? "translateY(0)"
//                     : `translateY(${20 + i * 10}px)`,
//                   transition: `all 0.5s ease-out ${i * 0.1}s`,
//                 }}
//               >
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">
//                     {stat.title}
//                   </CardTitle>
//                   <stat.icon className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{stat.value}</div>
//                 </CardContent>
//               </Card>
//             ))}
//           </>
//         )}
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {investmentProperties.map((property) => (
//           <InvestmentCard
//             key={property.id}
//             property={property}
//             expandedCardId={expandedCardId}
//             setExpandedCardId={setExpandedCardId}
//             // handleConnectWallet={handleConnectWallet}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Investment;
