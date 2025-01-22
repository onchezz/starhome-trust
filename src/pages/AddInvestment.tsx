import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccount } from "@starknet-react/core";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddInvestment = () => {
  const { address } = useAccount();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    size: "",
    investment_type: "",
    construction_year: "",
    asking_price: "",
    expected_roi: "",
    rental_income: "",
    maintenance_costs: "",
    tax_benefits: "",
    highlights: [""],
    market_analysis: {
      area_growth: "",
      occupancy_rate: "",
      comparable_properties: "",
      demand_trend: "",
    },
    risk_factors: [""],
    legal_details: {
      ownership: "",
      zoning: "",
      permits: "",
      documents: [""],
    },
    additional_features: [""],
    images: [""],
    min_amount: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      // Convert values to appropriate types
      const investment = {
        ...formData,
        construction_year: Number(formData.construction_year),
        asking_price: BigInt(formData.asking_price),
        rental_income: BigInt(formData.rental_income),
        maintenance_costs: BigInt(formData.maintenance_costs),
        min_amount: BigInt(formData.min_amount),
      };

      console.log("Submitting investment:", investment);
      toast.success("Investment added successfully");
      navigate("/investment");
    } catch (error) {
      console.error("Error adding investment:", error);
      toast.error("Failed to add investment");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-24">
        <Card>
          <CardHeader>
            <CardTitle>Add New Investment Property</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="name"
                  placeholder="Property Name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <Input
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                />
                <Input
                  name="size"
                  placeholder="Size"
                  value={formData.size}
                  onChange={handleChange}
                />
                <Input
                  name="investment_type"
                  placeholder="Investment Type"
                  value={formData.investment_type}
                  onChange={handleChange}
                />
                <Input
                  name="construction_year"
                  type="number"
                  placeholder="Construction Year"
                  value={formData.construction_year}
                  onChange={handleChange}
                />
                <Input
                  name="asking_price"
                  type="number"
                  placeholder="Asking Price"
                  value={formData.asking_price}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Market Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="market_analysis.area_growth"
                    placeholder="Area Growth"
                    value={formData.market_analysis.area_growth}
                    onChange={handleChange}
                  />
                  <Input
                    name="market_analysis.occupancy_rate"
                    placeholder="Occupancy Rate"
                    value={formData.market_analysis.occupancy_rate}
                    onChange={handleChange}
                  />
                  <Input
                    name="market_analysis.comparable_properties"
                    placeholder="Comparable Properties"
                    value={formData.market_analysis.comparable_properties}
                    onChange={handleChange}
                  />
                  <Input
                    name="market_analysis.demand_trend"
                    placeholder="Demand Trend"
                    value={formData.market_analysis.demand_trend}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Legal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="legal_details.ownership"
                    placeholder="Ownership"
                    value={formData.legal_details.ownership}
                    onChange={handleChange}
                  />
                  <Input
                    name="legal_details.zoning"
                    placeholder="Zoning"
                    value={formData.legal_details.zoning}
                    onChange={handleChange}
                  />
                  <Input
                    name="legal_details.permits"
                    placeholder="Permits"
                    value={formData.legal_details.permits}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Add Investment Property
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddInvestment;