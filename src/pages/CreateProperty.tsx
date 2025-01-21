import { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { usePropertyWrite } from "@/hooks/usePropertyWrite";
import { Property } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const CreateProperty = () => {
  const { address } = useAccount();
  const { handleListProperty, isPending } = usePropertyWrite();
  const [formData, setFormData] = useState<Partial<Property>>({
    owner: address?.toString(),
    is_investment: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      await handleListProperty(formData as Property);
    } catch (error) {
      console.error("Error creating property:", error);
    }
  };

  const handleInputChange = (field: keyof Property, value: any) => {
    // Convert numeric inputs to the correct type
    if (["price", "asking_price", "interested_clients", "annual_growth_rate"].includes(field)) {
      value = BigInt(value);
    } else if (["area", "bedrooms", "bathrooms", "parking_spaces", "date_listed"].includes(field)) {
      value = Number(value);
    }
    
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-24">
        <Card>
          <CardHeader>
            <CardTitle>Create New Property</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    required
                    value={formData.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    required
                    value={typeof formData.price === 'bigint' ? formData.price.toString() : ''}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    required
                    value={formData.description?.toString() || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_investment}
                    onCheckedChange={(checked) => handleInputChange("is_investment", checked)}
                  />
                  <Label>Investment Property</Label>
                </div>
              </div>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Property"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProperty;