import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/home/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import DashboardLayout from './components/dashboard/DashboardLayout';
import RetailerDashboard from './components/dashboard/RetailerDashboard';
import NGODashboard from './components/dashboard/NGODashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import NewDonation from './components/donations/NewDonation';
import BrowseDonations from './components/donations/BrowseDonations';
import DonationDetails from './components/donations/DonationDetails';
import History from './components/history/History';
import Messaging from './components/messages/Messaging';
import ImpactReports from './components/impact/ImpactReports';
import VerificationCenter from './components/verification/VerificationCenter';
import Settings from './components/settings/Settings';
import { useAuth } from './components/auth/AuthContext';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

export default function App() {
  const { user, profile, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6321]"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar user={profile || (user ? { uid: user.uid, email: user.email, displayName: user.displayName } : null)} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <DashboardLayout user={profile || user}>
                  {profile?.role === 'retailer' && <RetailerDashboard />}
                  {profile?.role === 'ngo' && <NGODashboard />}
                  {profile?.role === 'admin' && <AdminDashboard />}
                  {!profile && <div className="p-8">Setting up your profile...</div>}
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          <Route 
            path="/donations/new" 
            element={
              profile?.role === 'retailer' ? (
                <DashboardLayout user={profile}>
                  <NewDonation />
                </DashboardLayout>
              ) : (
                <Navigate to="/dashboard" />
              )
            } 
          />

          <Route 
            path="/donations/browse" 
            element={
              profile?.role === 'ngo' ? (
                <DashboardLayout user={profile}>
                  <BrowseDonations />
                </DashboardLayout>
              ) : (
                <Navigate to="/dashboard" />
              )
            } 
          />

          <Route 
            path="/donations/:id" 
            element={
              user ? (
                <DashboardLayout user={profile || user}>
                  <DonationDetails />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          <Route 
            path="/history" 
            element={
              user ? (
                <DashboardLayout user={profile || user}>
                  <History />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          <Route 
            path="/messages" 
            element={
              user ? (
                <DashboardLayout user={profile || user}>
                  <Messaging />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          <Route 
            path="/impact" 
            element={
              user ? (
                <DashboardLayout user={profile || user}>
                  <ImpactReports />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          <Route 
            path="/verification" 
            element={
              user ? (
                <DashboardLayout user={profile || user}>
                  <VerificationCenter user={profile || user} />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          <Route 
            path="/settings" 
            element={
              user ? (
                <DashboardLayout user={profile || user}>
                  <Settings user={profile || user} onLogout={handleLogout} />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}
