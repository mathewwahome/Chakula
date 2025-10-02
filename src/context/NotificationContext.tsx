import React, { useCallback, useState, createContext, useContext } from 'react';
type NotificationType = 'success' | 'error' | 'info' | 'warning';
interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}
interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}
interface NotificationContextType {
  notifications: Notification[];
  activityStream: ActivityItem[];
  showToast: (message: string, type: NotificationType) => void;
  addActivity: (message: string) => void;
  markActivityAsRead: (id: string) => void;
  clearNotification: (id: string) => void;
  unreadActivityCount: number;
}
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
export const NotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activityStream, setActivityStream] = useState<ActivityItem[]>([]);
  const showToast = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification = {
      id,
      message,
      type
    };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);
  const addActivity = useCallback((message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newActivity = {
      id,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    setActivityStream(prev => [newActivity, ...prev]);
  }, []);
  const markActivityAsRead = useCallback((id: string) => {
    setActivityStream(prev => prev.map(item => item.id === id ? {
      ...item,
      read: true
    } : item));
  }, []);
  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);
  const unreadActivityCount = activityStream.filter(item => !item.read).length;
  return <NotificationContext.Provider value={{
    notifications,
    activityStream,
    showToast,
    addActivity,
    markActivityAsRead,
    clearNotification,
    unreadActivityCount
  }}>
      {children}
    </NotificationContext.Provider>;
};
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};