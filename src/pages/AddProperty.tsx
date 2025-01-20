import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useAccount } from "@starknet-react/core";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStarhomesWrite } from "@/hooks/useStarhomesWrite";

const propertyFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location_address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  latitude: z.string(),
  longitude: z.string(),
  price: z.string().min(1, "Price is required"),
  asking_price: z.string().min(1, "Asking price is required"),
  currency: z.string(),
  area: z.string().min(1, "Area is required"),
  bedrooms: z.string().min(1, "Number of bedrooms is required"),
  bathrooms: z.string().min(1, "Number of bathrooms is required"),
  parking_spaces: z.string().min(1, "Number of parking spaces is required"),
  property_type: z.string(),
  status: z.string(),
  interested_clients: z.string(),
  annual_growth_rate: z.string(),
  features_id: z.string(),
  images_id: z.string(),
  video_tour: z.string(),
  date_listed: z.string(),
  has_garden: z.boolean(),
  has_swimming_pool: z.boolean(),
  pet_friendly: z.boolean(),
  wheelchair_accessible: z.boolean(),
  asset_token: z.string(),
  is_investment: z.boolean(),
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

      const property = {
        ...values,
        owner: address,
        agent_id: address, // Using the connected wallet address as agent_id
        price: BigInt(values.price),
        asking_price: BigInt(values.asking_price),
        area: BigInt(values.area),
        bedrooms: BigInt(values.bedrooms),
        bathrooms: BigInt(values.bathrooms),
        parking_spaces: BigInt(values.parking_spaces),
        interested_clients: BigInt(values.interested_clients),
        annual_growth_rate: BigInt(values.annual_growth_rate),
      };

      await listPropertyForSale(property, values.asset_token);
      toast.success("Property listed successfully!");
      navigate("/properties");
    } catch (error) {
      console.error("Error listing property:", error);
      toast.error("Failed to list property");
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Add New Property</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Property title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Property description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Property address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Property price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="asking_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asking Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Asking price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="property_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-2 grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="has_garden"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Has Garden</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="has_swimming_pool"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Has Swimming Pool</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pet_friendly"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Pet Friendly</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_investment"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Investment Property</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit">List Property</Button>
        </form>
      </Form>
    </div>
  );
}