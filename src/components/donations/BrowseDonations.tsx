import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Filter, 
  Clock, 
  ShoppingBag, 
  Navigation,
  ArrowRight,
  ChevronRight,
  Info,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { db, handleFirestoreError, OperationType } from '@/src/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FoodListing } from '@/src/types';

export default function BrowseDonations() {
  const [view, setView] = useState<'LIST' | 'MAP'>('LIST');
  const [filter, setFilter] = useState('all');
  const [donations, setDonations] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Food' },
    { id: 'perishable', label: 'Perishable' },
    { id: 'non_perishable', label: 'Non-Perishable' },
    { id: 'prepared', label: 'Prepared' },
  ];

  useEffect(() => {
    let q = query(
      collection(db, 'donations'),
      where('status', '==', 'available'),
      orderBy('createdAt', 'desc')
    );

    if (filter !== 'all') {
      q = query(
        collection(db, 'donations'),
        where('status', '==', 'available'),
        where('category', '==', filter),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as FoodListing));
      setDonations(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'donations');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filter]);

  const filteredDonations = donations.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.retailerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 max-w-xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none shadow-sm"
            placeholder="Search by food type or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
          <button
            onClick={() => setView('LIST')}
            className={cn(
              "px-4 py-2 text-sm font-bold rounded-lg transition-all",
              view === 'LIST' ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            List View
          </button>
          <button
            onClick={() => setView('MAP')}
            className={cn(
              "px-4 py-2 text-sm font-bold rounded-lg transition-all",
              view === 'MAP' ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            Map View
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
              filter === cat.id
                ? "bg-green-600 border-green-600 text-white shadow-sm"
                : "bg-white border-gray-100 text-gray-500 hover:border-green-200"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        </div>
      ) : view === 'LIST' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonations.length === 0 ? (
            <div className="col-span-full p-12 text-center text-gray-500 bg-white rounded-3xl border border-gray-100">
              No donations found matching your criteria.
            </div>
          ) : (
            filteredDonations.map((donation) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:border-green-200 transition-all group overflow-hidden"
              >
                <div className="aspect-video bg-gray-100 relative">
                  {donation.photoUrl ? (
                    <img src={donation.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <ShoppingBag className="w-10 h-10 text-gray-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md",
                      donation.category === 'perishable' ? "bg-blue-500/80" :
                      donation.category === 'prepared' ? "bg-red-500/80" : "bg-green-500/80"
                    )}>
                      {donation.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="text-white">
                      <p className="text-xs font-medium opacity-80">Retailer</p>
                      <p className="text-sm font-bold">{donation.retailerName}</p>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                      <ShoppingBag className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">{donation.title}</h3>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {donation.quantity}{donation.unit} • <Clock className="w-3 h-3 mx-1" /> 
                      Expires {donation.expiryDate ? new Date(donation.expiryDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="text-sm font-bold text-gray-900">
                      {donation.quantity}{donation.unit}
                    </div>
                    <Link to={`/donations/${donation.id}`} className="flex items-center text-sm font-bold text-green-600 hover:translate-x-1 transition-transform">
                      View Details <ChevronRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm h-[600px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Navigation className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Map</h3>
            <p className="text-gray-500 max-w-md">
              Google Maps integration would show nearby donations in a 15km radius. 
              NGOs can see real-time availability and get turn-by-turn directions.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="p-4 bg-white rounded-2xl border border-gray-100 text-left">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Nearby</p>
                <p className="text-lg font-bold text-gray-900">{filteredDonations.length} Listings</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-gray-100 text-left">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Radius</p>
                <p className="text-lg font-bold text-gray-900">15 km</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Info */}
      <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex items-start space-x-4">
        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
          <Info className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-amber-900">Important: Collection Safety</h3>
          <p className="text-sm text-amber-800/80 leading-relaxed mt-1">
            When collecting perishable food, ensure your vehicle is equipped with insulated containers or a cold chain system (R638). 
            You will be required to sign a digital liability handover (CPA Section 61) upon collection.
          </p>
        </div>
      </div>
    </div>
  );
}
