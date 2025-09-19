import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { validateEmail } from '../utils/validation';
import { COLLEGES } from '../utils/constants';
import { EyeIcon, EyeSlashIcon, UserPlusIcon } from '@heroicons/react/24/outline';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  college: string;
}

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<RegisterForm>();

  const watchPassword = watch('password');

  const collegeOptions = COLLEGES.map(college => ({
    value: college,
    label: college
  }));

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      setError('');
      
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        college: data.college
      });
      
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
            <UserPlusIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Join CampusBazaar
          </h2>
          <p className="text-gray-600">
            Create your account and start trading safely
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <Input
                {...register('name', {
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  maxLength: { value: 50, message: 'Name must be less than 50 characters' }
                })}
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                error={errors.name?.message}
              />
            </div>

            <div>
              <Input
                {...register('email', {
                  required: 'College email is required',
                  validate: (value) => validateEmail(value) || 'Please use a valid college email (.edu or .ac.in)'
                })}
                type="email"
                label="College Email"
                placeholder="your.email@university.edu"
                error={errors.email?.message}
                helperText="Only .edu and .ac.in domains are accepted"
              />
            </div>

            <div>
              <Select
                {...register('college', {
                  required: 'Please select your college'
                })}
                label="College/University"
                options={collegeOptions}
                error={errors.college?.message}
              />
            </div>

            <div className="relative">
              <Input
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain uppercase, lowercase, and number'
                  }
                })}
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Create a strong password"
                error={errors.password?.message}
                helperText="Must include uppercase, lowercase, and number"
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

            <div className="relative">
              <Input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === watchPassword || 'Passwords do not match'
                })}
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                placeholder="Confirm your password"
                error={errors.confirmPassword?.message}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              Create Account
            </Button>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};