import { api } from '../server/api';
import { Claim, ClaimStatus, ChatMessage, Notification } from '../types';

// This service acts as the bridge between the frontend components and the backend API.
// In a real app, this would use `fetch` to make HTTP requests to a server.

const currentUser = { id: 'mgr2', name: 'Jane Smith' };

export const apiService = {
  fetchClaims: (): Promise<Claim[]> => {
    // In a real app, you would pass an auth token to identify the user.
    // Here, we pass the user ID directly to the simulated API.
    return api.fetchClaims(currentUser.id);
  },

  submitClaim: (claimData: Omit<Claim, 'id' | 'status' | 'submittedBy'> | Claim): Promise<Claim> => {
    if ('id' in claimData) {
      // This is an edit operation
      return api.editClaim(claimData as Claim);
    } else {
      // This is a new claim submission
      return api.submitClaim(claimData as Omit<Claim, 'id' | 'status' | 'submittedBy' | 'chatHistory' | 'hasStatusChanged'>, currentUser);
    }
  },

  approveClaim: (claimId: string): Promise<Claim> => {
    return api.updateApprovalStatus(claimId, currentUser.id, currentUser.name, ClaimStatus.Approved);
  },

  rejectClaim: (claimId: string): Promise<Claim> => {
    return api.updateApprovalStatus(claimId, currentUser.id, currentUser.name, ClaimStatus.Rejected);
  },

  sendMessage: (claimId: string, messageContent: string): Promise<Claim> => {
    const newMessage: ChatMessage = {
      id: new Date().toISOString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      timestamp: new Date().toISOString(),
      content: messageContent,
      type: 'user',
    };
    return api.addChatMessage(claimId, newMessage);
  },

  fetchNotifications: (): Promise<Notification[]> => {
    return api.fetchNotifications(currentUser.id);
  },

  markNotificationAsRead: (notificationId: string): Promise<Notification | null> => {
    return api.markNotificationAsRead(notificationId);
  },

  markAllNotificationsAsRead: (): Promise<Notification[]> => {
    return api.markAllNotificationsAsRead(currentUser.id);
  },
};