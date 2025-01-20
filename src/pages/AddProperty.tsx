import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useAccount } from "@starknet-react/core";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStarhomesWrite } from "@/hooks/staker/useStarhomesWrite";
import { PropertyBasicInfo } from "@/components/property/PropertyBasicInfo";
import { PropertyLocation } from "@/components/property/PropertyLocation";
import { PropertyAmenities } from "@/components/property/PropertyAmenities";

const propertyFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location_address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  price: z.string().min(1, "Price is required"),
  asking_price: z.string().min(1, "Asking price is required"),
  area: z.string().min(1, "Area is required"),
  bedrooms: z.string().min(1, "Number of bedrooms is required"),
  bathrooms: z.string().min(1, "Number of bathrooms is required"),
  parking_spaces: z.string().min(1, "Number of parking spaces is required"),
  property_type: z.string(),
  has_garden: z.boolean().default(false),
  has_swimming_pool: z.boolean().default(false),
  pet_friendly: z.boolean().default(false),
  wheelchair_accessible: z.boolean().default(false),
  is_investment: z.boolean().default(false),
});

export default function AddProperty() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { listPropertyForSale } = useStarhomesWrite();

  const form = useForm<z.infer<typeof propertyFormSchema>>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      has_garden: false,
      has_swimming_pool: false,
      pet_friendly: false,
      wheelchair_accessible: false,
      is_investment: false,
    },
  });

  async function onSubmit(values: z.infer<typeof propertyFormSchema>) {
    try {
      if (!address) {
        toast.error("Please connect your wallet first");
        return;
      }

      console.log("Form values:", values);
      toast.success("Property submitted successfully!");
      navigate("/properties");
    } catch (error) {
      console.error("Error submitting property:", error);
      toast.error("Failed to submit property");
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Property</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <PropertyBasicInfo form={form} />
              <PropertyLocation form={form} />
              <PropertyAmenities form={form} />
              <Button type="submit" className="w-full">
                List Property
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
