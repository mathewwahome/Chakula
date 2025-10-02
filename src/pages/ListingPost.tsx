import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useListings, ListingType, ListingSource } from '../context/ListingsContext';
import { useNotification } from '../context/NotificationContext';
import PredictiveAnalytics from '../components/PredictiveAnalytics';
import { UploadIcon, XIcon, MapPinIcon, CalendarIcon, ClockIcon, AlertTriangleIcon } from 'lucide-react';
type PostStep = 'role' | 'type' | 'details' | 'wasteType' | 'wasteDetails';
const ListingPost: React.FC = () => {
  const {
    isAuthenticated,
    user
  } = useAuth();
  const {
    addListing
  } = useListings();
  const {
    showToast,
    addActivity
  } = useNotification();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<PostStep>('role');
  const [selectedRole, setSelectedRole] = useState<ListingSource | ''>('');
  const [selectedType, setSelectedType] = useState<ListingType | ''>('');
  const [wasteType, setWasteType] = useState<'Biodegradable' | 'Non-Biodegradable' | ''>('');
  const [nonBioType, setNonBioType] = useState<'Plastics' | 'Non-Plastics' | ''>('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [county, setCounty] = useState('');
  const [address, setAddress] = useState('');
  const [acceptsPickup, setAcceptsPickup] = useState(true);
  const [pickupWindows, setPickupWindows] = useState<string[]>(['']);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/post-listing');
      return;
    }
    if (user?.role) {
      if (user.role === 'Restaurant' || user.role === 'Farmer') {
        setSelectedRole(user.role);
        setCurrentStep('type');
      } else {
        showToast('Only restaurants and farmers can post listings', 'error');
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate, showToast]);
  const handleRoleSelect = (role: ListingSource) => {
    setSelectedRole(role);
    setCurrentStep('type');
  };
  const handleTypeSelect = (type: ListingType) => {
    setSelectedType(type);
    if (type === 'Biodegradable' || type === 'Non-Biodegradable') {
      if (type === 'Biodegradable') {
        setWasteType('Biodegradable');
        setCurrentStep('wasteDetails');
      } else {
        setWasteType('Non-Biodegradable');
        setCurrentStep('wasteType');
      }
    } else {
      setCurrentStep('details');
    }
  };
  const handleWasteTypeSelect = (type: 'Plastics' | 'Non-Plastics') => {
    setNonBioType(type);
    setCurrentStep('wasteDetails');
  };
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = [...images];
    Array.from(files).forEach(file => {
      if (newImages.length >= 5) return;
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
          setImages([...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  const addPickupWindow = () => {
    setPickupWindows([...pickupWindows, '']);
  };
  const updatePickupWindow = (index: number, value: string) => {
    const newWindows = [...pickupWindows];
    newWindows[index] = value;
    setPickupWindows(newWindows);
  };
  const removePickupWindow = (index: number) => {
    if (pickupWindows.length <= 1) return;
    const newWindows = [...pickupWindows];
    newWindows.splice(index, 1);
    setPickupWindows(newWindows);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!title || !category || !quantity || !county || !address || images.length === 0) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    if (acceptsPickup && pickupWindows.some(window => !window)) {
      showToast('Please fill in all pickup windows or remove empty ones', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const listing = {
        title,
        source: selectedRole as ListingSource,
        type: selectedType as ListingType,
        category,
        quantity,
        value: parseFloat(value) || 0,
        description,
        county,
        images,
        expiryDate: expiryDate && expiryTime ? `${expiryDate}T${expiryTime}:00.000Z` : undefined,
        postedBy: {
          id: user?.id || '',
          name: user?.name || '',
          organization: user?.organization
        },
        acceptsPickup,
        pickupWindows: acceptsPickup ? pickupWindows.filter(window => window) : [],
        location: {
          lat: -1.286389 + (Math.random() - 0.5) * 0.1,
          lng: 36.817223 + (Math.random() - 0.5) * 0.1,
          address
        },
        wasteDetails: selectedType === 'Biodegradable' || selectedType === 'Non-Biodegradable' ? {
          type: wasteType as 'Biodegradable' | 'Non-Biodegradable',
          nonBiodegradableType: nonBioType as 'Plastics' | 'Non-Plastics' | undefined,
          estimatedVolume: quantity
        } : undefined
      };
      const id = addListing(listing);
      showToast('Listing posted successfully', 'success');
      addActivity(`You posted a new listing: "${title}"`);
      navigate(`/listing/${id}`);
    } catch (error) {
      showToast('An error occurred. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };
  const renderRoleStep = () => {
    return <div>
        <h2 className="text-xl font-bold mb-6">Select your role</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button onClick={() => handleRoleSelect('Restaurant')} className={`p-6 border rounded-lg text-left hover:border-primary transition ${selectedRole === 'Restaurant' ? 'border-primary bg-primary bg-opacity-5' : ''}`}>
            <h3 className="font-semibold text-lg mb-2">Restaurant</h3>
            <p className="text-gray-600">
              For restaurants, cafes, hotels, and food service businesses with
              surplus food or ingredients.
            </p>
          </button>
          <button onClick={() => handleRoleSelect('Farmer')} className={`p-6 border rounded-lg text-left hover:border-primary transition ${selectedRole === 'Farmer' ? 'border-primary bg-primary bg-opacity-5' : ''}`}>
            <h3 className="font-semibold text-lg mb-2">Farmer</h3>
            <p className="text-gray-600">
              For farmers, producers, and agricultural businesses with excess or
              imperfect produce.
            </p>
          </button>
        </div>
      </div>;
  };
  const renderTypeStep = () => {
    const isRestaurant = selectedRole === 'Restaurant';
    return <div>
        <h2 className="text-xl font-bold mb-6">What are you posting?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button onClick={() => handleTypeSelect(isRestaurant ? 'Surplus' : 'Produce')} className={`p-6 border rounded-lg text-left hover:border-primary transition ${selectedType === (isRestaurant ? 'Surplus' : 'Produce') ? 'border-primary bg-primary bg-opacity-5' : ''}`}>
            <h3 className="font-semibold text-lg mb-2">
              {isRestaurant ? 'Food Surplus' : 'Produce'}
            </h3>
            <p className="text-gray-600">
              {isRestaurant ? 'Excess prepared food, ingredients, or near-expiry items that are still edible.' : 'Excess harvest or imperfect produce that is still edible and nutritious.'}
            </p>
          </button>
          <button onClick={() => handleTypeSelect('Biodegradable')} className={`p-6 border rounded-lg text-left hover:border-primary transition ${selectedType === 'Biodegradable' ? 'border-primary bg-primary bg-opacity-5' : ''}`}>
            <h3 className="font-semibold text-lg mb-2">Biodegradable Waste</h3>
            <p className="text-gray-600">
              Food scraps, plant trimmings, or organic materials suitable for
              composting.
            </p>
          </button>
          <button onClick={() => handleTypeSelect('Non-Biodegradable')} className={`p-6 border rounded-lg text-left hover:border-primary transition ${selectedType === 'Non-Biodegradable' ? 'border-primary bg-primary bg-opacity-5' : ''}`}>
            <h3 className="font-semibold text-lg mb-2">
              Non-Biodegradable Waste
            </h3>
            <p className="text-gray-600">
              Packaging, plastics, glass, or other materials that require
              recycling.
            </p>
          </button>
        </div>
      </div>;
  };
  const renderWasteTypeStep = () => {
    return <div>
        <h2 className="text-xl font-bold mb-6">
          What type of non-biodegradable waste?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button onClick={() => handleWasteTypeSelect('Plastics')} className={`p-6 border rounded-lg text-left hover:border-primary transition ${nonBioType === 'Plastics' ? 'border-primary bg-primary bg-opacity-5' : ''}`}>
            <h3 className="font-semibold text-lg mb-2">Plastics</h3>
            <p className="text-gray-600">
              Plastic containers, packaging, bottles, wraps, or other plastic
              materials.
            </p>
          </button>
          <button onClick={() => handleWasteTypeSelect('Non-Plastics')} className={`p-6 border rounded-lg text-left hover:border-primary transition ${nonBioType === 'Non-Plastics' ? 'border-primary bg-primary bg-opacity-5' : ''}`}>
            <h3 className="font-semibold text-lg mb-2">Non-Plastics</h3>
            <p className="text-gray-600">
              Glass, metal, paper, cardboard, or other non-plastic recyclable
              materials.
            </p>
          </button>
        </div>
      </div>;
  };
  const renderDetailsStep = () => {
    const isFood = selectedType === 'Surplus' || selectedType === 'Produce';
    const isRestaurant = selectedRole === 'Restaurant';
    let categoryOptions: string[] = [];
    if (isFood) {
      if (isRestaurant) {
        categoryOptions = ['Meals', 'Ingredients', 'Near-expiry', 'Baked Goods'];
      } else {
        categoryOptions = ['Imperfect Produce', 'Excess Harvest'];
      }
    }
    return <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-6">
          {isFood ? 'Food Surplus Details' : 'Waste Details'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
              Title *
            </label>
            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="E.g., Leftover Ugali & Sukuma" required />
          </div>
          {isFood && <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
                Category *
              </label>
              <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required>
                <option value="">Select category</option>
                {categoryOptions.map(option => <option key={option} value={option}>
                    {option}
                  </option>)}
              </select>
            </div>}
          {!isFood && <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
                Material Type *
              </label>
              <input id="category" type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder={wasteType === 'Biodegradable' ? 'E.g., Food Scraps, Plant Trimmings' : 'E.g., Plastic Containers, Glass Bottles'} required />
            </div>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="quantity">
              Quantity *
            </label>
            <input id="quantity" type="text" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="E.g., 5kg, 10 plates, 3 trays" required />
          </div>
          {isFood && <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="value">
                Suggested Value (Ksh)
              </label>
              <input id="value" type="number" min="0" value={value} onChange={e => setValue(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="E.g., 1200" />
            </div>}
        </div>
        {isFood && <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Expiry Date/Time
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <input type="time" value={expiryTime} onChange={e => setExpiryTime(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                  <ClockIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Optional. If not provided, we'll assume it should be consumed
              within 24 hours.
            </p>
          </div>}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
            Description
          </label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" rows={3} placeholder="Provide details about condition, ingredients, etc." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="county">
              County *
            </label>
            <select id="county" value={county} onChange={e => setCounty(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required>
              <option value="">Select county</option>
              {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Machakos'].map(c => <option key={c} value={c}>
                  {c}
                </option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="address">
              Address *
            </label>
            <div className="relative">
              <input id="address" type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Street address" required />
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Upload Images *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
            {images.map((image, index) => <div key={index} className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition">
                  <XIcon className="w-4 h-4 text-gray-700" />
                </button>
              </div>)}
            {images.length < 5 && <button type="button" onClick={handleImageUpload} className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary transition">
                <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Add Image</span>
              </button>}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" multiple />
          <p className="text-sm text-gray-500">
            Upload up to 5 images. First image will be the main listing image.
          </p>
        </div>
        <div className="mb-6">
          <label className="flex items-center">
            <input type="checkbox" checked={acceptsPickup} onChange={e => setAcceptsPickup(e.target.checked)} className="mr-2" />
            <span className="text-gray-700">Accepts pickup</span>
          </label>
        </div>
        {acceptsPickup && <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Preferred Pickup Windows
            </label>
            {pickupWindows.map((window, index) => <div key={index} className="flex items-center mb-2">
                <input type="text" value={window} onChange={e => updatePickupWindow(index, e.target.value)} className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="E.g., 16 Jun 2023 14:00-16:00" />
                <button type="button" onClick={() => removePickupWindow(index)} className="ml-2 text-gray-500 hover:text-gray-700 transition">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>)}
            <button type="button" onClick={addPickupWindow} className="text-primary hover:underline text-sm">
              + Add Another Pickup Window
            </button>
          </div>}
        {isFood && <div className="mb-8 bg-primary bg-opacity-5 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertTriangleIcon className="w-5 h-5 text-primary mr-2 mt-1" />
              <div>
                <h3 className="font-medium text-primary">
                  Predictive Analytics
                </h3>
                <p className="text-sm text-gray-700">
                  Estimated surplus probability: 72%
                </p>
                <p className="text-sm text-gray-700">
                  Based on historical data, this type of surplus is common in
                  your area.
                </p>
              </div>
            </div>
          </div>}
        <div className="flex justify-end">
          <button type="button" onClick={() => setCurrentStep('type')} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 mr-2 hover:bg-gray-50 transition">
            Back
          </button>
          <button type="submit" className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90 transition" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post Listing'}
          </button>
        </div>
      </form>;
  };
  const renderWasteDetailsStep = () => {
    return renderDetailsStep();
  };
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'role':
        return renderRoleStep();
      case 'type':
        return renderTypeStep();
      case 'wasteType':
        return renderWasteTypeStep();
      case 'details':
        return renderDetailsStep();
      case 'wasteDetails':
        return renderWasteDetailsStep();
      default:
        return null;
    }
  };
  return <div className="bg-neutral-light min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-neutral-dark mb-8">
          Post a Listing
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {renderCurrentStep()}
            </div>
          </div>
          <div>
            <PredictiveAnalytics />
          </div>
        </div>
      </div>
    </div>;
};
export default ListingPost;