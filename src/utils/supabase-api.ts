import { supabase } from '../lib/supabase';
import { User, Listing, Review, RegisterData, SearchFilters } from '../types';
import { Database } from '../lib/database.types';
import { authAPI as mockAuthAPI, listingsAPI as mockListingsAPI, favoritesAPI as mockFavoritesAPI, reviewsAPI as mockReviewsAPI } from './api';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ListingRow = Database['public']['Tables']['listings']['Row'];
type ReviewRow = Database['public']['Tables']['reviews']['Row'];

// Helper function to check if tables exist
const checkTablesExist = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    return !error || error.code !== 'PGRST205';
  } catch {
    return false;
  }
};

// Helper function to convert database profile to User type
const profileToUser = (profile: Profile): User => ({
  id: profile.id,
  name: profile.name,
  email: profile.email,
  college: profile.college,
  rating: profile.rating,
  reviewCount: profile.review_count,
  isVerified: profile.is_verified,
  createdAt: profile.created_at
});

// Helper function to convert database listing to Listing type
const dbListingToListing = (listing: ListingRow & { profiles?: Profile }): Listing => ({
  id: listing.id,
  title: listing.title,
  description: listing.description,
  category: listing.category,
  price: listing.price,
  images: listing.images || [],
  sellerId: listing.seller_id,
  seller: listing.profiles ? profileToUser(listing.profiles) : undefined,
  status: listing.status,
  location: listing.location,
  createdAt: listing.created_at,
  updatedAt: listing.updated_at
});

// Auth API
export const authAPI = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      console.warn('Database tables not found, using mock data. Please set up Supabase tables.');
      return mockAuthAPI.login(email, password);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Login failed');

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('Profile not found');
    }

    return {
      user: profileToUser(profile),
      token: data.session?.access_token || ''
    };
  },

  async register(userData: RegisterData): Promise<{ user: User; token: string }> {
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      console.warn('Database tables not found, using mock data. Please set up Supabase tables.');
      return mockAuthAPI.register(userData);
    }

    // Validate college email
    if (!userData.email.match(/\.(edu|ac\.in)$/)) {
      throw new Error('Please use a valid college email address');
    }

    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Registration failed');

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        name: userData.name,
        email: userData.email,
        college: userData.college
      })
      .select()
      .single();

    if (profileError || !profile) {
      throw new Error('Failed to create profile');
    }

    return {
      user: profileToUser(profile),
      token: data.session?.access_token || ''
    };
  },

  async verifyToken(): Promise<User | null> {
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      return null;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) return null;

    return profileToUser(profile);
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }
};

