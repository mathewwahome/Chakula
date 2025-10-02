import React from 'react';
import { Link } from 'react-router-dom';
const Footer: React.FC = () => {
  return <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ChakulaShare</h3>
            <p className="text-sm opacity-80">
              Reducing food waste and closing the loop in Kenya's circular
              economy.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm opacity-80 hover:opacity-100 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/food-surplus" className="text-sm opacity-80 hover:opacity-100 transition">
                  Food Surplus
                </Link>
              </li>
              <li>
                <Link to="/waste" className="text-sm opacity-80 hover:opacity-100 transition">
                  Waste
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm opacity-80 hover:opacity-100 transition">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">For Businesses</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/post-listing" className="text-sm opacity-80 hover:opacity-100 transition">
                  Post Surplus
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm opacity-80 hover:opacity-100 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm opacity-80 hover:opacity-100 transition">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-sm opacity-80 mb-2">Nairobi, Kenya</p>
            <p className="text-sm opacity-80 mb-2">info@chakulashare.co.ke</p>
            <p className="text-sm opacity-80">+254 700 123 456</p>
          </div>
        </div>
        <div className="border-t border-white border-opacity-20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-80 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ChakulaShare. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-sm opacity-80 hover:opacity-100 transition">
              Privacy Policy
            </a>
            <a href="#" className="text-sm opacity-80 hover:opacity-100 transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;