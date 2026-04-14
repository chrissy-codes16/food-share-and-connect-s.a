import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  ShoppingBag, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  Info,
  ArrowLeft,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { db, handleFirestoreError, OperationType } from '@/src/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../auth/AuthContext';

export default function NewDonation() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    category: 'perishable',
    quantity: '',
    unit: 'kg',
    expiryDate: '',
    allergens: [] as string[],
    photo: null as string | null,
    labelPhoto: null as string | null,
  });

  const allergensList = ['Dairy', 'Eggs', 'Peanuts', 'Tree Nuts', 'Wheat', 'Soy', 'Fish', 'Shellfish'];

  const toggleAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'labelPhoto') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setLoading(true);
    try {
      const donationData = {
        retailerId: user.uid,
        retailerName: profile.businessName || profile.displayName,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        expiryDate: formData.expiryDate,
        allergens: formData.allergens,
        photoUrl: formData.photo,
        labelPhotoUrl: formData.labelPhoto,
        status: 'available',
        location: profile.location || { lat: -26.2041, lng: 28.0473 }, // Default to Joburg if not set
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'donations'), donationData);
      navigate('/dashboard');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'donations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm font-semibold text-gray-500 hover:text-green-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </button>
        <div className="flex items-center space-x-2">
          <div className={cn("w-2 h-2 rounded-full", step >= 1 ? "bg-green-600" : "bg-gray-200")}></div>
          <div className={cn("w-2 h-2 rounded-full", step >= 2 ? "bg-green-600" : "bg-gray-200")}></div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/50">
          <h1 className="text-2xl font-bold text-gray-900">List Surplus Food</h1>
          <p className="text-gray-500 mt-1">Ensure all details are accurate for R146 and R638 compliance.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Donation Title</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="e.g., Mixed Fresh Produce"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="perishable">Perishable (Cold Chain Required)</option>
                      <option value="non_perishable">Non-Perishable (Dry Storage)</option>
                      <option value="prepared">Prepared Food (Immediate Consumption)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                        placeholder="0"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Unit</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      >
                        <option value="kg">Kilograms (kg)</option>
                        <option value="units">Units / Items</option>
                        <option value="crates">Crates</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Expiry Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none h-24 resize-none"
                      placeholder="Describe the items, storage conditions, etc."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Allergen Information (Mandatory)</label>
                <div className="flex flex-wrap gap-2">
                  {allergensList.map((allergen) => (
                    <button
                      key={allergen}
                      type="button"
                      onClick={() => toggleAllergen(allergen)}
                      className={cn(
                        "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                        formData.allergens.includes(allergen)
                          ? "bg-red-50 border-red-200 text-red-600"
                          : "bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-200"
                      )}
                    >
                      {allergen}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-sm shadow-green-200"
                >
                  Next: Compliance Photos
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong>R146 Compliance:</strong> You must upload a clear photo of the food label showing ingredients, allergens, and expiry date.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700">Food Item Photo</label>
                  <label className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-green-300 transition-all">
                    {formData.photo ? (
                      <img src={formData.photo} alt="Food" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-gray-300 mb-2 group-hover:text-green-400 transition-colors" />
                        <p className="text-xs text-gray-400">Click to upload</p>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'photo')} />
                  </label>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700">Mandatory Label Photo (R146)</label>
                  <label className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-green-300 transition-all">
                    {formData.labelPhoto ? (
                      <img src={formData.labelPhoto} alt="Label" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-gray-300 mb-2 group-hover:text-green-400 transition-colors" />
                        <p className="text-xs text-gray-400">Clear shot of the label</p>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'labelPhoto')} />
                  </label>
                </div>
              </div>

              <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl space-y-4">
                <div className="flex items-center space-x-2 text-amber-800">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-bold">Final Compliance Check</h3>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" required className="w-4 h-4 text-green-600 rounded border-gray-300" />
                    <span className="text-sm text-amber-900">I confirm this food is safe for consumption (R638).</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" required className="w-4 h-4 text-green-600 rounded border-gray-300" />
                    <span className="text-sm text-amber-900">Cold chain will be maintained until pickup (Perishables).</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-sm shadow-green-200 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Listing...
                    </>
                  ) : (
                    'List Donation'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
