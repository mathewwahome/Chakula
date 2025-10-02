import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { MenuIcon, XIcon, BellIcon, UserIcon } from 'lucide-react';
const Navbar: React.FC = () => {
  const {
    isAuthenticated,
    user,
    logout
  } = useAuth();
  const {
    unreadActivityCount
  } = useNotification();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };
  const handlePostListing = () => {
    if (isAuthenticated) {
      navigate('/post-listing');
    } else {
      navigate('/auth?redirect=/post-listing');
    }
  };
  return <header className="sticky top-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-primary font-bold text-xl flex items-center">
              <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold">C</span>
              </span>
              ChakulaShare
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-neutral-dark hover:text-primary transition">
              Home
            </Link>
            <Link to="/food-surplus" className="text-neutral-dark hover:text-primary transition">
              Food Surplus
            </Link>
            <Link to="/waste" className="text-neutral-dark hover:text-primary transition">
              Waste
            </Link>
            <Link to="/about" className="text-neutral-dark hover:text-primary transition">
              About
            </Link>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? <>
                <div className="relative">
                  <button className="text-neutral-dark hover:text-primary transition" onClick={() => navigate('/dashboard')}>
                    <BellIcon className="w-6 h-6" />
                    {unreadActivityCount > 0 && <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {unreadActivityCount}
                      </span>}
                  </button>
                </div>
                <div className="relative">
                  <button className="flex items-center space-x-2 text-neutral-dark hover:text-primary transition" onClick={toggleUserMenu}>
                    <UserIcon className="w-6 h-6" />
                    <span className="hidden lg:inline">{user?.name}</span>
                  </button>
                  {isUserMenuOpen && <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.role}</p>
                      </div>
                      <Link to="/dashboard" className="block px-4 py-2 text-sm text-neutral-dark hover:bg-neutral-light transition" onClick={() => setIsUserMenuOpen(false)}>
                        Dashboard
                      </Link>
                      <button className="block w-full text-left px-4 py-2 text-sm text-neutral-dark hover:bg-neutral-light transition" onClick={handleLogout}>
                        Logout
                      </button>
                    </div>}
                </div>
              </> : <Link to="/auth" className="text-primary hover:text-primary-hover transition">
                Login / Sign Up
              </Link>}
            <button onClick={handlePostListing} className="bg-primary hover:bg-primary-hover text-white rounded-lg px-4 py-2 transition">
              Post Listing
            </button>
          </div>
          <button className="md:hidden text-neutral-dark" onClick={toggleMenu}>
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      {isMenuOpen && <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-end mb-2">
              <button className="text-neutral-dark" onClick={toggleMenu}>
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col space-y-4 mb-4">
              <Link to="/" className="text-neutral-dark hover:text-primary transition" onClick={toggleMenu}>
                Home
              </Link>
              <Link to="/food-surplus" className="text-neutral-dark hover:text-primary transition" onClick={toggleMenu}>
                Food Surplus
              </Link>
              <Link to="/waste" className="text-neutral-dark hover:text-primary transition" onClick={toggleMenu}>
                Waste
              </Link>
              <Link to="/about" className="text-neutral-dark hover:text-primary transition" onClick={toggleMenu}>
                About
              </Link>
            </nav>
            <div className="flex flex-col space-y-3">
              {isAuthenticated ? <>
                  <Link to="/dashboard" className="text-neutral-dark hover:text-primary transition flex items-center" onClick={toggleMenu}>
                    <BellIcon className="w-5 h-5 mr-2" />
                    Notifications
                    {unreadActivityCount > 0 && <span className="ml-2 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {unreadActivityCount}
                      </span>}
                  </Link>
                  <Link to="/dashboard" className="text-neutral-dark hover:text-primary transition flex items-center" onClick={toggleMenu}>
                    <UserIcon className="w-5 h-5 mr-2" />
                    Dashboard
                  </Link>
                  <button className="text-left text-neutral-dark hover:text-primary transition" onClick={() => {
              handleLogout();
              toggleMenu();
            }}>
                    Logout
                  </button>
                </> : <Link to="/auth" className="text-primary hover:text-primary-hover transition" onClick={toggleMenu}>
                  Login / Sign Up
                </Link>}
              <button onClick={() => {
            handlePostListing();
            toggleMenu();
          }} className="bg-primary hover:bg-primary-hover text-white rounded-lg px-4 py-2 transition">
                Post Listing
              </button>
            </div>
          </div>
        </div>}
    </header>;
};
export default Navbar;