import React, { useState } from 'react';
import KPICard from '../common/KPICard';
import Table from '../common/Table';
import StatusBadge from '../common/StatusBadge';

const Vehicles = () => {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Assets' },
    { id: 'long_haul', label: 'Long Haul' },
    { id: 'regional', label: 'Regional' },
    { id: 'electric', label: 'Electric' },
  ];

  const vehiclesColumns = [
    {
      title: 'Vehicle Details',
      key: 'details',
      render: (value, row) => (
        <div className="flex items-center gap-4">
          <div className="w-16 h-10 rounded-lg overflow-hidden bg-surface-container flex-shrink-0 border border-outline-variant">
            <img className="w-full h-full object-cover" src={row.image} alt={row.name} />
          </div>
          <div>
            <p className="font-title-md text-on-surface font-semibold">{row.name}</p>
            <p className="text-label-md text-on-surface-variant font-medium uppercase">{row.idCode} • VIN: {row.vin}</p>
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: (value, row) => {
        // Map vehicle status into status badges
        let mappedStatus = 'info';
        if (row.status === 'Active') mappedStatus = 'active';
        else if (row.status === 'Maintenance') mappedStatus = 'warning';
        else if (row.status === 'Charging') mappedStatus = 'neutral';
        
        return <StatusBadge status={mappedStatus} label={row.status} />;
      }
    },
    {
      title: 'Assigned Driver',
      key: 'driver',
      render: (value, row) => {
        if (!row.driver) {
          return <span className="text-body-md text-on-surface-variant italic">Unassigned</span>;
        }

        const initials = row.driver.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        
        // Dynamic initials badge background styling
        const badgeBg = row.id % 2 === 0 
          ? 'bg-secondary-fixed text-on-secondary-fixed' 
          : 'bg-primary-fixed text-primary';

        return (
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${badgeBg}`}>
              {initials}
            </div>
            <span className="text-body-md text-on-surface">{row.driver}</span>
          </div>
        );
      }
    },
    {
      title: 'Efficiency',
      key: 'efficiency',
      render: (value, row) => {
        let barColor = 'bg-primary';
        if (row.efficiencyLabel === 'Optimal') barColor = 'bg-secondary';
        else if (row.efficiencyLabel === 'Low') barColor = 'bg-tertiary';

        return (
          <div className="w-full max-w-[100px]">
            <div className="flex justify-between text-label-sm mb-1 text-on-surface-variant font-medium">
              <span>{row.efficiency}%</span>
              <span>{row.efficiencyLabel}</span>
            </div>
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className={`h-full ${barColor}`} style={{ width: `${row.efficiency}%` }}></div>
            </div>
          </div>
        );
      }
    },
    {
      title: 'Last Service',
      key: 'lastService',
      render: (value, row) => {
        const isOverdue = row.serviceStatus === 'overdue';
        return (
          <div>
            <p className={`text-body-md font-semibold ${isOverdue ? 'text-error font-bold' : 'text-on-surface'}`}>
              {isOverdue ? 'Overdue' : row.lastServiceDate}
            </p>
            <p className={`text-label-sm ${isOverdue ? 'text-error' : 'text-on-surface-variant'}`}>
              {row.nextServiceText}
            </p>
          </div>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      )
    }
  ];

  const vehiclesData = [
    {
      id: 1,
      name: 'Volvo FH Electric',
      idCode: 'UNIT-0942',
      vin: '4V4NC9EJ',
      status: 'Active',
      driver: 'Marcus Sterling',
      efficiency: 92,
      efficiencyLabel: 'Optimal',
      lastServiceDate: 'Oct 12, 2023',
      nextServiceText: 'Next: 2,400 mi',
      serviceStatus: 'good',
      type: 'electric',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVpFHwmJhdmEzH3dbOHRgE47wwGW3b-lb-dJ1xGOlEWlDJYZSeOqNQNEi4VqPMgMatSCbFrKwlUYs-2KXenAdwMAN7CIJtdTeOews2cAHWUzHwuf2KQHvzdAYtY2wCwIm4NeIj_Jdn0lLiLJMDQKR-Dj94ESx8ri0FOeDnWydBexhkWgtfbOSvFk1b3D3IjV1tZciNlBLgf5pZE7VBJPKdq8BsRocwFZRk6Xhdha5FVkeBX96_U04QWw'
    },
    {
      id: 2,
      name: 'Mercedes Sprinter',
      idCode: 'UNIT-1108',
      vin: '1CD7Y3R9',
      status: 'Maintenance',
      driver: null,
      efficiency: 45,
      efficiencyLabel: 'Low',
      lastServiceDate: '',
      nextServiceText: '5 days past due',
      serviceStatus: 'overdue',
      type: 'regional',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcPO_aDS7yPjGq2ZbzzHQcAXA0RRxG8xxml-lgM47st9DASIqlghQQLafqe_Ak6X3eKbEsqhrsSFMUJYYneFUVdBd95ucpKYaHW4aegU69HSVxrxfotlD4_AUAW3XK-DVAKtsshExskxJBYve-ka1QoCX2XedGkwJyqT8xotfSAAvWXyJZV2YZcxClUwtCoid9axqLowoybGVU7hnfmfCuFGR9XV9glnOGS9T0BdvNdpj_rCUohJ5hkw'
    },
    {
      id: 3,
      name: 'Peterbilt 579',
      idCode: 'UNIT-0761',
      vin: '2G1WC5EK',
      status: 'Active',
      driver: 'Anita Wright',
      efficiency: 78,
      efficiencyLabel: 'Good',
      lastServiceDate: 'Nov 02, 2023',
      nextServiceText: 'Next: 12,100 mi',
      serviceStatus: 'good',
      type: 'long_haul',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3Q6E5pZHaxVBPZLaJSqgfdEkWaD8joVrIT151dAD0Yi7MhGklvZhf-Q6DnC_TOidEyNIcc5a3fPQ4LfiXSt-1ezhuNm7J4XgD2FXcsn593xu-bj-0SY1UdYyysBEi03caEZEgKIX1mdeZPdGVIfqoT8O9UoRbaZm4amZ57sZv2nA17drQ33B6rlh7HqPHfUUobTQe2HoqDd8lMnEA-C7CY8_shFnI9zmnL3XB2E9AbQEpFXCdmFTGZg'
    },
    {
      id: 4,
      name: 'Rivian EDV 700',
      idCode: 'UNIT-1422',
      vin: '5YJ3E1EA',
      status: 'Charging',
      driver: 'David Park',
      efficiency: 98,
      efficiencyLabel: 'Excel',
      lastServiceDate: 'Oct 28, 2023',
      nextServiceText: 'Next: 4,500 mi',
      serviceStatus: 'good',
      type: 'electric',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4ZBTxy1Uj-CO6PIv6sLgi3dvd461N8ozstd_tJWw0MYHFc0Q6YTcxOCr72RvAHx4y-ic-2bjAXJb___DZxMW4jwxsjWNfxZTfiicTotbmOLG6xUJUhe0dZmRySRixJvJenoY5NfU4zu25SCvuSSyS3bISmaUZ0ZS3Pqpcj0Q-1GEBq59t9_bfW1-CvWlrAvLowf3VmjmFFkLdSgfth054sb2eLgmF0RamiVVYjLl_V6bm5VokInP4iw'
    }
  ];

  // Filter vehicles based on active tab
  const filteredVehicles = activeTab === 'all'
    ? vehiclesData
    : vehiclesData.filter(v => v.type === activeTab);

  return (
    <div className="space-y-gutter">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Fleet Assets</h2>
          <p className="text-body-lg text-on-surface-variant">Manage and monitor 128 active transit vehicles across your logistics network.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-unit-md py-2 flex items-center gap-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined select-none">file_download</span>
            Export Data
          </button>
          <button className="px-unit-md py-2 flex items-center gap-2 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 active:scale-[0.98] transition-all soft-shadow">
            <span className="material-symbols-outlined select-none">add</span>
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Dashboard Stats Summary */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Total Assets */}
        <KPICard 
          title="Total Assets"
          value="142"
          icon="local_shipping"
          iconBgClass="bg-primary-fixed text-primary"
          trendText="+12% vs last mo"
          trendType="success"
        />

        {/* Operational */}
        <KPICard 
          title="Operational"
          value="131"
          icon="check_circle"
          iconBgClass="bg-secondary-container text-on-secondary-container"
          trendText="96.4% uptime"
          trendType="info"
        />

        {/* In Maintenance */}
        <KPICard 
          title="In Maintenance"
          value="7"
          icon="build"
          iconBgClass="bg-tertiary-fixed text-on-tertiary-fixed"
          trendText="4 Critical"
          trendType="error"
        />

        {/* Average Efficiency */}
        <KPICard 
          title="Avg Efficiency"
          value="8.4"
          icon="speed"
          iconBgClass="bg-surface-variant text-primary"
          trendText="Optimal"
          trendType="success"
          subtext="mi/gal"
        />
      </section>

      {/* Asset Table Section */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant soft-shadow overflow-hidden">
        {/* Table Filters header */}
        <div className="p-4 border-b border-outline-variant flex flex-wrap gap-4 items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-body-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-surface-container-high text-primary font-semibold border border-primary-fixed'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-px bg-outline-variant"></div>
            <button className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined select-none">filter_list</span>
              <span className="font-body-md">Filters</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <Table 
          columns={vehiclesColumns} 
          data={filteredVehicles} 
          emptyMessage="No vehicles matching the filter found"
        />

        {/* Pagination footer */}
        <div className="p-4 border-t border-outline-variant flex items-center justify-between bg-surface-container-low/50">
          <p className="text-body-md text-on-surface-variant">
            Showing <span className="font-bold text-on-surface">1-{filteredVehicles.length}</span> of 142 vehicles
          </p>
          
          <div className="flex items-center gap-2">
            <button className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-50 transition-colors" disabled>
              <span className="material-symbols-outlined select-none text-[18px]">chevron_left</span>
            </button>
            <button className="w-10 h-10 bg-primary text-on-primary rounded-lg font-bold">1</button>
            <button className="w-10 h-10 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container transition-colors">2</button>
            <button className="w-10 h-10 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container transition-colors">3</button>
            <span className="px-2 text-on-surface-variant">...</span>
            <button className="w-10 h-10 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container transition-colors">12</button>
            <button className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined select-none text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Bento section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Live Map Panel */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant soft-shadow overflow-hidden min-h-[320px] relative group">
          <div className="absolute top-4 left-4 z-10 bg-surface/90 backdrop-blur px-4 py-2 rounded-lg border border-outline-variant shadow-sm">
            <p className="text-label-md font-bold text-on-surface">Live Fleet Map</p>
            <p className="text-label-sm text-on-surface-variant">Active deployments in Chicago North</p>
          </div>
          <div className="w-full h-full bg-surface-container-highest">
            <img 
              className="w-full h-full object-cover opacity-80 grayscale hover:grayscale-0 transition-all duration-500" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_IE4CXgAHHXi_lzFvt_VWCnh34n-izFjDnzKpFhEYjkMRad0ub-nX9TYiO_MOr4lAa9MtNgwwB5u6jGUkXmVpIx-2KujNtj87R_O67HrKPlTdQ9GpytjJQpAq6jfb46RNNHukMedTTO_hqo3yXPpJsszLegC1SR4Ge5ryXcJxoEAtT5KAlEVfjJnfp2-I14pb1S9OQ8BX7M4p18ObJn0fttN0NUxCPmgZsijIHI5Xb7ycPVCSgMvpYg" 
              alt="Chicago deployment map"
            />
          </div>
        </div>

        {/* Health tasks side panel */}
        <div className="bg-surface-container-lowest p-unit-md rounded-xl border border-outline-variant soft-shadow flex flex-col justify-between">
          <h3 className="font-title-md text-on-surface font-semibold mb-2">Fleet Health Tasks</h3>
          <div className="space-y-3 flex-1 overflow-y-auto">
            {/* Task 1 */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-error-container/20 border border-error/10">
              <span className="material-symbols-outlined text-error mt-0.5">warning</span>
              <div>
                <p className="text-body-md font-bold text-on-surface">Tire Pressure Alert</p>
                <p className="text-label-md text-on-surface-variant mt-0.5">UNIT-0942 (Volvo FH) reports low pressure in rear axle 2.</p>
                <button className="mt-2 text-primary font-semibold text-label-md hover:underline">Route to Service</button>
              </div>
            </div>

            {/* Task 2 */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant">
              <span className="material-symbols-outlined text-primary mt-0.5">info</span>
              <div>
                <p className="text-body-md font-bold text-on-surface">Scheduled Maintenance</p>
                <p className="text-label-md text-on-surface-variant mt-0.5">3 regional units are due for 50k mile inspection this week.</p>
                <button className="mt-2 text-primary font-semibold text-label-md hover:underline">View Schedule</button>
              </div>
            </div>

            {/* Task 3 */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant">
              <span className="material-symbols-outlined text-secondary mt-0.5">eco</span>
              <div>
                <p className="text-body-md font-bold text-on-surface">Efficiency Report</p>
                <p className="text-label-md text-on-surface-variant mt-0.5">Your fleet's CO2 emissions decreased by 4% this month.</p>
                <button className="mt-2 text-primary font-semibold text-label-md hover:underline">Download Report</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Vehicles;
