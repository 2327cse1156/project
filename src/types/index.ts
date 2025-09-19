export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  createdAt: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  sellerId: string;
  seller?: User;
  status: 'active' | 'sold' | 'inactive';
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewer?: User;
  revieweeId: string;
  listingId: string;
  listing?: Listing;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  college: string;
}

export interface SearchFilters {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'rating';
}