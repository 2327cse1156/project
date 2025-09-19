import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Listing } from '../types';
import { listingsAPI, favoritesAPI } from '../utils/supabase-api';
import { formatPrice, formatDate } from '../utils/validation';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ContactModal } from '../components/messaging/ContactModal';
import {
  StarIcon,
  MapPinIcon,
  ClockIcon,
  HeartIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserCircleIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarFilledIcon, HeartIcon as HeartFilledIcon } from '@heroicons/react/24/solid';

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        setLoading(true);
        const data = await listingsAPI.getListing(id);
        setListing(data);
      } catch (err) {
        setError('Listing not found');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  useEffect(() => {
    if (user && listing) {
      checkIfFavorited();
    }
  }, [user, listing]);

  const checkIfFavorited = async () => {
    if (!user || !listing) return;
    try {
      const favorited = await favoritesAPI.isFavorited(user.id, listing.id);
      setIsFavorited(favorited);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user || !listing) {
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      if (isFavorited) {
        await favoritesAPI.removeFromFavorites(user.id, listing.id);
        setIsFavorited(false);
      } else {
        await favoritesAPI.addToFavorites(user.id, listing.id);
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const nextImage = () => {
    if (!listing) return;
    setCurrentImageIndex((prev) => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    if (!listing) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarFilledIcon key={i} className="h-4 w-4 text-yellow-400" />);
    }
    
    for (let i = fullStars; i < 5; i++) {
      stars.push(<StarIcon key={i} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    
    setShowContactModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Listing Not Found</h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => navigate('/browse')}>
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
              <img
                src={listing.images[currentImageIndex] || 'https://images.pexels.com/photos/4439425/pexels-photo-4439425.jpeg'}
                alt={listing.title}
                className="w-full h-96 object-cover"
              />
              
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {listing.images.length > 1 && (
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                  {currentImageIndex + 1} / {listing.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {listing.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${listing.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Listing Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {listing.category}
                    </span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      listing.status === 'active' 
                        ? 'text-green-600 bg-green-50' 
                        : 'text-gray-600 bg-gray-50'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {listing.title}
                  </h1>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatPrice(listing.price)}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-lg transition-colors ${
                      isFavorited ? 'text-red-600 bg-red-50' : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {isFavorited ? (
                      <HeartFilledIcon className="h-6 w-6" />
                    ) : (
                      <HeartIcon className="h-6 w-6" />
                    )}
                  </button>
                  <button className="p-2 text-gray-400 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <ShareIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPinIcon className="h-5 w-5" />
                  <span>Meetup: {listing.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <ClockIcon className="h-5 w-5" />
                  <span>Posted: {formatDate(listing.createdAt)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleContactSeller}
                  disabled={user?.id === listing.sellerId}
                  className="w-full"
                  size="lg"
                >
                  {user?.id === listing.sellerId ? 'This is your listing' : 'Contact Seller'}
                </Button>
                
                {!isAuthenticated && (
                  <p className="text-sm text-gray-600 text-center">
                    <button
                      onClick={() => navigate('/login')}
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Sign in
                    </button>
                    {' '}to contact the seller
                  </p>
                )}
              </div>
            </div>

            {/* Seller Information */}
            {listing.seller && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h2>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{listing.seller.name}</h3>
                      {listing.seller.isVerified && (
                        <CheckBadgeIcon className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600">{listing.seller.college}</p>
                    
                    <div className="flex items-center space-x-1 mt-1">
                      {renderStars(listing.seller.rating)}
                      <span className="text-sm text-gray-600 ml-2">
                        {listing.seller.rating.toFixed(1)} ({listing.seller.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {listing.seller.reviewCount}
                      </p>
                      <p className="text-sm text-gray-600">Reviews</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {listing.seller.rating.toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-600">Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Safety Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                Safety Tips
              </h3>
              <ul className="space-y-2 text-yellow-700">
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  Meet in designated campus locations only
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  Inspect items carefully before purchasing
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  Use secure payment methods
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  Trust your instincts and report suspicious activity
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {listing?.seller && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          seller={listing.seller}
          listingTitle={listing.title}
        />
      )}
    </div>
  );
};