import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import StarknetProvider from "@/providers/StarknetProvider";
import Index from "@/pages/Index";
import Properties from "@/pages/Properties";
import PropertyDetails from "@/pages/PropertyDetails";
import AddProperty from "@/pages/AddProperty";
import EditProperty from "@/pages/EditProperty";
import Investment from "@/pages/Investment";
import InvestmentDetails from "@/pages/InvestmentDetails";
import AddInvestment from "@/pages/AddInvestment";
import Profile from "@/pages/Profile";
import CreateUser from "@/pages/CreateUser";
import RegisterAgent from "@/pages/RegisterAgent";
import Blogs from "@/pages/Blogs";
import BlogDetails from "@/pages/BlogDetails";

function App() {
  return (
    <StarknetProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/properties/add" element={<AddProperty />} />
              <Route path="/properties/:id/edit" element={<EditProperty />} />
              <Route path="/investment" element={<Investment />} />
              <Route path="/investment/:id" element={<InvestmentDetails />} />
              <Route path="/investment/add" element={<AddInvestment />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-user" element={<CreateUser />} />
              <Route path="/register-agent" element={<RegisterAgent />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetails />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </StarknetProvider>
  );
}

export default App;