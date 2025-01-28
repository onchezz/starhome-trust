import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const ContactForm = () => {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      const response = await fetch("https://formsubmit.co/brianonchezz@gmail.com", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "We'll get back to you as soon as possible.",
        });
        (e.target as HTMLFormElement).reset();
      } else {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-primary dark:bg-primary/10 rounded-3xl p-8 text-white">
              <img
                src="/lovable-uploads/f0e1f301-eb87-4525-91c1-305fe18c2b3e.png"
                alt="Contact"
                className="w-full rounded-xl mb-6"
              />
              <h2 className="text-3xl font-bold mb-4">Get in Touch with Starhomes</h2>
              <p className="mb-6">
                Ready to start your global real estate investment journey? We're here
                to help you every step of the way.
              </p>
            </div>
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Your Name
                  </label>
                  <Input 
                    name="name" 
                    placeholder="John Doe" 
                    required 
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Email
                  </label>
                  <Input 
                    name="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Your Message
                  </label>
                  <Textarea
                    name="message"
                    placeholder="Tell us about your investment goals..."
                    className="min-h-[150px] dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Your Inquiry
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;