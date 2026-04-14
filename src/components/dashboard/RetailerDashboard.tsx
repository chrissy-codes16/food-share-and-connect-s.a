import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  FileText,
  Calendar,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import { cn, formatCurrency } from '@/src/lib/utils';
import { Link } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '@/src/firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { useAuth } from '../auth/AuthContext';
import { FoodListing } from '@/src/types';

export default function RetailerDashboard() {
  const { user, profile } = useAuth();
  const [donations, setDonations] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Total Donations', value: '0 kg', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'NGOs Reached', value: '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Tax Savings', value: formatCurrency(0), icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Active Listings', value: '0', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'donations'),
      where('retailerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as FoodListing));
      setDonations(docs);

      // Calculate stats
      const totalWeight = docs.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
      const activeCount = docs.filter(d => d.status === 'available').length;
      const uniqueNgos = new Set(docs.filter(d => d.ngoId).map(d => d.ngoId)).size;
      
      // Mock tax savings for now (e.g., R10 per kg)
      const taxSavings = totalWeight * 12.5;

      setStats([
        { label: 'Total Donations', value: `${totalWeight.toLocaleString()} kg`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'NGOs Reached', value: uniqueNgos.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Tax Savings', value: formatCurrency(taxSavings), icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Active Listings', value: activeCount.toString(), icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
      ]);

      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'donations');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Retailer Dashboard</h1>
          <p className="text-gray-500">Welcome back, {profile?.businessName || profile?.displayName}</p>
        </div>
        <Link 
          to="/donations/new" 
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-sm shadow-green-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Donation
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Donations</h2>
            <Link to="/history" className="text-sm font-semibold text-green-600 hover:underline">View all</Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {donations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No donations yet. Start by creating your first listing!
                </div>
              ) : (
                donations.slice(0, 5).map((donation) => (
                  <div key={donation.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {donation.photoUrl ? (
                          <img src={donation.photoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingBag className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{donation.title}</p>
                        <p className="text-xs text-gray-500">
                          {donation.quantity}{donation.unit} • {donation.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold uppercase",
                        donation.status === 'available' ? "bg-blue-50 text-blue-600" :
                        donation.status === 'claimed' ? "bg-amber-50 text-amber-600" :
                        "bg-green-50 text-green-600"
                      )}>
                        {donation.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Compliance & Verification */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Compliance Status</h2>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-start space-x-4">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                profile?.isVerified ? "bg-green-50" : "bg-amber-50"
              )}>
                {profile?.isVerified ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">
                  {profile?.isVerified ? 'Verified Account' : 'Verification Pending'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {profile?.isVerified 
                    ? 'Your account is fully verified for Section 18A.' 
                    : 'Upload your COA and NPO docs in the Verification Center.'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">R146 Labeling</p>
                <p className="text-xs text-gray-500 mt-1">All listings currently meet mandatory labeling standards.</p>
              </div>
            </div>

            <Link 
              to="/verification"
              className="block w-full py-3 bg-gray-50 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-100 transition-all text-center"
            >
              Go to Verification Center
            </Link>
          </div>

          {/* Impact Card */}
          <div className="bg-green-600 p-6 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold mb-2">Impact Summary</h3>
              <p className="text-sm text-green-50/80 mb-4">
                You've helped provide thousands of meals to local communities.
              </p>
              <Link 
                to="/impact"
                className="inline-flex items-center text-sm font-bold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all"
              >
                View Reports <ArrowUpRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
