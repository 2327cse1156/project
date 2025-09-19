import { Link } from 'react-router-dom';
import { Listing } from '../../types';
import { formatPrice, formatDate } from '../../utils/validation';
import { StarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} className="h-4 w-4 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarIcon key="half" className="h-4 w-4 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarOutlineIcon key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <Link to={`/listing/${listing.id}`} className="group">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200 overflow-hidden">
        {/* Image */}
        <div className="aspect-w-16 aspect-h-12 bg-gray-200 overflow-hidden">
          <img
            src={listing.images[0] || 'https://images.pexels.com/photos/4439425/pexels-photo-4439425.jpeg'}
            alt={listing.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category & Status */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {listing.category}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              listing.status === 'active' 
                ? 'text-green-600 bg-green-50' 
                : listing.status === 'sold'
                ? 'text-red-600 bg-red-50'
                : 'text-gray-600 bg-gray-50'
            }`}>
              {listing.status}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>

          {/* Price */}
          <p className="text-2xl font-bold text-gray-900 mb-3">
            {formatPrice(listing.price)}
          </p>

          {/* Seller Info */}
          {listing.seller && (
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{listing.seller.name}</p>
                <div className="flex items-center space-x-1">
                  {renderStars(listing.seller.rating)}
                  <span className="text-xs text-gray-500 ml-1">
                    ({listing.seller.reviewCount})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Location & Date */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPinIcon className="h-4 w-4" />
              <span>{listing.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-4 w-4" />
              <span>{formatDate(listing.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};