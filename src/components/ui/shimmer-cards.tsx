import { Card, CardContent, CardHeader } from "./card";
import { Shimmer } from "./shimmer";

export const PropertyShimmerCard = () => (
  <Card>
    <Shimmer className="w-full h-48 rounded-t-lg" />
    <CardHeader>
      <Shimmer className="h-6 w-3/4 mb-2" />
      <Shimmer className="h-4 w-1/2" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-full" />
        </div>
        <Shimmer className="h-8 w-full" />
        <div className="flex gap-2">
          <Shimmer className="h-10 w-1/2" />
          <Shimmer className="h-10 w-1/2" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const InvestmentShimmerCard = () => (
  <Card>
    <Shimmer className="w-full h-48 rounded-t-lg" />
    <CardHeader>
      <Shimmer className="h-6 w-3/4 mb-2" />
      <Shimmer className="h-4 w-1/2" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <Shimmer className="h-4 w-full mb-2" />
          <Shimmer className="h-2 w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Shimmer className="h-4 w-full mb-1" />
            <Shimmer className="h-6 w-3/4" />
          </div>
          <div>
            <Shimmer className="h-4 w-full mb-1" />
            <Shimmer className="h-6 w-3/4" />
          </div>
        </div>
        <div className="flex gap-2">
          <Shimmer className="h-10 w-1/2" />
          <Shimmer className="h-10 w-1/2" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const BlogShimmerCard = () => (
  <Card>
    <Shimmer className="w-full h-40 rounded-t-lg" />
    <CardHeader>
      <Shimmer className="h-6 w-3/4 mb-2" />
      <Shimmer className="h-4 w-1/2" />
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-5/6" />
        <Shimmer className="h-4 w-4/6" />
        <div className="flex justify-between items-center mt-4">
          <Shimmer className="h-8 w-24 rounded-full" />
          <Shimmer className="h-6 w-20" />
        </div>
      </div>
    </CardContent>
  </Card>
);