import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatTimeAgo } from '../utils/formatters';
import { Listing } from '../context/ListingsContext';
import { MapPinIcon, ClockIcon, AlertTriangleIcon } from 'lucide-react';
interface ListingCardProps {
  listing: Listing;
  onRequestClick?: (listing: Listing) => void;
  showRequestButton?: boolean;
}
const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onRequestClick,
  showRequestButton = false
}) => {
  const navigate = useNavigate();
  const isNearExpiry = listing.expiryDate && new Date(listing.expiryDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;
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
  const handleViewClick = () => {
    navigate(`/listing/${listing.id}`);
  };
  const handleRequestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRequestClick) {
      onRequestClick(listing);
    }
  };
  return <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer" onClick={handleViewClick}>
      <div className="relative h-48">
        <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
        {isNearExpiry && <div className="absolute top-2 right-2 bg-danger text-white text-xs px-2 py-1 rounded-full flex items-center">
            <AlertTriangleIcon className="w-3 h-3 mr-1" />
            Near Expiry
          </div>}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-neutral-dark truncate mr-2">
            {listing.title}
          </h3>
          {listing.value > 0 && <span className="text-accent font-medium whitespace-nowrap">
              {formatCurrency(listing.value)}
            </span>}
        </div>
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
        <div className="text-sm text-gray-600 mb-3">
          <div className="flex items-center mb-1">
            <MapPinIcon className="w-4 h-4 mr-1" />
            <span>{listing.county}</span>
            {listing.distance && <span className="ml-1">({listing.distance.toFixed(1)} km)</span>}
          </div>
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-1" />
            <span>Posted {formatTimeAgo(listing.postedAt)}</span>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button className="px-4 py-2 bg-neutral-light text-neutral-dark rounded-lg hover:bg-gray-200 transition" onClick={handleViewClick}>
            View
          </button>
          {showRequestButton && listing.status === 'Available' && <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90 transition" onClick={handleRequestClick}>
              Request
            </button>}
        </div>
      </div>
    </div>;
};
export default ListingCard;