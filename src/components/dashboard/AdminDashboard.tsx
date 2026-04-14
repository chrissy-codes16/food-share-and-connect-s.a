import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  FileText,
  Search,
  Filter,
  ArrowUpRight,
  MoreVertical,
  Map as MapIcon
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function AdminDashboard() {
  const stats = [
    { label: 'Pending Verifications', value: '14', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Active Retailers', value: '124', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active NGOs', value: '86', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Open Disputes', value: '2', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const verificationQueue = [
    { id: '1', name: 'Fresh Foods Ltd', type: 'RETAILER', docs: ['COA', 'Business Reg'], date: '2 hours ago' },
    { id: '2', name: 'Soweto Community Kitchen', type: 'NGO', docs: ['NPO', 'SARS 18A'], date: '5 hours ago' },
    { id: '3', name: 'Sandton Supermarket', type: 'RETAILER', docs: ['COA'], date: 'Yesterday' },
  ];

  const auditLogs = [
    { id: '1', action: 'COA Approved', user: 'Admin Sarah', target: 'Pick n Pay Melrose', date: '10 mins ago' },
    { id: '2', action: 'Dispute Resolved', user: 'Admin Mike', target: 'Claim #4521', date: '45 mins ago' },
    { id: '3', action: 'New NGO Verified', user: 'Admin Sarah', target: 'Hope Haven', date: '2 hours ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Control Center</h1>
          <p className="text-gray-500">Monitoring platform compliance and operations.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-sm">
            <MapIcon className="w-5 h-5 mr-2 text-green-600" />
            Live Logistics Map
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-sm shadow-green-200">
            <FileText className="w-5 h-5 mr-2" />
            Export Audit Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Verification Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Verification Queue</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" className="pl-9 pr-4 py-1.5 bg-white border border-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="Search..." />
              </div>
              <button className="p-1.5 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-green-600">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Entity</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Documents</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {verificationQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{item.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold uppercase",
                        item.type === 'RETAILER' ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                      )}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        {item.docs.map(doc => (
                          <span key={doc} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-medium rounded">{doc}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Audit Logs</h2>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{log.action}</p>
                    <p className="text-xs text-gray-500 mt-0.5">By {log.user} • {log.target}</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{log.date}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-300" />
                </div>
              ))}
            </div>
            <button className="w-full py-3 bg-gray-50 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition-all">
              View Full Audit Trail
            </button>
          </div>

          {/* System Health */}
          <div className="bg-gray-900 p-6 rounded-2xl text-white space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider opacity-60">System Health</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-80">API Status</span>
                <span className="flex items-center text-xs font-bold text-green-400">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-80">Database Sync</span>
                <span className="text-xs font-bold text-green-400">Synced</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-80">Email Queue</span>
                <span className="text-xs font-bold text-white">0 Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
