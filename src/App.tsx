import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import Investment from "./pages/Investment";
import Blogs from "./pages/Blogs";
import PropertyDetails from "./pages/PropertyDetails";
import InvestmentDetails from "./pages/InvestmentDetails";
import BlogDetails from "./pages/BlogDetails";
import AddProperty from "./pages/AddProperty";
import { Toaster } from "./components/ui/toaster";
import StarknetProvider from "./providers/StarknetProvider";

function App() {
  return (
    <StarknetProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/investment" element={<Investment />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/investment/:id" element={<InvestmentDetails />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/add-property" element={<AddProperty />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </StarknetProvider>
  );
}

export default App;