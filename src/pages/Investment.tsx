import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, TrendingUp, Building, DollarSign, Wallet, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    type: "Commercial",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    description: "Prime commercial property in downtown LA featuring retail spaces and office units. High-traffic location with excellent growth potential."
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
    type: "Residential",
    image: "https://images.unsplash.com/photo-1481253127861-534498168948",
    description: "Luxury residential complex with premium amenities, located in Miami's most sought-after neighborhood."
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
    type: "Mixed-Use",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
    description: "Modern tech park featuring office spaces, research facilities, and innovative workspace solutions."
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

  const handleGoogleSignIn = () => {
    console.log("Signing in with Google");
    // Implement Google sign-in logic
  };

  const handleConnectWallet = () => {
    console.log("Connecting wallet");
    // Implement wallet connection logic
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
              <img 
                src={property.image} 
                alt={property.title}
                className="w-full h-48 object-cover"
              />
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

                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="flex-1">
                          Invest Now
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuItem onClick={handleConnectWallet}>
                          <Wallet className="mr-2 h-4 w-4" />
                          Connect Wallet
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleGoogleSignIn}>
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="currentColor"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          Sign in with Google
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Link to={`/properties/${property.id}`}>
                      <Button variant="outline">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        More Details
                      </Button>
                    </Link>
                  </div>
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
