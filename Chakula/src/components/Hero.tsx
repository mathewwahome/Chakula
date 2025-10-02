import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const Hero: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated
  } = useAuth();
  const handlePostListing = () => {
    if (isAuthenticated) {
      navigate('/post-listing');
    } else {
      navigate('/auth?redirect=/post-listing');
    }
  };
  return <div className="relative bg-primary overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1920&q=80" alt="Circular economy" className="w-full h-full object-cover" />
      </div>
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Reduce food waste. Close the loop.
          </h1>
          <p className="text-lg md:text-xl text-white opacity-90 mb-8">
            ChakulaShare connects surplus food with communities in need while
            routing inedible materials to composting and recycling partners.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button onClick={handlePostListing} className="bg-accent hover:bg-opacity-90 text-white px-6 py-3 rounded-lg font-medium transition">
              Post Listing
            </button>
            <button onClick={() => navigate('/food-surplus')} className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg font-medium transition">
              Browse Food Surplus
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default Hero;