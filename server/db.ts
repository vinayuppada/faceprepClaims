import { Claim, ClaimCategory, ClaimStatus, MealType, CabType, BookingApp, Notification } from '../types';

// In a real app, this would be a connection to a database like PostgreSQL, MongoDB, etc.
// For this simulation, we use an in-memory array as our "database".
const claimsDB: Claim[] = [
  // Claims submitted by Jane Smith (current user)
  {
    id: '1',
    category: ClaimCategory.Food,
    amount: 2550.00,
    date: '2023-10-26',
    description: 'Lunch with client',
    proofUrls: ['https://picsum.photos/seed/proof1/200/200'],
    status: ClaimStatus.Approved,
    invoiceNumber: 'INV-123',
    approvers: [
      { id: 'mgr1', name: 'John Doe', status: ClaimStatus.Approved },
    ],
    mealTypes: [MealType.Lunch, MealType.Dinner],
    submittedBy: { id: 'mgr2', name: 'Jane Smith' },
    chatHistory: [
      { id: 'chat1', senderId: 'mgr2', senderName: 'Jane Smith', timestamp: '2023-10-26T10:00:00Z', content: 'Here is the receipt for the client lunch.', type: 'user' },
      { id: 'chat2', senderId: 'mgr1', senderName: 'John Doe', timestamp: '2023-10-26T11:00:00Z', content: 'Looks good, approved.', type: 'user' },
      { id: 'chat3', senderId: 'system', senderName: 'System', timestamp: '2023-10-26T11:00:05Z', content: 'John Doe changed their status to Approved.', type: 'system' },
    ],
  },
  {
    id: '2',
    category: ClaimCategory.Cab,
    amount: 1200.00,
    date: '2023-10-27',
    description: 'Airport transfer for conference',
    proofUrls: ['https://picsum.photos/seed/proof2/200/200', 'https://picsum.photos/seed/proof2-add/200/200'],
    status: ClaimStatus.Pending,
    invoiceNumber: 'UB-456',
    approvers: [
      { id: 'mgr1', name: 'John Doe', status: ClaimStatus.Pending }
    ],
    fromLocation: 'Office',
    toLocation: 'Airport',
    cabType: CabType.Cab,
    bookingApp: BookingApp.Uber,
    coPassengers: 'Mr. Smith',
    submittedBy: { id: 'mgr2', name: 'Jane Smith' },
    chatHistory: [],
  },
  // Claims submitted by others, pending Jane Smith's approval
  {
    id: '4',
    category: ClaimCategory.Stay,
    amount: 12500.00,
    date: '2023-11-01',
    description: 'Hotel stay for client visit',
    proofUrls: ['https://picsum.photos/seed/proof4/200/200'],
    status: ClaimStatus.Pending,
    invoiceNumber: 'MAKEMYTRIP-843',
    approvers: [
        { id: 'mgr2', name: 'Jane Smith', status: ClaimStatus.Pending }
    ],
    fromLocation: 'Mumbai',
    toLocation: 'Mumbai',
    submittedBy: { id: 'emp4', name: 'Emily White' },
    chatHistory: [],
  },
  {
    id: '5',
    category: ClaimCategory.Train,
    amount: 950.00,
    date: '2023-10-30',
    description: 'Train ticket for on-site meeting',
    proofUrls: ['https://picsum.photos/seed/proof5/200/200'],
    status: ClaimStatus.Pending,
    invoiceNumber: 'IRCTC-998',
    approvers: [
        { id: 'mgr2', name: 'Jane Smith', status: ClaimStatus.Pending }
    ],
    fromLocation: 'Central Station',
    toLocation: 'Client Office',
    submittedBy: { id: 'emp5', name: 'Michael Brown' },
    chatHistory: [],
  },
   // An already approved claim for Jane to see
   {
    id: '6',
    category: ClaimCategory.Food,
    amount: 450.00,
    date: '2023-10-29',
    description: 'Team breakfast meeting',
    proofUrls: ['https://picsum.photos/seed/proof6/200/200'],
    status: ClaimStatus.Approved,
    invoiceNumber: 'SWG-552',
    approvers: [
        { id: 'mgr2', name: 'Jane Smith', status: ClaimStatus.Approved }
    ],
    mealTypes: [MealType.Breakfast],
    submittedBy: { id: 'emp4', name: 'Emily White' },
    chatHistory: [],
  },
   // A rejected claim Jane handled
  {
    id: '7',
    category: ClaimCategory.Laundry,
    amount: 600.00,
    date: '2023-10-28',
    description: 'Laundry service during business trip',
    proofUrls: ['https://picsum.photos/seed/proof7/200/200'],
    status: ClaimStatus.Rejected,
    invoiceNumber: 'LND-111',
    approvers: [
        { id: 'mgr2', name: 'Jane Smith', status: ClaimStatus.Rejected }
    ],
    submittedBy: { id: 'emp5', name: 'Michael Brown' },
    chatHistory: [
        { id: 'chat4', senderId: 'mgr2', senderName: 'Jane Smith', timestamp: '2023-10-28T14:00:00Z', content: 'This claim is missing a detailed invoice.', type: 'user' },
        { id: 'chat5', senderId: 'system', senderName: 'System', timestamp: '2023-10-28T14:00:05Z', content: 'Jane Smith changed their status to Rejected.', type: 'system' },
    ],
  },
  // A claim that doesn't involve Jane Smith
  {
    id: '3',
    category: ClaimCategory.Stay,
    amount: 8500.75,
    date: '2023-10-25',
    description: 'Hotel for personal conference',
    proofUrls: ['https://picsum.photos/seed/proof3/200/200'],
    status: ClaimStatus.Rejected,
    invoiceNumber: 'HOTEL-789',
    approvers: [
        { id: 'mgr1', name: 'John Doe', status: ClaimStatus.Rejected }
    ],
    submittedBy: { id: 'emp4', name: 'Emily White' },
    chatHistory: [],
  },
];

