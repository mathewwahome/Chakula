import React, { useEffect, useState, createContext, useContext } from 'react';
import mockListings from '../data/mockListings.json';
import { matchListings } from '../utils/matchingAlgorithm';
export type ListingType = 'Surplus' | 'Produce' | 'Biodegradable' | 'Non-Biodegradable';
export type ListingSource = 'Restaurant' | 'Farmer';
export type ListingStatus = 'Available' | 'Pending Pickup' | 'Completed' | 'Expired';
export type WasteType = 'Biodegradable' | 'Non-Biodegradable';
export type NonBiodegradableType = 'Plastics' | 'Non-Plastics';
export interface Listing {
  id: string;
  title: string;
  source: ListingSource;
  type: ListingType;
  category: string;
  quantity: string;
  value: number;
  description: string;
  county: string;
  distance?: number;
  images: string[];
  expiryDate?: string;
  postedAt: string;
  postedBy: {
    id: string;
    name: string;
    organization?: string;
  };
  status: ListingStatus;
  acceptsPickup: boolean;
  pickupWindows?: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  wasteDetails?: {
    type: WasteType;
    nonBiodegradableType?: NonBiodegradableType;
    estimatedVolume: string;
  };
  matches?: {
    id: string;
    name: string;
    distance: number;
    score: number;
    rationale: string;
  }[];
}
interface ListingsContextType {
  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id' | 'postedAt' | 'status' | 'matches'>) => string;
  updateListingStatus: (id: string, status: ListingStatus) => void;
  getListing: (id: string) => Listing | undefined;
  getListingsByType: (type: ListingType | 'All') => Listing[];
  getListingsBySource: (source: ListingSource | 'All') => Listing[];
  getListingsByStatus: (status: ListingStatus | 'All') => Listing[];
  getWasteListings: (type?: WasteType, nonBiodegradableType?: NonBiodegradableType) => Listing[];
}
const ListingsContext = createContext<ListingsContextType | undefined>(undefined);
export const ListingsProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [listings, setListings] = useState<Listing[]>([]);
  useEffect(() => {
    const storedListings = localStorage.getItem('chakulaListings');
    if (storedListings) {
      setListings(JSON.parse(storedListings));
    } else {
      setListings(mockListings as Listing[]);
      localStorage.setItem('chakulaListings', JSON.stringify(mockListings));
    }
  }, []);
  const addListing = (newListing: Omit<Listing, 'id' | 'postedAt' | 'status' | 'matches'>) => {
    const id = Math.random().toString(36).substring(2, 15);
    const listing: Listing = {
      ...newListing,
      id,
      postedAt: new Date().toISOString(),
      status: 'Available',
      matches: matchListings(newListing)
    };
    const updatedListings = [...listings, listing];
    setListings(updatedListings);
    localStorage.setItem('chakulaListings', JSON.stringify(updatedListings));
    return id;
  };
  const updateListingStatus = (id: string, status: ListingStatus) => {
    const updatedListings = listings.map(listing => listing.id === id ? {
      ...listing,
      status
    } : listing);
    setListings(updatedListings);
    localStorage.setItem('chakulaListings', JSON.stringify(updatedListings));
  };
  const getListing = (id: string) => {
    return listings.find(listing => listing.id === id);
  };
  const getListingsByType = (type: ListingType | 'All') => {
    if (type === 'All') return listings;
    return listings.filter(listing => listing.type === type);
  };
  const getListingsBySource = (source: ListingSource | 'All') => {
    if (source === 'All') return listings;
    return listings.filter(listing => listing.source === source);
  };
  const getListingsByStatus = (status: ListingStatus | 'All') => {
    if (status === 'All') return listings;
    return listings.filter(listing => listing.status === status);
  };
  const getWasteListings = (type?: WasteType, nonBiodegradableType?: NonBiodegradableType) => {
    let filteredListings = listings.filter(listing => listing.type === 'Biodegradable' || listing.type === 'Non-Biodegradable');
    if (type) {
      filteredListings = filteredListings.filter(listing => listing.wasteDetails?.type === type);
      if (type === 'Non-Biodegradable' && nonBiodegradableType) {
        filteredListings = filteredListings.filter(listing => listing.wasteDetails?.nonBiodegradableType === nonBiodegradableType);
      }
    }
    return filteredListings;
  };
  return <ListingsContext.Provider value={{
    listings,
    addListing,
    updateListingStatus,
    getListing,
    getListingsByType,
    getListingsBySource,
    getListingsByStatus,
    getWasteListings
  }}>
      {children}
    </ListingsContext.Provider>;
};
export const useListings = () => {
  const context = useContext(ListingsContext);
  if (context === undefined) {
    throw new Error('useListings must be used within a ListingsProvider');
  }
  return context;
};