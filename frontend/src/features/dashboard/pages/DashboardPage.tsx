import React from "react";
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart3, 
  PieChart, 
  Activity, 
  Layers, 
  RefreshCw,
  Calendar,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";

// 1. Advanced Financial Performance Indicators
const financialMetrics = [
  {
    title: "Total Value Locked (TVL)",
    value: "1,245.80 ETH",
    change: "+18.4%",
    isPositive: true,
    timeframe: "vs. previous month",
    icon: <TrendingUp className="w-5 h-5 text-blue-800" />,
    gradientText: true
  },
  {
    title: "Routing Operational Cost",
    value: "14.25 ETH",
    change: "-3.1%",
    isPositive: true, // Decreasing costs is positive
    timeframe: "optimized via smart contract",
    icon: <Activity className="w-5 h-5 text-indigo-700" />,
    gradientText: false
  },
  {
    title: "Infrastructure SLA Rate",
    value: "99.45%",
    change: "-0.12%",
    isPositive: false,
    timeframe: "committed baseline 99.0%",
    icon: <Layers className="w-5 h-5 text-blue-600" />,
    gradientText: false
  }
];

// 2. Allocation Share Distribution Data
const allocationDistribution = [
  { label: "Production Raw Materials", percentage: 52, amount: "647.81 ETH", color: "bg-blue-900" },
  { label: "Global Logistics & Freight", percentage: 28, amount: "348.82 ETH", color: "bg-blue-700" },
  { label: "Semiconductors & Hardware components", percentage: 14, amount: "174.41 ETH", color: "bg-indigo-600" },
  { label: "FX Volatility Capital Buffer", percentage: 6, amount: "74.76 ETH", color: "bg-blue-300" }
];

// 3. Supply Distribution Node Capacity Load
const supplyNodes = [
  { node: "Regional Freight Transit Node 1", load: 84, status: "Optimal", volume: "420.5 ETH", color: "bg-emerald-600" },
  { node: "Domestic Hub Fulfillment Center", load: 62, status: "Stable", volume: "310.2 ETH", color: "bg-blue-700" },
  { node: "Import Material Sourcing Pipeline", load: 91, status: "Near Capacity", volume: "455.1 ETH", color: "bg-amber-500" },
  { node: "Emergency Contingency Network", load: 15, status: "Idle", volume: "60.0 ETH", color: "bg-gray-400" },
];

