import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ListingCard } from '../components/listings/ListingCard';
import { Listing } from '../types';
import { listingsAPI } from '../utils/supabase-api';
import { 
  PlusIcon, 
  EyeIcon, 
  StarIcon, 
  ShoppingBagIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserListings = async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const userOwnedListings = await listingsAPI.getUserListings(user.id);
        setUserListings(userOwnedListings);
      }
    } catch (err) {
      setError('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserListings();
  }, [user?.id]);

  const stats = [
    {
      label: 'Active Listings',
      value: userListings.filter(l => l.status === 'active').length,
      icon: ShoppingBagIcon,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      label: 'Items Sold',
      value: userListings.filter(l => l.status === 'sold').length,
      icon: TrophyIcon,
      color: 'text-green-600 bg-green-50'
    },
    {
      label: 'Profile Views',
      value: 127, // Mock data
      icon: EyeIcon,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      label: 'Average Rating',
      value: user?.rating?.toFixed(1) || '0.0',
      icon: StarIcon,
      color: 'text-yellow-600 bg-yellow-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.college} • Member since {new Date(user?.createdAt || '').toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button asChild>
                <Link to="/create-listing">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Listing
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Profile Status</h2>
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${user?.isVerified ? 'bg-green-100' : 'bg-yellow-100'}`}>
                <StarIcon className={`h-5 w-5 ${user?.isVerified ? 'text-green-600' : 'text-yellow-600'}`} />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {user?.isVerified ? 'Verified Account' : 'Pending Verification'}
                </p>
                <p className="text-sm text-gray-600">
                  {user?.isVerified ? 'Your account is verified' : 'Complete email verification'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <StarIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Trust Score</p>
                <p className="text-sm text-gray-600">
                  {user?.rating}/5.0 ({user?.reviewCount} reviews)
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <EyeIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Profile Visibility</p>
                <p className="text-sm text-gray-600">Public to campus</p>
              </div>
            </div>
          </div>
        </div>

        {/* Your Listings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Your Listings</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Manage All
              </Button>
              <Button size="sm" asChild>
                <Link to="/create-listing">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add New
                </Link>
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchUserListings}>Retry</Button>
            </div>
          ) : userListings.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No listings yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start selling by creating your first listing
              </p>
              <Button asChild>
                <Link to="/create-listing">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Your First Listing
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};