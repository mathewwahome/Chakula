import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ListingsProvider } from './context/ListingsContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import FoodSurplus from './pages/FoodSurplus';
import Waste from './pages/Waste';
import About from './pages/About';
import ListingPost from './pages/ListingPost';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import ListingDetail from './components/ListingDetail';
import Toast from './components/Toast';
export function App() {
  return <AuthProvider>
      <ListingsProvider>
        <NotificationProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-neutral-light">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/food-surplus" element={<FoodSurplus />} />
                  <Route path="/waste" element={<Waste />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/post-listing" element={<ListingPost />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/listing/:id" element={<ListingDetail />} />
                </Routes>
              </main>
              <Footer />
              <Toast />
            </div>
          </Router>
        </NotificationProvider>
      </ListingsProvider>
    </AuthProvider>;
}