const DashboardPage = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 bg-gradient-to-br from-white to-blue-50/40 min-h-screen space-y-6">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
            Data Visualization Engine
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time financial allocation tracking, decentralized data metrics, and operational stream monitoring.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 bg-white border border-gray-100 text-gray-600 font-medium px-4 py-2 rounded-md text-sm shadow-sm transition-all duration-200 hover:bg-gray-50 active:scale-[0.98] flex-1 sm:flex-initial">
            <Calendar className="w-4 h-4" />
            <span>Past 30 Days</span>
          </button>
          <button className="flex items-center justify-center gap-2 bg-blue-50 text-blue-800 font-medium px-4 py-2 rounded-md text-sm transition-all duration-200 hover:bg-blue-100 active:scale-[0.98] shrink-0">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Sync Data</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: METRIC VISUAL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {financialMetrics.map((card, i) => (
          <div key={i} className="bg-white rounded-md p-5 shadow-sm hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-wider">{card.title}</span>
              <div className="p-1.5 bg-blue-50/50 rounded-md shrink-0">{card.icon}</div>
            </div>
            
            <div className="mt-4">
              <span className={`text-2xl md:text-3xl font-bold tracking-tight ${
                card.gradientText ? "bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent" : "text-gray-900"
              }`}>
                {card.value}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-2 text-xs">
              <span className={`font-bold flex items-center px-1.5 py-0.5 rounded ${
                card.isPositive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}>
                {card.isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {card.change}
              </span>
              <span className="text-gray-400 truncate">{card.timeframe}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 2: CORE CHARTS GRAPHICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart View 1: Compound Share Progress Breakdown */}
        <div className="bg-white rounded-md p-5 md:p-6 shadow-sm lg:col-span-2 text-left space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-800" />
                Capital Disbursed Allocation Share
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Visual representation of total volume weight split across system criteria.</p>
            </div>
            <span className="text-xs font-mono font-bold text-gray-400">TOTAL: 100%</span>
          </div>

          {/* Compound Stacked Progress Bar */}
          <div className="w-full h-6 rounded-full bg-gray-100 flex overflow-hidden shadow-inner">
            {allocationDistribution.map((item, index) => (
              <div 
                key={index} 
                style={{ width: `${item.percentage}%` }} 
                className={`${item.color} h-full transition-all duration-500 hover:opacity-90`}
                title={`${item.label}: ${item.percentage}%`}
              />
            ))}
          </div>

          {/* Technical Legend Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {allocationDistribution.map((item, index) => (
              <div key={index} className="p-3 bg-gray-50/60 rounded-md flex items-start gap-3 transition-colors hover:bg-gray-50">
                <div className={`w-3 h-3 rounded-full ${item.color} shrink-0 mt-1`} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-bold text-gray-700 truncate">{item.label}</span>
                    <span className="text-xs font-extrabold text-blue-900">{item.percentage}%</span>
                  </div>
                  <p className="text-xs font-mono font-medium text-gray-400 mt-0.5">{item.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart View 2: Node Operations Efficiency Load */}
        <div className="bg-white rounded-md p-5 md:p-6 shadow-sm text-left flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-800" />
              Distribution Node Capacities
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Current infrastructure bandwidth and utilization load metrics.</p>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {supplyNodes.map((node, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 font-medium truncate max-w-[180px]">{node.node}</span>
                  <span className="font-mono text-gray-400">
                    <strong className="text-gray-900 font-semibold">{node.volume}</strong> ({node.load}%)
                  </span>
                </div>
                {/* Single Progress Metric Track */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${node.color} transition-all duration-500`} 
                    style={{ width: `${node.load}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: LINEAR VARIATION DATA SHEET */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        
        {/* Data Sheet Header */}
        <div className="p-4 md:p-6 bg-gradient-to-br from-white to-blue-50/40 flex items-center justify-between border-b border-gray-50">
          <div className="text-left">
            <h3 className="text-base md:text-lg font-bold text-gray-900">Index Mutation Log</h3>
            <p className="text-xs text-gray-500 mt-0.5">Real-time delta metrics stream evaluating allocation shift cycles.</p>
          </div>
          <button className="text-xs font-bold text-blue-800 flex items-center gap-1 hover:text-blue-900 transition-colors">
            <span>View Full Log Stream</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Technical Data Stream Sheet */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 text-gray-500 uppercase tracking-wider text-[11px] font-bold">
                <th className="py-3 px-4 md:px-6">Index Hash</th>
                <th className="py-3 px-4 md:px-6">Analyzed Category Block</th>
                <th className="py-3 px-4 md:px-6 text-right">Dispatched Volume</th>
                <th className="py-3 px-4 md:px-6">Visual Delta Spread</th>
                <th className="py-3 px-4 md:px-6 text-right">Sync Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs md:text-sm text-gray-900">
              {[
                { id: "IDX-VAL-889", category: "Production Raw Materials", amount: "145.20 ETH", percentage: 74, status: "Bullish Delta", isUp: true, date: "14:25:02" },
                { id: "IDX-LOG-412", category: "Global Logistics & Freight", amount: "89.15 ETH", percentage: 42, status: "Stable Track", isUp: true, date: "14:10:55" },
                { id: "IDX-SI-009", category: "Semiconductors & Hardware components", amount: "32.00 ETH", percentage: 18, status: "Minor Recess", isUp: false, date: "13:58:12" },
                { id: "IDX-BUF-551", category: "FX Volatility Capital Buffer", amount: "5.40 ETH", percentage: 8, status: "Optimized Clear", isUp: true, date: "13:12:40" },
              ].map((row, index) => (
                <tr key={index} className="hover:bg-blue-50/20 transition-colors duration-150">
                  <td className="py-3.5 px-4 md:px-6 font-mono font-semibold text-blue-800">
                    {row.id}
                  </td>
                  <td className="py-3.5 px-4 md:px-6 font-medium text-gray-900">
                    {row.category}
                  </td>
                  <td className="py-3.5 px-4 md:px-6 text-right font-mono font-bold text-gray-900">
                    {row.amount}
                  </td>
                  <td className="py-3.5 px-4 md:px-6">
                    <div className="flex items-center gap-3">
                      {/* Integrated Inline Matrix Micro-Bar */}
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0">
                        <div className={`h-full rounded-full ${row.isUp ? 'bg-blue-800' : 'bg-indigo-400'}`} style={{ width: `${row.percentage}%` }} />
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        row.isUp ? "bg-blue-50 text-blue-800" : "bg-gray-100 text-gray-600"
                      }`}>
                        {row.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 md:px-6 text-right text-gray-400 font-mono">
                    {row.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;