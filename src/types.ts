export type UserRole = 'retailer' | 'ngo' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  isVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  businessName?: string;
  npoNumber?: string;
  sarsNumber?: string;
  coaUrl?: string;
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export type FoodCategory = 'perishable' | 'non_perishable' | 'prepared';

export interface FoodListing {
  id: string;
  retailerId: string;
  retailerName: string;
  title: string;
  description: string;
  category: FoodCategory;
  quantity: number; // in kg or units
  unit: string;
  expiryDate: string;
  allergens: string[];
  photoUrl?: string;
  labelPhotoUrl?: string; // R146 requirement
  status: 'available' | 'claimed' | 'collected' | 'expired' | 'cancelled';
  ngoId?: string;
  ngoName?: string;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export interface DonationClaim {
  id: string;
  listingId: string;
  ngoId: string;
  ngoName: string;
  retailerId: string;
  status: 'claimed' | 'collected' | 'cancelled';
  claimDate: string;
  collectionDate?: string;
  qrCode?: string;
  handoverChecklist?: {
    coldChainMaintained: boolean;
    packagingIntact: boolean;
    labelsVisible: boolean;
  };
}

export interface ImpactMetrics {
  totalKgSaved: number;
  totalMealsProvided: number;
  totalCo2Avoided: number;
  totalTaxSavings: number;
}
