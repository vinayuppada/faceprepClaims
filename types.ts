export enum ClaimCategory {
  Food = "Food",
  Cab = "Cab",
  Train = "Train",
  Laundry = "Laundry",
  Stay = "Stay",
}

export enum ClaimStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export enum MealType {
  Breakfast = "Breakfast",
  Lunch = "Lunch",
  Dinner = "Dinner",
}

export enum CabType {
  Auto = "Auto-Rickshaw",
  Cab = "Cab",
  Bike = "Bike",
}

export enum BookingApp {
  Uber = "Uber",
  Ola = "Ola",
  Rapido = "Rapido",
  Other = "Other",
}

export interface Approver {
    id: string;
    name: string;
    status: ClaimStatus;
    statusChanged?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  content: string;
  type: 'user' | 'system';
}

export interface Notification {
  id: string;
  userId: string; // The user who should receive this notification
  claimId: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  claimDescription: string;
}

export interface Claim {
  id: string;
  category: ClaimCategory;
  amount: number;
  date: string;
  description: string;
  proofUrls: string[]; // URL for the uploaded proof image
  status: ClaimStatus; // Overall status
  submittedBy: { id: string; name: string; };
  hasStatusChanged?: boolean; // To notify the submitter of a status update

  // New generic fields
  invoiceNumber?: string;
  approvers?: Approver[];
  chatHistory?: ChatMessage[];

  // Food specific
  mealTypes?: MealType[]; // Changed from mealType to mealTypes array

  // Cab/Train specific
  fromLocation?: string;
  toLocation?: string;
  
  // Cab specific
  cabType?: CabType;
  bookingApp?: BookingApp;
  coPassengers?: string;
}