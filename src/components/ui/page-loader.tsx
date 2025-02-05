import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "./card";
import { Shimmer } from "./shimmer";

export const PageLoader = () => {
  return (
  
    Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="overflow-hidden animate-pulse">
          <Shimmer className="w-full h-48" />
          <CardHeader>
            <Shimmer className="h-6 w-3/4 mb-2" />
            <Shimmer className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Shimmer className="h-4 w-full" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j}>
                  <Shimmer className="h-4 w-24 mb-2" />
                  <Shimmer className="h-6 w-16" />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Shimmer className="h-10 w-full" />
              <Shimmer className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      ))
    // <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
      
    //   {/* <div className="flex flex-col items-center gap-4">
    //     <Loader2 className="h-8 w-8 animate-spin text-primary" />
    //     <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
    //   </div> */}
    // </div>
  );
};
    // <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
    //   <div className="flex flex-col items-center gap-4">
    //     <Loader2 className="h-8 w-8 animate-spin text-primary" />
    //     <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
    //   </div>
    // </div>
//   );
// };