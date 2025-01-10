import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp, Building, DollarSign } from "lucide-react";

const InvestmentDetails = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // This would typically come from route params and API
  const investment = {
    id: 1,
    title: "Downtown Commercial Complex",
    location: "Los Angeles, CA",
    totalInvestment: 5000000,
    currentInvestment: 3750000,
    investors: 45,
    minInvestment: 25000,
    roi: "12%",
    type: "Commercial",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    description: "Prime commercial property in downtown LA featuring retail spaces and office units. High-traffic location with excellent growth potential.",
    additionalDetails: {
      propertySize: "50,000 sq ft",
      yearBuilt: "2015",
      occupancyRate: "95%",
      annualRevenue: "$2.5M",
      propertyTax: "$150,000",
      maintenanceCost: "$200,000",
      insuranceCost: "$75,000",
      projectedAppreciation: "8% annually",
      investmentTerm: "5 years",
      exitStrategy: "Property sale or refinancing",
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-24">
        <div className="max-w-4xl mx-auto">
          <img 
            src={investment.image} 
            alt={investment.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
          
          <h1 className="text-4xl font-bold mb-4">{investment.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{investment.location}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(investment.totalInvestment)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Investors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{investment.investors}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expected ROI</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{investment.roi}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Property Type</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{investment.type}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Investment Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">{investment.description}</p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Investment Progress</span>
                    <span>{formatCurrency(investment.currentInvestment)} of {formatCurrency(investment.totalInvestment)}</span>
                  </div>
                  <Progress value={(investment.currentInvestment / investment.totalInvestment) * 100} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(investment.additionalDetails).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDetails;