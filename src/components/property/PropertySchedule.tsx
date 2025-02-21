import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Phone } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePropertyCreate } from "@/hooks/contract_interactions/usePropertiesWrite";
import { VisitRequest } from "@/types/visit_request";
import { useAccount } from "@starknet-react/core";

interface PropertyScheduleProps {
  property_id: string;
  agent_id: string;
  user_id?: string; // Optional as the user might not be logged in
}

export const PropertySchedule = ({
  property_id,
  agent_id,
  user_id = "",
}: PropertyScheduleProps) => {
  const [date, setDate] = useState<Date>();
  const { account } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendVisitPropertyRequest, contractStatus } = usePropertyCreate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Using the hook instead of defining the function locally

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast.error("Please select a preferred visit date");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare visit request data
      const visitRequest: Partial<VisitRequest> = {
        user_id: account.address,
        property_id: property_id,
        agent_id: agent_id,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        visit_date: date,
        timestamp: new Date(),
      };

      // Send the request
      const result = await sendVisitPropertyRequest(visitRequest);

      if (result.status.status.isSuccess) {
        toast.success("Visit request submitted successfully!");
        // Reset form after successful submission
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
        setDate(undefined);
      } else {
        toast.error("Failed to submit visit request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting visit request:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Request for Visit</h2>
      {contractStatus.isPending && (
        <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded">
          Processing your request...
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="w-full min-h-[100px] p-2 border rounded-md"
            placeholder="I would like to know more about this property..."
          />
        </div>

        <div className="space-y-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                {date ? date.toLocaleDateString() : "Select Preferred Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || contractStatus.isPending}
          >
            {isSubmitting || contractStatus.isPending
              ? "Sending..."
              : "Send Request"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Calendar, Phone } from "lucide-react";
// import { toast } from "sonner";
// import { useState } from "react";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Calendar as CalendarComponent } from "@/components/ui/calendar";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export const PropertySchedule = () => {
//   const [date, setDate] = useState<Date>();
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     message: ''
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     toast.success("Request submitted successfully!");
//   };

//   return (
//     <Card className="p-6">
//       <h2 className="text-xl font-semibold mb-4">Request for Visit</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="grid grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="firstName">First Name</Label>
//             <Input
//               id="firstName"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="lastName">Last Name</Label>
//             <Input
//               id="lastName"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="email">Email</Label>
//           <Input
//             id="email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="phone">Phone</Label>
//           <Input
//             id="phone"
//             name="phone"
//             type="tel"
//             value={formData.phone}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="message">Message</Label>
//           <textarea
//             id="message"
//             name="message"
//             value={formData.message}
//             onChange={handleInputChange}
//             className="w-full min-h-[100px] p-2 border rounded-md"
//             placeholder="I would like to know more about this property..."
//           />
//         </div>

//         <div className="space-y-4">
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="outline"
//                 className="w-full flex items-center justify-center gap-2"
//               >
//                 <Calendar className="h-4 w-4" />
//                 {date ? date.toLocaleDateString() : "Select Preferred Date"}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0" align="start">
//               <CalendarComponent
//                 mode="single"
//                 selected={date}
//                 onSelect={setDate}
//                 initialFocus
//               />
//             </PopoverContent>
//           </Popover>

//           <Button type="submit" className="w-full">Send Request</Button>
//         </div>
//       </form>
//     </Card>
//   );
// };
