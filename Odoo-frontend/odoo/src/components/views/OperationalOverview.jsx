import React from 'react';
import KPICard from '../common/KPICard';
import Table from '../common/Table';
import StatusBadge from '../common/StatusBadge';

const OperationalOverview = () => {
  const chartData = [
    { day: 'Mon', capacity: 65, demand: 80, height: '60%' },
    { day: 'Tue', capacity: 70, demand: 90, height: '75%' },
    { day: 'Wed', capacity: 95, demand: 100, height: '85%' },
    { day: 'Thu', capacity: 60, demand: 70, height: '65%' },
    { day: 'Fri', capacity: 80, demand: 85, height: '90%' },
    { day: 'Sat', capacity: 85, demand: 95, height: '70%' },
    { day: 'Sun', capacity: 90, demand: 100, height: '100%' },
  ];

  const recentTripsColumns = [
    {
      title: 'Trip ID',
      key: 'id',
      render: (value) => <span className="font-label-md text-label-md font-bold text-primary">{value}</span>
    },
    {
      title: 'Vehicle / Driver',
      key: 'vehicle',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary-fixed flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
          </div>
          <div>
            <p className="font-body-md text-body-md font-bold">{row.vehicle}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">{row.driver}</p>
          </div>
        </div>
      )
    },
    {
      title: 'Route',
      key: 'route',
      render: (value, row) => (
        <div className="flex flex-col">
          <span className="font-body-md text-body-md">{row.origin}</span>
          <span className="text-outline text-[12px] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            {row.destination}
          </span>
        </div>
      )
    },
    {
      title: 'Departure',
      key: 'departure',
      render: (value) => <span className="font-body-md text-body-md text-on-surface-variant">{value}</span>
    },
    {
      title: 'Status',
      key: 'status',
      render: (value, row) => <StatusBadge status={row.status} label={row.label} />
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <button className="text-primary font-body-md text-body-md font-semibold hover:underline md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          Track Details
        </button>
      )
    }
  ];

  const recentTripsData = [
    { 
      id: '#TO-9842', 
      vehicle: 'Freightliner Cascadia', 
      driver: 'Michael Chen', 
      origin: 'Jersey City, NJ', 
      destination: 'Boston, MA', 
      departure: 'Oct 24, 08:30 AM', 
      status: 'completed', 
      label: 'On Schedule' 
    },
    { 
      id: '#TO-9841', 
      vehicle: 'Volvo VNL 860', 
      driver: 'Sarah Jenkins', 
      origin: 'Philadelphia, PA', 
      destination: 'Washington, DC', 
      departure: 'Oct 24, 09:15 AM', 
      status: 'inactive', 
      label: 'Idle' 
    },
    { 
      id: '#TO-9840', 
      vehicle: 'Peterbilt 579', 
      driver: 'Robert Ford', 
      origin: 'Newark, NJ', 
      destination: 'Albany, NY', 
      departure: 'Oct 24, 07:00 AM', 
      status: 'critical', 
      label: 'Delayed (Traffic)' 
    }
  ];

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">Operational Overview</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Real-time performance metrics across your fleet.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-unit-md py-2 rounded-lg border border-outline-variant bg-surface-container-lowest font-body-md text-body-md hover:bg-surface-container transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            Last 24 Hours
          </button>
          <button className="px-unit-md py-2 rounded-lg bg-primary text-white font-body-md text-body-md font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-sm active:scale-[0.98]">
            <span className="material-symbols-outlined text-[20px]">file_download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Grid Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Active Vehicles */}
        <KPICard
          title="Active Vehicles"
          value="1,284"
          icon="local_shipping"
          iconBgClass="bg-primary-fixed text-primary"
          trendText="+12%"
          trendType="success"
          subtext="from 1,146 yesterday"
        />

        {/* On-Time Rate */}
        <KPICard
          title="On-Time Rate"
          value="98.2%"
          icon="schedule"
          iconBgClass="bg-secondary-container text-on-secondary-container"
          trendText="Optimal"
          trendType="success"
          progressBar={98.2}
        />

        {/* Fuel Efficiency */}
        <KPICard
          title="Fuel Efficiency"
          value="8.4 mpg"
          icon="gas_meter"
          iconBgClass="bg-tertiary-fixed text-on-tertiary-fixed-variant"
          trendText="-2.4%"
          trendType="error"
          subtext="Avg. fleet consumption"
        />

        {/* Maintenance Alerts */}
        <KPICard
          title="Maintenance Alerts"
          value="07"
          valueColor="text-error"
          icon="warning"
          iconBgClass="bg-error-container text-error"
          subtext="3 critical items pending"
        />
      </section>

      {/* Fleet Status & Trends Bento Grid */}
      <section className="grid grid-cols-12 gap-gutter">
        {/* Capacity vs Demand Chart */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-unit-lg rounded-xl border border-outline-variant soft-shadow">
          <div className="flex justify-between items-center mb-unit-lg">
            <h3 className="font-title-md text-title-md text-on-background">Fleet Capacity vs Demand</h3>
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

          {/* Dynamic CSS Bar Chart */}
          <div className="h-64 relative w-full flex items-end gap-2 overflow-hidden px-4">
            {chartData.map((d, index) => (
              <div key={index} className="flex-1 bg-surface-container rounded-t-lg relative group" style={{ height: d.height }}>
                <div 
                  className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-700 group-hover:opacity-80" 
                  style={{ height: `${d.demand}%` }}
                ></div>
                <div 
                  className="absolute bottom-0 left-1/2 w-1/2 -translate-x-1/2 bg-secondary rounded-t-lg transition-all duration-700" 
                  style={{ height: `${d.capacity}%` }}
                ></div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4 text-on-surface-variant font-label-md text-label-md px-4">
            {chartData.map((d, i) => (
              <span key={i}>{d.day}</span>
            ))}
          </div>
        </div>

        {/* Live Distribution Map */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-unit-lg rounded-xl border border-outline-variant soft-shadow relative overflow-hidden group min-h-[300px]">
          <h3 className="font-title-md text-title-md mb-unit-lg relative z-10 text-on-background">Live Fleet Distribution</h3>
          <div className="absolute inset-0 z-0">
            <div 
              className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500 bg-cover bg-center" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCiprVW8bxhfUE-vL_vx6wKDCRSd5YLMfGDUzPh4UASoOj99lobF06vI5tAkhsNfNvOT236rJ0L6Klam8u4DDgf1X2TxyylAhy-pCkbb-zGXpoZp1YBT4o-sOthSl-N-SnnQDZkpMWnfN_kz9IVXjXLueJtkvUBtyMmxe7Smk_1gaXypP2TvuItmhpCfKoZPnSgc8oi4yUG791kp7HPJRAt6ziztzWEG9GHcAlwbq2ilsrlvzegBVw9IQ')" }}
              alt="New York distribution map interface"
            ></div>
          </div>
          <div className="absolute bottom-unit-md left-unit-md right-unit-md bg-white/90 backdrop-blur-md p-unit-md rounded-lg border border-outline-variant z-10 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-body-md text-body-md font-semibold text-on-surface">Tri-State Area</span>
              <span className="font-label-md text-label-md text-secondary font-bold">84 Vehicles Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trips Table */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant soft-shadow overflow-hidden flex flex-col">
        <div className="px-unit-lg py-unit-md border-b border-outline-variant flex justify-between items-center bg-white">
          <h3 className="font-title-md text-title-md text-on-background">Recent Trip Logs</h3>
          <div className="flex gap-2">
            <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>
        
        <Table 
          columns={recentTripsColumns} 
          data={recentTripsData} 
        />

        <div className="px-unit-lg py-4 bg-surface-container-lowest flex justify-between items-center border-t border-outline-variant">
          <span className="font-body-md text-body-md text-on-surface-variant">Showing 1-3 of 1,284 trips</span>
          <div className="flex gap-2">
            <button className="p-1.5 border border-outline-variant rounded hover:bg-surface-container transition-colors disabled:opacity-30" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="p-1.5 border border-outline-variant rounded hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Insights Footer Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {/* AI Optimization Insight */}
        <div className="p-unit-lg bg-inverse-surface text-inverse-on-surface rounded-xl flex items-center gap-6 overflow-hidden relative min-h-[160px]">
          <div className="flex-1 z-10">
            <h4 className="font-title-md text-title-md mb-2">AI Optimization Insight</h4>
            <p className="font-body-md text-body-md opacity-80">
              Rerouting 12 vehicles in the NE corridor could save 4.2% fuel costs today based on current traffic patterns.
            </p>
            <button className="mt-4 px-unit-md py-2 bg-primary-fixed text-primary font-bold rounded-lg hover:bg-white transition-colors">
              Apply Optimization
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
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">All API nodes and tracking sensors are operational.</p>
        </div>
      </section>
    </>
  );
};

export default OperationalOverview;
