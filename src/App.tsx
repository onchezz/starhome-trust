import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Investment from "./pages/Investment";
import InvestmentDetails from "./pages/InvestmentDetails";
import Blogs from "./pages/Blogs";
import BlogDetails from "./pages/BlogDetails";
import StarknetProvider from "./providers/StarknetProvider";

function App() {
  return (
    <StarknetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/investment" element={<Investment />} />
          <Route path="/investment/:id" element={<InvestmentDetails />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </StarknetProvider>
  );
}

export default App;