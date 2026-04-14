import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '@/src/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send reset email. Please check the email address.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
          <p className="text-gray-500">
            We've sent password reset instructions to <span className="font-medium text-gray-900">{email}</span>.
          </p>
        </div>
        <Link
          to="/login"
          className="inline-flex items-center text-sm font-bold text-green-600 hover:text-green-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Reset Password</h2>
        <p className="text-gray-500">Enter your email and we'll send you instructions to reset your password.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              required
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-sm"
              placeholder="name@organization.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Send Reset Link'
          )}
        </button>

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
