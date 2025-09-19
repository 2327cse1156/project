import { User, Listing, Review, RegisterData, SearchFilters } from '../types';

// Mock API functions - in production, these would make actual HTTP requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@mit.edu',
    college: 'MIT',
    rating: 4.8,
    reviewCount: 15,
    isVerified: true,
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@stanford.edu',
    college: 'Stanford University',
    rating: 4.6,
    reviewCount: 8,
    isVerified: true,
    createdAt: '2024-01-20T00:00:00Z'
  }
];

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'MacBook Pro 16" - Excellent Condition',
    description: 'Barely used MacBook Pro with M2 chip. Perfect for computer science students. Includes original box and charger.',
    category: 'Electronics',
    price: 1800,
    images: ['https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg'],
    sellerId: '1',
    seller: mockUsers[0],
    status: 'active',
    location: 'Main Library',
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z'
  },
  {
    id: '2',
    title: 'Calculus Textbook - 10th Edition',
    description: 'Stewart Calculus textbook in great condition. All pages intact, minimal highlighting.',
    category: 'Books & Study Materials',
    price: 120,
    images: ['https://images.pexels.com/photos/1106468/pexels-photo-1106468.jpeg'],
    sellerId: '2',
    seller: mockUsers[1],
    status: 'active',
    location: 'Student Union Building',
    createdAt: '2024-01-24T00:00:00Z',
    updatedAt: '2024-01-24T00:00:00Z'
  },
  {
    id: '3',
    title: 'IKEA Desk Chair - Comfortable',
    description: 'Ergonomic desk chair from IKEA. Used for one semester, very comfortable for long study sessions.',
    category: 'Furniture',
    price: 75,
    images: ['https://images.pexels.com/photos/586763/pexels-photo-586763.jpeg'],
    sellerId: '1',
    seller: mockUsers[0],
    status: 'active',
    location: 'Dormitory Common Area',
    createdAt: '2024-01-23T00:00:00Z',
    updatedAt: '2024-01-23T00:00:00Z'
  }
];

// Auth API
export const authAPI = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(1000);
    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== 'password123') {
      throw new Error('Invalid credentials');
    }
    return { user, token: 'mock-jwt-token' };
  },

  async register(userData: RegisterData): Promise<{ user: User; token: string }> {
    await delay(1000);
    if (!userData.email.match(/\.(edu|ac\.in)$/)) {
      throw new Error('Please use a valid college email address');
    }
    const newUser: User = {
      id: String(mockUsers.length + 1),
      ...userData,
      rating: 0,
      reviewCount: 0,
      isVerified: false,
      createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return { user: newUser, token: 'mock-jwt-token' };
  },

  async verifyToken(token: string): Promise<User> {
    await delay(500);
    return mockUsers[0]; // Return first user for demo
  }
};

// Listings API
export const listingsAPI = {
  async getListings(filters?: Partial<SearchFilters>): Promise<Listing[]> {
    await delay(800);
    let results = [...mockListings];
    
    if (filters?.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(listing => 
        listing.title.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query)
      );
    }
    
    if (filters?.category && filters.category !== 'all') {
      results = results.filter(listing => listing.category === filters.category);
    }
    
    if (filters?.minPrice) {
      results = results.filter(listing => listing.price >= filters.minPrice);
    }
    
    if (filters?.maxPrice) {
      results = results.filter(listing => listing.price <= filters.maxPrice);
    }
    
    return results;
  },

  async getListing(id: string): Promise<Listing> {
    await delay(500);
    const listing = mockListings.find(l => l.id === id);
    if (!listing) throw new Error('Listing not found');
    return listing;
  },

  async createListing(listing: Omit<Listing, 'id' | 'seller' | 'createdAt' | 'updatedAt'>): Promise<Listing> {
    await delay(1000);
    const newListing: Listing = {
      ...listing,
      id: String(mockListings.length + 1),
      seller: mockUsers.find(u => u.id === listing.sellerId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockListings.push(newListing);
    return newListing;
  },

  async updateListing(id: string, updates: Partial<Listing>): Promise<Listing> {
    await delay(1000);
    const index = mockListings.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Listing not found');
    
    mockListings[index] = {
      ...mockListings[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return mockListings[index];
  },

  async deleteListing(id: string): Promise<void> {
    await delay(500);
    const index = mockListings.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Listing not found');
    mockListings.splice(index, 1);
  }
};

// Reviews API
export const reviewsAPI = {
  async getReviewsForUser(userId: string): Promise<Review[]> {
    await delay(500);
    return []; // Mock empty reviews
  },

  async createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    await delay(1000);
    return {
      ...review,
      id: 'review-' + Date.now(),
      createdAt: new Date().toISOString()
    };
  }
};