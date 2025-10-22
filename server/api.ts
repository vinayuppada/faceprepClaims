import { db } from './db';
import { logger } from './logger';
import { Claim, ClaimStatus, ChatMessage, Notification } from '../types';

// This file simulates the server's API logic.
// In a real app, this would be an Express.js or similar router handling HTTP requests.

export const api = {
  fetchClaims: async (userId: string): Promise<Claim[]> => {
    logger.info('API Request: Fetching claims', { userId });
    const allClaims = await db.getClaims();
    // In a real scenario, filtering would be more efficient (in the DB query)
    const userClaims = allClaims.filter(c => 
        c.submittedBy.id === userId || c.approvers?.some(a => a.id === userId)
    );
    logger.info(`Found ${userClaims.length} claims for user`, { userId });
    return userClaims;
  },

  submitClaim: async (claimData: Omit<Claim, 'id' | 'status' | 'submittedBy' | 'chatHistory' | 'hasStatusChanged'>, submitter: { id: string; name: string }): Promise<Claim> => {
    logger.info('API Request: Submitting new claim', { userId: submitter.id });
    const newClaim: Claim = {
      ...claimData,
      id: new Date().getTime().toString(),
      status: ClaimStatus.Pending,
      submittedBy: submitter,
      hasStatusChanged: false,
      chatHistory: [],
    };
    const addedClaim = await db.addClaim(newClaim);
    
    // Create notifications for approvers
    if (addedClaim.approvers) {
        for (const approver of addedClaim.approvers) {
            await db.addNotification({
                userId: approver.id,
                claimId: addedClaim.id,
                message: `${submitter.name} submitted a ${addedClaim.category} claim for ₹${addedClaim.amount.toFixed(2)} for your approval.`,
                isRead: false,
                timestamp: new Date().toISOString(),
                claimDescription: addedClaim.description || addedClaim.category,
            });
        }
    }
    logger.info('Successfully added new claim and created notifications', { claimId: addedClaim.id });
    return addedClaim;
  },

  editClaim: async (claimData: Claim): Promise<Claim> => {
    logger.info('API Request: Editing claim', { claimId: claimData.id });
    const originalClaim = await db.getClaimById(claimData.id);

    const updatedApprovers = claimData.approvers?.map(a => ({ ...a, status: ClaimStatus.Pending })) || [];
    const updatedClaim: Claim = {
      ...claimData,
      status: ClaimStatus.Pending,
      approvers: updatedApprovers,
      hasStatusChanged: false, // Reset status change on edit
    };
    
    const result = await db.updateClaim(updatedClaim);
    if (!result) {
        logger.error('Claim not found for editing', { claimId: claimData.id });
        throw new Error('Claim not found');
    }
    
    logger.info('Successfully edited claim', { claimId: result.id, statusChanged: originalClaim?.status !== result.status });
    return result;
  },
  
  updateApprovalStatus: async (claimId: string, approverId: string, approverName: string, newStatus: ClaimStatus.Approved | ClaimStatus.Rejected): Promise<Claim> => {
    logger.info('API Request: Updating approval status', { claimId, approverId, newStatus });
    const claim = await db.getClaimById(claimId);
    if (!claim) {
      logger.error('Claim not found for status update', { claimId });
      throw new Error('Claim not found');
    }

    const originalStatus = claim.status;
    let statusActuallyChanged = false;
    const updatedApprovers = claim.approvers?.map(a => {
        if (a.id === approverId) {
            statusActuallyChanged = a.status !== newStatus;
            return { ...a, status: newStatus, statusChanged: statusActuallyChanged };
        }
        return { ...a, statusChanged: false };
    });
    
    let newChatMessage: ChatMessage | null = null;
    if (statusActuallyChanged) {
        newChatMessage = {
            id: new Date().toISOString(),
            senderId: 'system',
            senderName: 'System',
            timestamp: new Date().toISOString(),
            content: `${approverName} changed their status to ${newStatus}.`,
            type: 'system',
        };
    }
    
    const updatedChatHistory = claim.chatHistory ? [...claim.chatHistory] : [];
    if (newChatMessage) {
        updatedChatHistory.push(newChatMessage);
    }

    const hasPending = updatedApprovers?.some(a => a.status === ClaimStatus.Pending);
    const hasRejected = updatedApprovers?.some(a => a.status === ClaimStatus.Rejected);
    let overallStatus = hasRejected ? ClaimStatus.Rejected : hasPending ? ClaimStatus.Pending : ClaimStatus.Approved;
    
    const statusDidChange = originalStatus !== overallStatus;

    const updatedClaim = { 
        ...claim, 
        approvers: updatedApprovers,
        status: overallStatus,
        hasStatusChanged: updatedApprovers?.some(a => a.statusChanged) || statusDidChange,
        chatHistory: updatedChatHistory,
    };

    const result = await db.updateClaim(updatedClaim);
    if (!result) throw new Error('Failed to update claim');

    // Create notification for the submitter if the status actually changed
    if (statusActuallyChanged) {
        await db.addNotification({
            userId: claim.submittedBy.id,
            claimId: claim.id,
            message: `${approverName} has ${newStatus.toLowerCase()} your ${claim.category} claim for ₹${claim.amount.toFixed(2)}.`,
            isRead: false,
            timestamp: new Date().toISOString(),
            claimDescription: claim.description || claim.category,
        });
        logger.info('Created status change notification', { claimId, recipientId: claim.submittedBy.id });
    }

    logger.info('Successfully updated approval status', { claimId, newOverallStatus: result.status });
    return result;
  },

  addChatMessage: async (claimId: string, message: ChatMessage): Promise<Claim> => {
    logger.info('API Request: Adding chat message', { claimId, senderId: message.senderId });
    const claim = await db.getClaimById(claimId);
    if (!claim) {
      logger.error('Claim not found for chat message', { claimId });
      throw new Error('Claim not found');
    }
    const updatedHistory = claim.chatHistory ? [...claim.chatHistory, message] : [message];
    
    // Create notification for the other party
    const isSenderSubmitter = message.senderId === claim.submittedBy.id;
    if (isSenderSubmitter) {
        if (claim.approvers) {
            for (const approver of claim.approvers) {
                if (approver.id !== message.senderId) { // Don't notify self
                    await db.addNotification({
                        userId: approver.id,
                        claimId: claim.id,
                        message: `${claim.submittedBy.name} sent a message on a ${claim.category} claim.`,
                        isRead: false,
                        timestamp: new Date().toISOString(),
                        claimDescription: claim.description || claim.category,
                    });
                }
            }
        }
    } else {
        await db.addNotification({
            userId: claim.submittedBy.id,
            claimId: claim.id,
            message: `${message.senderName} sent a message on your ${claim.category} claim.`,
            isRead: false,
            timestamp: new Date().toISOString(),
            claimDescription: claim.description || claim.category,
        });
    }

    const updatedClaim = { ...claim, chatHistory: updatedHistory };
    
    const result = await db.updateClaim(updatedClaim);
    if (!result) throw new Error('Failed to add message');
    
    logger.info('Successfully added chat message', { claimId });
    return result;
  },

  fetchNotifications: async (userId: string): Promise<Notification[]> => {
    logger.info('API Request: Fetching notifications', { userId });
    return db.getNotifications(userId);
  },

  markNotificationAsRead: async (notificationId: string): Promise<Notification | null> => {
    logger.info('API Request: Marking notification as read', { notificationId });
    return db.updateNotification(notificationId, { isRead: true });
  },

  markAllNotificationsAsRead: async (userId: string): Promise<Notification[]> => {
    logger.info('API Request: Marking all notifications as read', { userId });
    const notifications = await db.getNotifications(userId);
    const updatedNotifications: Notification[] = [];
    for (const notification of notifications) {
        if (!notification.isRead) {
            const updated = await db.updateNotification(notification.id, { isRead: true });
            if (updated) updatedNotifications.push(updated);
        } else {
            updatedNotifications.push(notification);
        }
    }
    return updatedNotifications;
  },
};