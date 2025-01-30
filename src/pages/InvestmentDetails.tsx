import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building, DollarSign, TrendingUp, AlertTriangle, FileText, MapPin, Home, Ruler } from "lucide-react";
import { useParams } from "react-router-dom";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useInvestmentsCache } from "@/hooks/contract_interactions/useInvestmentsCache";
import { ImageGallery } from "@/components/investment/ImageGallery";
import { InvestmentAsset } from "@/types/investment";

const InvestmentDetails = () => {
  const { id } = useParams();
  const { address } = useAccount();
  const [investmentAmount, setInvestmentAmount] = useState("");
  const { investments, isLoading } = useInvestmentsCache();
  
  const investment = investments?.find((inv: InvestmentAsset) => inv.id === id);
  const isOwner = address === investment?.owner;

  console.log("Investment details:", { investment, isOwner, address });

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

  const handleInvest = () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!investmentAmount || isNaN(Number(investmentAmount))) {
      toast.error("Please enter a valid investment amount");
      return;
    }

    console.log("Investing amount:", investmentAmount);
    toast.success("Investment initiated");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!investment) {
    return <div>Investment not found</div>;
  }

  const progress = calculateProgress(
    investment.asset_value - investment.available_staking_amount,
    investment.asset_value
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-24">
        <div className="max-w-6xl mx-auto space-y-8">
          {isOwner && (
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-green-700">You are the owner of this investment</p>
            </div>
          )}
          
          <ImageGallery imagesId={investment.images} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                Investment Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Current Investment</span>
                    <span>
                      {formatCurrency(investment.asset_value - investment.available_staking_amount)} of{" "}
                      {formatCurrency(investment.asset_value)}
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Available for Investment</p>
                    <p className="font-semibold">{formatCurrency(investment.available_staking_amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Minimum Investment</p>
                    <p className="font-semibold">{formatCurrency(investment.min_investment_amount)}</p>
                  </div>
                </div>
                {!isOwner && (
                  <>
                    <div>
                      <Label>Investment Amount</Label>
                      <Input
                        type="number"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                        placeholder={`Min. ${formatCurrency(investment.min_investment_amount)}`}
                      />
                    </div>
                    <Button onClick={handleInvest} className="w-full">
                      Invest Now
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

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
                  <p className="font-semibold">{investment.investment_type}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    Location
                  </div>
                  <p className="font-semibold">{investment.location.address}, {investment.location.city}, {investment.location.country}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Ruler className="h-4 w-4" />
                    Size
                  </div>
                  <p className="font-semibold">{investment.size} sqft</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Building className="h-4 w-4" />
                    Year Built
                  </div>
                  <p className="font-semibold">{investment.construction_year}</p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <p className="text-2xl font-bold">{formatCurrency(investment.asset_value)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Expected ROI</p>
                  <p className="text-2xl font-bold">{investment.expected_roi}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Annual Rental Income</p>
                  <p className="text-2xl font-bold">{formatCurrency(investment.rental_income)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Maintenance Costs</p>
                  <p className="text-2xl font-bold">{formatCurrency(investment.maintenance_costs)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  {Object.entries(investment.market_analysis).map(([key, value]) => (
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {investment.risk_factors.map((risk, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    {risk}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

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
                    <li>Ownership: {investment.legal_detail.ownership}</li>
                    <li>Zoning: {investment.legal_detail.zoning}</li>
                    <li>Permits: {investment.legal_detail.permits}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Required Documents</h4>
                  <ul className="space-y-2">
                    {investment.legal_detail.documents.map((doc, index) => (
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

          <Card>
            <CardHeader>
              <CardTitle>Additional Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {investment.additional_features.map((feature, index) => (
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
