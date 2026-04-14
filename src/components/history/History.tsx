import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  Download, 
  ShoppingBag, 
  CheckCircle2, 
  XCircle,
  Clock,
  ArrowUpRight,
  MoreVertical,
  Loader2
} from 'lucide-react';
import { cn, formatCurrency } from '@/src/lib/utils';
import { useAuth } from '@/src/components/auth/AuthContext';
import { db, handleFirestoreError, OperationType } from '@/src/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { FoodListing } from '@/src/types';

export default function History() {
  const { profile } = useAuth();
  const [historyItems, setHistoryItems] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!profile) return;

    let q;
    if (profile.role === 'retailer') {
      q = query(
        collection(db, 'donations'),
        where('retailerId', '==', profile.uid),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'donations'),
        where('ngoId', '==', profile.uid),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as FoodListing));
      setHistoryItems(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'donations');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile]);

  const filteredItems = historyItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (profile?.role === 'retailer' ? item.ngoName?.toLowerCase().includes(searchQuery.toLowerCase()) : item.retailerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = {
    totalKg: historyItems.reduce((acc, item) => acc + (item.status === 'collected' ? item.quantity : 0), 0),
    totalMeals: historyItems.reduce((acc, item) => acc + (item.status === 'collected' ? item.quantity * 2.5 : 0), 0),
    totalCo2: historyItems.reduce((acc, item) => acc + (item.status === 'collected' ? item.quantity * 2.5 : 0), 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donation History</h1>
          <p className="text-gray-500">View and manage your past donations and collections.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-sm">
          <Download className="w-5 h-5 mr-2 text-green-600" />
          Export History
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none shadow-sm"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-100 text-sm font-bold text-gray-600 rounded-xl hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-100 text-sm font-bold text-gray-600 rounded-xl hover:bg-gray-50">
            <Clock className="w-4 h-4 mr-2" />
            Date Range
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Item</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {profile?.role === 'retailer' ? 'NGO' : 'Retailer'}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No history found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-bold text-gray-900">{item.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{item.quantity}{item.unit}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-700">
                        {profile?.role === 'retailer' ? (item.ngoName || 'Pending') : item.retailerName}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        item.status === 'collected' ? "bg-green-50 text-green-600" :
                        item.status === 'cancelled' ? "bg-red-50 text-red-600" : 
                        item.status === 'claimed' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                          <ArrowUpRight className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-600 p-8 rounded-3xl text-white relative overflow-hidden shadow-lg shadow-green-200">
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-4">Impact Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-80">Total Weight Saved</span>
                <span className="font-bold">{stats.totalKg.toLocaleString()} kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-80">Estimated Meals</span>
                <span className="font-bold">{Math.round(stats.totalMeals).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-80">CO2 Emissions Avoided</span>
                <span className="font-bold">{Math.round(stats.totalCo2).toLocaleString()} kg</span>
              </div>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">SARS 18A Compliance</h3>
              <p className="text-sm text-gray-500">All collected donations are eligible for tax receipts.</p>
            </div>
          </div>
          <button className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
            Generate Quarterly Tax Summary
          </button>
        </div>
      </div>
    </div>
  );
}
