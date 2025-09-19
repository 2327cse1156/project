import { useState } from 'react';
import { SearchFilters } from '../../types';
import { CATEGORIES } from '../../utils/constants';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...CATEGORIES.map(category => ({ value: category, label: category }))
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Best Rated' }
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: filters.query,
      category: 'all',
      minPrice: 0,
      maxPrice: 10000,
      sortBy: 'newest'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Mobile Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 text-left font-medium text-gray-900 hover:bg-gray-50"
        >
          <span className="flex items-center space-x-2">
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            <span>Filters</span>
          </span>
          <span className="text-gray-400">
            {isOpen ? '−' : '+'}
          </span>
        </button>
      </div>

      {/* Filter Content */}
      <div className={`p-4 space-y-4 ${isOpen ? 'block' : 'hidden'} lg:block`}>
        {/* Category */}
        <Select
          label="Category"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          options={categoryOptions}
        />

        {/* Price Range */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', parseFloat(e.target.value) || 10000)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Sort By */}
        <Select
          label="Sort By"
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value as SearchFilters['sortBy'])}
          options={sortOptions}
        />

        {/* Clear Filters */}
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="w-full"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};