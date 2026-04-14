import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Bell, 
  ShieldCheck, 
  Lock, 
  Globe, 
  CreditCard, 
  ChevronRight,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Building2,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '@/src/components/auth/AuthContext';
import { db, auth, handleFirestoreError, OperationType } from '@/src/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { signOut, updatePassword, updateProfile } from 'firebase/auth';

export default function Settings() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    displayName: profile?.displayName || '',
    phoneNumber: profile?.phoneNumber || '',
    businessName: profile?.businessName || profile?.ngoName || '',
    address: profile?.address || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: formData.displayName
      });

      // Update Firestore profile
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        businessName: profile?.role === 'retailer' ? formData.businessName : undefined,
        ngoName: profile?.role === 'ngo' ? formData.businessName : undefined,
        address: formData.address,
        updatedAt: new Date().toISOString(),
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updatePassword(user, passwordData.newPassword);
      setSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Password update error:', err);
      setError(err.message || 'Failed to update password. You may need to re-authenticate.');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your account and platform preferences.</p>
        </div>
        <button onClick={handleLogout} className="flex items-center px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-all shadow-sm">
          <LogOut className="w-5 h-5 mr-2" />
          Log Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all group",
                activeTab === tab.id
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-green-600"
              )}
            >
              <tab.icon className={cn(
                "w-5 h-5 mr-3 transition-colors",
                activeTab === tab.id ? "text-green-600" : "text-gray-400 group-hover:text-green-500"
              )} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-sm text-green-600 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Changes saved successfully!
            </div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
                <p className="text-sm text-gray-500 mt-1">Update your personal and business details.</p>
              </div>
              
              <form onSubmit={handleProfileUpdate} className="p-8 space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center relative group cursor-pointer">
                    <User className="w-10 h-10 text-gray-400" />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <ChevronRight className="w-6 h-6 text-white rotate-90" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{profile.displayName}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <span className="mt-2 inline-block px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-wider border border-green-100">
                      {profile.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        className="w-full pl-10 pr-4 py-2 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500" 
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="email" 
                        disabled
                        className="w-full pl-10 pr-4 py-2 border border-gray-100 rounded-xl text-sm outline-none bg-gray-50 text-gray-500 cursor-not-allowed" 
                        value={user?.email || ''} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="tel" 
                        className="w-full pl-10 pr-4 py-2 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500" 
                        placeholder="+27 00 000 0000" 
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Business Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        className="w-full pl-10 pr-4 py-2 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500" 
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      className="w-full pl-10 pr-4 py-2 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500" 
                      placeholder="123 Street, City, 0000" 
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex justify-end">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-sm shadow-green-200 disabled:opacity-50 flex items-center"
                  >
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900">Notification Preferences</h2>
                <p className="text-sm text-gray-500 mt-1">Choose how you want to be notified about donations.</p>
              </div>
              
              <div className="p-8 space-y-6">
                {[
                  { id: 'newDonation', label: 'New Donation Alerts', desc: 'Notify me when new food is listed in my area.' },
                  { id: 'claimStatus', label: 'Claim Status Updates', desc: 'Notify me when my claims are confirmed or cancelled.' },
                  { id: 'compliance', label: 'Compliance Reminders', desc: 'Notify me when my documents are about to expire.' },
                  { id: 'impact', label: 'Impact Reports', desc: 'Monthly summary of your contribution to food security.' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-all">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900">Security Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your password and account security.</p>
              </div>
              
              <div className="p-8 space-y-6">
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900">Change Password</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <input 
                      type="password" 
                      placeholder="New Password" 
                      className="w-full px-4 py-2 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                    <input 
                      type="password" 
                      placeholder="Confirm New Password" 
                      className="w-full px-4 py-2 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500" 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center"
                  >
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Update Password
                  </button>
                </form>

                <div className="pt-6 border-t border-gray-50">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Enable 2FA</p>
                        <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-xs font-bold rounded-lg hover:bg-gray-50 transition-all">
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
