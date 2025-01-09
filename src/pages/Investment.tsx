import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Building, DollarSign } from "lucide-react";

const investmentProperties = [
  {
    id: 1,
    title: "Downtown Commercial Complex",
    location: "Los Angeles, CA",
    totalInvestment: 5000000,
    currentInvestment: 3750000,
    investors: 45,
    minInvestment: 25000,
    roi: "12%",
    type: "Commercial"
  },
  {
    id: 2,
    title: "Luxury Apartment Building",
    location: "Miami, FL",
    totalInvestment: 8000000,
    currentInvestment: 6000000,
    investors: 78,
    minInvestment: 50000,
    roi: "15%",
    type: "Residential"
  },
  {
    id: 3,
    title: "Tech Park Development",
    location: "Austin, TX",
    totalInvestment: 12000000,
    currentInvestment: 9600000,
    investors: 120,
    minInvestment: 100000,
    roi: "18%",
    type: "Mixed-Use"
  }
];

const Investment = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (current: number, total: number) => {
    return (current / total) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-24">
        <h1 className="text-4xl font-bold mb-8 text-center">Investment Opportunities</h1>
        
        {/* Investment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Properties
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{investmentProperties.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Investors
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">243</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average ROI
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Investment
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$25M</div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Properties */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {investmentProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{property.title}</CardTitle>
                <p className="text-sm text-gray-500">{property.location}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Investment Progress</span>
                      <span>{formatCurrency(property.currentInvestment)} of {formatCurrency(property.totalInvestment)}</span>
                    </div>
                    <Progress value={calculateProgress(property.currentInvestment, property.totalInvestment)} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Number of Investors</p>
                      <p className="font-semibold">{property.investors}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Minimum Investment</p>
                      <p className="font-semibold">{formatCurrency(property.minInvestment)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Expected ROI</p>
                      <p className="font-semibold">{property.roi}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Property Type</p>
                      <p className="font-semibold">{property.type}</p>
                    </div>
                  </div>

                  <Button className="w-full">Invest Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Investment;