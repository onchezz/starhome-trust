import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const InvestmentPageShimmer = () => {
  // Stats Cards
  const StatsShimmer = () => {
    const stats = Array(4).fill(null);
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((_, i) => (
          <Card
            key={i}
            className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg bg-white"
            // style={{
            //   transform: `translateY(${20 + i * 10}px)`,
            //   transition: `all 0.5s ease-out ${i * 0.1}s`,
            // }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Property Cards
  const PropertyCardShimmer = () => {
    return (
      <Card className="overflow-hidden">
        {/* Image Shimmer */}
        <div className="w-full h-48 bg-gray-200 animate-pulse" />
        
        <div className="p-6">
          {/* Title Shimmer */}
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
          {/* Address Shimmer */}
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-6" />

          {/* Investment Progress */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-1">
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4  mt-24">
      {/* Stats Section */}
      <StatsShimmer />
      
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
      {/* Properties Grid */}
      {/* <div className="container mx-auto py-24"> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <PropertyCardShimmer />
        <PropertyCardShimmer />
        <PropertyCardShimmer />
        <PropertyCardShimmer />
      </div>
      {/* </div> */}
      {/* <div className="grid grid-cols-4 md:grid-cols-2 gap-6">
       
      </div> */}
    </div>
  );
};

export default InvestmentPageShimmer;
// import React from 'react';
// import { Card, CardHeader, CardContent } from '@/components/ui/card';

// const InvestmentPageShimmer = () => {
//   return (
//     <div className="min-h-screen bg-gray-50 w-full">
//       {/* Navigation Bar Shimmer */}
    

//       {/* Main Content */}
//       <main className="w-full px-4 sm:px-6 py-4 sm:py-6">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
//           {[...Array(4)].map((_, i) => (
//             <Card key={i} className="bg-white">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
//                 <div className="h-4 w-20 sm:w-28 bg-gray-200 rounded animate-pulse" />
//                 <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
//               </CardHeader>
//               <CardContent className="p-4 pt-0">
//                 <div className="h-6 sm:h-8 w-16 sm:w-24 bg-gray-200 rounded animate-pulse" />
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Search and Filter Bar */}
//         <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6 sm:mb-8">
//           {/* Search Bar */}
//           <div className="w-full sm:w-96 h-10 bg-gray-200 rounded animate-pulse" />
          
//           {/* Filter Buttons */}
//           <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="flex-1 sm:flex-none h-10 w-full sm:w-24 bg-gray-200 rounded animate-pulse" />
//             ))}
//           </div>
//         </div>

//         {/* Property Cards Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//           {[...Array(2)].map((_, index) => (
//             <Card key={index} className="overflow-hidden bg-white">
//               {/* Property Image */}
//               <div className="w-full h-40 sm:h-48 lg:h-56 bg-gray-200 animate-pulse" />
              
//               <div className="p-4 sm:p-6">
//                 {/* Title */}
//                 <div className="h-5 sm:h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
//                 {/* Address */}
//                 <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-4 sm:mb-6" />

//                 {/* Investment Progress */}
//                 <div className="mb-4 sm:mb-6">
//                   <div className="flex justify-between mb-2">
//                     <div className="h-4 w-24 sm:w-32 bg-gray-200 rounded animate-pulse" />
//                     <div className="h-4 w-24 sm:w-32 bg-gray-200 rounded animate-pulse" />
//                   </div>
//                   <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
//                 </div>

//                 {/* Stats Grid */}
//                 <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
//                   {[...Array(4)].map((_, i) => (
//                     <div key={i} className="space-y-1">
//                       <div className="h-3 sm:h-4 w-20 sm:w-28 bg-gray-200 rounded animate-pulse" />
//                       <div className="h-4 sm:h-5 w-16 sm:w-20 bg-gray-200 rounded animate-pulse" />
//                     </div>
//                   ))}
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
//                   <div className="flex-1">
//                     <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
//                   </div>
//                   <div className="h-10 w-full sm:w-32 bg-gray-200 rounded animate-pulse" />
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       </main>

//     </div>
//   );
// };

// export default InvestmentPageShimmer;