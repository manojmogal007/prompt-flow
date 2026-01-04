import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import React from 'react';
import { useApiMutation } from '../../utils/customHooks/apiHooks';
import { usePostAuthRequestMutation } from '../../utils/services/authService';
import { APP_NAME } from '../../config';
import { Link, useNavigate } from 'react-router';
import iconImage from '../../../assets/app_icon.png';
import { useToast } from '../../hooks/useToast';
import { handleAccessToken } from '../authSlice';
import { useAppDispatch } from '../../store/hooks';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }>({ firstName: '', lastName: '', email: '', password: '' });

  const { isLoading, handleTrigger } = useApiMutation(usePostAuthRequestMutation, '/users/registerUser', {
    onSuccess: (data: any) => {
      dispatch(handleAccessToken(data?.accessToken));
      navigate('/prompt-flow/workflows');
    },
    onError: (error: any) => {
      console.log(error);
      showToast(error?.data?.message || 'Something went wrong', 'error');
    },
  });

  const triggerSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleTrigger(formData);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className='w-full flex bg-white dark:bg-dark-900 h-[100dvh]'>
      <div className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-900'>
        <div className='max-w-md w-full space-y-8'>
          {/* Header */}
          <div className='text-center '>
            <div className='flex items-center justify-center mb-3'>
              <div className='w-12 h-12 rounded-xl flex items-center justify-center'>
                <img src={iconImage} alt='App Icon' className='w-14 h-14' />
              </div>
            </div>
            <div className='flex items-center justify-center space-x-3 mb-6'>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Sign up to {APP_NAME}</h1>
            </div>
          </div>

          {/* sign up Form */}
          <form className='mt-8 space-y-6' onSubmit={triggerSignIn}>
            <div className='space-y-4'>
              <div className='flex space-x-3'>
                <div className='flex-1'>
                  <label htmlFor='email' className='block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2'>
                    First name
                  </label>
                  <div className='relative'>
                    <input
                      id='firstName'
                      name='firstName'
                      type='string'
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className='block w-full pl-3 pr-3 py-3 border border-gray-300 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-dark-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100'
                      placeholder='Your first name'
                    />
                  </div>
                </div>
                <div className='flex-1'>
                  <label htmlFor='email' className='block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2'>
                    Last name
                  </label>
                  <div className='relative'>
                    <input
                      id='lastName'
                      name='lastName'
                      type='string'
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className='block w-full pl-3 pr-3 py-3 border border-gray-300 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-dark-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100'
                      placeholder='Your last name'
                    />
                  </div>
                </div>
              </div>
              {/* Email Field */}
              <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2'>
                  Email address
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Mail className='h-5 w-5 text-gray-400 dark:text-dark-500' />
                  </div>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className='block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-dark-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100'
                    placeholder='Your email address'
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor='password' className='block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2'>
                  Password
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Lock className='h-5 w-5 text-gray-400 dark:text-dark-500' />
                  </div>
                  <input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='current-password'
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className='block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-dark-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100'
                    placeholder='Your password'
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5 text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-400' />
                    ) : (
                      <Eye className='h-5 w-5 text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-400' />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {/* {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )} */}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {isLoading
                ? // <div className="flex items-center space-x-2">
                  //   {/* <LoadingSpinner /> */}
                  //   <span>Signing in...</span>
                  // </div>
                  'Signing up...'
                : 'Sign up'}
            </button>

            {/* Forgot Password Link */}
            <div className='text-center'>
              <p className='text-gray-600 dark:text-dark-400'>
                Already have an account?{' '}
                <Link to='/prompt-flow/auth/signin' className='text-sm text-blue-600 hover:text-blue-500 transition-colors hover:underline'>
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
