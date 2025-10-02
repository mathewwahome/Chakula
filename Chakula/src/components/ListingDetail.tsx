import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListings, Listing } from '../context/ListingsContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { formatCurrency, formatDate, formatTimeAgo } from '../utils/formatters';
import RequestModal from './RequestModal';
import { MapPinIcon, ClockIcon, UserIcon, CalendarIcon, TruckIcon, XIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
const ListingDetail: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    getListing
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
  const [listing, setListing] = useState<Listing | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    if (id) {
      const foundListing = getListing(id);
      if (foundListing) {
        setListing(foundListing);
      } else {
        navigate('/food-surplus');
        showToast('Listing not found', 'error');
      }
    }
  }, [id, getListing, navigate, showToast]);
  if (!listing) {
    return <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>;
  }
  const handleRequestClick = () => {
    if (!isAuthenticated) {
      navigate(`/auth?redirect=/listing/${listing.id}`);
      return;
    }
    if (user?.role !== 'Beneficiary' && (listing.type === 'Surplus' || listing.type === 'Produce')) {
      showToast('Only beneficiaries can request food surplus listings', 'error');
      return;
    }
    if (user?.role !== 'Waste Partner' && (listing.type === 'Biodegradable' || listing.type === 'Non-Biodegradable')) {
      showToast('Only waste partners can claim waste listings', 'error');
      return;
    }
    setIsRequestModalOpen(true);
  };
  const handleRequestSubmit = () => {
    setIsRequestModalOpen(false);
    showToast(listing.type === 'Biodegradable' || listing.type === 'Non-Biodegradable' ? 'Waste collection scheduled successfully' : 'Request submitted successfully', 'success');
    addActivity(listing.type === 'Biodegradable' || listing.type === 'Non-Biodegradable' ? `You scheduled collection for "${listing.title}"` : `You requested "${listing.title}"`);
    navigate('/dashboard');
  };
  const nextImage = () => {
    setCurrentImageIndex(prev => prev === listing.images.length - 1 ? 0 : prev + 1);
  };
  const prevImage = () => {
    setCurrentImageIndex(prev => prev === 0 ? listing.images.length - 1 : prev - 1);
  };
  const isWasteListing = listing.type === 'Biodegradable' || listing.type === 'Non-Biodegradable';
  const getListingTypeColor = (type: string) => {
    switch (type) {
      case 'Surplus':
        return 'bg-blue-100 text-blue-800';
      case 'Produce':
        return 'bg-green-100 text-green-800';
      case 'Biodegradable':
        return 'bg-amber-100 text-amber-800';
      case 'Non-Biodegradable':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getSourceColor = (source: string) => {
    return source === 'Restaurant' ? 'bg-orange-100 text-orange-800' : 'bg-teal-100 text-teal-800';
  };
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-primary hover:underline">
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Back to listings
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <div className="relative h-64 md:h-full">
              <img src={listing.images[currentImageIndex]} alt={listing.title} className="w-full h-full object-cover" />
              {listing.images.length > 1 && <>
                  <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition">
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition">
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
                    {listing.images.map((_, index) => <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`} />)}
                  </div>
                </>}
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-xs px-2 py-1 rounded-full ${getSourceColor(listing.source)}`}>
                {listing.source}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${getListingTypeColor(listing.type)}`}>
                {listing.type}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                {listing.category}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-dark mb-2">
              {listing.title}
            </h1>
            {listing.value > 0 && <p className="text-xl text-accent font-medium mb-4">
                {formatCurrency(listing.value)}
              </p>}
            <div className="mb-4">
              <p className="text-gray-700">{listing.description}</p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-600">
                <UserIcon className="w-5 h-5 mr-2" />
                <span>
                  Posted by {listing.postedBy.name},{' '}
                  {listing.postedBy.organization}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPinIcon className="w-5 h-5 mr-2" />
                <span>
                  {listing.location.address}, {listing.county}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <ClockIcon className="w-5 h-5 mr-2" />
                <span>Posted {formatTimeAgo(listing.postedAt)}</span>
              </div>
              {listing.expiryDate && <div className="flex items-center text-gray-600">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  <span>Expires on {formatDate(listing.expiryDate)}</span>
                </div>}
              {listing.quantity && <div className="flex items-center text-gray-600">
                  <span className="font-medium mr-2">Quantity:</span>
                  <span>{listing.quantity}</span>
                </div>}
              {isWasteListing && listing.wasteDetails && <div className="flex items-center text-gray-600">
                  <span className="font-medium mr-2">Waste Type:</span>
                  <span>
                    {listing.wasteDetails.type}
                    {listing.wasteDetails.nonBiodegradableType && ` (${listing.wasteDetails.nonBiodegradableType})`}
                  </span>
                </div>}
            </div>
            {listing.pickupWindows && listing.pickupWindows.length > 0 && <div className="mb-6">
                <h3 className="font-medium text-neutral-dark mb-2">
                  Pickup Windows:
                </h3>
                <div className="space-y-2">
                  {listing.pickupWindows.map((window, index) => <div key={index} className="flex items-center">
                      <TruckIcon className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm">{window}</span>
                    </div>)}
                </div>
              </div>}
            {listing.status === 'Available' && <button onClick={handleRequestClick} className="w-full bg-accent hover:bg-opacity-90 text-white py-3 rounded-lg font-medium transition">
                {isWasteListing ? 'Claim for Recycling' : 'Request'}
              </button>}
            {listing.status !== 'Available' && <div className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg text-center">
                This listing is no longer available
              </div>}
          </div>
        </div>
      </div>
      {listing.matches && listing.matches.length > 0 && <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-neutral-dark mb-4">
            Potential Matches
          </h2>
          <div className="space-y-4">
            {listing.matches.map(match => <div key={match.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-neutral-dark">
                    {match.name}
                  </h3>
                  <span className="text-sm bg-primary text-white px-2 py-1 rounded-full">
                    {match.score}% Match
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{match.rationale}</p>
              </div>)}
          </div>
        </div>}
      {isRequestModalOpen && listing && <RequestModal listing={listing} onClose={() => setIsRequestModalOpen(false)} onSubmit={handleRequestSubmit} />}
    </div>;
};
export default ListingDetail;