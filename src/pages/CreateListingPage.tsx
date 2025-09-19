import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { listingsAPI } from '../utils/api';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../utils/constants';
import { validatePrice } from '../utils/validation';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ListingForm {
  title: string;
  description: string;
  category: string;
  price: string;
  location: string;
}

export const CreateListingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ListingForm>();

  const categoryOptions = CATEGORIES.map(category => ({
    value: category,
    label: category
  }));

  const locationOptions = CAMPUS_LOCATIONS.map(location => ({
    value: location,
    label: location
  }));

  const handleImageAdd = () => {
    // Mock image URL for demo - in production, integrate with Cloudinary
    const mockImageUrls = [
      'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
      'https://images.pexels.com/photos/1106468/pexels-photo-1106468.jpeg',
      'https://images.pexels.com/photos/586763/pexels-photo-586763.jpeg',
      'https://images.pexels.com/photos/4439425/pexels-photo-4439425.jpeg',
      'https://images.pexels.com/photos/442154/pexels-photo-442154.jpeg'
    ];
    
    const randomImage = mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)];
    if (images.length < 5) {
      setImages([...images, randomImage]);
    }
  };

  const handleImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ListingForm) => {
    try {
      setIsLoading(true);
      setError('');

      if (!user) {
        throw new Error('You must be logged in to create a listing');
      }

      if (images.length === 0) {
        throw new Error('Please add at least one image');
      }

      const listingData = {
        title: data.title,
        description: data.description,
        category: data.category,
        price: parseFloat(data.price),
        location: data.location,
        images,
        sellerId: user.id,
        status: 'active' as const
      };

      await listingsAPI.createListing(listingData);
      
      // Reset form
      reset();
      setImages([]);
      
      // Navigate to dashboard with success message
      navigate('/dashboard', { 
        state: { message: 'Listing created successfully!' }
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Listing
          </h1>
          <p className="text-gray-600">
            Share details about your item to attract potential buyers
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h2>

              <Input
                {...register('title', {
                  required: 'Title is required',
                  minLength: { value: 5, message: 'Title must be at least 5 characters' },
                  maxLength: { value: 100, message: 'Title must be less than 100 characters' }
                })}
                label="Title"
                placeholder="MacBook Pro 16″, Calculus Textbook, etc."
                error={errors.title?.message}
                helperText="Be specific and descriptive"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description', {
                    required: 'Description is required',
                    minLength: { value: 10, message: 'Description must be at least 10 characters' },
                    maxLength: { value: 1000, message: 'Description must be less than 1000 characters' }
                  })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the condition, usage, included accessories..."
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Include condition, age, and any relevant details
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  {...register('category', {
                    required: 'Category is required'
                  })}
                  label="Category"
                  options={[{ value: '', label: 'Select a category' }, ...categoryOptions]}
                  error={errors.category?.message}
                />

                <Input
                  {...register('price', {
                    required: 'Price is required',
                    validate: (value) => validatePrice(value) || 'Please enter a valid price'
                  })}
                  type="number"
                  step="0.01"
                  min="0"
                  label="Price ($)"
                  placeholder="0.00"
                  error={errors.price?.message}
                  helperText="Set a fair market price"
                />
              </div>

              <Select
                {...register('location', {
                  required: 'Meetup location is required'
                })}
                label="Preferred Meetup Location"
                options={[{ value: '', label: 'Select a location' }, ...locationOptions]}
                error={errors.location?.message}
                helperText="Choose a safe, public campus location"
              />
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Photos ({images.length}/5)
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={handleImageAdd}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
                  >
                    <PhotoIcon className="h-8 w-8 mb-2" />
                    <span className="text-sm font-medium">Add Photo</span>
                  </button>
                )}
              </div>

              <p className="text-sm text-gray-500">
                Add up to 5 high-quality photos. First photo will be the main image.
                <br />
                <em>Note: This demo uses stock photos. In production, integrate with Cloudinary for real image uploads.</em>
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading || images.length === 0}
                className="flex-1"
              >
                Create Listing
              </Button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Tips for a Great Listing
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              Use clear, well-lit photos from multiple angles
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              Be honest about the item's condition and any flaws
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              Research similar items to set a competitive price
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              Include relevant keywords in your title and description
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};