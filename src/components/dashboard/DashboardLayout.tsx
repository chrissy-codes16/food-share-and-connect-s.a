import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  History, 
  Settings, 
  BarChart3, 
  ShieldCheck, 
  MessageSquare,
  Search
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

export default function DashboardLayout({ children, user }: { children: React.ReactNode; user: any }) {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { 
      icon: ShoppingBag, 
      label: user.role === 'RETAILER' ? 'My Donations' : 'Browse Food', 
      path: user.role === 'RETAILER' ? '/donations/manage' : '/donations/browse' 
    },
    { icon: History, label: 'History', path: '/history' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: BarChart3, label: 'Impact Reports', path: '/impact' },
    { icon: ShieldCheck, label: 'Verification', path: '/verification' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col sticky top-16 h-[calc(100vh-4rem)]">
        <div className="p-6 flex-1">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all group",
                  location.pathname === item.path
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-green-600"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 mr-3 transition-colors",
                  location.pathname === item.path ? "text-green-600" : "text-gray-400 group-hover:text-green-500"
                )} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-gray-100">
          <div className="bg-green-600 rounded-2xl p-4 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">Impact Score</p>
              <p className="text-2xl font-bold mb-2">1,240 <span className="text-xs font-normal opacity-80">kg</span></p>
              <div className="w-full bg-white/20 rounded-full h-1.5 mb-2">
                <div className="bg-white rounded-full h-1.5 w-3/4"></div>
              </div>
              <p className="text-[10px] opacity-80">Next milestone: 2,000 kg saved</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
