import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StarknetProvider from "./providers/StarknetProvider";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Investment from "./pages/Investment";
import InvestmentDetails from "./pages/InvestmentDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <StarknetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/investment" element={<Investment />} />
            <Route path="/investment/:id" element={<InvestmentDetails />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </StarknetProvider>
  </QueryClientProvider>
);

export default App;