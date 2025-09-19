import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { User } from '../../types';
import { reviewsAPI } from '../../utils/supabase-api';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: User;
  listingId: string;
  reviewerId: string;
  onReviewSubmitted?: () => void;
}

interface ReviewForm {
  rating: number;
  comment: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  seller,
  listingId,
  reviewerId,
  onReviewSubmitted
}) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ReviewForm>();

  const onSubmit = async (data: ReviewForm) => {
    try {
      setIsSubmitting(true);
      
      await reviewsAPI.createReview({
        reviewerId,
        revieweeId: seller.id,
        listingId,
        rating: selectedRating,
        comment: data.comment
      });

      reset();
      setSelectedRating(0);
      onReviewSubmitted?.();
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoverRating || selectedRating);
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setSelectedRating(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          className="p-1 transition-colors"
        >
          {isFilled ? (
            <StarIcon className="h-8 w-8 text-yellow-400" />
          ) : (
            <StarOutlineIcon className="h-8 w-8 text-gray-300 hover:text-yellow-400" />
          )}
        </button>
      );
    }
    return stars;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave a Review" maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            How was your experience with <strong>{seller.name}</strong>?
          </p>
          
          <div className="flex justify-center space-x-1 mb-2">
            {renderStars()}
          </div>
          
          {selectedRating > 0 && (
            <p className="text-sm text-gray-600">
              {selectedRating === 1 && 'Poor'}
              {selectedRating === 2 && 'Fair'}
              {selectedRating === 3 && 'Good'}
              {selectedRating === 4 && 'Very Good'}
              {selectedRating === 5 && 'Excellent'}
            </p>
          )}
          
          {selectedRating === 0 && (
            <p className="text-sm text-red-600">Please select a rating</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comment (Optional)
          </label>
          <textarea
            {...register('comment')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Share your experience with other students..."
          />
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            type="submit"
            loading={isSubmitting}
            disabled={selectedRating === 0 || isSubmitting}
            className="flex-1"
          >
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  );
};