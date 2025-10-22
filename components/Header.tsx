import React, { useState, useRef, useEffect } from 'react';
import { Notification } from '../types';
import BellIcon from './icons/BellIcon';
import NotificationPanel from './NotificationPanel';


interface HeaderProps {
    onProfileClick: () => void;
    notifications: Notification[];
    onNotificationClick: (notification: Notification) => void;
    onMarkAllAsRead: () => void;
}

const Header: React.FC<HeaderProps> = ({ onProfileClick, notifications, onNotificationClick, onMarkAllAsRead }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
            setIsPanelOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleNotificationClickAndClose = (notification: Notification) => {
    onNotificationClick(notification);
    setIsPanelOpen(false);
  }

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
              FACEPrep Claims
            </h1>
            <p className="text-slate-500 mt-1">Effortless expense management</p>
        </div>
        <div className="flex items-center space-x-4">
            <div className="relative" ref={panelRef}>
                <button 
                    onClick={() => setIsPanelOpen(prev => !prev)}
                    className="relative p-2 rounded-full transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    aria-label={`View notifications (${unreadCount} unread)`}
                >
                    <BellIcon className="h-6 w-6 text-slate-600" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-[10px] items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        </span>
                    )}
                </button>
                {isPanelOpen && (
                    <NotificationPanel 
                        notifications={notifications}
                        onNotificationClick={handleNotificationClickAndClose}
                        onMarkAllAsRead={onMarkAllAsRead}
                        onClose={() => setIsPanelOpen(false)}
                    />
                )}
            </div>
            <button 
                onClick={onProfileClick}
                className="flex items-center space-x-3 rounded-full p-1 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="View profile"
            >
                <div className="text-right">
                    <p className="font-semibold text-slate-800">Jane Smith</p>
                    <p className="text-sm text-slate-500">Employee ID: 54321</p>
                </div>
                <img 
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-offset-2 ring-indigo-400"
                    src={`https://api.dicebear.com/8.x/initials/svg?seed=Jane%20Smith`}
                    alt="User Profile"
                />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;