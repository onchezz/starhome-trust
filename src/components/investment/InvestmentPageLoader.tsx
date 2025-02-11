import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const InvestmentPageShimmer = () => {
  // Shimmer animation classes
  const shimmerClass = "animate-pulse bg-muted rounded";
  
  return (
    <div className="flex min-h-screen bg-background pt-20">
      {/* Sidebar Shimmer */}
      <div className="hidden lg:block w-64 p-6 border-r">
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className={`${shimmerClass} h-4 w-20`} />
              <div className={`${shimmerClass} h-10 w-full`} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6">
        {/* Stats Section Shimmer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className={`${shimmerClass} h-4 w-24`} />
                <div className={`${shimmerClass} h-4 w-4 rounded-full`} />
              </CardHeader>
              <CardContent>
                <div className={`${shimmerClass} h-8 w-32`} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Bar Shimmer */}
        <div className="flex gap-4 mb-8">
          <div className={`${shimmerClass} flex-1 h-10`} />
          <div className={`${shimmerClass} h-10 w-10 lg:hidden`} />
        </div>

        {/* Properties Grid Shimmer */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              {/* Image placeholder */}
              <div className={`${shimmerClass} h-48 w-full`} />
              
              <CardContent className="p-6 space-y-4">
                {/* Title */}
                <div className={`${shimmerClass} h-6 w-3/4`} />
                
                {/* Location */}
                <div className={`${shimmerClass} h-4 w-1/2`} />
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="space-y-2">
                      <div className={`${shimmerClass} h-3 w-16`} />
                      <div className={`${shimmerClass} h-4 w-20`} />
                    </div>
                  ))}
                </div>
                
                {/* Progress bar */}
                <div className={`${shimmerClass} h-2 w-full`} />
                
                {/* Button */}
                <div className={`${shimmerClass} h-10 w-full`} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestmentPageShimmer;
