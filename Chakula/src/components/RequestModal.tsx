import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
import { Listing } from '../context/ListingsContext';
import { formatCurrency } from '../utils/formatters';
interface RequestModalProps {
  listing: Listing;
  onClose: () => void;
  onSubmit: () => void;
}
const RequestModal: React.FC<RequestModalProps> = ({
  listing,
  onClose,
  onSubmit
}) => {
  const [quantity, setQuantity] = useState('');
  const [pickupWindow, setPickupWindow] = useState(listing.pickupWindows ? listing.pickupWindows[0] : '');
  const [deliveryRequested, setDeliveryRequested] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const isWasteListing = listing.type === 'Biodegradable' || listing.type === 'Non-Biodegradable';
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-neutral-dark">
            {isWasteListing ? 'Schedule Collection' : 'Request Item'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="font-medium text-neutral-dark mb-2">
              {listing.title}
            </h3>
            {listing.value > 0 && <p className="text-accent">{formatCurrency(listing.value)}</p>}
          </div>
          {!isWasteListing && <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Quantity Requested
              </label>
              <input type="text" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder={`Available: ${listing.quantity}`} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              {isWasteListing ? 'Collection Window' : 'Pickup Window'}
            </label>
            {listing.pickupWindows && listing.pickupWindows.length > 0 ? <select value={pickupWindow} onChange={e => setPickupWindow(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required>
                {listing.pickupWindows.map((window, index) => <option key={index} value={window}>
                    {window}
                  </option>)}
              </select> : <input type="text" value={pickupWindow} onChange={e => setPickupWindow(e.target.value)} placeholder="Specify preferred time" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />}
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" checked={deliveryRequested} onChange={e => setDeliveryRequested(e.target.checked)} className="mr-2" />
              <span className="text-gray-700">
                {isWasteListing ? 'I need this collected from a different address' : 'I need delivery (if available)'}
              </span>
            </label>
          </div>
          {deliveryRequested && <>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Delivery Address
                </label>
                <input type="text" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} placeholder="Enter full address" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Delivery Notes
                </label>
                <textarea value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)} placeholder="Any special instructions" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" rows={3} />
              </div>
            </>}
          <div className="flex justify-end mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 mr-2 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90 transition">
              {isWasteListing ? 'Schedule Collection' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default RequestModal;