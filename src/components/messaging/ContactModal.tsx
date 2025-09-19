import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { User } from '../../types';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  CheckBadgeIcon 
} from '@heroicons/react/24/outline';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: User;
  listingTitle: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  seller,
  listingTitle
}) => {
  const [message, setMessage] = useState(`Hi! I'm interested in your listing "${listingTitle}". Is it still available?`);
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    setIsSending(true);
    
    // Simulate sending message
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would send the message through your messaging system
    alert('Message sent! The seller will be notified.');
    
    setIsSending(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Seller" maxWidth="lg">
      <div className="space-y-6">
        {/* Seller Info */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900">{seller.name}</h3>
              {seller.isVerified && (
                <CheckBadgeIcon className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <p className="text-sm text-gray-600">{seller.college}</p>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-600">Rating:</span>
                <span className="text-sm font-medium text-gray-900">
                  {seller.rating.toFixed(1)}/5.0
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-600">Reviews:</span>
                <span className="text-sm font-medium text-gray-900">
                  {seller.reviewCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Options */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Contact Information</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{seller.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Campus Phone</p>
                <p className="text-sm text-gray-600">Available after contact</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Send a Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your message here..."
          />
          <p className="text-sm text-gray-500">
            Be polite and specific about your interest in the item.
          </p>
        </div>

        {/* Safety Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h5 className="font-medium text-yellow-800 mb-2">Safety Reminder</h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Meet only in designated campus locations</li>
            <li>• Inspect items before payment</li>
            <li>• Use secure payment methods</li>
            <li>• Trust your instincts</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage} 
            loading={isSending}
            disabled={!message.trim()}
            className="flex-1"
          >
            Send Message
          </Button>
        </div>
      </div>
    </Modal>
  );
};