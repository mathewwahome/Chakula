import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import FilterAccordion from '../components/FilterAccordion';
import RequestModal from '../components/RequestModal';
import { useListings, Listing, ListingType } from '../context/ListingsContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { SearchIcon, FilterIcon, XIcon, AppleIcon } from 'lucide-react';
const FoodSurplus: React.FC = () => {
  const {
    getListingsByType,
    getListingsBySource
  } = useListings();
  const {
    isAuthenticated,
    user
  } = useAuth();
  const {
    showToast,
    addActivity
  } = useNotification();
  const navigate = useNavigate();
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [sourceFilter, setSourceFilter] = useState<string[]>([]);
  const [countyFilter, setCountyFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('recent');
  useEffect(() => {
    let filtered = getListingsByType('All').filter(listing => (listing.type === 'Surplus' || listing.type === 'Produce') && listing.status === 'Available');
    if (typeFilter.length > 0) {
      filtered = filtered.filter(listing => typeFilter.includes(listing.type));
    }
    if (sourceFilter.length > 0) {
      filtered = filtered.filter(listing => sourceFilter.includes(listing.source));
    }
    if (countyFilter.length > 0) {
      filtered = filtered.filter(listing => countyFilter.includes(listing.county));
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(listing => listing.title.toLowerCase().includes(term) || listing.description.toLowerCase().includes(term) || listing.county.toLowerCase().includes(term) || listing.category.toLowerCase().includes(term));
    }
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
        break;
      case 'value-high':
        filtered.sort((a, b) => b.value - a.value);
        break;
      case 'value-low':
        filtered.sort((a, b) => a.value - b.value);
        break;
      case 'expiry':
        filtered.sort((a, b) => {
          if (!a.expiryDate) return 1;
          if (!b.expiryDate) return -1;
          return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        });
        break;
    }
    setFilteredListings(filtered);
  }, [getListingsByType, getListingsBySource, searchTerm, typeFilter, sourceFilter, countyFilter, sortBy]);
  const handleRequestClick = (listing: Listing) => {
    if (!isAuthenticated) {
      navigate(`/auth?redirect=/food-surplus`);
      return;
    }
    if (user?.role !== 'Beneficiary') {
      showToast('Only beneficiaries can request food surplus listings', 'error');
      return;
    }
    setSelectedListing(listing);
    setShowRequestModal(true);
  };
  const handleRequestSubmit = () => {
    setShowRequestModal(false);
    setSelectedListing(null);
    showToast('Request submitted successfully', 'success');
    addActivity(`You requested "${selectedListing?.title}"`);
    navigate('/dashboard');
  };
  const typeOptions = [{
    id: 'Surplus',
    label: 'Prepared Food'
  }, {
    id: 'Produce',
    label: 'Farm Produce'
  }];
  const sourceOptions = [{
    id: 'Restaurant',
    label: 'Restaurant'
  }, {
    id: 'Farmer',
    label: 'Farmer'
  }];
  const countyOptions = [{
    id: 'Nairobi',
    label: 'Nairobi'
  }, {
    id: 'Mombasa',
    label: 'Mombasa'
  }, {
    id: 'Kisumu',
    label: 'Kisumu'
  }, {
    id: 'Nakuru',
    label: 'Nakuru'
  }, {
    id: 'Eldoret',
    label: 'Eldoret'
  }, {
    id: 'Machakos',
    label: 'Machakos'
  }];
  const sortOptions = [{
    id: 'recent',
    label: 'Most Recent'
  }, {
    id: 'value-high',
    label: 'Value: High to Low'
  }, {
    id: 'value-low',
    label: 'Value: Low to High'
  }, {
    id: 'expiry',
    label: 'Expiry Date: Soonest First'
  }];
  return <div className="bg-neutral-light min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <AppleIcon className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-neutral-dark">Food Surplus</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-3">About Food Surplus</h2>
          <p className="text-gray-700 mb-4">
            ChakulaShare connects restaurants with surplus food and farmers with
            excess produce to communities and organizations in need. Browse
            available listings below.
          </p>
          <p className="text-gray-700">
            Beneficiaries can request available food items for collection or
            delivery.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search food surplus listings..." className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button className="md:hidden flex items-center justify-center px-4 py-2 border rounded-lg bg-white" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? <XIcon className="w-5 h-5 mr-1" /> : <FilterIcon className="w-5 h-5 mr-1" />}
            {showFilters ? 'Close Filters' : 'Filters'}
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <aside className={`w-full md:w-64 md:block ${showFilters ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="font-bold text-neutral-dark mb-4">Filters</h2>
              <FilterAccordion title="Food Type" options={typeOptions} selectedOptions={typeFilter} onChange={setTypeFilter} />
              <FilterAccordion title="Source" options={sourceOptions} selectedOptions={sourceFilter} onChange={setSourceFilter} />
              <FilterAccordion title="County" options={countyOptions} selectedOptions={countyFilter} onChange={setCountyFilter} />
              <div className="border-b border-gray-200 py-4">
                <h3 className="font-medium text-neutral-dark mb-3">Sort By</h3>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  {sortOptions.map(option => <option key={option.id} value={option.id}>
                      {option.label}
                    </option>)}
                </select>
              </div>
              <div className="mt-4">
                <button onClick={() => {
                setSearchTerm('');
                setTypeFilter([]);
                setSourceFilter([]);
                setCountyFilter([]);
                setSortBy('recent');
              }} className="text-primary hover:underline text-sm">
                  Clear All Filters
                </button>
              </div>
            </div>
          </aside>
          <div className="flex-1">
            {filteredListings.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map(listing => <ListingCard key={listing.id} listing={listing} onRequestClick={handleRequestClick} showRequestButton={isAuthenticated && user?.role === 'Beneficiary'} />)}
              </div> : <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500 mb-4">
                  No food surplus listings found matching your criteria.
                </p>
                <button onClick={() => {
              setSearchTerm('');
              setTypeFilter([]);
              setSourceFilter([]);
              setCountyFilter([]);
            }} className="text-primary hover:underline">
                  Clear filters and try again
                </button>
              </div>}
          </div>
        </div>
      </div>
      {showRequestModal && selectedListing && <RequestModal listing={selectedListing} onClose={() => setShowRequestModal(false)} onSubmit={handleRequestSubmit} />}
    </div>;
};
export default FoodSurplus;