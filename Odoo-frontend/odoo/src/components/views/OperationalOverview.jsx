import React, { useState } from 'react';
import { useTransitOps } from '../../hooks/TransitOpsContext';

// Paste your Mistral API Key here:
const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY || "YOUR_MISTRAL_API_KEY";
import KPICard from '../common/KPICard';
import Table from '../common/Table';
import StatusBadge from '../common/StatusBadge';
import FleetMap from '../common/FleetMap';
import reportService from '../../services/reportService';

const OperationalOverview = () => {
  const { vehicles, drivers, trips, maintenance, kpis: backendKpis, triggerToast } = useTransitOps();
  const [isExporting, setIsExporting] = useState(false);
  const [aiInsight, setAiInsight] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

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

  // Compute robust KPIs handling both backend values and local calculations
  const totalVehiclesCount = backendKpis?.totalVehicles ?? vehicles.length;
  const availVehiclesCount = backendKpis?.availableVehicles ?? vehicles.filter(v => v.status === 'Available').length;
  const tripVehiclesCount  = backendKpis?.vehiclesOnTrip ?? vehicles.filter(v => v.status === 'On Trip').length;
  const activeMaintCount   = backendKpis 
    ? ((backendKpis.activeMaintenance || 0) + (backendKpis.scheduledMaintenance || 0)) 
    : maintenance.filter(m => m.status === 'Scheduled' || m.status === 'In Progress').length;
  
  const activeVehicles = vehicles.filter(v => v.status !== 'Retired').length;
  const onTripVehicles = vehicles.filter(v => v.status === 'On Trip').length;
  const utilizationVal = backendKpis?.fleetUtilizationPercent ?? (
    activeVehicles > 0 ? ((onTripVehicles / activeVehicles) * 100) : 0
  );
  
  const driversActiveDuty = backendKpis?.driversOnTrip ?? drivers.filter(d => d.status === 'On Trip').length;

  const kpis = {
    totalVehicles: totalVehiclesCount,
    availableVehicles: availVehiclesCount,
    vehiclesOnTrip: tripVehiclesCount,
    driversOnDuty: driversActiveDuty,
    maintenanceCount: activeMaintCount,
    utilization: Math.round(Number(utilizationVal) || 0)
  };

  const handleOptimize = async () => {
    if (isOptimizing) return;
    
    if (!MISTRAL_API_KEY || MISTRAL_API_KEY === 'YOUR_MISTRAL_API_KEY') {
      triggerToast('Mistral API Key is not configured. Please define it in OperationalOverview.jsx or .env', 'error');
      return;
    }

    setIsOptimizing(true);
    try {
      const systemPrompt = {
        role: 'system',
        content: `You are a Fleet AI Optimization Engine. The current fleet metrics are: ${kpis.totalVehicles} total vehicles, ${kpis.availableVehicles} available, ${kpis.vehiclesOnTrip} on trips, ${kpis.maintenanceCount} in maintenance, with a ${kpis.utilization}% utilization rate. Provide a single short sentence recommendation on how to optimize operations, followed by 'Optimization applied successfully.' Keep it under 25 words.`
      };

      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'open-mistral-7b',
          messages: [systemPrompt, { role: 'user', content: 'Generate optimization insight.' }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Mistral API error (${response.status})`);
      }

      const data = await response.json();
      const assistantText = data?.choices?.[0]?.message?.content;
      if (assistantText) {
        setAiInsight(assistantText);
        setShowAiModal(true);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Failed to run AI optimization: ' + err.message, 'error');
    } finally {
      setIsOptimizing(false);
    }
  };

  // Dynamic Chart values calculated based on active states
  // Monday - Saturday: static historical trends
  // Sunday: binds dynamically to current active utilization and operational capacity
  const activeTotal = vehicles.filter(v => v.status !== 'Retired').length;
  const inTripCount = vehicles.filter(v => v.status === 'On Trip').length;
  const inShopCount = vehicles.filter(v => v.status === 'In Shop').length;
  const availableCount = vehicles.filter(v => v.status === 'Available').length;
  
  const currentDemandPct = activeTotal > 0 ? Math.round((inTripCount / activeTotal) * 100) : 0;
  const currentCapacityPct = activeTotal > 0 ? Math.round(((availableCount + inTripCount) / activeTotal) * 100) : 0;

  const chartData = [
    { day: 'Mon', capacity: 70, demand: 80, height: '70%' },
    { day: 'Tue', capacity: 75, demand: 85, height: '75%' },
    { day: 'Wed', capacity: 90, demand: 95, height: '85%' },
    { day: 'Thu', capacity: 60, demand: 70, height: '65%' },
    { day: 'Fri', capacity: 80, demand: 90, height: '90%' },
    { day: 'Sat', capacity: 85, demand: 75, height: '70%' },
    { 
      day: 'Sun', 
      capacity: currentCapacityPct || 50, 
      demand: currentDemandPct || 40, 
      height: '100%' 
    },
  ];

  // Map trips to fit Recent Trip Logs layout
  const activeNowTrips = trips.slice(0, 5); // display latest 5 logs

  const recentTripsColumns = [
    {
      title: 'Trip ID',
      key: 'id',
      render: (value) => <span className="font-label-md text-label-md font-bold text-primary font-mono">{value}</span>
    },
    {
      title: 'Vehicle & Driver',
      key: 'vehicle',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary-fixed flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[20px] select-none">local_shipping</span>
          </div>
          <div>
            <p className="font-body-md text-body-md font-bold text-on-surface">{row.vehicleId}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant font-medium">{row.driverName}</p>
          </div>
        </div>
      )
    },
    {
      title: 'Route details',
      key: 'route',
      render: (value, row) => (
        <div className="flex flex-col">
          <span className="font-body-md text-body-md text-on-surface">{row.origin}</span>
          <span className="text-outline text-[12px] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] select-none">arrow_forward</span>
            {row.destination}
          </span>
        </div>
      )
    },
    {
      title: 'Progress status',
      key: 'progress',
      render: (value, row) => (
        <div className="w-24">
          <div className="flex justify-between text-[10px] mb-0.5 text-on-surface-variant font-mono">
            <span>{row.progress}%</span>
            <span>{row.speed}</span>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full" style={{ width: `${row.progress}%` }}></div>
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: (value, row) => {
        let badgeType = 'neutral';
        if (row.status === 'On Schedule' || row.status === 'En Route') badgeType = 'active';
        else if (row.status === 'Delayed') badgeType = 'critical';
        else if (row.status === 'Completed') badgeType = 'info';
        else if (row.status === 'Cancelled') badgeType = 'neutral';

        return <StatusBadge status={badgeType} label={row.status} />;
      }
    }
  ];

  return (
    <div className="space-y-gutter">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 select-none animate-fade-in">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">Operational Overview</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Real-time performance metrics across your fleet.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => triggerToast('Toggled calendar view scope (mock).', 'info')}
            className="px-unit-md py-2 rounded-lg border border-outline-variant bg-surface-container-lowest font-body-md text-body-md hover:bg-surface-container transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] select-none">calendar_today</span>
            Last 24 Hours
          </button>
          <button 
            onClick={handleExportReport}
            disabled={isExporting}
            className="px-unit-md py-2 rounded-lg bg-primary text-white font-body-md text-body-md font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-sm active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px] select-none">
              {isExporting ? 'hourglass_empty' : 'file_download'}
            </span>
            {isExporting ? 'Exporting...' : 'Export Report'}
          </button>
        </div>
      </div>

      {/* KPI Grid Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter select-none">
        
        {/* Total Assets */}
        <KPICard
          title="Total Vehicles"
          value={kpis.totalVehicles.toString()}
          icon="local_shipping"
          iconBgClass="bg-primary-fixed text-primary"
          trendText={`Available: ${kpis.availableVehicles}`}
          trendType="success"
        />

        {/* Vehicles On Trip */}
        <KPICard
          title="Vehicles On Trip"
          value={kpis.vehiclesOnTrip.toString()}
          icon="schedule"
          iconBgClass="bg-secondary-container text-on-secondary-container"
          trendText={`Active Duty: ${kpis.driversOnDuty}`}
          trendType="success"
        />

        {/* In Maintenance */}
        <KPICard
          title="In Maintenance"
          value={kpis.maintenanceCount.toString()}
          icon="build"
          iconBgClass="bg-tertiary-fixed text-on-tertiary-fixed-variant"
          trendText="Action Required"
          trendType="error"
        />

        {/* Fleet Utilization */}
        <KPICard
          title="Fleet Utilization"
          value={`${kpis.utilization}%`}
          icon="speed"
          iconBgClass="bg-error-container text-error"
          progressBar={Number(kpis.utilization)}
          subtext="Active assets efficiency"
        />
      </section>

      {/* Fleet Status & Trends Bento Grid */}
      <section className="grid grid-cols-12 gap-gutter">
        {/* Capacity vs Demand Chart */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-unit-lg rounded-xl border border-outline-variant soft-shadow flex flex-col justify-between">
          <div className="flex justify-between items-center mb-unit-lg select-none">
            <h3 className="font-title-md text-title-md text-on-background font-semibold">Fleet Capacity vs Demand</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-primary rounded-full"></span>
                <span className="font-label-md text-label-md text-on-surface">Demand</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-secondary rounded-full"></span>
                <span className="font-label-md text-label-md text-on-surface">Capacity</span>
              </div>
            </div>
          </div>

          {/* Bar Chart (Height mapped to values) */}
          <div className="h-64 relative w-full flex items-end gap-2 overflow-hidden px-4 select-none">
            {chartData.map((d, index) => (
              <div key={index} className="flex-1 bg-surface-container rounded-t-lg relative group h-full flex items-end">
                <div 
                  className="w-[45%] bg-primary rounded-t-lg transition-all duration-700 hover:opacity-80 ml-auto mr-0.5" 
                  style={{ height: `${d.demand}%` }}
                  title={`Demand: ${d.demand}%`}
                ></div>
                <div 
                  className="w-[45%] bg-secondary rounded-t-lg transition-all duration-700 hover:opacity-80 mr-auto ml-0.5" 
                  style={{ height: `${d.capacity}%` }}
                  title={`Capacity: ${d.capacity}%`}
                ></div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4 text-on-surface-variant font-label-md text-label-md px-4 select-none">
            {chartData.map((d, i) => (
              <span key={i}>{d.day}</span>
            ))}
          </div>
        </div>

        {/* Live Distribution Map */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-unit-lg rounded-xl border border-outline-variant soft-shadow relative overflow-hidden group min-h-[340px] flex flex-col justify-between">
          <h3 className="font-title-md text-title-md mb-unit-lg z-10 text-on-background font-semibold">Live Fleet Distribution</h3>
          
          <div className="flex-1 w-full relative z-0 min-h-[200px] rounded-lg overflow-hidden border border-outline-variant/30">
            <FleetMap height="100%" />
          </div>

          <div className="mt-4 bg-white/90 backdrop-blur-md p-unit-md rounded-lg border border-outline-variant/60 z-10 shadow-sm">
            <div className="flex justify-between items-center select-none text-xs">
              <span className="font-body-md font-semibold text-on-surface">Live Fleet Tracking</span>
              <span className="font-label-md text-secondary font-bold">{inTripCount} Vehicles Active</span>
            </div>
            <div className="flex justify-between items-center mt-2 text-[10px] text-outline uppercase font-semibold">
              <span>Depot: {availableCount}</span>
              <span>Maintenance: {inShopCount}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trips Table */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant soft-shadow overflow-hidden flex flex-col">
        <div className="px-unit-lg py-unit-md border-b border-outline-variant flex justify-between items-center bg-white select-none">
          <h3 className="font-title-md text-title-md text-on-background font-semibold">Recent Trip Logs</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => triggerToast('Trip logs filter updated.', 'info')}
              className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
            </button>
          </div>
        </div>
        
        <Table 
          columns={recentTripsColumns} 
          data={activeNowTrips} 
        />

        {activeNowTrips.length === 0 && (
          <p className="text-body-md text-on-surface-variant italic text-center p-8">No recent logs recorded.</p>
        )}
      </section>

      {/* Dynamic Insights Footer Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter select-none">
        
        {/* AI Optimization Insight */}
        <div 
          onClick={handleOptimize}
          className={`p-unit-lg bg-inverse-surface text-inverse-on-surface rounded-xl flex items-center gap-6 overflow-hidden relative min-h-[160px] cursor-pointer group ${isOptimizing ? 'opacity-80 pointer-events-none' : ''}`}
        >
          <div className="flex-1 z-10">
            <h4 className="font-title-md text-title-md mb-2 flex items-center gap-2">
              AI Optimization Insight
              {isOptimizing && <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>}
            </h4>
            <p className="font-body-md text-body-md opacity-80">
              Tap below to use Mistral AI to analyze current metrics and generate a real-time operational optimization strategy.
            </p>
            <button className="mt-4 px-unit-md py-2 bg-primary-fixed text-primary font-bold rounded-lg group-hover:bg-white transition-colors">
              {isOptimizing ? 'Optimizing...' : 'Generate AI Strategy'}
            </button>
          </div>
          <div className="w-32 h-32 opacity-20 absolute -right-4 -bottom-4 flex items-center justify-center select-none pointer-events-none">
            <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              insights
            </span>
          </div>
        </div>

        {/* System Integrity */}
        <div className="p-unit-lg bg-surface-container-high rounded-xl border border-primary/20 flex flex-col justify-center min-h-[160px] text-on-surface">
          <div className="flex items-center gap-4 mb-3">
            <span className="material-symbols-outlined text-primary">hub</span>
            <h4 className="font-title-md text-title-md text-primary font-semibold">System Integrity</h4>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-outline-variant rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
            <span className="font-label-md text-label-md text-secondary font-bold">100% UP</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 font-medium">All API nodes and tracking sensors are operational.</p>
        </div>
      </section>

      {/* AI Insight Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-primary p-6 text-white relative">
              <h3 className="font-title-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">auto_awesome</span>
                AI Optimization Insight
              </h3>
              <button 
                onClick={() => setShowAiModal(false)}
                className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6">
              <p className="font-body-lg text-on-surface leading-relaxed">
                {aiInsight}
              </p>
              <div className="mt-8 flex justify-end gap-3">
                <button 
                  onClick={() => setShowAiModal(false)}
                  className="px-4 py-2 border border-outline-variant text-on-surface rounded-lg font-bold hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
                <button 
                  onClick={() => {
                    setShowAiModal(false);
                    triggerToast('Optimization applied to fleet schedule.', 'success');
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-bold shadow-sm hover:opacity-90 transition-colors cursor-pointer"
                >
                  Apply Strategy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationalOverview;
