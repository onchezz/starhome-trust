import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Properties from "@/pages/Properties";
import PropertyDetails from "@/pages/PropertyDetails";
import Investment from "@/pages/Investment";
import InvestmentDetails from "@/pages/InvestmentDetails";
import Blogs from "@/pages/Blogs";
import BlogDetails from "@/pages/BlogDetails";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/investment" element={<Investment />} />
        <Route path="/investment/:id" element={<InvestmentDetails />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
      </Routes>
    </Router>
  );
}

export default App;