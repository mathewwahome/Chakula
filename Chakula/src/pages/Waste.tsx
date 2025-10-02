import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import FilterAccordion from '../components/FilterAccordion';
import RequestModal from '../components/RequestModal';
import { useListings, Listing, WasteType, NonBiodegradableType } from '../context/ListingsContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { SearchIcon, FilterIcon, XIcon, RecycleIcon } from 'lucide-react';
const Waste: React.FC = () => {
  const {
    getWasteListings
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
  const [wasteTypeFilter, setWasteTypeFilter] = useState<string[]>([]);
  const [nonBiodegradableTypeFilter, setNonBiodegradableTypeFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('recent');
  useEffect(() => {
    let wasteType: WasteType | undefined = undefined;
    let nonBioType: NonBiodegradableType | undefined = undefined;
    if (wasteTypeFilter.length === 1) {
      wasteType = wasteTypeFilter[0] as WasteType;
      if (wasteType === 'Non-Biodegradable' && nonBiodegradableTypeFilter.length === 1) {
        nonBioType = nonBiodegradableTypeFilter[0] as NonBiodegradableType;
      }
    }
    let filtered = getWasteListings(wasteType, nonBioType).filter(listing => listing.status === 'Available');
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(listing => listing.title.toLowerCase().includes(term) || listing.description.toLowerCase().includes(term) || listing.county.toLowerCase().includes(term));
    }
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
        break;
      case 'volume-high':
        filtered.sort((a, b) => {
          const volumeA = parseFloat(a.wasteDetails?.estimatedVolume || '0');
          const volumeB = parseFloat(b.wasteDetails?.estimatedVolume || '0');
          return volumeB - volumeA;
        });
        break;
      case 'volume-low':
        filtered.sort((a, b) => {
          const volumeA = parseFloat(a.wasteDetails?.estimatedVolume || '0');
          const volumeB = parseFloat(b.wasteDetails?.estimatedVolume || '0');
          return volumeA - volumeB;
        });
        break;
    }
    setFilteredListings(filtered);
  }, [getWasteListings, searchTerm, wasteTypeFilter, nonBiodegradableTypeFilter, sortBy]);
  const handleRequestClick = (listing: Listing) => {
    if (!isAuthenticated) {
      navigate(`/auth?redirect=/waste`);
      return;
    }
    if (user?.role !== 'Waste Partner') {
      showToast('Only waste partners can claim waste listings', 'error');
      return;
    }
    setSelectedListing(listing);
    setShowRequestModal(true);
  };
  const handleRequestSubmit = () => {
    setShowRequestModal(false);
    setSelectedListing(null);
    showToast('Waste collection scheduled successfully', 'success');
    addActivity(`You scheduled collection for "${selectedListing?.title}"`);
    navigate('/dashboard');
  };
  const wasteTypeOptions = [{
    id: 'Biodegradable',
    label: 'Biodegradable'
  }, {
    id: 'Non-Biodegradable',
    label: 'Non-Biodegradable'
  }];
  const nonBiodegradableOptions = [{
    id: 'Plastics',
    label: 'Plastics'
  }, {
    id: 'Non-Plastics',
    label: 'Non-Plastics (Glass, Metal, etc.)'
  }];
  const sortOptions = [{
    id: 'recent',
    label: 'Most Recent'
  }, {
    id: 'volume-high',
    label: 'Volume: High to Low'
  }, {
    id: 'volume-low',
    label: 'Volume: Low to High'
  }];
  return <div className="bg-neutral-light min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <RecycleIcon className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-neutral-dark">
            Waste Management
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-3">About Waste Management</h2>
          <p className="text-gray-700 mb-4">
            ChakulaShare helps route inedible materials to composting and
            recycling partners. Waste is categorized as Biodegradable (food
            scraps, plant waste) or Non-Biodegradable (plastics, glass, metals)
            to ensure proper handling.
          </p>
          <p className="text-gray-700">
            Waste Partners can browse and claim listings for collection and
            processing.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search waste listings..." className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
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
              <FilterAccordion title="Waste Type" options={wasteTypeOptions} selectedOptions={wasteTypeFilter} onChange={setWasteTypeFilter} allowMultiple={false} />
              {wasteTypeFilter.includes('Non-Biodegradable') && <FilterAccordion title="Non-Biodegradable Type" options={nonBiodegradableOptions} selectedOptions={nonBiodegradableTypeFilter} onChange={setNonBiodegradableTypeFilter} allowMultiple={false} />}
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
                setWasteTypeFilter([]);
                setNonBiodegradableTypeFilter([]);
                setSortBy('recent');
              }} className="text-primary hover:underline text-sm">
                  Clear All Filters
                </button>
              </div>
            </div>
          </aside>
          <div className="flex-1">
            {filteredListings.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map(listing => <ListingCard key={listing.id} listing={listing} onRequestClick={handleRequestClick} showRequestButton={isAuthenticated && user?.role === 'Waste Partner'} />)}
              </div> : <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500 mb-4">
                  No waste listings found matching your criteria.
                </p>
                <button onClick={() => {
              setSearchTerm('');
              setWasteTypeFilter([]);
              setNonBiodegradableTypeFilter([]);
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
export default Waste;