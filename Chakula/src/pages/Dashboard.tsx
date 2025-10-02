import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useListings, Listing } from '../context/ListingsContext';
import { useNotification } from '../context/NotificationContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import PredictiveAnalytics from '../components/PredictiveAnalytics';
import { BarChart2Icon, TrendingUpIcon, CheckCircleIcon, ClockIcon, AlertCircleIcon, BellIcon } from 'lucide-react';
type DashboardTab = 'overview' | 'listings' | 'activity' | 'analytics';
const Dashboard: React.FC = () => {
  const {
    isAuthenticated,
    user
  } = useAuth();
  const {
    listings
  } = useListings();
  const {
    activityStream,
    markActivityAsRead
  } = useNotification();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [relevantListings, setRelevantListings] = useState<Listing[]>([]);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/dashboard');
      return;
    }
    if (user) {
      const userListings = listings.filter(listing => listing.postedBy.id === user.id);
      setMyListings(userListings);
      let relevant: Listing[] = [];
      if (user.role === 'Beneficiary') {
        relevant = listings.filter(listing => (listing.type === 'Surplus' || listing.type === 'Produce') && listing.status === 'Available');
      } else if (user.role === 'Waste Partner') {
        relevant = listings.filter(listing => (listing.type === 'Biodegradable' || listing.type === 'Non-Biodegradable') && listing.status === 'Available');
      }
      setRelevantListings(relevant);
    }
    activityStream.forEach(activity => {
      if (!activity.read) {
        markActivityAsRead(activity.id);
      }
    });
  }, [isAuthenticated, user, listings, navigate, activityStream, markActivityAsRead]);
  if (!isAuthenticated || !user) {
    return null;
  }
  const getCompletedCount = () => {
    return myListings.filter(listing => listing.status === 'Completed').length;
  };
  const getPendingCount = () => {
    return myListings.filter(listing => listing.status === 'Pending Pickup').length;
  };
  const getAvailableCount = () => {
    return myListings.filter(listing => listing.status === 'Available').length;
  };
  const getTotalValue = () => {
    return myListings.reduce((sum, listing) => sum + listing.value, 0);
  };
  const renderOverviewTab = () => {
    return <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-3">
                <BarChart2Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-neutral-dark">Total Listings</h3>
            </div>
            <p className="text-3xl font-bold text-neutral-dark">
              {myListings.length}
            </p>
            <div className="flex mt-2">
              <div className="flex items-center mr-4">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                <span className="text-sm text-gray-600">
                  Completed: {getCompletedCount()}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
                <span className="text-sm text-gray-600">
                  Pending: {getPendingCount()}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-accent bg-opacity-10 flex items-center justify-center mr-3">
                <TrendingUpIcon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-medium text-neutral-dark">Total Value</h3>
            </div>
            <p className="text-3xl font-bold text-neutral-dark">
              {formatCurrency(getTotalValue())}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Value of food redirected from waste
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <CheckCircleIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-medium text-neutral-dark">
                Available Listings
              </h3>
            </div>
            <p className="text-3xl font-bold text-neutral-dark">
              {getAvailableCount()}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Listings currently available
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
            {activityStream.length > 0 ? <div className="space-y-4">
                {activityStream.slice(0, 5).map(activity => <div key={activity.id} className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-3 mt-1">
                      <BellIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-gray-700">{activity.message}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>)}
              </div> : <p className="text-gray-500">No recent activity</p>}
            {activityStream.length > 5 && <button onClick={() => setActiveTab('activity')} className="mt-4 text-primary hover:underline text-sm">
                View All Activity
              </button>}
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-4">
              {user.role === 'Beneficiary' ? 'Available Food Surplus' : user.role === 'Waste Partner' ? 'Available Waste Listings' : 'Your Listings'}
            </h3>
            {(user.role === 'Beneficiary' || user.role === 'Waste Partner') && relevantListings.length > 0 ? <div className="space-y-3">
                {relevantListings.slice(0, 5).map(listing => <div key={listing.id} className="p-3 border rounded-lg hover:border-primary cursor-pointer transition" onClick={() => navigate(`/listing/${listing.id}`)}>
                    <div className="flex justify-between">
                      <h4 className="font-medium text-neutral-dark">
                        {listing.title}
                      </h4>
                      {listing.value > 0 && <span className="text-accent font-medium">
                          {formatCurrency(listing.value)}
                        </span>}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      <span>Posted {formatDate(listing.postedAt)}</span>
                    </div>
                  </div>)}
              </div> : myListings.length > 0 ? <div className="space-y-3">
                {myListings.slice(0, 5).map(listing => <div key={listing.id} className="p-3 border rounded-lg hover:border-primary cursor-pointer transition" onClick={() => navigate(`/listing/${listing.id}`)}>
                    <div className="flex justify-between">
                      <h4 className="font-medium text-neutral-dark">
                        {listing.title}
                      </h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${listing.status === 'Available' ? 'bg-blue-100 text-blue-800' : listing.status === 'Pending Pickup' ? 'bg-yellow-100 text-yellow-800' : listing.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {listing.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      <span>Posted {formatDate(listing.postedAt)}</span>
                    </div>
                  </div>)}
              </div> : <div className="text-center py-6">
                <AlertCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No listings found</p>
                <button onClick={() => navigate('/post-listing')} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition">
                  Create Your First Listing
                </button>
              </div>}
            {(user.role === 'Beneficiary' || user.role === 'Waste Partner') && relevantListings.length > 5 ? <button onClick={() => navigate(user.role === 'Waste Partner' ? '/waste' : '/food-surplus')} className="mt-4 text-primary hover:underline text-sm">
                View All Listings
              </button> : myListings.length > 5 ? <button onClick={() => setActiveTab('listings')} className="mt-4 text-primary hover:underline text-sm">
                View All Listings
              </button> : null}
          </div>
        </div>
      </div>;
  };
  const renderListingsTab = () => {
    return <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Your Listings</h2>
        {myListings.length > 0 ? <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Value</th>
                  <th className="text-left py-3 px-4">Posted On</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myListings.map(listing => <tr key={listing.id} className="border-b hover:bg-neutral-light">
                    <td className="py-3 px-4">{listing.title}</td>
                    <td className="py-3 px-4">{listing.type}</td>
                    <td className="py-3 px-4">
                      {listing.value > 0 ? formatCurrency(listing.value) : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {formatDate(listing.postedAt)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${listing.status === 'Available' ? 'bg-blue-100 text-blue-800' : listing.status === 'Pending Pickup' ? 'bg-yellow-100 text-yellow-800' : listing.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => navigate(`/listing/${listing.id}`)} className="text-primary hover:underline">
                        View
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div> : <div className="text-center py-8">
            <AlertCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">
              You haven't posted any listings yet
            </p>
            <button onClick={() => navigate('/post-listing')} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition">
              Post Your First Listing
            </button>
          </div>}
      </div>;
  };
  const renderActivityTab = () => {
    return <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Activity Stream</h2>
        {activityStream.length > 0 ? <div className="space-y-4">
            {activityStream.map(activity => <div key={activity.id} className="p-4 border rounded-lg">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-3">
                    <BellIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-gray-700">{activity.message}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </div>)}
          </div> : <div className="text-center py-8">
            <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No activity recorded yet</p>
          </div>}
      </div>;
  };
  const renderAnalyticsTab = () => {
    return <div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Analytics Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Meals Redirected</h3>
              <p className="text-3xl font-bold text-primary">247</p>
              <div className="flex items-center text-sm text-green-600 mt-2">
                <TrendingUpIcon className="w-4 h-4 mr-1" />
                <span>12% increase</span>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Waste Collected</h3>
              <p className="text-3xl font-bold text-primary">185 kg</p>
              <div className="flex items-center text-sm text-green-600 mt-2">
                <TrendingUpIcon className="w-4 h-4 mr-1" />
                <span>8% increase</span>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Matches per Day</h3>
              <p className="text-3xl font-bold text-primary">5.3</p>
              <div className="flex items-center text-sm text-yellow-600 mt-2">
                <TrendingUpIcon className="w-4 h-4 mr-1" />
                <span>2% increase</span>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4 h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart2Icon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                Interactive charts will appear here as you gather more data
              </p>
            </div>
          </div>
        </div>
        <PredictiveAnalytics />
      </div>;
  };
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'listings':
        return renderListingsTab();
      case 'activity':
        return renderActivityTab();
      case 'analytics':
        return renderAnalyticsTab();
      default:
        return renderOverviewTab();
    }
  };
  return <div className="bg-neutral-light min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-dark mb-1">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user.name} ({user.role})
            </p>
          </div>
          <button onClick={() => navigate('/post-listing')} className="mt-4 md:mt-0 bg-accent hover:bg-opacity-90 text-white px-4 py-2 rounded-lg transition">
            Post New Listing
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md mb-8 overflow-x-auto">
          <div className="flex">
            <button onClick={() => setActiveTab('overview')} className={`px-6 py-4 font-medium text-sm transition ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-primary'}`}>
              Overview
            </button>
            <button onClick={() => setActiveTab('listings')} className={`px-6 py-4 font-medium text-sm transition ${activeTab === 'listings' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-primary'}`}>
              My Listings
            </button>
            <button onClick={() => setActiveTab('activity')} className={`px-6 py-4 font-medium text-sm transition ${activeTab === 'activity' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-primary'}`}>
              Activity
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`px-6 py-4 font-medium text-sm transition ${activeTab === 'analytics' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-primary'}`}>
              Analytics
            </button>
          </div>
        </div>
        {renderActiveTab()}
      </div>
    </div>;
};
export default Dashboard;