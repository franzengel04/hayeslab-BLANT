//import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // Main App styles

import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import SubmitJob from './pages/SubmitJob';
import LookupJob from './pages/LookupJob';

function App() {
  return (
    <Router>
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/submit-job" element={<SubmitJob />} />
            <Route path="/lookup-job" element={<LookupJob />} />
          </Routes>
        </main>
        <Footer />
    </Router>
  );
}

export default App;