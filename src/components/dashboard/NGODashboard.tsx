import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ShoppingBag,
  History,
  Navigation,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '@/src/firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { useAuth } from '../auth/AuthContext';
import { FoodListing } from '@/src/types';

export default function NGODashboard() {
  const { user, profile } = useAuth();
  const [nearbyDonations, setNearbyDonations] = useState<FoodListing[]>([]);
  const [activePickups, setActivePickups] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Food Received', value: '0 kg', icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Meals Provided', value: '0', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Claims', value: '0', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Past Pickups', value: '0', icon: History, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]);

  useEffect(() => {
    if (!user) return;

    // Query for available donations
    const availableQuery = query(
      collection(db, 'donations'),
      where('status', '==', 'available'),
      orderBy('createdAt', 'desc'),
      limit(6)
    );

    // Query for NGO's active claims
    const claimsQuery = query(
      collection(db, 'donations'),
      where('ngoId', '==', user.uid),
      where('status', 'in', ['claimed', 'ready']),
      orderBy('createdAt', 'desc')
    );

    // Query for NGO's history
    const historyQuery = query(
      collection(db, 'donations'),
      where('ngoId', '==', user.uid),
      where('status', '==', 'collected'),
      orderBy('createdAt', 'desc')
    );

    const unsubAvailable = onSnapshot(availableQuery, (snapshot) => {
      setNearbyDonations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as FoodListing)));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'donations'));

    const unsubClaims = onSnapshot(claimsQuery, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as FoodListing));
      setActivePickups(docs);
      setStats(prev => prev.map(s => s.label === 'Active Claims' ? { ...s, value: docs.length.toString() } : s));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'donations'));

    const unsubHistory = onSnapshot(historyQuery, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as FoodListing));
      const totalWeight = docs.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
      const meals = Math.floor(totalWeight * 2.5); // Estimate 2.5 meals per kg
      
      setStats(prev => prev.map(s => {
        if (s.label === 'Food Received') return { ...s, value: `${totalWeight.toLocaleString()} kg` };
        if (s.label === 'Meals Provided') return { ...s, value: meals.toLocaleString() };
        if (s.label === 'Past Pickups') return { ...s, value: docs.length.toString() };
        return s;
      }));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'donations'));

    return () => {
      unsubAvailable();
      unsubClaims();
      unsubHistory();
    };
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
          <h1 className="text-2xl font-bold text-gray-900">NGO Dashboard</h1>
          <p className="text-gray-500">Helping communities, one meal at a time.</p>
        </div>
        <Link 
          to="/donations/browse" 
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-sm shadow-green-200"
        >
          <Search className="w-5 h-5 mr-2" />
          Browse Nearby Food
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
        {/* Nearby Food */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Nearby Donations</h2>
            <Link to="/donations/browse" className="text-sm font-semibold text-green-600 hover:underline">View map</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nearbyDonations.length === 0 ? (
              <div className="col-span-2 p-8 bg-white rounded-2xl border border-gray-100 text-center text-gray-500">
                No donations available nearby right now. Check back soon!
              </div>
            ) : (
              nearbyDonations.map((donation) => (
                <div key={donation.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-green-200 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center overflow-hidden">
                      {donation.photoUrl ? (
                        <img src={donation.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded uppercase tracking-wider flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {donation.expiryDate ? `Expires ${new Date(donation.expiryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'N/A'}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{donation.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{donation.retailerName}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center text-xs text-gray-400">
                      <MapPin className="w-3 h-3 mr-1" />
                      {donation.quantity}{donation.unit}
                    </div>
                    <Link to={`/donations/${donation.id}`} className="text-sm font-bold text-green-600 flex items-center group-hover:translate-x-1 transition-transform">
                      View Details <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Claims & Pickups */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Active Pickups</h2>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            {activePickups.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No active pickups.</p>
                <p className="text-xs text-gray-400 mt-1">Claim a donation to get started.</p>
              </div>
            ) : (
              activePickups.map((pickup) => (
                <div key={pickup.id} className="p-4 bg-green-50 border border-green-100 rounded-xl relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs font-bold text-green-600 uppercase">
                        {pickup.status === 'ready' ? 'Ready for Pickup' : 'Claimed'}
                      </p>
                      <Navigation className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{pickup.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{pickup.retailerName}</p>
                    <Link 
                      to={`/pickups/${pickup.id}`}
                      className="block w-full mt-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-all text-center"
                    >
                      View Pickup Info
                    </Link>
                  </div>
                </div>
              ))
            )}

            <div className="space-y-4 pt-4 border-t border-gray-50">
              <h3 className="text-sm font-bold text-gray-900">Compliance Checklist</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-5 h-5 rounded flex items-center justify-center",
                    profile?.isVerified ? "bg-green-100" : "bg-amber-100"
                  )}>
                    {profile?.isVerified ? (
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600">
                    {profile?.isVerified ? 'NPO Registration Verified' : 'NPO Verification Pending'}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600">SARS PBO Status Active</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <p className="text-xs text-gray-400 leading-relaxed">
                Remember to bring your insulated transport containers for perishable items (R638 compliance).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
