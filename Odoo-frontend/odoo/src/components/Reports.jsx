import React, { useState, useEffect, useRef } from 'react';
import Table from './common/Table';
import StatusBadge from './common/StatusBadge';
import reportService from '../services/reportService';
import { useTransitOps } from '../hooks/TransitOpsContext';

const Reports = () => {
  const { searchQuery = '', triggerToast } = useTransitOps() || {};
  const containerRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);

  const handleExportReport = async () => {
    try {
      setIsExporting(true);
      const blob = await reportService.exportFleetReport();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'fleet_report.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      triggerToast('Fleet Report exported successfully.', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      triggerToast('Failed to export report.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const [viewMode, setViewMode] = useState('realtime');
  const [utilizationCategory, setUtilizationCategory] = useState('All Assets');
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Monthly ROI data (in ₹ lakhs)
  const months = [
    { name: 'JAN', val: 6.2, prev: 5.4 },
    { name: 'FEB', val: 7.8, prev: 6.1 },
    { name: 'MAR', val: 6.9, prev: 6.5 },
    { name: 'APR', val: 8.9, prev: 7.2 },
    { name: 'MAY', val: 9.4, prev: 8.1, active: true },
    { name: 'JUN', val: 8.2, prev: 7.5 },
    { name: 'JUL', val: 8.5, prev: 7.8 },
    { name: 'AUG', val: 7.1, prev: 6.9 },
    { name: 'SEP', val: 6.4, prev: 6.0 },
    { name: 'OCT', val: 9.1, prev: 8.4 },
    { name: 'NOV', val: 9.8, prev: 9.1 },
    { name: 'DEC', val: 9.2, prev: 8.7 },
  ];
  const maxVal = Math.max(...months.map(m => m.val));

  // Donut chart for fuel breakdown
  const fuelBreakdown = [
    { label: 'Diesel', value: 58, color: '#0053DB' },
    { label: 'CNG', value: 27, color: '#00C897' },
    { label: 'Electric', value: 15, color: '#9C5AF2' },
  ];
  const donutData = (() => {
    let cumulative = 0;
    return fuelBreakdown.map(d => {
      const startAngle = cumulative;
      cumulative += (d.value / 100) * 360;
      return { ...d, startAngle, endAngle: cumulative };
    });
  })();
  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const describeArc = (cx, cy, r, startAngle, endAngle) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const getUtilizationData = () => {
    switch (utilizationCategory) {
      case 'Heavy Duty':
        return { activeRoutes: '62/70', activePct: 88, maintenanceHold: '5/70', maintPct: 7, idleAvailable: '3/70', idlePct: 5 };
      case 'Last Mile':
        return { activeRoutes: '80/90', activePct: 89, maintenanceHold: '3/90', maintPct: 3, idleAvailable: '7/90', idlePct: 8 };
      default:
        return { activeRoutes: '142/160', activePct: 88, maintenanceHold: '8/160', maintPct: 5, idleAvailable: '10/160', idlePct: 7 };
    }
  };
  const utilData = getUtilizationData();

  const vehiclePerformanceData = [
    { id: 'TRK-2901', status: 'completed', label: 'ON ROUTE', distance: '1,244.5', fuel: '158.2', avgSpeed: '58 km/h', efficiency: 92 },
    { id: 'VAN-0455', status: 'completed', label: 'ON ROUTE', distance: '842.1', fuel: '42.5', avgSpeed: '34 km/h', efficiency: 78 },
    { id: 'TRK-8812', status: 'warning', label: 'Maintenance', distance: '0.0', fuel: '0.0', avgSpeed: '--', efficiency: 45 },
    { id: 'TRK-1002', status: 'inactive', label: 'Idle', distance: '2,104.9', fuel: '244.1', avgSpeed: '55 km/h', efficiency: 89 },
    { id: 'TRK-5501', status: 'completed', label: 'ON ROUTE', distance: '1,102.3', fuel: '134.5', avgSpeed: '60 km/h', efficiency: 95 },
    { id: 'VAN-0221', status: 'completed', label: 'ON ROUTE', distance: '654.8', fuel: '32.1', avgSpeed: '38 km/h', efficiency: 84 },
    { id: 'TRK-7711', status: 'inactive', label: 'Idle', distance: '1,450.2', fuel: '180.4', avgSpeed: '52 km/h', efficiency: 87 },
    { id: 'VAN-0899', status: 'warning', label: 'Maintenance', distance: '0.0', fuel: '0.0', avgSpeed: '--', efficiency: 50 },
    { id: 'TRK-1234', status: 'completed', label: 'ON ROUTE', distance: '980.4', fuel: '110.2', avgSpeed: '56 km/h', efficiency: 90 },
    { id: 'VAN-0654', status: 'completed', label: 'ON ROUTE', distance: '430.5', fuel: '21.4', avgSpeed: '32 km/h', efficiency: 82 },
    { id: 'TRK-9876', status: 'warning', label: 'Maintenance', distance: '0.0', fuel: '0.0', avgSpeed: '--', efficiency: 40 },
    { id: 'VAN-0112', status: 'inactive', label: 'Idle', distance: '1,890.3', fuel: '210.9', avgSpeed: '50 km/h', efficiency: 85 },
  ];

  const filteredVehicles = vehiclePerformanceData.filter(
    (v) =>
      v.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (v.id.toLowerCase().includes(filterText.toLowerCase()) ||
        v.label.toLowerCase().includes(filterText.toLowerCase()))
  );

  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const tableColumns = [
    { title: 'Vehicle ID', key: 'id', render: (v) => <span className="font-bold text-on-surface font-mono">{v}</span> },
    { title: 'Status', key: 'status', render: (v, row) => <StatusBadge status={row.status} label={row.label} /> },
    { title: 'Distance (km)', key: 'distance', render: (v) => <span className="font-label-md text-right block">{v}</span> },
    { title: 'Fuel (L)', key: 'fuel', render: (v) => <span className="font-label-md text-right block">{v}</span> },
    { title: 'Avg Speed', key: 'avgSpeed', render: (v) => <span className="font-label-md text-right block">{v}</span> },
    {
      title: 'Efficiency',
      key: 'efficiency',
      render: (v) => (
        <div className="flex items-center justify-end gap-2">
          <div className="w-16 h-2 bg-surface-container rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${v > 80 ? 'bg-secondary' : v > 50 ? 'bg-primary' : 'bg-error'}`} style={{ width: `${v}%` }} />
          </div>
          <span className={`text-[10px] font-bold ${v > 80 ? 'text-secondary' : v > 50 ? 'text-primary' : 'text-error'}`}>{v}%</span>
        </div>
      ),
    },
  ];

  return (
    <div ref={containerRef} className="max-w-[1440px] mx-auto p-4 md:p-margin-desktop space-y-unit-lg min-h-screen">

      {/* ── Page Header ── */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
              <span className="material-symbols-outlined text-white text-lg">bar_chart</span>
            </div>
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Reports & Analytics</h2>
              <p className="text-on-surface-variant text-sm mt-0.5">Fleet performance & fiscal efficiency — Q3 2025</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline-variant shadow-sm">
            <button
              onClick={() => setViewMode('realtime')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'realtime' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:text-on-surface'}`}
            >Real-time</button>
            <button
              onClick={() => setViewMode('historical')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'historical' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:text-on-surface'}`}
            >Historical</button>
          </div>
          <button
            onClick={handleExportReport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/25 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">{isExporting ? 'hourglass_empty' : 'ios_share'}</span>
            {isExporting ? 'Exporting...' : 'Export Report'}
          </button>
        </div>
      </section>

      {/* ── KPI Summary Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '₹94.3L', change: '+8.2%', up: true, icon: 'currency_rupee', color: 'text-secondary', bg: 'bg-secondary-container' },
          { label: 'Fuel Expenditure', value: '₹18.7L', change: '-3.1%', up: false, icon: 'local_gas_station', color: 'text-primary', bg: 'bg-primary-container' },
          { label: 'Fleet Uptime', value: '98.4%', change: '+1.2%', up: true, icon: 'speed', color: 'text-tertiary', bg: 'bg-tertiary-container' },
          { label: 'Avg ROI', value: '24.8%', change: '+3.2%', up: true, icon: 'trending_up', color: 'text-error', bg: 'bg-error-container' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-outline-variant p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-lg ${kpi.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{kpi.icon}</span>
              </div>
              <span className={`flex items-center gap-0.5 text-[11px] font-bold ${kpi.up ? 'text-secondary' : 'text-error'}`}>
                <span className="material-symbols-outlined text-xs">{kpi.up ? 'arrow_upward' : 'arrow_downward'}</span>
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-on-surface">{kpi.value}</p>
            <p className="text-xs text-on-surface-variant mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-12 gap-6">

        {/* Bar Chart – Monthly Revenue */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-outline-variant shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-title-md text-title-md text-on-surface">Monthly Revenue vs ROI</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Net profit vs operational expenditure (₹ in Lakhs)</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">₹94.3L</span>
              <span className="flex items-center gap-1 text-[11px] text-secondary font-bold justify-end mt-0.5">
                <span className="material-symbols-outlined text-xs">trending_up</span>+8.2% vs last year
              </span>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-primary"></div><span className="text-xs text-on-surface-variant">This Year</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-primary/20"></div><span className="text-xs text-on-surface-variant">Last Year</span></div>
          </div>

          <div className="flex items-end gap-1.5" style={{ height: '176px' }}>
            {months.map((month, idx) => {
              const MAX_PX = 152;
              const thisPx = Math.round((month.val / maxVal) * MAX_PX);
              const prevPx = Math.round((month.prev / maxVal) * MAX_PX);
              const isHovered = hoveredBar === idx;
              return (
                <div
                  key={month.name}
                  className="flex-1 flex flex-col items-center gap-0.5 justify-end cursor-pointer group"
                  style={{ height: '176px' }}
                  onMouseEnter={() => setHoveredBar(idx)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {isHovered && (
                    <div className="bg-on-surface text-white text-[9px] rounded-md px-2 py-1 mb-1 whitespace-nowrap shadow-lg">
                      <p className="font-bold">{month.name}</p>
                      <p>₹{month.val}L</p>
                    </div>
                  )}
                  <div className="w-full flex items-end gap-0.5">
                    <div
                      className={`flex-1 rounded-t-md transition-all duration-300 ${month.active ? 'bg-primary' : isHovered ? 'bg-primary/80' : 'bg-primary/50'}`}
                      style={{ height: `${thisPx}px` }}
                    />
                    <div
                      className={`flex-1 rounded-t-md transition-all duration-300 ${isHovered ? 'bg-primary/30' : 'bg-primary/15'}`}
                      style={{ height: `${prevPx}px` }}
                    />
                  </div>
                  <span className={`text-[9px] font-bold mt-1 transition-colors ${month.active ? 'text-primary' : 'text-on-surface-variant'}`}>{month.name}</span>
                </div>
              );
            })}
          </div>

          {/* Y-axis guides */}
          <div className="flex justify-between mt-3 pt-3 border-t border-outline-variant/30">
            {['₹5L', '₹6L', '₹7L', '₹8L', '₹9L', '₹10L'].map(l => (
              <span key={l} className="text-[9px] text-outline">{l}</span>
            ))}
          </div>
        </div>

        {/* Donut Chart – Fuel Breakdown */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-outline-variant shadow-sm p-6 flex flex-col">
          <div className="mb-4">
            <h3 className="font-title-md text-title-md text-on-surface">Fuel Mix Breakdown</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">By energy source type</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <svg viewBox="0 0 120 120" className="w-36 h-36">
              {donutData.map((seg, i) => (
                <path
                  key={i}
                  d={describeArc(60, 60, 46, seg.startAngle, seg.endAngle)}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="14"
                  strokeLinecap="round"
                  className="transition-all"
                />
              ))}
              <text x="60" y="56" textAnchor="middle" className="text-xs font-bold" fill="#1A1C1E" fontSize="11" fontWeight="bold">Fleet</text>
              <text x="60" y="70" textAnchor="middle" fill="#49454F" fontSize="8">Energy</text>
            </svg>
            <div className="space-y-2 w-full mt-4">
              {fuelBreakdown.map((d) => (
                <div key={d.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-on-surface-variant">{d.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${d.value}%`, backgroundColor: d.color }} />
                    </div>
                    <span className="text-xs font-bold text-on-surface w-6 text-right">{d.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Second Row: Utilization + Alerts ── */}
      <div className="grid grid-cols-12 gap-6">

        {/* Fleet Utilization */}
        <div className="col-span-12 md:col-span-7 bg-white rounded-2xl border border-outline-variant shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-title-md text-title-md text-on-surface">Fleet Utilization</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Real-time asset deployment overview</p>
            </div>
            <select
              value={utilizationCategory}
              onChange={(e) => setUtilizationCategory(e.target.value)}
              className="text-xs font-bold text-primary bg-primary-container border-none focus:ring-0 cursor-pointer outline-none rounded-lg px-3 py-1.5"
            >
              <option>All Assets</option>
              <option>Heavy Duty</option>
              <option>Last Mile</option>
            </select>
          </div>
          <div className="space-y-5">
            {[
              { label: 'Active Routes', pct: utilData.activePct, count: utilData.activeRoutes, color: 'bg-primary', textColor: 'text-primary' },
              { label: 'Maintenance Hold', pct: utilData.maintPct, count: utilData.maintenanceHold, color: 'bg-tertiary', textColor: 'text-tertiary' },
              { label: 'Idle (Available)', pct: utilData.idlePct, count: utilData.idleAvailable, color: 'bg-outline', textColor: 'text-outline' },
            ].map((row) => (
              <div key={row.label} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${row.color}`} />
                    <span className="text-sm font-medium text-on-surface">{row.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${row.textColor}`}>{row.pct}%</span>
                    <span className="text-xs text-on-surface-variant font-label-md">{row.count}</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className={`h-full ${row.color} rounded-full transition-all duration-700 ease-out`} style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 pt-4 border-t border-outline-variant/30">
            {[
              { label: 'Total Vehicles', value: '160' },
              { label: 'On Time Rate', value: '94.2%' },
              { label: 'Avg Load', value: '78.5%' },
            ].map((stat) => (
              <div key={stat.label} className="text-center bg-surface-container-lowest rounded-xl p-3 border border-outline-variant/50">
                <p className="text-lg font-bold text-on-surface">{stat.value}</p>
                <p className="text-[10px] text-on-surface-variant uppercase font-bold mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Anomalies & Alerts */}
        <div className="col-span-12 md:col-span-5 bg-white rounded-2xl border border-outline-variant shadow-sm p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="font-title-md text-title-md text-on-surface">Anomalies & Alerts</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Live incident monitoring</p>
            </div>
            <span className="bg-error/10 text-error px-2.5 py-1 rounded-lg text-[10px] font-bold border border-error/20">3 CRITICAL</span>
          </div>
          <div className="space-y-1">
            {[
              { dot: 'bg-error', title: 'Sudden Fuel Drop (TRK-902)', time: '2m ago', desc: 'Unusual depletion near Pune depot. Possible siphoning.', urgent: true },
              { dot: 'bg-tertiary', title: 'Maintenance Overdue (VAN-44)', time: '14m ago', desc: 'Scheduled 50k service was due 3 days ago.', urgent: false },
              { dot: 'bg-secondary', title: 'Efficiency Peak Achieved', time: '1h ago', desc: 'Route optimization saved 450L of diesel today.', urgent: false },
              { dot: 'bg-primary', title: 'New Driver Assignment (TRK-1002)', time: '2h ago', desc: 'Rajesh Kumar assigned to Delhi–Jaipur corridor.', urgent: false },
            ].map((a, i) => (
              <div key={i} className={`p-3 rounded-xl flex gap-3 cursor-pointer transition-all hover:bg-surface-container-lowest ${a.urgent ? 'bg-error/5 border border-error/10' : ''}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${a.dot} shrink-0 mt-1.5`} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-bold text-on-surface truncate">{a.title}</p>
                    <span className="text-[10px] text-outline font-label-md shrink-0">{a.time}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Fleet Performance Table ── */}
      <section className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-title-md text-title-md text-on-surface">Fleet Performance Detail</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">Granular per-vehicle metric analysis</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline">search</span>
              <input
                value={filterText}
                onChange={(e) => { setFilterText(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2 border border-outline-variant rounded-xl text-xs focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="Filter vehicles..."
                type="text"
              />
            </div>
          </div>
        </div>

        <Table columns={tableColumns} data={paginatedVehicles} emptyMessage="No vehicles match the filter criteria." />

        <div className="p-4 border-t border-outline-variant flex justify-between items-center bg-surface-container-lowest">
          <p className="text-xs text-outline">
            Showing {filteredVehicles.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, filteredVehicles.length)} of {filteredVehicles.length} vehicles
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded-lg hover:bg-surface-container transition-all disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs transition-all ${currentPage === p ? 'bg-primary text-white shadow-md' : 'border border-outline-variant hover:bg-surface-container'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded-lg hover:bg-surface-container transition-all disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reports;
