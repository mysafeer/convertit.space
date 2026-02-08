import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// --- 1. CONSTANTS & ICONS ---
const UNIT_CATEGORIES = [
  { name: 'Length', units: ['meters', 'kilometers', 'miles', 'feet', 'inches', 'centimeters'] },
  { name: 'Weight', units: ['kilograms', 'grams', 'pounds', 'ounces'] },
  { name: 'Temperature', units: ['celsius', 'fahrenheit', 'kelvin'] },
  { name: 'Volume', units: ['liters', 'milliliters', 'gallons', 'cups'] },
  { name: 'Speed', units: ['km/h', 'mph', 'm/s', 'knots'] },
];

const Icons = {
  Refresh: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>,
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  Cpu: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>,
  FileCode: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m10 13-2 2 2 2"/><path d="m14 17 2-2-2-2"/></svg>,
  UserCheck: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>,
  Zap: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  Shield: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Moon: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
  Sun: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
  Star: ({ filled = false }: { filled?: boolean }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
};

// --- 2. AI SERVICE (Internal) ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const performSmartConversion = async (prompt: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Convert the following based on natural language intent: "${prompt}". Provide a result and a brief explanation.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          result: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ['result', 'explanation']
      },
    },
  });
  return JSON.parse(response.text || '{}');
};

const convertDataFormat = async (data: string, targetFormat: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Convert the following data into ${targetFormat} format. Provide only the code.\n\n${data}`,
  });
  return response.text.trim();
};

const generateSalesFollowup = async (leadName: string, context: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Draft a high-end sales closer email for "${leadName}" regarding "${context}".`,
  });
  return response.text.trim();
};

// --- 3. SUB-COMPONENTS ---

const SmartConverter = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleConvert = async (e: any) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await performSmartConversion(query);
      setResult(data);
    } catch (err) { alert("Conversion failed."); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-indigo-950 rounded-[40px] shadow-2xl text-white overflow-hidden border border-white/5 p-6 md:p-10 space-y-6">
      <h2 className="text-xl md:text-2xl font-black flex items-center gap-4 uppercase tracking-tighter"><Icons.Cpu /> AI Engine</h2>
      <form onSubmit={handleConvert} className="space-y-4">
        <textarea 
          value={query} onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-lg focus:outline-none focus:ring-2 focus:ring-brand-500/40 min-h-[140px]"
          placeholder='e.g. "1.5 BTC to USD" or "User schema to JSON"'
        />
        <button disabled={loading} className="w-full py-5 bg-white text-slate-950 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-4 active:scale-95 transition-all">
          {loading ? "PROCESSING..." : "RUN PROTOCOL"}
        </button>
      </form>
      {result && (
        <div className="bg-white/10 rounded-3xl p-8 border border-white/10 animate-in fade-in duration-700">
          <div className="text-3xl font-black mb-4 tracking-tighter">{result.result}</div>
          <p className="text-xs text-brand-200 font-bold italic">"{result.explanation}"</p>
        </div>
      )}
    </div>
  );
};

