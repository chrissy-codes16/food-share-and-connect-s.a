import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Download, 
  FileText, 
  TrendingUp, 
  Heart, 
  Leaf, 
  ShieldCheck,
  Calendar,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { cn, formatCurrency } from '@/src/lib/utils';

export default function ImpactReports() {
  const metrics = [
    { label: 'Total Food Saved', value: '1,240 kg', icon: Leaf, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Meals Provided', value: '3,100', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'CO2 Avoided', value: '3,100 kg', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Tax Savings', value: formatCurrency(15400), icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const reports = [
    { id: '1', title: 'March 2026 Impact Report', type: 'ESG REPORT', date: 'Apr 01, 2026' },
    { id: '2', title: 'SARS Section 18A Receipt - Q1', type: 'TAX RECEIPT', date: 'Mar 31, 2026' },
    { id: '3', title: 'February 2026 Impact Report', type: 'ESG REPORT', date: 'Mar 01, 2026' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Impact & Reporting</h1>
          <p className="text-gray-500">Track your contribution to food security and sustainability.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-sm shadow-green-200">
          <Download className="w-5 h-5 mr-2" />
          Download All Data
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", metric.bg)}>
              <metric.icon className={cn("w-6 h-6", metric.color)} />
            </div>
            <p className="text-sm font-medium text-gray-500">{metric.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available Reports */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Available Reports</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {reports.map((report) => (
                <div key={report.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-green-50 transition-colors">
                      <FileText className="w-6 h-6 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{report.title}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                          report.type === 'TAX RECEIPT' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                        )}>
                          {report.type}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {report.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SARS Section 18A Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Tax Compliance</h2>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Section 18A:</strong> All tax receipts generated are compliant with SARS requirements. Ensure your NGO recipients have valid PBO status to issue these receipts.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Quarterly Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Q1 2026</span>
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(15400)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-green-600 rounded-full h-1.5 w-3/4"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Q4 2025</span>
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(12800)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-green-600 rounded-full h-1.5 w-2/3"></div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <div className="flex items-center space-x-2 text-blue-600 mb-2">
                <TrendingUp className="w-4 h-4" />
                <p className="text-xs font-bold">ESG Performance</p>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Your food waste reduction has contributed to a 15% improvement in your store's sustainability rating this quarter.
              </p>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-sm mb-2">Need a custom report?</h3>
              <p className="text-xs text-white/60 mb-4 leading-relaxed">Generate custom data exports for your annual sustainability audit.</p>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center">
                Request Custom Export <ArrowUpRight className="ml-2 w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
