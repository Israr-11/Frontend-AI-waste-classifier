import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import React Router
import CustomFooter from './components/Footer';
import CustomNavbar from './components/Navbar';
import HeroSection from './components/Hero';
import OverviewSection from './components/Overview';
import WhyThisSection from './components/WhyThis';
import Process from './components/core/ProcessReal';
import Flow from './components/Flow';
import ResultsPage from './components/Results';
import Statistics from './components/Statistics';


function App() {
  return (
    <Router>
      {/* Navbar */}
      <CustomNavbar />
      
      <Routes>
        {/* Home Page Route*/}
        <Route path="/" element={<>
          <HeroSection />
          <OverviewSection />
          <WhyThisSection />
        </>} />

        <Route path="/process" element={<Process />} />
        <Route path="/flow" element={<Flow />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/statistics" element={<Statistics/>} />

      </Routes>
      
      <CustomFooter />
    </Router>
  );
}

export default App;
