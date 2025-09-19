import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { validateEmail } from '../utils/validation';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface LoginForm {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<LoginForm>();

  const watchEmail = watch('email');

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setError('');
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to your CampusBazaar account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <Input
                {...register('email', {
                  required: 'Email is required',
                  validate: (value) => validateEmail(value) || 'Please use a valid college email (.edu or .ac.in)'
                })}
                type="email"
                label="College Email"
                placeholder="your.email@university.edu"
                error={errors.email?.message}
                helperText="Use your official college email address"
              />
            </div>

            <div className="relative">
              <Input
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' }
                })}
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                error={errors.password?.message}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              Sign In
            </Button>
          </form>

          {/* Demo Account */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 text-center">
              Demo Account (for testing):
            </p>
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p><strong>Email:</strong> john.smith@mit.edu</p>
              <p><strong>Password:</strong> password123</p>
            </div>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};