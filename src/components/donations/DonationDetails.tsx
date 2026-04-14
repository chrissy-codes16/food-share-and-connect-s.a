import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  ShoppingBag, 
  Navigation,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Camera,
  FileText,
  QrCode,
  Loader2
} from 'lucide-react';
import { cn, formatCurrency } from '@/src/lib/utils';
import { QRCodeSVG } from 'qrcode.react';
import { db, handleFirestoreError, OperationType } from '@/src/firebase';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../auth/AuthContext';
import { FoodListing } from '@/src/types';

export default function DonationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [donation, setDonation] = useState<FoodListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = onSnapshot(doc(db, 'donations', id), (docSnap) => {
      if (docSnap.exists()) {
        setDonation({ id: docSnap.id, ...docSnap.data() } as unknown as FoodListing);
      } else {
        setDonation(null);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `donations/${id}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleClaim = async () => {
    if (!id || !user || !profile || !donation) return;
    if (donation.status !== 'available') return;

    setClaiming(true);
    try {
      await updateDoc(doc(db, 'donations', id), {
        status: 'claimed',
        ngoId: user.uid,
        ngoName: profile.businessName || profile.displayName,
        claimedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `donations/${id}`);
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Donation not found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-green-600 font-bold">Go back</button>
      </div>
    );
  }

  const isClaimedByMe = donation.ngoId === user?.uid;
  const isAvailable = donation.status === 'available';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm font-semibold text-gray-500 hover:text-green-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Browse
        </button>
        {isClaimedByMe && (
          <span className="px-4 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full border border-amber-100">
            CLAIMED BY YOU
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              {donation.photoUrl ? (
                <img src={donation.photoUrl} alt={donation.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <ShoppingBag className="w-12 h-12 text-gray-200" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg">
                  {donation.category}
                </span>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{donation.title}</h1>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <MapPin className="w-4 h-4 mr-1 text-green-600" />
                  {donation.retailerName}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Quantity</p>
                  <p className="text-lg font-bold text-gray-900">{donation.quantity}{donation.unit}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Expires</p>
                  <p className="text-lg font-bold text-red-600">
                    {donation.expiryDate ? new Date(donation.expiryDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-gray-900">Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{donation.description || 'No description provided.'}</p>
              </div>

              {donation.allergens && donation.allergens.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-900">Allergen Information</h3>
                  <div className="flex flex-wrap gap-2">
                    {donation.allergens.map(a => (
                      <span key={a} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* R146 Compliance Photo */}
          {donation.labelPhotoUrl && (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">R146 Compliance Label</h3>
              </div>
              <div className="aspect-video bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                <img src={donation.labelPhotoUrl} alt="Food Label" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Mandatory label photo provided by retailer. Please verify ingredients and expiry date upon collection.
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-24">
            {!isClaimedByMe ? (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Collection Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">Location details provided after claim.</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                      <p className="text-sm text-gray-600">Pickup before expiry</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl space-y-3">
                  <div className="flex items-center space-x-2 text-amber-800">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-xs font-bold uppercase tracking-wider">Legal Notice</p>
                  </div>
                  <p className="text-xs text-amber-800/80 leading-relaxed">
                    By claiming this donation, you agree to the CPA Section 61 liability handover and confirm you have insulated transport for perishables.
                  </p>
                </div>

                <button
                  onClick={handleClaim}
                  disabled={!isAvailable || claiming}
                  className={cn(
                    "w-full py-4 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center",
                    isAvailable 
                      ? "bg-green-600 hover:bg-green-700 shadow-green-200" 
                      : "bg-gray-300 cursor-not-allowed shadow-none"
                  )}
                >
                  {claiming ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Claiming...
                    </>
                  ) : isAvailable ? 'Claim Donation' : 'Already Claimed'}
                </button>
              </>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Donation Claimed!</h3>
                  <p className="text-sm text-gray-500 mt-1">Show this QR code to the retailer upon collection.</p>
                </div>

                <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl inline-block mx-auto">
                  <QRCodeSVG value={`DONATION-${donation.id}`} size={160} />
                </div>

                <div className="space-y-3">
                  <button className="w-full py-3 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-all flex items-center justify-center">
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </button>
                  <button className="w-full py-3 bg-gray-50 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Transport Checklist
                  </button>
                </div>

                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  ID: {donation.id?.slice(0, 8).toUpperCase()}
                </p>
              </div>
            )}
          </div>

          {/* Impact Stats */}
          <div className="bg-blue-600 p-8 rounded-3xl text-white relative overflow-hidden shadow-lg shadow-blue-200">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-4">Impact of this Pickup</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-80">Estimated Meals</span>
                  <span className="font-bold">{Math.floor((donation.quantity || 0) * 2.5)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-80">CO2 Avoided</span>
                  <span className="font-bold">{donation.quantity || 0} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-80">Tax Deduction Value</span>
                  <span className="font-bold">{formatCurrency((donation.quantity || 0) * 12.5)}</span>
                </div>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
