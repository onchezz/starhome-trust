import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Properties from "@/pages/Properties";
import PropertyDetails from "@/pages/PropertyDetails";
import Blogs from "@/pages/Blogs";
import BlogDetails from "@/pages/BlogDetails";
import Investment from "@/pages/Investment";
import InvestmentDetails from "@/pages/InvestmentDetails";
import AddInvestment from "@/pages/AddInvestment";
import Profile from "@/pages/Profile";
import CreateUser from "@/pages/CreateUser";
import CreateProperty from "@/pages/AddProperty";
import { Toaster } from "@/components/ui/sonner";
import StarknetProvider from "@/providers/StarknetProvider";
import RegisterAgent from "./pages/RegisterAgent";
// import CreateProperty from "./pages/AddProperty";

function App() {
  return (
    <StarknetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/investment" element={<Investment />} />
          <Route path="/investment/:id" element={<InvestmentDetails />} />
          <Route path="/add-investment" element={<AddInvestment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/create-agent" element={<RegisterAgent />} />
          <Route path="/create-property" element={<CreateProperty />} />
        </Routes>
        <Toaster />
      </Router>
    </StarknetProvider>
  );
}

export default App;
