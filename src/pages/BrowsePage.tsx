import { useState, useEffect } from 'react';
import { SearchBar } from '../components/search/SearchBar';
import { FilterPanel } from '../components/search/FilterPanel';
import { ListingCard } from '../components/listings/ListingCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Listing, SearchFilters } from '../types';
import { listingsAPI } from '../utils/supabase-api';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export const BrowsePage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    minPrice: 0,
    maxPrice: 10000,
    sortBy: 'newest'
  });

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await listingsAPI.getListings(filters);
      setListings(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load listings';
      if (errorMessage.includes('table') && errorMessage.includes('schema cache')) {
        setError('Database not set up. Using demo data. Please connect to Supabase and run migrations.');
      } else {
        setError('Failed to load listings');
      }
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Marketplace
          </h1>
          <p className="text-gray-600">
            Discover amazing deals from your fellow students
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for textbooks, electronics, furniture..."
            className="max-w-2xl mx-auto"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                {!loading && (
                  <p className="text-gray-600">
                    {listings.length === 0 ? 'No items found' : `${listings.length} items found`}
                  </p>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <LoadingSpinner size="lg" />
                  <p className="text-gray-600">Loading listings...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchListings}>
                  Try Again
                </Button>
              </div>
            )}

            {/* Listings Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && listings.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AdjustmentsHorizontalIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No items found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => setFilters({
                    query: '',
                    category: 'all',
                    minPrice: 0,
                    maxPrice: 10000,
                    sortBy: 'newest'
                  })}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};