let notificationsDB: Notification[] = [
    {
        id: 'notif1',
        userId: 'mgr2', // Jane Smith
        claimId: '4',
        message: 'Emily White submitted a Stay claim for ₹12500.00 for your approval.',
        isRead: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        claimDescription: 'Hotel stay for client visit'
    },
    {
        id: 'notif2',
        userId: 'mgr2', // Jane Smith
        claimId: '5',
        message: 'Michael Brown submitted a Train claim for ₹950.00 for your approval.',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        claimDescription: 'Train ticket for on-site meeting'
    }
];

// Simulate database latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const db = {
  getClaims: async (): Promise<Claim[]> => {
    await delay(500); // Simulate network/db delay
    return JSON.parse(JSON.stringify(claimsDB));
  },

  getClaimById: async (id: string): Promise<Claim | undefined> => {
     await delay(50);
     const claim = claimsDB.find(c => c.id === id);
     return claim ? JSON.parse(JSON.stringify(claim)) : undefined;
  },

  addClaim: async (newClaim: Claim): Promise<Claim> => {
    await delay(300);
    claimsDB.unshift(newClaim);
    return JSON.parse(JSON.stringify(newClaim));
  },

  updateClaim: async (updatedClaim: Claim): Promise<Claim | null> => {
    await delay(300);
    const index = claimsDB.findIndex(c => c.id === updatedClaim.id);
    if (index === -1) {
      return null;
    }
    claimsDB[index] = updatedClaim;
    return JSON.parse(JSON.stringify(updatedClaim));
  },

  getNotifications: async (userId: string): Promise<Notification[]> => {
    await delay(100);
    const userNotifications = notificationsDB.filter(n => n.userId === userId);
    userNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return JSON.parse(JSON.stringify(userNotifications));
  },

  addNotification: async (notification: Omit<Notification, 'id'>): Promise<Notification> => {
    await delay(50);
    const newNotification: Notification = {
      ...notification,
      id: `notif_${new Date().getTime()}_${Math.random()}`,
    };
    notificationsDB.unshift(newNotification);
    return JSON.parse(JSON.stringify(newNotification));
  },

  updateNotification: async (notificationId: string, updates: Partial<Notification>): Promise<Notification | null> => {
    await delay(50);
    const index = notificationsDB.findIndex(n => n.id === notificationId);
    if (index === -1) return null;
    notificationsDB[index] = { ...notificationsDB[index], ...updates };
    return JSON.parse(JSON.stringify(notificationsDB[index]));
  },
};