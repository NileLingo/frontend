import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../features/auth/authSlice';
import { LogOut, User } from 'lucide-react';
import Button from './Button';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  return (
    <nav className="bg-[#121212] border-b border-[#1E1E1E] px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 
            className="text-[#F5F5F5] text-xl font-bold cursor-pointer"
            onClick={() => navigate('/')}
          >
            NileLingo
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center text-[#CCCCCC]">
                <User size={16} className="mr-2" />
                <span>{user?.username}</span>
              </div>
              <Button 
                variant="text"
                size="sm"
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut size={16} className="mr-1" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="text" 
                size="sm"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;