const UnitConverter = () => {
  const [cat, setCat] = useState(UNIT_CATEGORIES[0]);
  const [fromUnit, setFromUnit] = useState(UNIT_CATEGORIES[0].units[0]);
  const [toUnit, setToUnit] = useState(UNIT_CATEGORIES[0].units[1]);
  const [val, setVal] = useState('1');
  const [res, setRes] = useState('0');

  useEffect(() => {
    const v = parseFloat(val);
    if (isNaN(v)) { setRes('0'); return; }
    setRes((v * 1.609).toFixed(4)); 
  }, [val, fromUnit, toUnit, cat]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-6 md:p-10 shadow-sm">
      <h2 className="text-xl md:text-2xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter"><Icons.Refresh /> Units</h2>
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        {UNIT_CATEGORIES.map(c => (
          <button key={c.name} onClick={() => { setCat(c); setFromUnit(c.units[0]); setToUnit(c.units[1]); }}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${cat.name === c.name ? 'bg-brand-800 text-white' : 'bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-slate-800'}`}>
            {c.name}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <input type="number" value={val} onChange={(e) => setVal(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-6 text-2xl font-black" />
        <input type="text" value={res} readOnly className="w-full bg-brand-50 dark:bg-brand-900/10 border-2 border-brand-100 dark:border-brand-800 rounded-2xl p-6 text-2xl font-black text-brand-800 dark:text-brand-400" />
      </div>
    </div>
  );
};

const DataConverter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [target, setTarget] = useState('JSON');
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try { setOutput(await convertDataFormat(input, target)); } catch(e) { alert("Error."); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-6 md:p-10">
      <h2 className="text-xl md:text-2xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter"><Icons.FileCode /> Format Labs</h2>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-40 bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 font-mono text-xs border border-slate-200 dark:border-slate-800" placeholder="Source code here..." />
      <div className="flex flex-wrap gap-2 mt-4 mb-6">
        {['JSON', 'CSV', 'YAML', 'Markdown'].map(f => (
          <button key={f} onClick={() => setTarget(f)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase ${target === f ? 'bg-brand-800 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{f}</button>
        ))}
      </div>
      <button onClick={handleConvert} disabled={loading} className="w-full py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest">
        {loading ? "TRANSFORMING..." : "RUN BRIDGE"}
      </button>
      {output && <textarea value={output} readOnly className="w-full h-40 bg-slate-950 text-brand-400 rounded-2xl p-6 font-mono text-xs border border-slate-800 mt-6" />}
    </div>
  );
};

const SalesAgent = () => {
  const [leads, setLeads] = useState([
    { id: '1', name: 'Jonathan V.', company: 'Apex Logistics', value: '$18k', status: 'negotiating' },
    { id: '2', name: 'Mila K.', company: 'CyberSync', value: '$9k', status: 'new' },
  ]);
  const [log, setLog] = useState<string[]>([]);

  const closeDeal = (lead: any) => {
    setLog(p => [`[${new Date().toLocaleTimeString()}] CLOSING SEQUENCE: Finalizing ${lead.name}...`, ...p]);
    setTimeout(() => {
      setLeads(ls => ls.map(l => l.id === lead.id ? { ...l, status: 'closed' } : l));
      setLog(p => [`[SUCCESS] Deal with ${lead.company} SECURED.`, ...p]);
    }, 2500);
  };

  return (
    <div className="bg-slate-900 text-white rounded-[48px] p-6 md:p-12 shadow-2xl border border-slate-800">
      <h2 className="text-2xl md:text-4xl font-black mb-12 flex items-center gap-4 tracking-tighter"><Icons.Zap /> Deal Closer Agent</h2>
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          {leads.map(l => (
            <div key={l.id} className="bg-slate-950 p-6 rounded-3xl flex justify-between items-center border border-slate-800">
              <div>
                <div className="font-black text-xl">{l.name}</div>
                <div className="text-[10px] uppercase font-black text-slate-500 tracking-widest">{l.company} // {l.value}</div>
              </div>
              <button onClick={() => closeDeal(l)} disabled={l.status === 'closed'} className={`p-4 rounded-2xl ${l.status === 'closed' ? 'text-emerald-500 bg-emerald-500/10' : 'bg-white text-slate-950 active:scale-90 transition-all'}`}>
                {l.status === 'closed' ? <Icons.Shield /> : <Icons.UserCheck />}
              </button>
            </div>
          ))}
        </div>
        <div className="bg-slate-950 rounded-3xl p-8 border border-slate-800 h-64 overflow-y-auto font-mono text-[10px] space-y-2 text-slate-500">
          {log.length === 0 ? "Awaiting commands..." : log.map((l, i) => <div key={i}><span className="text-brand-600">>>></span> {l}</div>)}
        </div>
      </div>
    </div>
  );
};

// --- 4. MASTER APP COMPONENT ---

const App = () => {
  const [tab, setTab] = useState<'AI' | 'UNITS' | 'DATA' | 'SALES'>('AI');
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const navItems = [
    { id: 'AI', label: 'Engine', icon: <Icons.Cpu /> },
    { id: 'UNITS', label: 'Units', icon: <Icons.Refresh /> },
    { id: 'DATA', label: 'Labs', icon: <Icons.FileCode /> },
    { id: 'SALES', label: 'Closer', icon: <Icons.Zap /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20">
      <header className="bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-900 h-24 sticky top-0 z-50 glass">
        <div className="container mx-auto px-4 h-full flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-800 rounded-2xl flex items-center justify-center shadow-xl"><Icons.Zap /></div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase">Convert<span className="text-brand-700">.it</span></h1>
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Elite AI Pro</p>
            </div>
          </div>
          <button onClick={() => setDark(!dark)} className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            {dark ? <Icons.Sun /> : <Icons.Moon />}
          </button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex justify-center mb-16 overflow-x-auto pb-4 scrollbar-hide">
          <div className="bg-white/90 dark:bg-slate-900/50 p-2 rounded-[40px] shadow-2xl border border-slate-200 dark:border-slate-800 flex gap-2 glass">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setTab(item.id as any)}
                className={`flex items-center gap-4 px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${tab === item.id ? 'bg-brand-800 text-white shadow-xl scale-105' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                {item.icon} <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-16 animate-in fade-in duration-1000">
          {tab === 'AI' && <SmartConverter />}
          {tab === 'UNITS' && <UnitConverter />}
          {tab === 'DATA' && <DataConverter />}
          {tab === 'SALES' && <SalesAgent />}
        </div>
      </main>

      <footer className="mt-20 py-10 text-center opacity-20 text-[10px] font-black uppercase tracking-[0.5em]">
        Transaction Logic Secured // v4.2
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
