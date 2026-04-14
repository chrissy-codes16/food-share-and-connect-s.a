import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  ShieldCheck, 
  Truck, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2,
  Users,
  Building2,
  Globe,
  Leaf
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

export default function Home() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-16 lg:pt-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-600 text-xs font-bold uppercase tracking-wider mb-6">
                <ShieldCheck className="w-4 h-4" />
                <span>South Africa's Leading Food Donation Platform</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                Connecting Surplus <span className="text-green-600">Food</span> to Communities in Need.
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-lg">
                A digital bridge between retailers and NGOs. Reduce waste, improve food security, and stay compliant with South African food safety laws.
              </p>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all shadow-xl shadow-green-200 flex items-center justify-center group">
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/how-it-works" className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center">
                  How it Works
                </Link>
              </div>
              <div className="mt-12 flex items-center space-x-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                      <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  <span className="font-bold text-gray-900">500+</span> NGOs and Retailers joined this month.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-white p-4 rounded-3xl shadow-2xl border border-gray-100">
                <img 
                  src="https://picsum.photos/seed/foodshare/1200/800" 
                  alt="Food Donation" 
                  className="rounded-2xl w-full h-auto"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-[200px]">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase">Impact</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">1.2M kg</p>
                  <p className="text-[10px] text-gray-500">Food saved across SA this year.</p>
                </div>
                <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-[200px]">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase">Safety</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 leading-tight">100% R638 Compliant</p>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-green-100/50 rounded-full blur-3xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">Built for South African Compliance</h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            We've integrated local legal requirements directly into the platform workflow, ensuring safety and accountability at every step.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: ShieldCheck, 
              title: 'Legal Compliance', 
              desc: 'Built-in verification for COA, NPO, and SARS 18A status. Fully compliant with CPA Section 61 and R638.',
              color: 'text-green-600',
              bg: 'bg-green-50'
            },
            { 
              icon: Truck, 
              title: 'Smart Logistics', 
              desc: 'Real-time GPS matching and cold chain transport checklists for perishable food items.',
              color: 'text-blue-600',
              bg: 'bg-blue-50'
            },
            { 
              icon: BarChart3, 
              title: 'Impact Reporting', 
              desc: 'Automatic generation of ESG metrics and SARS-compliant tax receipts for every donation.',
              color: 'text-amber-600',
              bg: 'bg-amber-50'
            }
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all group"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", feature.bg)}>
                <feature.icon className={cn("w-8 h-8", feature.color)} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Food Saved', value: '1.2M kg', icon: Leaf },
              { label: 'Meals Provided', value: '3.1M', icon: Heart },
              { label: 'Active NGOs', value: '850+', icon: Users },
              { label: 'Retail Partners', value: '120+', icon: Building2 }
            ].map((stat) => (
              <div key={stat.label} className="space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <stat.icon className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-sm font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-600 rounded-full blur-[120px]"></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-green-600 rounded-[40px] p-12 lg:p-24 text-center relative overflow-hidden shadow-2xl shadow-green-200">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight">Ready to make an impact in your community?</h2>
            <p className="text-xl text-green-50/80 mb-12 leading-relaxed">
              Join the platform that's transforming food waste into food security across South Africa.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-white text-green-600 font-bold rounded-2xl hover:bg-green-50 transition-all shadow-xl flex items-center justify-center">
                Sign Up as a Retailer
              </Link>
              <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-green-700 text-white font-bold rounded-2xl hover:bg-green-800 transition-all shadow-xl flex items-center justify-center">
                Register your NGO
              </Link>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <Globe className="absolute -right-24 -bottom-24 w-96 h-96 text-white" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 border-t border-gray-100">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">FoodShare <span className="text-green-600">SA</span></span>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              Empowering South African communities through smart food redistribution and strict compliance standards.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-xs">Platform</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link to="/how-it-works" className="hover:text-green-600 transition-colors">How it Works</Link></li>
              <li><Link to="/compliance" className="hover:text-green-600 transition-colors">Compliance Standards</Link></li>
              <li><Link to="/impact" className="hover:text-green-600 transition-colors">Impact Reports</Link></li>
              <li><Link to="/faq" className="hover:text-green-600 transition-colors">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-xs">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link to="/privacy" className="hover:text-green-600 transition-colors">Privacy Policy (POPIA)</Link></li>
              <li><Link to="/terms" className="hover:text-green-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/liability" className="hover:text-green-600 transition-colors">Liability Agreement</Link></li>
            </ul>
          </div>
        </div>
        <div className="pb-12 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 font-medium uppercase tracking-widest">
          <p>© 2026 FoodShare SA. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-green-600 transition-colors">Twitter</a>
            <a href="#" className="hover:text-green-600 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-green-600 transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
