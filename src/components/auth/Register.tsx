import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Building2, ShieldCheck, FileText, CheckCircle2, Heart, AlertCircle } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { cn } from '@/src/lib/utils';
import { auth, db, handleFirestoreError, OperationType } from '@/src/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Register() {
  const [step, setStep] = React.useState(1);
  const [role, setRole] = React.useState<'retailer' | 'ngo' | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    displayName: '',
    businessName: '',
    npoNumber: '',
    sarsNumber: '',
    address: '',
    termsAccepted: false,
    liabilityAccepted: false,
    noResaleAccepted: false,
    popiaConsent: false,
  });

  const navigate = useNavigate();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    
    setLoading(true);
    setError(null);

    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Update Auth Profile
      await updateProfile(user, {
        displayName: formData.displayName
      });

      // 3. Create Firestore Profile
      const profileData = {
        uid: user.uid,
        email: formData.email,
        displayName: formData.displayName,
        role: role,
        isVerified: false,
        verificationStatus: 'pending',
        businessName: role === 'retailer' ? formData.businessName : null,
        npoNumber: role === 'ngo' ? formData.npoNumber : null,
        sarsNumber: formData.sarsNumber,
        address: formData.address,
        createdAt: new Date().toISOString(),
        legalAgreements: {
          liabilityAccepted: formData.liabilityAccepted,
          noResaleAccepted: formData.noResaleAccepted,
          popiaConsent: formData.popiaConsent,
          termsAccepted: formData.termsAccepted,
          acceptedAt: new Date().toISOString()
        }
      };

      try {
        await setDoc(doc(db, 'users', user.uid), profileData);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create your account" 
      subtitle="Join South Africa's leading food donation platform."
    >
      <div className="space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                step >= s ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400"
              )}>
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={cn("w-12 h-0.5 mx-2", step > s ? "bg-green-600" : "bg-gray-100")} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Choose your role</h2>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => { setRole('retailer'); handleNext(); }}
                className={cn(
                  "flex items-center p-4 border-2 rounded-xl transition-all text-left group",
                  role === 'retailer' ? "border-green-600 bg-green-50" : "border-gray-100 hover:border-green-200"
                )}
              >
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="font-bold text-gray-900">Retailer / Food Donor</p>
                  <p className="text-sm text-gray-500">I want to donate surplus food and track my impact.</p>
                </div>
              </button>

              <button
                onClick={() => { setRole('ngo'); handleNext(); }}
                className={cn(
                  "flex items-center p-4 border-2 rounded-xl transition-all text-left group",
                  role === 'ngo' ? "border-green-600 bg-green-50" : "border-gray-100 hover:border-green-200"
                )}
              >
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="font-bold text-gray-900">NGO / Recipient</p>
                  <p className="text-sm text-gray-500">I want to receive food for my community.</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Account Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="John Doe"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              {role === 'retailer' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    placeholder="Supermarket Name"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NPO Number</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    placeholder="000-000 NPO"
                    value={formData.npoNumber}
                    onChange={(e) => setFormData({ ...formData, npoNumber: e.target.value })}
                  />
                </div>
              )}
            </div>
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow-sm"
              >
                Next
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Legal Onboarding</h2>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5" />
              <p className="text-sm text-amber-800 leading-relaxed">
                To comply with South African law (CPA Section 61, POPIA, R638), you must accept the following agreements.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { id: 'liabilityAccepted', label: 'Liability Handover Agreement (CPA Section 61)', desc: 'I understand that liability for food safety transfers to the recipient upon handover.' },
                { id: 'noResaleAccepted', label: 'No Resale Agreement', desc: 'I agree that donated food will not be resold and will be distributed for free.' },
                { id: 'popiaConsent', label: 'POPIA Consent', desc: 'I consent to the processing of my personal and business data for platform operations.' },
                { id: 'termsAccepted', label: 'General Terms & Conditions', desc: 'I agree to the platform terms of service and food hygiene standards (R638).' },
              ].map((item) => (
                <label key={item.id} className="flex items-start space-x-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    checked={(formData as any)[item.id]}
                    onChange={(e) => setFormData({ ...formData, [item.id]: e.target.checked })}
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.termsAccepted || !formData.liabilityAccepted || !formData.noResaleAccepted || !formData.popiaConsent}
                className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-green-600 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
