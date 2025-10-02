import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { XIcon } from 'lucide-react';
const Toast: React.FC = () => {
  const {
    notifications,
    clearNotification
  } = useNotification();
  if (notifications.length === 0) return null;
  return <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
      {notifications.map(notification => {
      let bgColor = 'bg-primary';
      if (notification.type === 'success') bgColor = 'bg-accent';
      if (notification.type === 'error') bgColor = 'bg-danger';
      if (notification.type === 'warning') bgColor = 'bg-yellow-500';
      return <div key={notification.id} className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex justify-between items-center max-w-xs md:max-w-md`}>
            <p className="text-sm">{notification.message}</p>
            <button onClick={() => clearNotification(notification.id)} className="ml-4 text-white opacity-80 hover:opacity-100 transition">
              <XIcon className="w-4 h-4" />
            </button>
          </div>;
    })}
    </div>;
};
export default Toast;