import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, DollarSign, TrendingUp, AlertTriangle, FileText, MapPin, Home, Ruler } from "lucide-react";
import { useParams } from "react-router-dom";

const InvestmentDetails = () => {
  const { id } = useParams();
  console.log("Investment ID:", id);

  // This would typically come from an API call using the ID
  const investment = {
    id: 1,
    name: "Downtown Commercial Complex",
    location: "Los Angeles, CA",
    size: "50,000 sq ft",
    type: "Commercial",
    constructionYear: 2015,
    askingPrice: 5000000,
    expectedROI: "12%",
    rentalIncome: 450000,
    maintenanceCosts: 75000,
    taxBenefits: "Opportunity Zone Tax Benefits",
    highlights: [
      "Prime downtown location",
      "Recently renovated",
      "100% occupancy rate",
      "Long-term tenants",
      "Energy-efficient building"
    ],
    marketAnalysis: {
      areaGrowth: "15% YoY",
      occupancyRate: "98%",
      comparableProperties: "10% below market average",
      demandTrend: "High and increasing"
    },
    riskFactors: [
      "Market volatility in commercial real estate",
      "Potential changes in zoning laws",
      "Competition from new developments"
    ],
    legalDetails: {
      ownership: "Clear title",
      zoning: "Commercial C-2",
      permits: "All current",
      documents: ["Title deed", "Property survey", "Environmental assessment"]
    },
    additionalFeatures: [
      "LEED Gold certified",
      "Smart building management system",
      "24/7 security",
      "EV charging stations",
      "Rooftop garden"
    ],
    images: [
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      "https://images.unsplash.com/photo-1460574283810-2aab119d8511",
      "https://images.unsplash.com/photo-1496307653780-42ee777d4833"
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-24">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {investment.images.map((image, index) => (
              <img 
                key={index}
                src={image}
                alt={`${investment.name} - View ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>

          {/* Basic Property Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-6 w-6" />
                Basic Property Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Home className="h-4 w-4" />
                    Property Type
                  </div>
                  <p className="font-semibold">{investment.type}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    Location
                  </div>
                  <p className="font-semibold">{investment.location}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Ruler className="h-4 w-4" />
                    Size
                  </div>
                  <p className="font-semibold">{investment.size}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Building className="h-4 w-4" />
                    Year Built
                  </div>
                  <p className="font-semibold">{investment.constructionYear}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Investment Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investment.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Financial Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                Financial Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-gray-500">Asking Price</p>
                  <p className="text-2xl font-bold">{formatCurrency(investment.askingPrice)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Expected ROI</p>
                  <p className="text-2xl font-bold">{investment.expectedROI}</p>
                </div>
                <div>
                  <p className="text-gray-500">Annual Rental Income</p>
                  <p className="text-2xl font-bold">{formatCurrency(investment.rentalIncome)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Maintenance Costs</p>
                  <p className="text-2xl font-bold">{formatCurrency(investment.maintenanceCosts)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(investment.marketAnalysis).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Risk Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {investment.riskFactors.map((risk, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    {risk}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Legal Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Legal and Documentation Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Status</h4>
                  <ul className="space-y-2">
                    <li>Ownership: {investment.legalDetails.ownership}</li>
                    <li>Zoning: {investment.legalDetails.zoning}</li>
                    <li>Permits: {investment.legalDetails.permits}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Required Documents</h4>
                  <ul className="space-y-2">
                    {investment.legalDetails.documents.map((doc, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Features */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {investment.additionalFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-secondary rounded-full" />
                    {feature}
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