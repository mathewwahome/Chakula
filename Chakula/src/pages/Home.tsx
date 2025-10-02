import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import ListingCard from '../components/ListingCard';
import { useListings, Listing } from '../context/ListingsContext';
const Home: React.FC = () => {
  const {
    listings
  } = useListings();
  const [foodSurplusListings, setFoodSurplusListings] = useState<Listing[]>([]);
  useEffect(() => {
    const filteredListings = listings.filter(listing => (listing.type === 'Surplus' || listing.type === 'Produce') && listing.status === 'Available').sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()).slice(0, 6);
    setFoodSurplusListings(filteredListings);
  }, [listings]);
  return <div>
      <Hero />
      <Stats />
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-dark">
              Latest Food Surplus
            </h2>
            <Link to="/food-surplus" className="text-primary hover:underline font-medium">
              View All
            </Link>
          </div>
          {foodSurplusListings.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodSurplusListings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
            </div> : <div className="text-center py-12">
              <p className="text-gray-500">
                No food surplus listings available at the moment.
              </p>
            </div>}
        </div>
      </div>
      <div className="py-12 bg-neutral-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-4">
            Join the Circular Economy
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Whether you're a restaurant with surplus food, a farmer with excess
            produce, or an organization helping those in need, ChakulaShare
            connects you to close the loop.
          </p>
          <Link to="/about" className="inline-block bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition">
            Learn More
          </Link>
        </div>
      </div>
    </div>;
};
export default Home;