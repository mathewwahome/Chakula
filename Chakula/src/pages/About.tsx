import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { InfoIcon, RecycleIcon, UsersIcon, LeafIcon, HeartIcon, ArrowRightIcon } from 'lucide-react';
const About: React.FC = () => {
  const {
    isAuthenticated
  } = useAuth();
  return <div className="bg-neutral-light min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-dark mb-4">
            About ChakulaShare
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Reducing food waste and closing the loop in Kenya's circular
            economy.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img src="https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=800&q=80" alt="Food sharing" className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-2xl font-bold text-neutral-dark mb-4">
                Our Mission
              </h2>
              <p className="text-gray-700 mb-6">
                ChakulaShare is a platform dedicated to reducing food waste by
                connecting surplus food from restaurants and farms with
                communities in need, while ensuring that inedible waste is
                properly recycled or composted.
              </p>
              <p className="text-gray-700">
                We believe in creating a circular economy where nothing goes to
                waste. Food that can be consumed finds its way to those who need
                it, and materials that can't be eaten are properly recycled or
                composted, creating a sustainable cycle.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Connect</h3>
            <p className="text-gray-600">
              We connect food sources with communities and recycling partners to
              ensure nothing goes to waste.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Share</h3>
            <p className="text-gray-600">
              We facilitate the sharing of surplus food with those who need it
              most, fighting hunger and waste.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <RecycleIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Recycle</h3>
            <p className="text-gray-600">
              We ensure inedible waste is properly recycled or composted, not
              sent to landfills.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <LeafIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Sustain</h3>
            <p className="text-gray-600">
              We're building a sustainable ecosystem that benefits communities
              and the environment.
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-neutral-dark mb-6">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="border-2 border-primary rounded-lg p-6">
                <h3 className="font-bold text-lg mb-3">For Food Providers</h3>
                <p className="text-gray-700 mb-4">
                  Restaurants and farmers can post listings for surplus food or
                  produce that would otherwise go to waste.
                </p>
                <ul className="text-gray-700 space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-primary text-white rounded-full text-xs flex items-center justify-center mr-2 mt-1">
                      1
                    </span>
                    Create an account and verify your business
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-primary text-white rounded-full text-xs flex items-center justify-center mr-2 mt-1">
                      2
                    </span>
                    Post details about your surplus food
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-primary text-white rounded-full text-xs flex items-center justify-center mr-2 mt-1">
                      3
                    </span>
                    Set pickup windows and manage requests
                  </li>
                </ul>
              </div>
              {!isAuthenticated && <Link to="/auth" className="mt-4 inline-block bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition flex items-center">
                  Sign Up Now
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>}
            </div>
            <div className="relative">
              <div className="border-2 border-accent rounded-lg p-6">
                <h3 className="font-bold text-lg mb-3">For Beneficiaries</h3>
                <p className="text-gray-700 mb-4">
                  Community organizations, shelters, and food programs can
                  request available food surplus.
                </p>
                <ul className="text-gray-700 space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-accent text-white rounded-full text-xs flex items-center justify-center mr-2 mt-1">
                      1
                    </span>
                    Register as a beneficiary organization
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-accent text-white rounded-full text-xs flex items-center justify-center mr-2 mt-1">
                      2
                    </span>
                    Browse available food surplus listings
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-accent text-white rounded-full text-xs flex items-center justify-center mr-2 mt-1">
                      3
                    </span>
                    Request items and arrange pickup or delivery
                  </li>
                </ul>
              </div>
              {!isAuthenticated && <Link to="/auth" className="mt-4 inline-block bg-accent hover:bg-opacity-90 text-white px-4 py-2 rounded-lg transition flex items-center">
                  Sign Up Now
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>}
            </div>
            <div className="relative">
              <div className="border-2 border-green-500 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-3">For Waste Partners</h3>
                <p className="text-gray-700 mb-4">
                  Recycling and composting partners can collect inedible food
                  waste and packaging.
                </p>
                <ul className="text-gray-700 space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-green-500 text-white rounded-full text-xs flex items-center justify-center mr-2 mt-1">
                      1
                    </span>
                    Register as a waste management partner
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-green-500 text-white rounded-full text-xs flex items-center justify-center mr-2 mt-1">
                      2
                    </span>
                    Browse available waste collection listings
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-green-500 text-white rounded-full text-xs flex items-center justify-center mr-2 mt-1">
                      3
                    </span>
                    Schedule collections and track impact
                  </li>
                </ul>
              </div>
              {!isAuthenticated && <Link to="/auth" className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition flex items-center">
                  Sign Up Now
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>}
            </div>
          </div>
        </div>
        <div className="bg-primary text-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Join the ChakulaShare Network Today
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Whether you're a restaurant with surplus food, a farmer with excess
            produce, or an organization helping those in need, ChakulaShare
            connects you to close the loop.
          </p>
          {!isAuthenticated ? <Link to="/auth" className="inline-block bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition">
              Create Your Account
            </Link> : <Link to="/post-listing" className="inline-block bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition">
              Post a Listing
            </Link>}
        </div>
      </div>
    </div>;
};
export default About;