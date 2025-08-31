import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'; // Import your existing content
import UrbanRuralDashboard from './urban_rural_visualization';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/urban-rural" element={<UrbanRuralDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;