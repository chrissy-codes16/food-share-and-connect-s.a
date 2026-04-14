import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Truck, BarChart3 } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center space-x-2 mb-12">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
              <Heart className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">FoodShare <span className="text-green-600">SA</span></span>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-500 mb-8">{subtitle}</p>
            {children}
          </motion.div>
        </div>
      </div>

      {/* Right side - Visuals */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-green-600 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-12"
          >
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Strict Compliance</h3>
                <p className="text-green-50/80 leading-relaxed">Fully compliant with R638, R146, and CPA Section 61. We ensure every donation meets South African food safety standards.</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Smart Logistics</h3>
                <p className="text-green-50/80 leading-relaxed">Real-time GPS matching connects retailers with nearby NGOs within minutes, ensuring fresh food reaches those in need.</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Impact Tracking</h3>
                <p className="text-green-50/80 leading-relaxed">Automated SARS Section 18A tax receipts and detailed ESG reports for retailers. Track your contribution to food security.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
