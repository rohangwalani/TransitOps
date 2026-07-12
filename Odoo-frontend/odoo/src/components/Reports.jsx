import React, { useState, useEffect, useRef } from 'react';
import Table from './common/Table';
import StatusBadge from './common/StatusBadge';

const Reports = () => {
  // Atmospheric background tracking
  const [bgStyle, setBgStyle] = useState({});
  const containerRef = useRef(null);

  // ROI Chart Tooltip State
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    month: '',
    value: 0,
  });

  // Filter & Mode State
  const [viewMode, setViewMode] = useState('realtime'); // 'realtime' or 'historical'
  const [utilizationCategory, setUtilizationCategory] = useState('All Assets');
  const [filterText, setFilterText] = useState('');

  // Track mouse movement for subtle atmosphere gradient shift
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setBgStyle({
        backgroundImage: `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(0, 83, 219, 0.03) 0%, rgba(248, 249, 255, 1) 50%)`,
      });
    }
  };

  // ROI Mock Data
  const months = [
    { name: 'JAN', height: '40%', val: 6200 },
    { name: 'FEB', height: '55%', val: 7800 },
    { name: 'MAR', height: '45%', val: 6900 },
    { name: 'APR', height: '70%', val: 8900 },
    { name: 'MAY', height: '85%', val: 9400, active: true },
    { name: 'JUN', height: '60%', val: 8200 },
    { name: 'JUL', height: '65%', val: 8500 },
    { name: 'AUG', height: '50%', val: 7100 },
    { name: 'SEP', height: '40%', val: 6400 },
    { name: 'OCT', height: '75%', val: 9100 },
    { name: 'NOV', height: '90%', val: 9800 },
    { name: 'DEC', height: '80%', val: 9200 },
  ];

  // Dynamic Fleet Utilization metrics based on select dropdown
  const getUtilizationData = () => {
    switch (utilizationCategory) {
      case 'Heavy Duty':
        return {
          activeRoutes: '62/70',
          activePct: 88,
          maintenanceHold: '5/70',
          maintPct: 7,
          idleAvailable: '3/70',
          idlePct: 5,
          totalActive: 62,
        };
      case 'Last Mile':
        return {
          activeRoutes: '80/90',
          activePct: 89,
          maintenanceHold: '3/90',
          maintPct: 3,
          idleAvailable: '7/90',
          idlePct: 8,
          totalActive: 80,
        };
      case 'All Assets':
      default:
        return {
          activeRoutes: '142/160',
          activePct: 88,
          maintenanceHold: '8/160',
          maintPct: 5,
          idleAvailable: '10/160',
          idlePct: 7,
          totalActive: 142,
        };
    }
  };

  const utilData = getUtilizationData();

  // Fleet performance table data
  const vehiclePerformanceData = [
    {
      id: 'TRK-2901',
      status: 'completed',
      label: 'ON ROUTE',
      distance: '1,244.5',
      fuel: '158.2',
      avgSpeed: '58 mph',
      efficiency: 92,
    },
    {
      id: 'VAN-0455',
      status: 'completed',
      label: 'ON ROUTE',
      distance: '842.1',
      fuel: '42.5',
      avgSpeed: '34 mph',
      efficiency: 78,
    },
    {
      id: 'TRK-8812',
      status: 'warning',
      label: 'Maintenance',
      distance: '0.0',
      fuel: '0.0',
      avgSpeed: '--',
      efficiency: 45,
    },
    {
      id: 'TRK-1002',
      status: 'inactive',
      label: 'Idle',
      distance: '2,104.9',
      fuel: '244.1',
      avgSpeed: '55 mph',
      efficiency: 89,
    },
  ];

  // Filter vehicles
  const filteredVehicles = vehiclePerformanceData.filter(
    (vehicle) =>
      vehicle.id.toLowerCase().includes(filterText.toLowerCase()) ||
      vehicle.label.toLowerCase().includes(filterText.toLowerCase())
  );

  // Table Columns
  const tableColumns = [
    {
      title: 'Vehicle ID',
      key: 'id',
      render: (value) => <span className="font-bold text-on-surface">{value}</span>,
    },
    {
      title: 'Status',
      key: 'status',
      render: (value, row) => <StatusBadge status={row.status} label={row.label} />,
    },
    {
      title: 'Distance (mi)',
      key: 'distance',
      render: (value) => <span className="font-label-md text-right block">{value}</span>,
    },
    {
      title: 'Fuel Consumed (gal)',
      key: 'fuel',
      render: (value) => <span className="font-label-md text-right block">{value}</span>,
    },
    {
      title: 'Avg Speed',
      key: 'avgSpeed',
      render: (value) => <span className="font-label-md text-right block">{value}</span>,
    },
    {
      title: 'Efficiency Score',
      key: 'efficiency',
      render: (value) => (
        <div className="flex items-center justify-end gap-2">
          <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
            <div
              className={`h-full ${value > 80 ? 'bg-secondary' : value > 50 ? 'bg-primary' : 'bg-error'}`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="text-[10px] font-bold">{value}%</span>
        </div>
      ),
    },
    {
      title: '',
      key: 'actions',
      render: () => (
        <button className="opacity-0 group-hover:opacity-100 p-1 hover:text-primary transition-all flex items-center justify-center">
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </button>
      ),
    },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={bgStyle}
      className="max-w-[1440px] mx-auto p-4 md:p-margin-desktop space-y-unit-lg transition-all duration-300 min-h-screen"
    >
      {/* Page Header & Export Controls */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Reports & Analytics</h2>
          <p className="text-on-surface-variant mt-1">Operational performance and fiscal efficiency for Q3 2024.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant">
            <button
              onClick={() => setViewMode('realtime')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                viewMode === 'realtime' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Real-time
            </button>
            <button
              onClick={() => setViewMode('historical')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                viewMode === 'historical' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Historical
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant rounded-lg text-sm font-semibold hover:bg-surface-container-lowest transition-all soft-shadow">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all soft-shadow">
            <span className="material-symbols-outlined text-sm">ios_share</span>
            Export Report
          </button>
        </div>
      </section>

      {/* Key Metric Bento Grid */}
      <div className="bento-grid">
        {/* ROI Chart */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-xl border border-outline-variant soft-shadow relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-title-md text-title-md">Investment Return (ROI)</h3>
              <p className="text-xs text-outline">Net profit vs operational expenditure</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">24.8%</span>
              <span className="flex items-center gap-1 text-[10px] text-secondary font-bold justify-end">
                <span className="material-symbols-outlined text-[12px]">trending_up</span> +3.2%
              </span>
            </div>
          </div>

          <div className="chart-container flex items-end justify-between gap-2 px-2">
            {months.map((month, idx) => {
              const isActive = month.active;
              return (
                <div
                  key={month.name}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const containerRect = containerRef.current.getBoundingClientRect();
                    setTooltip({
                      visible: true,
                      x: rect.left - containerRect.left + rect.width / 2,
                      y: rect.top - containerRect.top,
                      month: month.name,
                      value: month.val,
                    });
                  }}
                  onMouseLeave={() => {
                    setTooltip((prev) => ({ ...prev, visible: false }));
                  }}
                  className={`flex-1 rounded-t-sm transition-all cursor-pointer relative ${
                    isActive ? 'bg-primary hover:bg-primary/80' : 'bg-surface-container-high hover:bg-primary'
                  }`}
                  style={{ height: month.height }}
                ></div>
              );
            })}
          </div>

          <div className="flex justify-between mt-4 text-[10px] text-outline font-label-md px-2">
            {months.map((month) => (
              <span key={month.name}>{month.name}</span>
            ))}
          </div>
        </div>

        {/* Efficiency Score */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white/80 backdrop-blur-md p-6 rounded-xl border border-outline-variant/50 soft-shadow flex flex-col justify-between min-h-[320px]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                speed
              </span>
              <h3 className="font-title-md text-title-md">Efficiency Score</h3>
            </div>
            <p className="text-xs text-outline">Overall fleet health index</p>
          </div>

          <div className="flex flex-col items-center py-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle className="text-surface-container-high" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-secondary" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" stroke-dashoffset="65" stroke-width="8"></circle>
              </svg>
              <span className="absolute font-headline-md text-headline-md text-on-surface">
                82<span className="text-sm font-normal text-outline">%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-3 rounded-lg border border-outline-variant">
              <p className="text-[10px] text-outline uppercase font-bold">Uptime</p>
              <p className="text-sm font-bold text-on-surface">98.4%</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-outline-variant">
              <p className="text-[10px] text-outline uppercase font-bold">Idle Time</p>
              <p className="text-sm font-bold text-on-surface">4.2m/h</p>
            </div>
          </div>
        </div>

        {/* Fleet Utilization */}
        <div className="col-span-12 md:col-span-6 lg:col-span-6 bg-white p-6 rounded-xl border border-outline-variant soft-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-title-md text-title-md">Fleet Utilization</h3>
            <select
              value={utilizationCategory}
              onChange={(e) => setUtilizationCategory(e.target.value)}
              className="text-xs font-bold text-outline bg-transparent border-none focus:ring-0 cursor-pointer outline-none"
            >
              <option>All Assets</option>
              <option>Heavy Duty</option>
              <option>Last Mile</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span>Active Routes</span>
                <span className="font-label-md">{utilData.activeRoutes}</span>
              </div>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${utilData.activePct}%` }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span>Maintenance Hold</span>
                <span className="font-label-md">{utilData.maintenanceHold}</span>
              </div>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-tertiary rounded-full transition-all duration-500" style={{ width: `${utilData.maintPct}%` }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span>Idle (Available)</span>
                <span className="font-label-md">{utilData.idleAvailable}</span>
              </div>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-outline rounded-full transition-all duration-500" style={{ width: `${utilData.idlePct}%` }}></div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-[10px] text-outline uppercase font-bold">Active</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                <span className="text-[10px] text-outline uppercase font-bold">Down</span>
              </div>
            </div>
            <button className="text-xs font-bold text-primary hover:underline transition-all bg-transparent border-none">
              View Fleet View
            </button>
          </div>
        </div>

        {/* Live Performance Feed */}
        <div className="col-span-12 lg:col-span-6 bg-white p-6 rounded-xl border border-outline-variant soft-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-title-md text-title-md">Anomalies & Alerts</h3>
            <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded text-[10px] font-bold">3 CRITICAL</span>
          </div>

          <div className="divide-y divide-outline-variant/30">
            <div className="py-3 flex items-start gap-3 group hover:bg-surface-container-lowest px-2 rounded-lg transition-all cursor-pointer">
              <div className="mt-1.5 w-2 h-2 rounded-full bg-error shrink-0"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-on-surface">Sudden Fuel Drop (TRK-902)</p>
                  <span className="text-[10px] text-outline font-label-md">2m ago</span>
                </div>
                <p className="text-xs text-on-surface-variant">Unusual depletion pattern detected near Chicago depot.</p>
              </div>
            </div>

            <div className="py-3 flex items-start gap-3 group hover:bg-surface-container-lowest px-2 rounded-lg transition-all cursor-pointer">
              <div className="mt-1.5 w-2 h-2 rounded-full bg-tertiary shrink-0"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-on-surface">Maintenance Overdue (VAN-44)</p>
                  <span className="text-[10px] text-outline font-label-md">14m ago</span>
                </div>
                <p className="text-xs text-on-surface-variant">Scheduled 50k service was due 3 days ago.</p>
              </div>
            </div>

            <div className="py-3 flex items-start gap-3 group hover:bg-surface-container-lowest px-2 rounded-lg transition-all cursor-pointer">
              <div className="mt-1.5 w-2 h-2 rounded-full bg-secondary shrink-0"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-on-surface">Efficiency Peak Achieved</p>
                  <span className="text-[10px] text-outline font-label-md">1h ago</span>
                </div>
                <p className="text-xs text-on-surface-variant">Route optimization saved 120 gallons today.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Data Table Section */}
      <section className="bg-white rounded-xl border border-outline-variant soft-shadow overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest">
          <div>
            <h3 className="font-title-md text-title-md">Fleet Performance Detail</h3>
            <p className="text-xs text-outline">Granular per-vehicle metric analysis</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-sm text-outline">search</span>
              <input
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 border border-outline-variant rounded text-xs focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="Filter vehicles..."
                type="text"
              />
            </div>
            <button className="p-2 border border-outline-variant rounded hover:bg-surface-container transition-all flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-sm">download</span>
            </button>
          </div>
        </div>

        <Table columns={tableColumns} data={filteredVehicles} emptyMessage="No vehicles match the filter criteria." />

        <div className="p-4 bg-surface-container-lowest border-t border-outline-variant flex justify-between items-center">
          <p className="text-xs text-outline">Showing {filteredVehicles.length} of {vehiclePerformanceData.length} vehicles</p>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container transition-all">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded font-bold text-xs">1</button>
            <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container transition-all text-xs">2</button>
            <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container transition-all text-xs">3</button>
            <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container transition-all">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* Floating Tooltip for Micro-interactions */}
      <div
        className={`fixed pointer-events-none bg-inverse-surface text-white text-[10px] px-3 py-2 rounded-lg shadow-xl transition-all duration-150 z-[100] transform -translate-x-1/2 -translate-y-full mb-2 ${
          tooltip.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{
          left: `${tooltip.x}px`,
          top: `${tooltip.y}px`,
        }}
      >
        <p className="font-bold border-b border-white/20 pb-1 mb-1">{tooltip.month || 'Metric Details'}</p>
        <p>Expenditure: ${tooltip.value.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Reports;
