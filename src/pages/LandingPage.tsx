import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import {
  ShieldCheckIcon,
  UserGroupIcon,
  MapPinIcon,
  StarIcon,
  CheckBadgeIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Trusted',
      description: 'College email verification ensures you\'re dealing with real students from your campus.'
    },
    {
      icon: UserGroupIcon,
      title: 'Campus Community',
      description: 'Connect with fellow students and build lasting relationships within your college.'
    },
    {
      icon: MapPinIcon,
      title: 'Safe Meetups',
      description: 'Predefined campus locations ensure safe and convenient exchanges.'
    },
    {
      icon: StarIcon,
      title: 'Rating System',
      description: 'Build your reputation and trust through our comprehensive review system.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Students' },
    { number: '500+', label: 'Universities' },
    { number: '50,000+', label: 'Items Sold' },
    { number: '4.8/5', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-teal-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Hero Content */}
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">For Students, By Students</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                The Campus
                <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"> Marketplace</span>
                <br />You Can Trust
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Buy and sell safely within your college community. Verified students, secure transactions, 
                and campus-based meetups make CampusBazaar the smart choice for student commerce.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <Button size="lg" asChild>
                  <Link to="/browse">
                    Start Shopping
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link to="/register">
                      Join CampusBazaar
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/browse">
                      Browse Items
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckBadgeIcon className="h-5 w-5 text-green-600" />
                <span>College Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <StarIcon className="h-5 w-5 text-yellow-500" />
                <span>Rated 4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CampusBazaar?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've built the safest and most trusted marketplace specifically for college students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Getting started is simple and secure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Sign Up',
                description: 'Register with your college email address to join your campus community.'
              },
              {
                step: '2',
                title: 'List or Browse',
                description: 'Post items for sale or browse what your fellow students are offering.'
              },
              {
                step: '3',
                title: 'Meet & Exchange',
                description: 'Connect with buyers/sellers and meet safely at designated campus locations.'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students already using CampusBazaar to buy and sell safely within their campus community.
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/register">
                  Create Account
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link to="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};