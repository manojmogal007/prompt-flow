import { LogOut, Sun, Moon } from 'lucide-react';
import { Tooltip } from '../../utils/helperComponents/Tooltip';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../auth/useAuth';
import { useNavigate } from 'react-router';
import { APP_NAME } from '../../config';
import iconImage from '../../../assets/app_icon.png';
import IconButton from '../../utils/helperComponents/IconButton';

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const triggerLogout = async () => {
    const res = await logout();
    if (res?.data?.status) {
      navigate('/prompt-flow/auth/signin');
    }
  };
  return (
    <div className='w-full h-14 sticky top-0 z-50 flex items-center justify-between bg-white border-b border-gray-200 px-6'>
      <div className='flex items-center'>
        <img src={iconImage} alt='App Icon' className='w-8 h-8 mr-1' />
        <h2 className='text-lg font-bold '>{APP_NAME}</h2>
      </div>
      <div className='flex items-center space-x-2'>
        {user?.firstName && (
          <div className='flex items-center space-x-2 mr-3'>
            <div className='w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 dark:text-blue-400'>
              {user.firstName?.slice(0, 1)}
            </div>
            <span>{`${user?.firstName} ${user?.lastName}`}</span>
          </div>
        )}
        <button
          onClick={toggleTheme}
          className={`relative flex items-center w-10 h-5 rounded-full border transition-colors duration-300 border hover:border-red-400 mt-1 cursor-pointer ${
            theme === 'dark' ? 'bg-gray-800 border-red-400' : 'bg-gray-200 border-gray-400'
          }`}
        >
          <span
            className={`absolute top-0.1 left-0.5 flex items-center justify-center w-4 h-4 rounded-full transition-all duration-300 ${
              theme === 'dark' ? 'translate-x-5 bg-black text-gray-200' : 'translate-x-0 bg-white text-yellow-500'
            }`}
          >
            {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
          </span>
        </button>
        <Tooltip text='Logout' position='left'>
          <IconButton Icon={LogOut} triggerClick={triggerLogout} size='md' />
          {/* <button
            onClick={triggerLogout}
            className={`flex items-center space-x-2 p-1.5 rounded rounded-md border border-gray-200 text-gray-600 bg-gray-100 hover:bg-red-200 hover:text-red-600
             focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-gray-700 dark:border-gray-600
              dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600`}
          >
            <LogOut className='w-5 h-5' />
          </button> */}
        </Tooltip>
      </div>
    </div>
  );
}

export default Navbar;
