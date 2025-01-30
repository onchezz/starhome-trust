import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  FileText,
  MapPin,
  Home,
  Ruler,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { ImageGallery } from "@/components/investment/ImageGallery";
import { shortString } from "starknet";
import { useInvestmentAssetReadById } from "@/hooks/contract_interactions/usePropertiesReads";

const InvestmentDetails = () => {
  const { id } = useParams();
  const { address } = useAccount();
  const [investmentAmount, setInvestmentAmount] = useState("");
  const { investment, isLoading } = useInvestmentAssetReadById(id || "");

  console.log("[InvestmentDetails] Investment data:", investment);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
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

  const getBigIntValue = (value: any): string => {
    if (!value) return "";
    if (typeof value === "object" && value._type === "BigInt") {
      return shortString.decodeShortString(value.value.toString());
    }
    return value.toString();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!investment) {
    return <div>Investment not found</div>;
  }

  // Convert BigInt values to numbers
  const assetValue = Number(investment.asset_value || 0);
  const availableStakingAmount = Number(
    investment.available_staking_amount || 0
  );
  const minInvestmentAmount = Number(investment.min_investment_amount || 0);
  const propertyPrice = Number(investment.property_price || 0);
  const rentalIncome = Number(investment.rental_income || 0);
  const maintenanceCosts = Number(investment.maintenance_costs || 0);
  const size = Number(investment.size || 0);
  const constructionYear = Number(investment.construction_year || 0);

  const progress = calculateProgress(
    assetValue - availableStakingAmount,
    assetValue
  );

  // Helper function to safely split strings
  const safeSplit = (
    str: string | undefined | null,
    separator: string = ","
  ) => {
    if (!str) return [];
    return String(str).split(separator);
  };

  const investmentName = getBigIntValue(investment.name);
  const investmentType = getBigIntValue(investment.investment_type);
  const locationAddress = getBigIntValue(investment.location?.address);
  const locationCity = getBigIntValue(investment.location?.city);
  const locationState = getBigIntValue(investment.location?.state);
  const locationCountry = getBigIntValue(investment.location?.country);
  const constructionStatus = getBigIntValue(investment.construction_status);
  const expectedRoi = getBigIntValue(investment.expected_roi);
  const taxBenefits = getBigIntValue(investment.tax_benefits);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-24">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Image Gallery */}
          <ImageGallery imagesId={investment.images || ""} />

          {/* Investment Action */}
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
                      {formatCurrency(assetValue - availableStakingAmount)} of{" "}
                      {formatCurrency(assetValue)}
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Available for Investment
                    </p>
                    <p className="font-semibold">
                      {formatCurrency(availableStakingAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Minimum Investment</p>
                    <p className="font-semibold">
                      {formatCurrency(minInvestmentAmount)}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Investment Amount</Label>
                  <Input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder={`Min. ${formatCurrency(minInvestmentAmount)}`}
                  />
                </div>
                <Button onClick={handleInvest} className="w-full">
                  Invest Now
                </Button>
              </div>
            </CardContent>
          </Card>

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
                  <p className="font-semibold">{investmentType}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    Location
                  </div>
                  <p className="font-semibold">{locationAddress}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Ruler className="h-4 w-4" />
                    Size
                  </div>
                  <p className="font-semibold">{size.toLocaleString()} sq ft</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Building className="h-4 w-4" />
                    Year Built
                  </div>
                  <p className="font-semibold">{constructionYear}</p>
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
                {safeSplit(investment.highlights).map((highlight, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    {highlight.trim()}
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
                  <p className="text-2xl font-bold">
                    {formatCurrency(propertyPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Expected ROI</p>
                  <p className="text-2xl font-bold">{expectedRoi}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Annual Rental Income</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(rentalIncome)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Maintenance Costs</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(maintenanceCosts)}
                  </p>
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
                  {safeSplit(investment.market_analysis).map(
                    (analysis, index) => {
                      const [key, value] = analysis
                        .split(":")
                        .map((item) => item.trim());
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium capitalize">
                            {key}
                          </TableCell>
                          <TableCell>{value}</TableCell>
                        </TableRow>
                      );
                    }
                  )}
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
                {safeSplit(investment.risk_factors).map((risk, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    {risk.trim()}
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
                  <h4 className="font-semibold mb-2">Legal Details</h4>
                  <ul className="space-y-2">
                    {safeSplit(investment.legal_detail).map((detail, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {detail.trim()}
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
                {safeSplit(investment.additional_features).map(
                  (feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-secondary rounded-full" />
                      {feature.trim()}
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDetails;
