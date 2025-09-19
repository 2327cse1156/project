import { Link } from 'react-router-dom';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
                <ShoppingBagIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">CampusBazaar</span>
            </div>
            <p className="text-gray-400">
              The trusted marketplace for college students. Buy, sell, and connect within your campus community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/browse" className="block text-gray-400 hover:text-white transition-colors">
                Browse Items
              </Link>
              <Link to="/create-listing" className="block text-gray-400 hover:text-white transition-colors">
                Sell Item
              </Link>
              <Link to="/how-it-works" className="block text-gray-400 hover:text-white transition-colors">
                How It Works
              </Link>
              <Link to="/safety" className="block text-gray-400 hover:text-white transition-colors">
                Safety Guidelines
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
            <div className="space-y-2">
              <Link to="/browse?category=Electronics" className="block text-gray-400 hover:text-white transition-colors">
                Electronics
              </Link>
              <Link to="/browse?category=Books%20%26%20Study%20Materials" className="block text-gray-400 hover:text-white transition-colors">
                Books & Study Materials
              </Link>
              <Link to="/browse?category=Furniture" className="block text-gray-400 hover:text-white transition-colors">
                Furniture
              </Link>
              <Link to="/browse?category=Sports%20%26%20Fitness" className="block text-gray-400 hover:text-white transition-colors">
                Sports & Fitness
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <Link to="/help" className="block text-gray-400 hover:text-white transition-colors">
                Help Center
              </Link>
              <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors">
                Contact Us
              </Link>
              <Link to="/terms" className="block text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="block text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2024 CampusBazaar. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};