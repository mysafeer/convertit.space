/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  FileText, 
  Users, 
  Zap, 
  History, 
  Settings, 
  ChevronRight, 
  ArrowRight,
  Upload,
  Download,
  MessageSquare,
  TrendingUp,
  CreditCard,
  Sparkles,
  Search,
  Menu,
  Bell,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
interface Conversion {
  id: string;
  name: string;
  type: string;
  status: 'completed' | 'processing' | 'failed';
  date: string;
}

interface Lead {
  id: string;
  name: string;
  source: string;
  score: number;
  status: 'new' | 'contacted' | 'converted';
}

// --- Components ---

const GlassCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl ${className}`}
  >
    {children}
  </motion.div>
);

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
  </div>
);

export default function App() {
  const [credits, setCredits] = useState(1250);
  const [activeTab, setActiveTab] = useState('dashboard');

  const DeploymentView = () => (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-3xl font-bold tracking-tight mb-1">Deployment & Operations</h2>
        <p className="text-zinc-400 text-sm">Comprehensive guide for domain, SSL, CI/CD, and monitoring.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GitHub & CI/CD */}
        <GlassCard className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/10 rounded-lg">
              <Zap className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold">CI/CD Pipeline</h3>
          </div>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            Automate your deployment to InfinityFree using GitHub Actions.
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-black/40 rounded-xl border border-white/5">
              <p className="text-[10px] text-zinc-500 uppercase font-bold mb-2">Required Secrets</p>
              <ul className="text-xs space-y-1 text-zinc-300">
                <li>• <code className="text-emerald-400">FTP_SERVER</code>: your ftp server</li>
                <li>• <code className="text-emerald-400">FTP_USERNAME</code>: your ftp user</li>
                <li>• <code className="text-emerald-400">FTP_PASSWORD</code>: your ftp password</li>
              </ul>
            </div>
            <p className="text-xs text-zinc-400">
              The pipeline in <code className="text-emerald-400">.github/workflows/deploy.yml</code> will trigger on every push to main.
            </p>
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-[10px] text-zinc-500 uppercase font-bold mb-3">Initial Setup</p>
              <div className="bg-black/40 rounded-xl p-4 font-mono text-[10px] text-emerald-400 border border-white/5">
                git init<br/>
                git remote add origin https://github.com/mysafeer/convertit.space.git<br/>
                git add .<br/>
                git commit -m "Initial deploy"<br/>
                git push -u origin main
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Domain & SSL */}
        <GlassCard className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
              <LayoutGrid size={24} />
            </div>
            <h3 className="text-xl font-bold">Domain & SSL</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs font-bold text-white mb-2">1. Domain Verification</p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Add <code className="text-emerald-400">convertit.space</code> or use your subdomain <code className="text-emerald-400">convertit.infinityfree.me</code> in InfinityFree Control Panel. Update nameservers to:
                <br/><span className="text-emerald-400">ns1.epizy.com</span> & <span className="text-emerald-400">ns2.epizy.com</span>
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs font-bold text-white mb-2">2. SSL Setup (HTTPS)</p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Go to "Free SSL Certificates" in InfinityFree. Choose "Let's Encrypt" for <code className="text-emerald-400">convertit.space</code>. Complete CNAME verification and click "Install Automatically".
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Monitoring */}
        <GlassCard className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold">Monitoring Tools</h3>
          </div>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            Keep your command center operational with real-time monitoring.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs font-bold text-white mb-1">UptimeRobot</p>
              <p className="text-[10px] text-zinc-500">Monitors uptime & response time. Alert on 5xx errors.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs font-bold text-white mb-1">Sentry</p>
              <p className="text-[10px] text-zinc-500">Tracks frontend/backend errors and performance.</p>
            </div>
          </div>
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-1">Health Check</p>
            <p className="text-xs text-zinc-300">Point your monitors to: <code className="text-emerald-400">/api/health</code></p>
          </div>
        </GlassCard>

        {/* Gemini API */}
        <GlassCard className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold">Gemini AI Engine</h3>
          </div>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            Your application is powered by Gemini 3 Flash for real-time, high-speed conversions.
          </p>
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p className="text-xs text-amber-200/70">
              The API key is securely managed via environment variables. Ensure <code className="text-emerald-400">GEMINI_API_KEY</code> is set in your hosting environment.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
  const [isConverting, setIsConverting] = useState(false);
  const [conversionText, setConversionText] = useState('');
  const [result, setResult] = useState('');

  const handleConvert = async () => {
    if (!conversionText) return;
    setIsConverting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Transform the following content into a professional blog post summary with key takeaways: ${conversionText}`,
      });
      setResult(response.text || "Conversion failed.");
      setCredits(prev => prev - 10);
    } catch (error) {
      console.error(error);
      setResult("Error during conversion.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/5 bg-black/20 backdrop-blur-md flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Zap className="text-black fill-black" size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">ConvertIt<span className="text-emerald-500">.</span></h1>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarItem icon={LayoutGrid} label="Command Center" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon={FileText} label="Document AI" active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} />
            <SidebarItem icon={Users} label="Lead Agents" active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} />
            <SidebarItem icon={Zap} label="Deployment" active={activeTab === 'deploy'} onClick={() => setActiveTab('deploy')} />
            <SidebarItem icon={History} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
            <SidebarItem icon={TrendingUp} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Credits</span>
                <span className="text-xs text-emerald-400 font-bold">{credits}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-3/4" />
              </div>
              <button className="w-full mt-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors">
                Upgrade Plan
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'deploy' ? (
            <DeploymentView />
          ) : (
            <>
              {/* Header */}
              <header className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-1">Command Center</h2>
                  <p className="text-zinc-400 text-sm">Welcome back, Commander. Your agents are standing by.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search tools..." 
                      className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 w-64 transition-all"
                    />
                  </div>
                  <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#050505]" />
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 p-[1px]">
                    <div className="w-full h-full rounded-[11px] bg-[#050505] flex items-center justify-center overflow-hidden">
                      <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                </div>
              </header>

              {/* Bento Grid */}
              <div className="grid grid-cols-12 gap-6 auto-rows-[180px]">
                
                {/* Document Converter - Large Tile */}
                <GlassCard className="col-span-8 row-span-3 p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                        <FileText size={24} />
                      </div>
                      <h3 className="text-xl font-bold">Intelligent Document AI</h3>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-400 border border-white/5">Auto-Detect</span>
                      <span className="px-3 py-1 bg-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/20">Active</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-4">
                    <textarea 
                      value={conversionText}
                      onChange={(e) => setConversionText(e.target.value)}
                      placeholder="Paste your content here or drop a file..."
                      className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-6 text-zinc-300 focus:outline-none focus:border-emerald-500/30 resize-none font-mono text-sm leading-relaxed"
                    />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-all">
                          <Upload size={16} />
                          <span>Upload File</span>
                        </button>
                        <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none">
                          <option>Blog Post</option>
                          <option>Executive Summary</option>
                          <option>Social Media Kit</option>
                          <option>Technical Docs</option>
                        </select>
                      </div>
                      <button 
                        onClick={handleConvert}
                        disabled={isConverting || !conversionText}
                        className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      >
                        {isConverting ? (
                          <motion.div 
                            animate={{ rotate: 360 }} 
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          >
                            <Zap size={18} />
                          </motion.div>
                        ) : (
                          <Sparkles size={18} />
                        )}
                        <span>{isConverting ? 'Processing...' : 'Convert Content'}</span>
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {result && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-white/5"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Result</span>
                          <button className="text-zinc-500 hover:text-white transition-colors">
                            <Download size={16} />
                          </button>
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 text-sm text-zinc-300 leading-relaxed max-h-48 overflow-y-auto">
                          {result}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>

                {/* Lead Agent - Medium Tile */}
                <GlassCard className="col-span-4 row-span-2 p-6 flex flex-col" delay={0.1}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                      <Users size={20} />
                    </div>
                    <h3 className="font-bold">Lead Conversion Agent</h3>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-zinc-400">Active Leads</span>
                        <span className="text-xs font-bold text-blue-400">12</span>
                      </div>
                      <div className="flex -space-x-2">
                        {[1,2,3,4].map(i => (
                          <img key={i} src={`https://picsum.photos/seed/${i+10}/40/40`} className="w-8 h-8 rounded-full border-2 border-[#050505]" referrerPolicy="no-referrer" />
                        ))}
                        <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#050505] flex items-center justify-center text-[10px] font-bold">+8</div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                      <p className="text-xs text-blue-300 italic mb-2">"I've identified 3 high-intent prospects from your recent LinkedIn campaign. Should I initiate outreach?"</p>
                      <button className="w-full py-2 bg-blue-500 text-black text-xs font-bold rounded-lg hover:bg-blue-400 transition-colors">
                        Approve Outreach
                      </button>
                    </div>
                  </div>
                </GlassCard>

                {/* Quick Stats - Small Tile */}
                <GlassCard className="col-span-4 row-span-1 p-6 flex items-center justify-between" delay={0.2}>
                  <div>
                    <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold block mb-1">Efficiency</span>
                    <span className="text-3xl font-bold tracking-tight">94.2<span className="text-emerald-500">%</span></span>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                    <TrendingUp size={24} />
                  </div>
                </GlassCard>

                {/* Recent Activity - Small Tile */}
                <GlassCard className="col-span-4 row-span-2 p-6" delay={0.3}>
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <History size={18} className="text-zinc-400" />
                    <span>Recent Activity</span>
                  </h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Q4 Report.pdf', type: 'Summary', time: '2m ago' },
                      { name: 'Lead: Sarah J.', type: 'Outreach', time: '15m ago' },
                      { name: 'Product Demo.mp4', type: 'Script', time: '1h ago' },
                      { name: 'Market Analysis', type: 'Blog', time: '3h ago' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-zinc-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-all">
                            <FileText size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-medium group-hover:text-white transition-colors">{item.name}</p>
                            <p className="text-[10px] text-zinc-500">{item.type}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-zinc-600">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* System Status - Small Tile */}
                <GlassCard className="col-span-4 row-span-1 p-6 flex items-center gap-4" delay={0.4}>
                  <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 block">AI Core Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-sm font-bold">Operational</span>
                    </div>
                  </div>
                </GlassCard>

              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
