import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, Bell, Heart, ShoppingBag, ShieldCheck } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Navbar({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">FoodShare <span className="text-green-600">SA</span></span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {user && (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">Dashboard</Link>
                {user.role === 'RETAILER' && <Link to="/donations/new" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">List Food</Link>}
                {user.role === 'NGO' && <Link to="/donations/browse" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">Find Food</Link>}
                <button className="relative p-2 text-gray-400 hover:text-green-600 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-100">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{user.displayName}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
                  </div>
                  <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
            {!user && (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-green-600">Log in</Link>
                <Link to="/register" className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-all shadow-sm">Get Started</Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-4">
          {user ? (
            <>
              <Link to="/dashboard" className="block text-base font-medium text-gray-600">Dashboard</Link>
              <button onClick={onLogout} className="block text-base font-medium text-red-600">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-base font-medium text-gray-600">Log in</Link>
              <Link to="/register" className="block text-base font-medium text-green-600">Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
