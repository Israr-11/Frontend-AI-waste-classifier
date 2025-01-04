import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import React Router
import CustomFooter from './components/Footer';
import CustomNavbar from './components/Navbar';
import HeroSection from './components/Hero';
import OverviewSection from './components/Overview';
import WhyThisSection from './components/WhyThis';
import Process from './components/core/Process';
import Flow from './components/Flow';

function App() {
  return (
    <Router>
      {/* Navbar */}
      <CustomNavbar />
      
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<>
          <HeroSection />
          <OverviewSection />
          <WhyThisSection />
        </>} />

        <Route path="/process" element={<Process />} />
        <Route path="/flow" element={<Flow />} />


      </Routes>
      
      <CustomFooter />
    </Router>
  );
}

export default App;
