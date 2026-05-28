// pages/Marketing/LandingPage.tsx

import React from "react";
import { Link } from "react-router";
import { 
  ShieldCheck, 
  Zap, 
  Layers, 
  ArrowRight, 
  Globe2,
  Cpu,
  Network,
  Scale,
  FileCheck2,
  Coins,
  ArrowUpRight,
  Activity,
  Sparkles
} from "lucide-react";

const LandingPage = () => {
  // 1. Core Cryptographic Supply Chain Engine Features
  const coreFeatures = [
    {
      icon: <Zap className="w-5 h-5 text-indigo-600 group-hover:text-white" strokeWidth={2} />,
      title: "Automated Route Matching",
      description: "Our Smart Sourcing solver instantly deconstructs your Bill of Materials (BOM), matching raw procurement requirements to optimal suppliers based on historical capacity profiles."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600 group-hover:text-white" strokeWidth={2} />,
      title: "Cryptographic Verification",
      description: "Every supplier quotation, historical delivery timeline, and quality certification is permanently hashed onto an immutable, decentralized ledger to eliminate bid tampering."
    },
    {
      icon: <Scale className="w-5 h-5 text-indigo-600 group-hover:text-white" strokeWidth={2} />,
      title: "Constraint-Driven Allocation",
      description: "Automate supply orders by cross-referencing multi-variable parameters including maximum manufacturing tolerance (Defect Rate) and logistics lead times."
    },
    {
      icon: <FileCheck2 className="w-5 h-5 text-indigo-600 group-hover:text-white" strokeWidth={2} />,
      title: "On-Chain Smart Contracts",
      description: "Upon successful matching, our system deploys automated Ethereum-native procurement contracts, escrowing funds and linking payouts strictly to cryptographic proof of delivery."
    },
    {
      icon: <Network className="w-5 h-5 text-indigo-600 group-hover:text-white" strokeWidth={2} />,
      title: "Decentralized SLA Audit",
      description: "Fulfillment tracking data streams directly to decentralized consensus nodes, computing programmatic liquidation penalties or speed bonuses automatically."
    },
    {
      icon: <Coins className="w-5 h-5 text-indigo-600 group-hover:text-white" strokeWidth={2} />,
      title: "Wei-Denominated Precision",
      description: "Core accounting structures operate entirely in the 'wei' unit base, eliminating floating-point rounding errors common in high-volume transnational supply chains."
    }
  ];

  // 2. Blockchain Procurement Workflow
  const workflowSteps = [
    {
      step: "01",
      title: "Demand Initialization",
      desc: "Administrators or Chapter Leaders emit procurement requests paired with cryptographic safety boundaries."
    },
    {
      step: "02",
      title: "Quotation Injection",
      desc: "Suppliers commit pricing (in wei) and production boundaries directly via secure Web3 key signatures."
    },
    {
      step: "03",
      title: "Algorithmic Solver Optimization",
      desc: "The protocol processes the constraint matrix, identifying the optimal configuration minimizing cost leakage."
    },
    {
      step: "04",
      title: "Immutable Binding",
      desc: "Multi-signature contracts lock strict penalties into place before manufacturing orchestration initiates."
    }
  ];

  // 4. Live Network Metrics Dashboard Data
  const platformMetrics = [
    { value: "1,425.85 ETH", label: "Total Value Locked (TVL)", sub: "Active procurement capital" },
    { value: "99.82%", label: "SLA Fulfillment Rate", sub: "On-time programmatic delivery" },
    { value: "0.18%", label: "Avg Defect Rate", sub: "Verified material tolerance" },
    { value: "< 24s", label: "Smart Settlement Time", sub: "Average cross-border payment" }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600/10 relative overflow-x-hidden antialiased">
      
      {/* EFFECT 1: LƯỚI HÌNH HỌC ĐỒNG BỘ VỚI LOGIN (GRID PATTERN) */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_60%,transparent_100%)] opacity-60 pointer-events-none" />

      {/* EFFECT 2: CÁC KHỐI CẦU SÁNG GRADIENT MỜ (BLURRED AMBIENT ORBS) */}
      <div className="absolute top-[-5%] left-[-10%] w-[45rem] h-[45rem] rounded-full bg-blue-400/10 blur-[130px] pointer-events-none mix-blend-multiply animate-pulse duration-[8000ms]" />
      <div className="absolute top-[25%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-indigo-400/10 blur-[140px] pointer-events-none mix-blend-multiply animate-pulse duration-[10000ms]" />
      <div className="absolute bottom-[15%] left-[-5%] w-[35rem] h-[35rem] rounded-full bg-emerald-400/5 blur-[120px] pointer-events-none" />

      {/* ==========================================
          1. NAVIGATION BAR (GLASSMORPHISM)
         ========================================== */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-900 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <Layers className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-base text-slate-900 tracking-tight">
              SE400 <span className="bg-gradient-to-r from-indigo-950 via-indigo-800 to-indigo-600 bg-clip-text text-transparent font-black">Sourcing Core</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-400">
            <a href="#metrics" className="hover:text-indigo-900 transition-colors">Live Matrix</a>
            <a href="#features" className="hover:text-indigo-900 transition-colors">Protocol Spec</a>
            <a href="#workflow" className="hover:text-indigo-900 transition-colors">Smart Workflow</a>
          </div>

          <Link 
            to="/login" 
            className="
              flex items-center gap-2 bg-white text-slate-700 border border-slate-200 font-bold px-4 py-2 
              rounded-lg text-xs uppercase tracking-wider transition-all duration-200 
              hover:bg-slate-50 hover:text-indigo-950 active:scale-[0.98] shadow-xs hover:border-slate-300
            "
          >
            <span>Console Access</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </Link>
        </div>
      </nav>

      {/* ==========================================
          2. HERO SECTION
         ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 text-left space-y-6">
          <div className="inline-flex items-center gap-2 bg-indigo-50/60 text-indigo-950 text-xs font-bold px-3 py-1.5 rounded-lg border border-indigo-100/80 shadow-xs">
            <Globe2 className="w-3.5 h-3.5 text-indigo-700 animate-spin" style={{ animationDuration: '12s' }} strokeWidth={2.5} />
            <span className="uppercase tracking-wider text-[10px]">Next-Gen Web3 Sourcing Infrastructure</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.05]">
            Trustless Procurement.<br />
            <span className="bg-gradient-to-r from-slate-950 via-indigo-950 to-indigo-800 bg-clip-text text-transparent">
              Mathematical Execution.
            </span>
          </h1>
          
          <p className="text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed font-medium">
            Eliminate informational asymmetry and administrative overhead. Secure manufacturing supply paths utilizing <strong className="text-slate-800 font-semibold">Ethereum Smart Contracts</strong> to orchestrate precision allocation logic and zero-friction global asset clearing.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/login"
              className="
                flex items-center justify-center gap-2 bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-900 
                text-white font-bold px-6 py-3.5 rounded-lg shadow-lg shadow-indigo-900/10 
                transition-all duration-200 hover:shadow-xl hover:brightness-110 active:scale-[0.98] w-full sm:w-auto text-xs uppercase tracking-wider group
              "
            >
              <span>Initialize Control Nodes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </Link>
            
            <a
              href="#features"
              className="
                flex items-center justify-center bg-white text-slate-600 font-bold px-6 py-3.5 
                rounded-lg border border-slate-200 shadow-xs transition-all duration-200 
                hover:bg-slate-50 hover:text-slate-900 w-full sm:w-auto text-xs uppercase tracking-wider
              "
            >
              Read Architecture Guide
            </a>
          </div>
        </div>

        {/* FLOATING INTERACTIVE UI BLOCK (GLASSMORPHISM CARD) */}
        <div className="lg:col-span-5 bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 shadow-2xl space-y-4 relative overflow-hidden transition-all duration-500 hover:-translate-y-1.5 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span className="text-[10px] font-mono text-slate-400 ml-1.5">procurement_solver.sol</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] font-mono bg-emerald-50/60 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-100/60 font-bold tracking-wide uppercase">
              <Sparkles className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: '3s' }} /> On-Chain Syncing
            </div>
          </div>

          <div className="space-y-3 text-left">
            <div className="p-3.5 bg-slate-50/60 rounded-lg border border-slate-100 space-y-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400 uppercase font-bold tracking-wider">Target Pipeline</span>
                <span className="font-mono text-indigo-950 font-extrabold">REQ-2026-X49</span>
              </div>
              <p className="text-xs font-bold text-slate-800">5,000 Tactical Units / Target Max Error: 2.50%</p>
            </div>

            <div className="p-3.5 bg-emerald-50/30 rounded-lg border border-emerald-100/50 space-y-1">
              <div className="flex justify-between items-center text-[10px] text-emerald-800">
                <span className="font-bold uppercase tracking-wider">Matched Supplier Node</span>
                <span className="font-mono font-medium">0x71C...3a90</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Cryptographic Unit Cost</p>
                  <p className="text-xs font-mono font-bold text-emerald-950">1,250,000,000,000,000 wei</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-white px-2 py-1 rounded-md border border-emerald-100 shadow-2xs">
                  ≈ 0.00125 ETH
                </span>
              </div>
            </div>

            <div className="pt-2 text-[10px] font-mono text-slate-400 space-y-1 border-t border-dashed border-slate-100">
              <p className="text-slate-800 font-bold flex items-center gap-1">
                <Activity className="w-3 h-3 text-indigo-600 animate-pulse" /> Consensus Logs:
              </p>
              <p className="text-slate-400">&gt; Evaluating supply threshold bounds... OK.</p>
              <p className="text-slate-400">&gt; Verifying multi-sig execution authority... Valid.</p>
              <p className="text-emerald-600 font-bold">&gt; Block Commit Successful (Gas Optimized)</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. REAL-TIME DATA STREAM METRICS
         ========================================== */}
      <section id="metrics" className="bg-white/80 backdrop-blur-md py-14 border-y border-slate-200/60 shadow-2xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center sm:text-left mb-10 space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-950 flex items-center justify-center sm:justify-start gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600 animate-pulse" /> Decentralized Protocol Performance Ledger
            </h3>
            <p className="text-xs font-medium text-slate-400">Live state data verified by distributed network validator systems.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformMetrics.map((metric, i) => (
              <div 
                key={i} 
                className="bg-slate-50/40 rounded-xl p-6 border border-slate-100 shadow-2xs text-left space-y-1.5 transition-all duration-300 hover:shadow-md hover:bg-white group"
              >
                <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight group-hover:text-indigo-900 transition-colors">
                  {metric.value}
                </p>
                <p className="text-xs font-bold text-slate-700">
                  {metric.label}
                </p>
                <p className="text-[11px] font-medium text-slate-400">
                  {metric.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. CORE FEATURES ENGINE GRID
         ========================================== */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="text-left mb-16 space-y-2">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
            Engineered for High-Stake Production Integrity
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-400 max-w-xl leading-relaxed">
            Eliminate traditional procurement corruption and supply bottlenecks. Enforce absolute alignment with your supply network using cryptography.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((item, index) => (
            <div 
              key={index}
              className="
                bg-white/90 backdrop-blur-xl rounded-xl p-6 border border-slate-200/80 shadow-2xs 
                transition-all duration-300 flex flex-col justify-between group 
                hover:shadow-xl hover:shadow-indigo-950/5 hover:border-indigo-200/80 hover:-translate-y-1
              "
            >
              <div className="space-y-4">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200/60 group-hover:bg-gradient-to-br group-hover:from-slate-950 group-hover:to-indigo-950 transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          5. PROTOCOL INTERACTIVE WORKFLOW
         ========================================== */}
      <section id="workflow" className="bg-slate-100/60 py-20 md:py-28 border-y border-slate-200/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          <div className="mb-16 space-y-1">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
              The Cryptographic Sourcing Lifecycle
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-400 max-w-xl">
              Trace the end-to-end flow from initial material requisition triggers to programmatic micro-settlements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, idx) => (
              <div 
                key={idx} 
                className="bg-white/90 backdrop-blur-xl rounded-xl p-6 border border-slate-200 shadow-2xs relative space-y-4 transition-all duration-300 hover:shadow-md"
              >
                <div className="text-3xl font-mono font-black text-slate-100 absolute top-4 right-4 select-none">
                  {step.step}
                </div>
                <h4 className="text-sm font-bold text-slate-900 pr-10 tracking-tight">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* SYSTEM CONSENSUS INFO BLOCK (GLASSMORPHISM) */}
          <div className="mt-10 bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-indigo-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs">
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping" /> Consensus Governor State
              </span>
              <h5 className="text-sm font-bold text-slate-900">Zero-Leakage Allocator Mechanics</h5>
              <p className="text-xs text-slate-500 max-w-3xl leading-relaxed font-medium">
                The protocol incorporates compile-time geometric optimizations. Any attempted quote adjustment or constraint override after block confirmation triggers an automated transaction rejection at the EVM consensus layer.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-4 py-2.5 rounded-lg border border-slate-200 whitespace-nowrap cursor-pointer hover:bg-slate-50 hover:text-indigo-950 transition-colors group shadow-2xs">
              <span>View Contract Specs</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
          6. ENTERPRISE CONVERSION BLOCK
         ========================================== */}
      <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-900 text-white py-20 md:py-24 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
            Deploy Absolute Governance to Your Pipeline.
          </h2>
          <p className="text-indigo-200/70 text-xs sm:text-sm font-medium max-w-2xl mx-auto leading-relaxed">
            Transition your manufacturing supply chain to an immutable, decentralized management plane. Enforce SLA metrics, lock quotation integrity, and automate international liquidity pipelines instantly.
          </p>
          
          <div className="pt-4">
            <Link
              to="/login"
              className="
                inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-extrabold px-6 py-3.5 
                rounded-lg shadow-lg text-xs uppercase tracking-wider transition-all duration-200 
                hover:bg-slate-50 active:scale-[0.98] group
              "
            >
              <span>Access Protocol Control Center</span>
              <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. ENTERPRISE CLEAN FOOTER
         ========================================== */}
      <footer className="bg-white py-10 border-t border-slate-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] md:text-xs text-slate-400 font-medium">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-bold text-slate-800 text-xs tracking-tight">SE400 Sourcing System Enterprise Ltd.</p>
            <p>&copy; 2026 Cryptographic Logistics & On-Chain Procurement Frameworks. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-bold uppercase tracking-wider text-slate-400">
            <span className="hover:text-indigo-950 cursor-pointer transition-colors">Security Audit Specs</span>
            <span className="hover:text-indigo-950 cursor-pointer transition-colors">SLA Terms</span>
            <span className="hover:text-indigo-950 cursor-pointer transition-colors">Node Logs</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;