// Listings API
export const listingsAPI = {
  async getListings(filters?: Partial<SearchFilters>): Promise<Listing[]> {
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      console.warn('Database tables not found, using mock data. Please set up Supabase tables.');
      return mockListingsAPI.getListings(filters);
    }

    let query = supabase
      .from('listings')
      .select(`
        *,
        profiles (*)
      `)
      .eq('status', 'active');

    // Apply filters
    if (filters?.query) {
      query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
    }

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    if (filters?.minPrice) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters?.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }

    // Apply sorting
    switch (filters?.sortBy) {
      case 'price-low':
        query = query.order('price', { ascending: true });
        break;
      case 'price-high':
        query = query.order('price', { ascending: false });
        break;
      case 'rating':
        query = query.order('created_at', { ascending: false }); // Fallback to newest
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return (data || []).map(dbListingToListing);
  },

  async getListing(id: string): Promise<Listing> {
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      console.warn('Database tables not found, using mock data. Please set up Supabase tables.');
      return mockListingsAPI.getListing(id);
    }

    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        profiles (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Listing not found');

    return dbListingToListing(data);
  },

  async getUserListings(userId: string): Promise<Listing[]> {
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      console.warn('Database tables not found, using mock data. Please set up Supabase tables.');
      return mockListingsAPI.getListings().then(listings => 
        listings.filter(l => l.sellerId === userId)
      );
    }

    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        profiles (*)
      `)
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map(dbListingToListing);
  },

  async createListing(listing: Omit<Listing, 'id' | 'seller' | 'createdAt' | 'updatedAt'>): Promise<Listing> {
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      console.warn('Database tables not found, using mock data. Please set up Supabase tables.');
      return mockListingsAPI.createListing(listing);
    }

    const { data, error } = await supabase
      .from('listings')
      .insert({
        title: listing.title,
        description: listing.description,
        category: listing.category,
        price: listing.price,
        images: listing.images,
        seller_id: listing.sellerId,
        status: listing.status,
        location: listing.location
      })
      .select(`
        *,
        profiles (*)
      `)
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Failed to create listing');

    return dbListingToListing(data);
  },

  async updateListing(id: string, updates: Partial<Listing>): Promise<Listing> {
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      console.warn('Database tables not found, using mock data. Please set up Supabase tables.');
      return mockListingsAPI.updateListing(id, updates);
    }

    const { data, error } = await supabase
      .from('listings')
      .update({
        ...(updates.title && { title: updates.title }),
        ...(updates.description && { description: updates.description }),
        ...(updates.category && { category: updates.category }),
        ...(updates.price !== undefined && { price: updates.price }),
        ...(updates.images && { images: updates.images }),
        ...(updates.status && { status: updates.status }),
        ...(updates.location && { location: updates.location })
      })
      .eq('id', id)
      .select(`
        *,
        profiles (*)
      `)
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Failed to update listing');

    return dbListingToListing(data);
  },

  async deleteListing(id: string): Promise<void> {
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      console.warn('Database tables not found, using mock data. Please set up Supabase tables.');
      return mockListingsAPI.deleteListing(id);
    }

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};

// Favorites API
export const favoritesAPI = {
  async getUserFavorites(userId: string): Promise<Listing[]> {
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      console.warn('Database tables not found, using mock data. Please set up Supabase tables.');
      return [];
    }

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        listings (
          *,
          profiles (*)
        )
      `)
      .eq('user_id', userId);

    if (error) throw new Error(error.message);

    return (data || [])
      .map(item => item.listings)
      .filter(Boolean)
      .map(dbListingToListing);
  },

  async addToFavorites(userId: string, listingId: string): Promise<void> {
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      console.warn('Database tables not found, using mock data. Please set up Supabase tables.');
      return;
    }

    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        listing_id: listingId
      });

    if (error) throw new Error(error.message);
  },

  async removeFromFavorites(userId: string, listingId: string): Promise<void> {
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      console.warn('Database tables not found, using mock data. Please set up Supabase tables.');
      return;
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('listing_id', listingId);

    if (error) throw new Error(error.message);
  },

  async isFavorited(userId: string, listingId: string): Promise<boolean> {
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      return false;
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('listing_id', listingId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message);
    }

    return !!data;
  }
};

// Reviews API
export const reviewsAPI = {
  async getReviewsForUser(userId: string): Promise<Review[]> {
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      console.warn('Database tables not found, using mock data. Please set up Supabase tables.');
      return mockReviewsAPI.getReviewsForUser(userId);
    }

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey (*),
        listing:listings (*)
      `)
      .eq('reviewee_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((review: any): Review => ({
      id: review.id,
      reviewerId: review.reviewer_id,
      reviewer: review.reviewer ? profileToUser(review.reviewer) : undefined,
      revieweeId: review.reviewee_id,
      listingId: review.listing_id,
      listing: review.listing ? dbListingToListing(review.listing) : undefined,
      rating: review.rating,
      comment: review.comment || '',
      createdAt: review.created_at
    }));
  },

  async createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      console.warn('Database tables not found, using mock data. Please set up Supabase tables.');
      return mockReviewsAPI.createReview(review);
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        reviewer_id: review.reviewerId,
        reviewee_id: review.revieweeId,
        listing_id: review.listingId,
        rating: review.rating,
        comment: review.comment
      })
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey (*),
        listing:listings (*)
      `)
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Failed to create review');

    return {
      id: data.id,
      reviewerId: data.reviewer_id,
      reviewer: data.reviewer ? profileToUser(data.reviewer) : undefined,
      revieweeId: data.reviewee_id,
      listingId: data.listing_id,
      listing: data.listing ? dbListingToListing(data.listing) : undefined,
      rating: data.rating,
      comment: data.comment || '',
      createdAt: data.created_at
    };
  }
};