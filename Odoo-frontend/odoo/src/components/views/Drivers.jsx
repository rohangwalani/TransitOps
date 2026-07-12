import React, { useState } from 'react';
import { useTransitOps } from '../../hooks/TransitOpsContext';
import KPICard from '../common/KPICard';
import Table from '../common/Table';
import StatusBadge from '../common/StatusBadge';

const Drivers = () => {
  const { 
    drivers, 
    addDriver, 
    editDriver, 
    deleteDriver,
    triggerToast 
  } = useTransitOps();

  // Search, Filters, Sorting, and Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('safety_desc');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals States
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDriverId, setCurrentDriverId] = useState(null);

  // Delete Confirmation State
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    licenseExpiry: '',
    contact: '',
    safetyScore: '',
    status: 'Available',
    role: 'Fleet Driver',
    experience: ''
  });

  // KPI Calculations
  const totalDrivers = drivers.length;
  const onDutyCount = drivers.filter(d => d.status === 'On Trip' || d.status === 'ON DUTY').length;
  
  // Calculate critical expirations (where license is expired relative to 2026-07-12)
  const currentDate = new Date('2026-07-12');
  const criticalExpirations = drivers.filter(d => {
    if (!d.licenseExpiry) return false;
    const expiry = new Date(d.licenseExpiry);
    return expiry < currentDate;
  }).length;

  const fleetSafetyAvg = drivers.length > 0
    ? Math.round(drivers.reduce((acc, d) => acc + (d.safetyScore || 0), 0) / drivers.length)
    : 0;

  // Actions Handlers
  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setCurrentDriverId(null);
    setFormData({
      name: '',
      licenseNumber: '',
      licenseExpiry: '',
      contact: '',
      safetyScore: '',
      status: 'Available',
      role: 'Fleet Driver',
      experience: ''
    });
    setShowFormModal(true);
  };

  const handleOpenEditModal = (driver) => {
    setIsEditMode(true);
    setCurrentDriverId(driver.id);
    setFormData({
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      licenseExpiry: driver.licenseExpiry,
      contact: driver.contact,
      safetyScore: driver.safetyScore,
      status: driver.status,
      role: driver.role || 'Fleet Driver',
      experience: driver.experience
    });
    setShowFormModal(true);
  };

  const handleOpenDeleteConfirm = (driver) => {
    setDriverToDelete(driver);
    setShowConfirmDelete(true);
  };

  const handleDeleteExecute = async () => {
    if (driverToDelete) {
      await deleteDriver(driverToDelete.id);
    }
    setShowConfirmDelete(false);
    setDriverToDelete(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.name.trim() || !formData.licenseNumber.trim() || !formData.contact.trim()) {
      triggerToast('Name, License Number, and Contact fields are required.', 'error');
      return;
    }
    const score = Number(formData.safetyScore);
    if (isNaN(score) || score < 0 || score > 100) {
      triggerToast('Safety Score must be a number between 0 and 100.', 'error');
      return;
    }
    const exp = Number(formData.experience);
    if (isNaN(exp) || exp < 0) {
      triggerToast('Experience must be a positive number.', 'error');
      return;
    }

    if (isEditMode) {
      const success = await editDriver(currentDriverId, formData);
      if (success) setShowFormModal(false);
    } else {
      const success = await addDriver(formData);
      if (success) setShowFormModal(false);
    }
  };

  // Filters, Sort, and Search queries
  const searchedDrivers = drivers.filter(d => {
    const query = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(query) ||
      d.licenseNumber.toLowerCase().includes(query) ||
      d.id.toLowerCase().includes(query)
    );
  });

  const filteredDrivers = searchedDrivers.filter(driver => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'On Duty') return driver.status === 'On Trip' || driver.status === 'ON DUTY';
    if (statusFilter === 'Off Duty') return driver.status === 'Available' || driver.status === 'RESTING';
    if (statusFilter === 'Medical Leave') return driver.status === 'MEDICAL LEAVE';
    return true;
  });

  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
    if (sortOrder === 'safety_desc') {
      return (b.safetyScore || 0) - (a.safetyScore || 0);
    }
    if (sortOrder === 'safety_asc') {
      return (a.safetyScore || 0) - (b.safetyScore || 0);
    }
    if (sortOrder === 'seniority') {
      return (b.experience || 0) - (a.experience || 0);
    }
    return 0;
  });

  // Pagination Slice
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDrivers = sortedDrivers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedDrivers.length / itemsPerPage) || 1;

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const handleExportCSV = () => {
    triggerToast('Driver roster CSV data exported successfully (mock download).', 'info');
  };

  // List View Columns
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
            <p className="text-xs text-on-surface-variant">{row.role} • ID: {row.id}</p>
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: (value, row) => {
        let badgeType = 'neutral';
        if (row.status === 'Available') badgeType = 'active';
        else if (row.status === 'On Trip') badgeType = 'info';
        else if (row.status === 'Suspended') badgeType = 'critical';
        
        return <StatusBadge status={badgeType} label={row.status} />;
      }
    },
    {
      title: 'Safety Score',
      key: 'safetyScore',
      render: (value) => (
        value !== null ? (
          <span className={`font-bold ${value >= 90 ? 'text-secondary' : value >= 80 ? 'text-primary' : 'text-tertiary'}`}>
            {value} / 100
          </span>
        ) : (
          <span className="text-outline">--</span>
        )
      )
    },
    {
      title: 'License Number',
      key: 'licenseNumber',
      render: (value, row) => {
        const isExpired = row.licenseExpiry && new Date(row.licenseExpiry) < currentDate;
        return (
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined text-[18px] ${isExpired ? 'text-error' : 'text-outline'}`}>
              {isExpired ? 'warning' : 'badge'}
            </span>
            <span className={isExpired ? 'text-error font-semibold' : ''}>{row.licenseNumber}</span>
          </div>
        );
      }
    },
    {
      title: 'Compliance Expiry',
      key: 'licenseExpiry',
      render: (value, row) => {
        const isExpired = row.licenseExpiry && new Date(row.licenseExpiry) < currentDate;
        return (
          <span className={isExpired ? 'text-error font-semibold bg-error-container/20 px-2 py-0.5 rounded' : 'text-on-surface-variant'}>
            {value || 'Verifying...'}
          </span>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleOpenEditModal(row)}
            className="p-1 text-primary hover:bg-surface-container rounded-lg transition-colors flex items-center justify-center"
            title="Edit Driver"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
          <button 
            onClick={() => handleOpenDeleteConfirm(row)}
            className="p-1 text-error hover:bg-error-container/20 rounded-lg transition-colors flex items-center justify-center"
            title="Delete Driver"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-gutter">
      {/* Page Header */}
      <section className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background animate-fade-in">Driver Personnel</h2>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mt-1">
            Manage your active fleet drivers, monitor safety performance, and track licensing compliance in real-time.
          </p>
        </div>
        <div className="flex gap-unit-sm">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-unit-lg py-3 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container transition-all font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined select-none">download</span>
            Export CSV
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-unit-lg py-3 rounded-lg bg-primary text-on-primary hover:opacity-90 transition-all font-semibold shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined select-none">add</span>
            Add New Driver
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <KPICard 
          title="Total Drivers"
          value={totalDrivers.toString()}
          icon="groups"
          iconBgClass="bg-primary-fixed text-primary"
        />
        <KPICard 
          title="On Duty"
          value={onDutyCount.toString()}
          icon="verified_user"
          iconBgClass="bg-secondary-container text-on-secondary-container"
          trendText="Active Now"
          trendType="success"
        />
        <KPICard 
          title="License Expirations"
          value={criticalExpirations.toString()}
          icon="warning"
          iconBgClass="bg-error-container text-error"
          trendText="Action Required"
          trendType="error"
        />
        <KPICard 
          title="Fleet Safety Score"
          value={`${fleetSafetyAvg}/100`}
          variant="primary"
          progressBar={fleetSafetyAvg}
          subtext="Top 5% of global logistics fleets"
          underlayIcon="shield_with_heart"
        />
      </section>

      {/* Filters & Tools toolbar */}
      <section className="flex flex-wrap items-center justify-between gap-unit-md p-4 rounded-xl border border-outline-variant bg-surface-container-low/30">
        <div className="flex flex-wrap gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="rounded-lg border-outline-variant text-body-md px-4 py-2 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="All">All Statuses</option>
            <option value="On Duty">On Duty</option>
            <option value="Off Duty">Off Duty</option>
            <option value="Medical Leave">Medical Leave</option>
          </select>
          
          <select 
            value={sortOrder}
            onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
            className="rounded-lg border-outline-variant text-body-md px-4 py-2 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="safety_desc">Safety Score: High to Low</option>
            <option value="safety_asc">Safety Score: Low to High</option>
            <option value="seniority">Seniority</option>
          </select>

          {/* Search Field */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">search</span>
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-8 pr-3 py-2 bg-white border border-outline-variant rounded-lg text-body-md w-48 outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        
        {/* Toggle Grid/List */}
        <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden bg-white">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 transition-colors flex items-center justify-center ${viewMode === 'grid' ? 'bg-surface-container-high text-primary' : 'text-outline hover:bg-surface-container'}`}
          >
            <span className="material-symbols-outlined select-none text-[20px]">grid_view</span>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 transition-colors flex items-center justify-center ${viewMode === 'list' ? 'bg-surface-container-high text-primary' : 'text-outline hover:bg-surface-container'}`}
          >
            <span className="material-symbols-outlined select-none text-[20px]">list</span>
          </button>
        </div>
      </section>

      {/* Driver Content Area */}
      {viewMode === 'grid' ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
          {currentDrivers.map((driver) => {
            const isLicenseExpired = driver.licenseExpiry && new Date(driver.licenseExpiry) < currentDate;
            const isGood = driver.safetyScore !== null && driver.safetyScore >= 90;
            const isAverage = driver.safetyScore !== null && driver.safetyScore >= 80 && driver.safetyScore < 90;
            
            // Status Tag color mapping
            let badgeBg = 'bg-surface-container-highest text-on-surface-variant';
            if (driver.status === 'On Trip' || driver.status === 'ON DUTY') {
              badgeBg = 'bg-secondary-container text-on-secondary-container';
            } else if (driver.status === 'Suspended') {
              badgeBg = 'bg-error-container text-on-error-container';
            }

            return (
              <div 
                key={driver.id} 
                className={`bg-white border rounded-xl p-unit-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer relative ${
                  isLicenseExpired ? 'border-error/40 ring-1 ring-error/10' : 'border-outline-variant'
                }`}
              >
                {/* Header (Photo & Status & Edit tools) */}
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
                    <span className={`px-2 py-0.5 rounded font-label-md text-[10px] font-bold ${badgeBg}`}>
                      {isLicenseExpired ? 'LICENSE ALERT' : driver.status}
                    </span>
                    <span className="text-label-md font-label-md text-on-surface-variant mt-1">
                      ID: {driver.id}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <h4 className="font-title-md text-title-md text-on-background font-bold">{driver.name}</h4>
                <p className="text-body-md text-outline">{driver.role} • {driver.experience} years exp.</p>

                {/* Safety & Compliance Metrics */}
                <div className="mt-6 space-y-4">
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

                  {/* Expiry Details */}
                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`material-symbols-outlined text-[18px] ${isLicenseExpired ? 'text-error animate-pulse' : 'text-outline'}`}>
                        {isLicenseExpired ? 'warning' : 'badge'}
                      </span>
                      <span className={`text-body-md ${isLicenseExpired ? 'text-error font-semibold' : 'text-on-surface'}`}>
                        {isLicenseExpired ? 'Expired' : driver.licenseNumber}
                      </span>
                    </div>
                    <span className={`text-label-sm px-2 py-0.5 rounded font-semibold ${
                      isLicenseExpired 
                        ? 'bg-error-container text-error' 
                        : 'bg-surface-container-high text-on-surface'
                    }`}>
                      {isLicenseExpired ? 'Expired' : driver.licenseExpiry ? `Exp. ${driver.licenseExpiry.substring(0,4)}` : 'Verifying'}
                    </span>
                  </div>

                  {/* Action overlays inside card */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/10">
                    <button 
                      onClick={() => handleOpenEditModal(driver)}
                      className="p-1.5 text-primary hover:bg-surface-container rounded-lg transition-colors flex items-center justify-center"
                      title="Edit Profile"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button 
                      onClick={() => handleOpenDeleteConfirm(driver)}
                      className="p-1.5 text-error hover:bg-error-container/20 rounded-lg transition-colors flex items-center justify-center"
                      title="Delete Profile"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
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
            data={currentDrivers} 
            emptyMessage="No drivers matching the filters found"
          />
        </section>
      )}

      {/* Pagination footer */}
      <footer className="mt-unit-xl flex items-center justify-between py-6 border-t border-outline-variant/40">
        <p className="text-body-md text-outline">
          Showing <span className="font-semibold text-on-surface">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedDrivers.length)}</span> of {sortedDrivers.length} drivers
        </p>
        <div className="flex gap-2 select-none">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-white text-outline transition-colors disabled:opacity-30"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
            <button
              key={pNum}
              onClick={() => handlePageChange(pNum)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${
                currentPage === pNum
                  ? 'bg-primary text-on-primary'
                  : 'border border-outline-variant hover:bg-white'
              }`}
            >
              {pNum}
            </button>
          ))}

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-white text-outline transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </footer>

      {/* Add / Edit Driver Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest p-unit-lg rounded-2xl border border-outline-variant shadow-xl max-w-md w-full relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="font-title-md text-title-md text-on-surface mb-4 font-bold border-b border-outline-variant/30 pb-2">
              {isEditMode ? 'Edit Driver Profile' : 'Add New Driver'}
            </h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4 text-on-surface">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Driver Full Name *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins" 
                  className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">License Number *</label>
                  <input 
                    type="text" 
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    placeholder="e.g. DL-9021004" 
                    className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Expiry Date *</label>
                  <input 
                    type="date" 
                    value={formData.licenseExpiry}
                    onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                    className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Contact Number *</label>
                <input 
                  type="text" 
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="e.g. +91 98765 43210" 
                  className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Role / Seniority</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                  >
                    <option value="Lead Hauler">Lead Hauler</option>
                    <option value="Cargo Specialist">Cargo Specialist</option>
                    <option value="Fleet Driver">Fleet Driver</option>
                    <option value="Logistics Driver">Logistics Driver</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                    disabled={isEditMode && formData.status === 'On Trip'} // Prevent manual swap if active
                  >
                    <option value="Available">Available</option>
                    <option value="Suspended">Suspended</option>
                    {isEditMode && <option value="On Trip">On Trip</option>}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Safety Score (0-100) *</label>
                  <input 
                    type="number" 
                    value={formData.safetyScore}
                    onChange={(e) => setFormData({ ...formData, safetyScore: e.target.value })}
                    placeholder="95" 
                    className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Experience (Years) *</label>
                  <input 
                    type="number" 
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="6" 
                    className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/30">
                <button 
                  type="button" 
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 border border-outline-variant rounded-lg text-body-md font-semibold hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg text-body-md font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
                >
                  {isEditMode ? 'Save Changes' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest p-unit-lg rounded-2xl border border-outline-variant shadow-xl max-w-sm w-full text-on-surface">
            <h3 className="font-title-md text-title-md font-bold text-error mb-2">Remove Driver Profile</h3>
            <p className="text-body-md text-on-surface-variant mb-6">
              Are you sure you want to permanently delete driver <span className="font-semibold text-on-surface">{driverToDelete?.name}</span>? This profile deletion is permanent.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                type="button" 
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 border border-outline-variant rounded-lg text-body-md font-semibold hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleDeleteExecute}
                className="px-4 py-2 bg-error text-white rounded-lg text-body-md font-bold hover:opacity-90 active:scale-95 transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Drivers;
