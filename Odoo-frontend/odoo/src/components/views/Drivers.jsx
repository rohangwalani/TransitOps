import React, { useState } from 'react';
import KPICard from '../common/KPICard';
import Table from '../common/Table';
import StatusBadge from '../common/StatusBadge';

const Drivers = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('safety_desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const driversData = [
    {
      id: 1,
      name: 'Marcus Thorne',
      role: 'Lead Hauler',
      experience: 8,
      idCode: '#TR-9021',
      status: 'ON DUTY',
      safetyScore: 98,
      licenseName: 'Class A CDL',
      licenseExpiry: 'Exp. 2026',
      serviceStatus: 'good',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMb_UcKahH3ukZWQJS0ThnKXtZRqES0dPxb7SZPn3V3sdo4Ggn4CrUtFkAvgGEB8JoWYuvml3VtTdlQXY8cneu1YaowSN-W79NLtHZCVBxnl0am-ryQ1PrugLWYIE1RN8XOlYwgkg_Fty4DP3dbjojpe88wco2UjZ-wipDw7WzIsWrWbDJIfrA1Eh7L9rm3sEZkNwpWkC2JMPckcwbpgDvWKJcL9IVSVAHQMKvDnMzd04gDuKVuxLqQA'
    },
    {
      id: 2,
      name: 'Elena Sokolov',
      role: 'Cargo Specialist',
      experience: 4,
      idCode: '#TR-4452',
      status: 'RESTING',
      safetyScore: 92,
      licenseName: 'HazMat Cert',
      licenseExpiry: 'Exp. 2025',
      serviceStatus: 'good',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmCBnnvRQl-0u02hj133IPPTFP-pTiivjqi0JS2H0auZeK7Qb8UhG420MOX0cu7xiF6dz9XNpIye278MmdoPqm856vo6dcb_gmgMs_bhy6ccEOcu1TMOD9j6TDS2egX1AEGBaIfDZp2sleQc9_E70YMfJeItjqgHi9WV81rRsLmofQFkjWXc-FgWWDWhDjZtdZM4f6mSWI5Nur7aKPG0IwETat-Kad_QQP2gr9KxgdcWIaSWAhCyGB1A'
    },
    {
      id: 3,
      name: 'Jackson Wu',
      role: 'Fleet Driver',
      experience: 2,
      idCode: '#TR-1102',
      status: 'LICENSE ALERT',
      safetyScore: 78,
      licenseName: 'License Expired',
      licenseExpiry: '3 days ago',
      serviceStatus: 'expired',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDS_seARgL-0117o1DowHI36Y7FEnIK3DYeFrREURmN1Ejm2kbvMs4tWtmunzMqKwuerilOJVPEifi02i6zCGKQLIWboumryNvKkYbik3V4EN1hZx_znLHWpyBZRGrVZSY4AS2j8wMUindsLSuWGBcnz1ltQ_6clM61lr9dx8SMUOjrB68OHJOkQAHEpBdV8h2uto86Z0BdeTsdfuffUbXh5U7uugMU20TfT921uBN2JvKNYMbNFLC2MQ'
    },
    {
      id: 4,
      name: 'Sarah Jenkins',
      role: 'Regional Manager',
      experience: 15,
      idCode: '#TR-5529',
      status: 'ON DUTY',
      safetyScore: 95,
      licenseName: 'Class A CDL',
      licenseExpiry: 'Exp. 2027',
      serviceStatus: 'good',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEqUDg3EE4FRsLIbpcCBCh0GlHs2Oy5VLn-K8lFc-OCynMK8BGFfZ5Tlj44pjhDCLR30-fGWZbcYlPYgKqK8N9uLo_DqS6w3POrR70jGlXE7y9LlgWkPuKQmBaHxkUT7y3AR4ZxLwBn-ln77QGpXpk_SClanye6wmOjs3O9ZvuOXY-yhmvCkhyjuC8L9MyloWQ0bEcKdcEx9PA-VQi4GD1YzQQWiekR7mEQXuWOZ3dcpoLTxGVnXTrPw'
    },
    {
      id: 5,
      name: 'Leo Martinez',
      role: 'Last Mile Expert',
      experience: 3,
      idCode: '#TR-6782',
      status: 'OFF DUTY',
      safetyScore: 89,
      licenseName: 'Class B CDL',
      licenseExpiry: 'Exp. 2024',
      serviceStatus: 'good',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHLKIhWSkaa_1U5wya5hyMtvmf9nXoqAHgaD5MeY9quYjkyHWN-Kd2AbldXVyVQbNclYQKqFDfAZqCcO93Bkr1UE7vqSsgXnQ_kPHi1eT3jSGjgWlhQyIf1WoFXfgP4hvxZdRr-TCWbJwq-073DBesBs27xukwIDPeWtA1St1EznFBBszPuTCAzTZvSRZDvUX1qN7AGU5yYi3cfrWjDVdgmMGdxvxSeeQ27NZOmWV0pNVmtvoP24r_VA'
    },
    {
      id: 6,
      name: 'David Chen',
      role: 'Heavy Duty Operator',
      experience: 6,
      idCode: '#TR-3391',
      status: 'ON DUTY',
      safetyScore: 91,
      licenseName: 'Class A CDL',
      licenseExpiry: 'Exp. 2026',
      serviceStatus: 'good',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkPF3E6AfjS-V6AHGa6jK5fY5JnMulOdWBJZlVm0oC0VS8UopgOPPCXxe2W-XcmesfEDrd1bLxwkRgHfI-v2SokgE-72W1EDVa1w_DQ38Wx6en9gjj91cKk_u-m65SGW23daS8kchTTTS14HjeGZ495TFPm9eFSNZ44cURDSiigLLrONZPkTp7_Nz-g8qlfujKn9gtStC6l0ZiILd0NXi9VtbWmr4YJSxbXBcQjUW-kogeqoB8E62fpw'
    },
    {
      id: 7,
      name: 'Rachel Adams',
      role: 'Logistics Driver',
      experience: 10,
      idCode: '#TR-2281',
      status: 'OFF DUTY',
      safetyScore: 96,
      licenseName: 'Class A CDL',
      licenseExpiry: 'Exp. 2025',
      serviceStatus: 'good',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVh8Po5iWCUyHA6tXUuAd6KtZ9rra7Dgfbg8ZM8JphWI5HEvBWnya6xz4tfvjmJB8SSdO6S6T8-Wntcc-hZtNXGjoHVwE0SteSzJ_O6L6xJQZHVc_scrVIh3dDsgn-q43i8gqQJDXDeRVPh4WSbx1wVqgSL85cYershMVRUXsixmCDtQdd6TEDIIQtTbxntwFo8CACg26sb8OYR9uYhHApcUnzNyKLoTIsoREuJ8k2H35oS-VjxwwvgA'
    },
    {
      id: 8,
      name: 'New Hire Pending',
      role: 'Awaiting Documentation',
      experience: 0,
      idCode: '#TR-9901',
      status: 'ONBOARDING',
      safetyScore: null,
      licenseName: 'Verifying...',
      licenseExpiry: '',
      serviceStatus: 'pending',
      image: null
    }
  ];

  // Filters & Sorting logic
  const filteredDrivers = driversData.filter(driver => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'On Duty') return driver.status === 'ON DUTY';
    if (statusFilter === 'Off Duty') return driver.status === 'OFF DUTY' || driver.status === 'RESTING';
    if (statusFilter === 'Medical Leave') return driver.status === 'MEDICAL LEAVE';
    return true;
  });

  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
    if (sortOrder === 'safety_desc') {
      return (b.safetyScore || 0) - (a.safetyScore || 0);
    }
    if (sortOrder === 'safety_asc') {
      return (a.safetyScore || 100) - (b.safetyScore || 100);
    }
    if (sortOrder === 'seniority') {
      return b.experience - a.experience;
    }
    return 0;
  });

  // Table structure columns (if in list mode)
  const listColumns = [
    {
      title: 'Driver Details',
      key: 'name',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img className="w-10 h-10 rounded-full object-cover" src={row.image} alt={row.name} />
          ) : (
            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold">
              <span className="material-symbols-outlined">person</span>
            </div>
          )}
          <div>
            <p className="font-semibold text-on-surface">{row.name}</p>
            <p className="text-xs text-on-surface-variant">{row.role} • ID: {row.idCode}</p>
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: (value) => {
        let badgeType = 'info';
        if (value === 'ON DUTY') badgeType = 'active';
        else if (value === 'RESTING' || value === 'OFF DUTY') badgeType = 'neutral';
        else if (value === 'LICENSE ALERT') badgeType = 'critical';
        else if (value === 'ONBOARDING') badgeType = 'warning';
        
        return <StatusBadge status={badgeType} label={value} />;
      }
    },
    {
      title: 'Safety Score',
      key: 'safetyScore',
      render: (value) => (
        value !== null ? (
          <div className="flex items-center gap-2">
            <span className={`font-bold ${value >= 90 ? 'text-secondary' : value >= 80 ? 'text-primary' : 'text-tertiary'}`}>
              {value} / 100
            </span>
          </div>
        ) : (
          <span className="text-outline">--</span>
        )
      )
    },
    {
      title: 'License Status',
      key: 'licenseName',
      render: (value, row) => {
        const isExpired = row.serviceStatus === 'expired';
        return (
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined text-[18px] ${isExpired ? 'text-error' : 'text-outline'}`}>
              {isExpired ? 'warning' : 'badge'}
            </span>
            <span className={isExpired ? 'text-error font-semibold' : ''}>{row.licenseName}</span>
          </div>
        );
      }
    },
    {
      title: 'Compliance Expiry',
      key: 'licenseExpiry',
      render: (value, row) => {
        const isExpired = row.serviceStatus === 'expired';
        return (
          <span className={isExpired ? 'text-error font-semibold bg-error-container/20 px-2 py-0.5 rounded' : 'text-on-surface-variant'}>
            {value || 'Verifying...'}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-gutter">
      {/* Page Header */}
      <section className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <nav className="flex items-center text-label-sm text-outline mb-2">
            <span>Fleet</span>
            <span className="material-symbols-outlined text-[14px] mx-1 select-none">chevron_right</span>
            <span className="text-on-surface-variant font-bold">Drivers</span>
          </nav>
          <h2 className="font-headline-lg text-headline-lg text-on-background">Driver Personnel</h2>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mt-1">
            Manage your active fleet drivers, monitor safety performance, and track licensing compliance in real-time.
          </p>
        </div>
        <div className="flex gap-unit-sm">
          <button className="flex items-center gap-2 px-unit-lg py-3 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container transition-all font-semibold">
            <span className="material-symbols-outlined select-none">download</span>
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-unit-lg py-3 rounded-lg bg-primary text-on-primary hover:opacity-90 transition-all font-semibold shadow-md">
            <span className="material-symbols-outlined select-none">add</span>
            Add New Driver
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        
        {/* Total Drivers */}
        <KPICard 
          title="Total Drivers"
          value="1,284"
          icon="groups"
          iconBgClass="bg-primary-fixed text-primary"
          trendText="+12% vs last month"
          trendType="success"
        />

        {/* On Duty */}
        <KPICard 
          title="On Duty"
          value="842"
          icon="verified_user"
          iconBgClass="bg-secondary-container text-on-secondary-container"
          trendText="Active Now"
          trendType="success"
        />

        {/* License Expirations */}
        <KPICard 
          title="License Expirations"
          value="28"
          icon="warning"
          iconBgClass="bg-tertiary-container/10 text-tertiary"
          trendText="4 Critical"
          trendType="error"
        />

        {/* Safety Score (Primary Colored Card) */}
        <KPICard 
          title="Fleet Safety Score"
          value="94/100"
          variant="primary"
          progressBar={94}
          subtext="Top 5% of global logistics fleets"
          underlayIcon="shield_with_heart"
        />
      </section>

      {/* Filters & Tools toolbar */}
      <section className="flex flex-wrap items-center justify-between gap-unit-md p-4 rounded-xl border border-outline-variant bg-surface-container-low/30">
        <div className="flex flex-wrap gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border-outline-variant text-body-md px-4 py-2 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="All">All Statuses</option>
            <option value="On Duty">On Duty</option>
            <option value="Off Duty">Off Duty</option>
            <option value="Medical Leave">Medical Leave</option>
          </select>
          
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="rounded-lg border-outline-variant text-body-md px-4 py-2 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="safety_desc">Safety Score: High to Low</option>
            <option value="safety_asc">Safety Score: Low to High</option>
            <option value="seniority">Seniority</option>
          </select>
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant hover:bg-white transition-colors text-body-md">
            <span className="material-symbols-outlined text-sm select-none">filter_list</span>
            More Filters
          </button>
        </div>
        
        {/* Toggle Grid/List */}
        <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden bg-white">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 transition-colors flex items-center justify-center ${viewMode === 'grid' ? 'bg-surface-container-high text-primary' : 'text-outline hover:bg-surface-container'}`}
          >
            <span className="material-symbols-outlined select-none">grid_view</span>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 transition-colors flex items-center justify-center ${viewMode === 'list' ? 'bg-surface-container-high text-primary' : 'text-outline hover:bg-surface-container'}`}
          >
            <span className="material-symbols-outlined select-none">list</span>
          </button>
        </div>
      </section>

      {/* Driver Content Area */}
      {viewMode === 'grid' ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
          {sortedDrivers.map((driver) => {
            const isAlert = driver.status === 'LICENSE ALERT';
            const isGood = driver.safetyScore !== null && driver.safetyScore >= 90;
            const isAverage = driver.safetyScore !== null && driver.safetyScore >= 80 && driver.safetyScore < 90;
            
            // Status Tag color overrides
            let badgeBg = 'bg-surface-container-highest text-on-surface-variant';
            if (driver.status === 'ON DUTY') {
              badgeBg = 'bg-secondary-container text-on-secondary-container';
            } else if (driver.status === 'LICENSE ALERT') {
              badgeBg = 'bg-error-container text-on-error-container';
            }

            return (
              <div 
                key={driver.id} 
                className={`bg-white border rounded-xl p-unit-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer ${
                  isAlert ? 'border-error/30 ring-1 ring-error/10' : 'border-outline-variant'
                }`}
              >
                {/* Header (Photo & Status) */}
                <div className="flex justify-between items-start mb-unit-md">
                  {driver.image ? (
                    <img 
                      className="w-14 h-14 rounded-full border-2 border-surface-container-highest object-cover" 
                      src={driver.image} 
                      alt={driver.name} 
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center border-2 border-white text-primary text-3xl font-bold select-none">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                  )}
                  
                  <div className="flex flex-col items-end">
                    <span className={`px-2 py-1 rounded font-label-md text-[10px] font-bold ${badgeBg}`}>
                      {driver.status}
                    </span>
                    <span className="text-label-md font-label-md text-on-surface-variant mt-1">
                      ID: {driver.idCode}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <h4 className="font-title-md text-title-md text-on-background font-semibold">{driver.name}</h4>
                <p className="text-body-md text-outline">{driver.role} • {driver.experience > 0 ? `${driver.experience} years exp.` : 'Awaiting Documentation'}</p>

                {/* Safety & Compliance Metrics */}
                <div className="mt-6 space-y-4">
                  {driver.safetyScore !== null ? (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-label-sm text-on-surface-variant uppercase font-medium">Safety Score</span>
                        <span className={`text-label-md font-bold ${isGood ? 'text-secondary' : isAverage ? 'text-primary' : 'text-tertiary'}`}>
                          {driver.safetyScore} / 100
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isGood ? 'bg-secondary' : isAverage ? 'bg-primary' : 'bg-tertiary'}`} 
                          style={{ width: `${driver.safetyScore}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="opacity-50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-label-sm text-on-surface-variant uppercase">Safety Score</span>
                        <span className="text-label-md font-bold text-outline">-- / 100</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container rounded-full"></div>
                    </div>
                  )}

                  {/* Expiry Details */}
                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-[18px] ${driver.serviceStatus === 'expired' ? 'text-error' : 'text-outline'}`}>
                        {driver.serviceStatus === 'expired' ? 'warning' : driver.serviceStatus === 'pending' ? 'hourglass_empty' : 'badge'}
                      </span>
                      <span className={`text-body-md ${driver.serviceStatus === 'expired' ? 'text-error font-semibold' : 'text-on-surface'}`}>
                        {driver.licenseName}
                      </span>
                    </div>
                    {driver.licenseExpiry ? (
                      <span className={`text-label-sm px-2 py-0.5 rounded ${
                        driver.serviceStatus === 'expired' 
                          ? 'bg-error-container text-error font-bold' 
                          : 'bg-surface-container-high text-on-surface'
                      }`}>
                        {driver.licenseExpiry}
                      </span>
                    ) : driver.serviceStatus === 'pending' ? (
                      <button className="text-primary font-bold text-label-md hover:underline">Complete</button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant soft-shadow overflow-hidden">
          <Table 
            columns={listColumns} 
            data={sortedDrivers} 
            emptyMessage="No drivers matching the filters found"
          />
        </section>
      )}

      {/* Pagination footer */}
      <footer className="mt-unit-xl flex items-center justify-between py-6 border-t border-outline-variant/40">
        <p className="text-body-md text-outline">
          Showing <span className="font-semibold text-on-surface">1-{sortedDrivers.length}</span> of 1,284 drivers
        </p>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-white text-outline transition-colors disabled:opacity-30" disabled>
            <span className="material-symbols-outlined select-none text-[18px]">chevron_left</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold">1</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-white transition-colors">2</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-white transition-colors">3</button>
          <span className="px-2 self-center text-outline">...</span>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-white transition-colors">160</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-white text-outline transition-colors">
            <span className="material-symbols-outlined select-none text-[18px]">chevron_right</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Drivers;
