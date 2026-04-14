import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowRight,
  Info,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function VerificationCenter({ user }: { user: any }) {
  const [files, setFiles] = React.useState<{ [key: string]: File | null }>({
    coa: null,
    npo: null,
    sars: null,
    businessReg: null,
  });

  const documents = user.role === 'RETAILER' ? [
    { id: 'coa', label: 'Certificate of Acceptability (R638)', desc: 'Mandatory for all food handlers in South Africa.' },
    { id: 'businessReg', label: 'Business Registration (CIPC)', desc: 'Proof of legal business entity.' },
  ] : [
    { id: 'npo', label: 'NPO Registration Certificate', desc: 'Proof of non-profit organization status.' },
    { id: 'sars', label: 'SARS Section 18A PBO Status', desc: 'Required to issue tax-deductible receipts.' },
  ];

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [id]: e.target.files![0] }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verification Center</h1>
          <p className="text-gray-500">Manage your legal and compliance documents.</p>
        </div>
        <div className={cn(
          "px-4 py-2 rounded-full text-xs font-bold flex items-center border shadow-sm",
          user.isVerified ? "bg-green-50 border-green-100 text-green-600" : "bg-amber-50 border-amber-100 text-amber-600"
        )}>
          {user.isVerified ? (
            <><CheckCircle2 className="w-4 h-4 mr-2" /> VERIFIED ACCOUNT</>
          ) : (
            <><Clock className="w-4 h-4 mr-2" /> PENDING VERIFICATION</>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Uploads */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Required Documents</h2>
              <p className="text-sm text-gray-500 mt-1">Upload clear, scanned copies of your legal documents.</p>
            </div>
            
            <div className="p-8 space-y-6">
              {documents.map((doc) => (
                <div key={doc.id} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{doc.label}</p>
                      <p className="text-xs text-gray-500">{doc.desc}</p>
                    </div>
                    {files[doc.id] && (
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase tracking-wider">
                        File Selected
                      </span>
                    )}
                  </div>
                  
                  <div className="relative">
                    <input
                      type="file"
                      id={doc.id}
                      className="hidden"
                      onChange={(e) => handleFileChange(doc.id, e)}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor={doc.id}
                      className={cn(
                        "flex items-center justify-between p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all",
                        files[doc.id] ? "border-green-200 bg-green-50/30" : "border-gray-100 hover:border-green-200 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          files[doc.id] ? "bg-green-100" : "bg-gray-100"
                        )}>
                          <FileText className={cn("w-5 h-5", files[doc.id] ? "text-green-600" : "text-gray-400")} />
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {files[doc.id] ? files[doc.id]?.name : 'Click to upload document'}
                        </span>
                      </div>
                      <Upload className="w-5 h-5 text-gray-400" />
                    </label>
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <button className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-200">
                  Submit for Verification
                </button>
              </div>
            </div>
          </div>

          {/* Verification Timeline */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Verification Timeline</h2>
            <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              <div className="relative flex items-start space-x-6">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-green-200">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Account Created</p>
                  <p className="text-xs text-gray-500 mt-1">Mar 28, 2026 • 10:45 AM</p>
                </div>
              </div>

              <div className="relative flex items-start space-x-6">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-green-200">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Initial Documents Uploaded</p>
                  <p className="text-xs text-gray-500 mt-1">Mar 28, 2026 • 11:30 AM</p>
                </div>
              </div>

              <div className="relative flex items-start space-x-6">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center relative z-10 border-4 border-white">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Admin Review Pending</p>
                  <p className="text-xs text-gray-500 mt-1">Estimated completion: 24-48 hours.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Info */}
        <div className="space-y-6">
          <div className="bg-gray-900 p-8 rounded-3xl text-white space-y-6 relative overflow-hidden shadow-xl shadow-gray-200">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">Why Verification?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0"></div>
                  <p className="text-sm text-white/70 leading-relaxed">Ensures all food handlers meet R638 hygiene standards.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0"></div>
                  <p className="text-sm text-white/70 leading-relaxed">Protects donors and recipients under CPA Section 61.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0"></div>
                  <p className="text-sm text-white/70 leading-relaxed">Enables legal SARS Section 18A tax receipting.</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-green-600/20 rounded-full blur-3xl"></div>
          </div>

          <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl space-y-4">
            <div className="flex items-center space-x-2 text-blue-800">
              <Info className="w-5 h-5" />
              <h3 className="font-bold text-sm">Need Help?</h3>
            </div>
            <p className="text-xs text-blue-800/80 leading-relaxed">
              If you are unsure about which documents to upload, please contact our compliance team at <strong>compliance@foodsharesa.org.za</strong>.
            </p>
            <button className="w-full py-2 bg-white text-blue-600 text-xs font-bold rounded-lg border border-blue-100 hover:bg-blue-50 transition-all">
              View Documentation Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
