import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Settings, ClipboardList, LogOut } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAdmin } = useAuth();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.code === 'auth/popup-blocked') {
        alert('登入視窗被瀏覽器攔截，請允許彈出視窗後再試一次。');
      } else if (error.code === 'auth/unauthorized-domain') {
        alert('目前的網域未被授權進行登入。請前往 Firebase 控制台將此網域加入授權清單。');
      } else {
        alert('登入失敗：' + (error.message || '未知錯誤'));
      }
    }
  };

  const handleLogout = () => signOut(auth);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#4a6741] rounded-full flex items-center justify-center text-white font-bold text-xl">
            茶
          </div>
          <span className="text-xl font-bold text-[#2d3a29]">雙茶苑</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-[#4a6741] transition-colors">菜單</Link>
          <Link to="/orders" className="text-gray-600 hover:text-[#4a6741] transition-colors flex items-center gap-1">
            <ClipboardList size={18} />
            <span className="hidden sm:inline">我的訂單</span>
          </Link>
          
          {isAdmin && (
            <Link to="/admin" className="text-gray-600 hover:text-[#4a6741] transition-colors flex items-center gap-1">
              <Settings size={18} />
              <span className="hidden sm:inline">後台管理</span>
            </Link>
          )}

          <div className="h-6 w-[1px] bg-gray-200 mx-2" />

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2">
                <img src={user.photoURL || ''} alt="Avatar" className="w-8 h-8 rounded-full border" />
                <span className="hidden md:inline text-sm font-medium">{user.displayName}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="bg-[#4a6741] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3d5535] transition-colors"
            >
              登入
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
