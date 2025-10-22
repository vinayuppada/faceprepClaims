import React from 'react';
import { Notification } from '../types';
import BellIcon from './icons/BellIcon';

interface NotificationPanelProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onNotificationClick, onMarkAllAsRead }) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border border-slate-200 z-20 overflow-hidden">
      <div className="flex justify-between items-center p-3 border-b border-slate-200">
        <h4 className="font-bold text-slate-700">Notifications</h4>
        {unreadCount > 0 && (
          <button onClick={onMarkAllAsRead} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
            Mark all as read
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <button
              key={notification.id}
              onClick={() => onNotificationClick(notification)}
              className={`w-full text-left p-3 border-b border-slate-100 transition-colors ${
                notification.isRead ? 'bg-white hover:bg-slate-50' : 'bg-indigo-50 hover:bg-indigo-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 flex-shrink-0 h-2.5 w-2.5 rounded-full ${notification.isRead ? 'bg-slate-300' : 'bg-indigo-500'}`}></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800 font-medium">{notification.message}</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    Re: {notification.claimDescription}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(notification.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center p-8 text-slate-500">
            <BellIcon className="h-10 w-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold">All caught up!</p>
            <p className="text-sm">You have no new notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
