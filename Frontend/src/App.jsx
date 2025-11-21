import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout Components (Visible on all pages)
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Page Components
import Home from "./pages/Home";
import Courses from "./pages/Courses"; 
import ContactUs from "./pages/ContactUs";
const App = () => {
  return (
    <Router>
      <ScrollToTop />
        <div className="font-sans text-slate-900 selection:bg-orange-100 selection:text-orange-900 bg-white flex flex-col min-h-screen">
          {/* 1. Navbar (Stays on top of every page) */}
          <Navbar />

          {/* 2. Main Content Area (Changes based on URL) */}
          <div className="flex-grow">
            <Routes>
              {/* The Home Page Route */}
              <Route path="/" element={<Home />} />

              {/* You can add more pages here later, e.g.: */}
              <Route path="/Courses" element={<Courses />} />
              <Route path="/contact" element={<ContactUs />} />
            </Routes>
          </div>

          {/* 3. Footer (Stays at bottom of every page) */}
          <Footer />
        </div>
     
    </Router>
  );
};

export default App;
