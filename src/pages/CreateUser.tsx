import { useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useUserWrite } from "@/hooks/contract_interactions/useUserWrite";
import pinata from "@/hooks/services_hooks/pinata";
import { Loader2 } from "lucide-react";

const CreateUser = () => {
 const { address } = useAccount();
 const { handleRegisterUser, contractStatus } = useUserWrite();
 const [formData, setFormData] = useState({
   name: "",
   email: "",
   phone: "",
   profile_image: "",
   address: address,
   ipfsHash: "", // Store IPFS hash separately
 });
 const [uploadLoading, setUploadLoading] = useState(false);
 const [isSubmitting, setIsSubmitting] = useState(false);

 useEffect(() => {
   if (!address) {
     toast({
       title: "Wallet Not Connected",
       description: "Please connect your wallet to continue",
       variant: "destructive",
     });
   }
 }, [address]);

 const validateForm = () => {
   if (!formData.name.trim()) {
     toast({
       title: "Error",
       description: "Name is required",
       variant: "destructive",
     });
     return false;
   }
   if (
     !formData.email.trim() ||
     !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
   ) {
     toast({
       title: "Error",
       description: "Valid email is required",
       variant: "destructive",
     });
     return false;
   }
   if (!formData.phone.trim() || !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
     toast({
       title: "Error",
       description: "Valid phone number is required",
       variant: "destructive",
     });
     return false;
   }
   if (!formData.profile_image) {
     toast({
       title: "Error",
       description: "Profile image is required",
       variant: "destructive",
     });
     return false;
   }
   return true;
 };

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const { name, value } = e.target;
   setFormData((prev) => ({
     ...prev,
     [name]: value,
   }));
 };

 const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
   if (!e.target.files?.[0]) return;
   if (formData.ipfsHash) {
     toast({
       title: "Image Already Uploaded",
       description: "Please submit the form or reset to upload a new image",
       variant: "destructive",
     });
     return;
   }

   try {
     setUploadLoading(true);
     const file = e.target.files[0];
     const upload = await pinata.upload.file(file);
     const ipfsUrl = await pinata.gateways.convert(upload.IpfsHash);

     setFormData((prev) => ({
       ...prev,
       profile_image: ipfsUrl,
       ipfsHash: upload.IpfsHash,
     }));

     toast({
       title: "Success",
       description: "Image uploaded successfully",
     });
   } catch (error) {
     console.error("Error uploading image:", error);
     toast({
       title: "Upload Failed",
       description: "Failed to upload image. Please try again.",
       variant: "destructive",
     });
   } finally {
     setUploadLoading(false);
   }
 };

 const handleSubmit = async (e: React.FormEvent) => {
   validateForm();
   e.preventDefault();
   if (!address) {
     toast({
       title: "Error",
       description: "Please connect your wallet first",
       variant: "destructive",
     });
     return;
   }

   // if (!validateForm() || isSubmitting) return;

   try {
     setIsSubmitting(true);
     const { transaction_hash, status } = await handleRegisterUser({
       ...formData,
       id: address, // Generate a unique ID
     });
     if (status == "success") {
       resetForm();
       toast({
         title: "Transaction",
         description: `Transaction tx : ${transaction_hash}`,
       });
     }
     // await handleRegisterAgent({
     //   ...formData,
     //   agent_id: address,
     // });
     toast({
       title: "Success",
       description: "Agent registered successfully",
     });
   } catch (error) {
     console.error("Registration error:", error);
     toast({
       title: "Registration Failed",
       description: "Failed to register agent. Please try again.",
       variant: "destructive",
     });
   } finally {
     setIsSubmitting(false);
   }
 };

 const resetForm = () => {
   setFormData({
     name: "",
     email: "",
     phone: "",
     profile_image: "",
     address: address,
     ipfsHash: "",
   });
 };

 return (
   <div>
     {/* <Navbar /> */}
     <Card className="w-full mt-24 max-w-md mx-auto">
       <CardHeader>
         <CardTitle>User registration</CardTitle>
       </CardHeader>
       <CardContent>
         <form onSubmit={handleSubmit} className="space-y-4">
           <div className="space-y-2">
             <Label htmlFor="name">Name</Label>
             <Input
               id="name"
               name="name"
               value={formData.name}
               onChange={handleInputChange}
               required
               disabled={!address || isSubmitting}
             />
           </div>

           <div className="space-y-2">
             <Label htmlFor="email">Email</Label>
             <Input
               id="email"
               name="email"
               type="email"
               value={formData.email}
               onChange={handleInputChange}
               required
               disabled={!address || isSubmitting}
             />
           </div>

           <div className="space-y-2">
             <Label htmlFor="phone">Phone</Label>
             <Input
               id="phone"
               name="phone"
               value={formData.phone}
               onChange={handleInputChange}
               required
               disabled={!address || isSubmitting}
             />
           </div>

           <div className="space-y-2">
             <Label htmlFor="address">User Wallet Address</Label>
             <Input
               id="address"
               name="address"
               value={formData.address}
               placeholder={address}
               disabled
               required
             />
           </div>

           <div className="space-y-2">
             <Label htmlFor="profile_image">Profile Image</Label>
             <Input
               id="profile_image"
               name="profile_image"
               type="file"
               onChange={handleImageUpload}
               accept="image/*"
               className="file:mr-4 mt-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-primary/10"
               disabled={!address || isSubmitting || Boolean(formData.ipfsHash)}
             />
             {formData.profile_image && (
               <img
                 src={formData.profile_image}
                 alt="Profile preview"
                 className="mt-2 w-24 h-24 rounded-full object-cover"
               />
             )}
           </div>

           <div className="flex gap-4">
             <Button
               type="submit"
               className="flex-1"
               disabled={!address || isSubmitting || uploadLoading}
             >
               {(isSubmitting || uploadLoading) && (
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               )}

               {uploadLoading ? (
                 <p>Uploading Image</p>
               ) : !address ? (
                 <p>Connect Wallet</p>
               ) : (
                 <p>Register User</p>
               )}
             </Button>

             <Button
               type="button"
               variant="outline"
               onClick={resetForm}
               disabled={isSubmitting || uploadLoading}
             >
               Reset
             </Button>
           </div>
         </form>
       </CardContent>
     </Card>
   </div>
 );
};

export default CreateUser;
