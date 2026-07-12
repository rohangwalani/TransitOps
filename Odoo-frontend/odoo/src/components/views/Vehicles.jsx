import React, { useState } from 'react';
import { useTransitOps } from '../../hooks/TransitOpsContext';
import KPICard from '../common/KPICard';
import Table from '../common/Table';
import StatusBadge from '../common/StatusBadge';
import reportService from '../../services/reportService';
import FleetMap from '../common/FleetMap';

const Vehicles = () => {
  const { 
    vehicles, 
    trips, 
    addVehicle, 
    editVehicle, 
    deleteVehicle,
    triggerToast,
    searchQuery
  } = useTransitOps();

  // Search, Sorting, Filtering, and Pagination States
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const activeSearchQuery = searchQuery || localSearchQuery;
  const [activeTab, setActiveTab] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal States
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentVehicleId, setCurrentVehicleId] = useState(null);
  
  // Confirmation Modal State
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    type: 'Heavy Duty',
    capacity: '',
    odometer: '',
    cost: '',
    status: 'Available'
  });

  // KPI Calculations
  const totalAssets = vehicles.length;
  const operationalAssets = vehicles.filter(v => v.status === 'Available' || v.status === 'On Trip').length;
  const inMaintenance = vehicles.filter(v => v.status === 'In Shop').length;
  const activeVehs = vehicles.filter(v => v.status !== 'Retired').length;
  const onTripVehs = vehicles.filter(v => v.status === 'On Trip').length;
  const uptimePct = activeVehs > 0 ? ((operationalAssets / activeVehs) * 100).toFixed(1) : '0';

  const tabs = [
    { id: 'all', label: 'All Assets' },
    { id: 'Heavy Duty', label: 'Heavy Duty' },
    { id: 'Light Duty', label: 'Light Duty' },
    { id: 'Electric', label: 'Electric' }
  ];

  // Table Columns
  const vehiclesColumns = [
    {
      title: 'Vehicle Details',
      key: 'details',
      render: (value, row) => (
        <div className="flex items-center gap-4">
          <div className="w-16 h-10 rounded-lg overflow-hidden bg-surface-container flex-shrink-0 border border-outline-variant">
            <img 
              className="w-full h-full object-cover" 
              src={row.type === 'Electric' 
                ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4ZBTxy1Uj-CO6PIv6sLgi3dvd461N8ozstd_tJWw0MYHFc0Q6YTcxOCr72RvAHx4y-ic-2bjAXJb___DZxMW4jwxsjWNfxZTfiicTotbmOLG6xUJUhe0dZmRySRixJvJenoY5NfU4zu25SCvuSSyS3bISmaUZ0ZS3Pqpcj0Q-1GEBq59t9_bfW1-CvWlrAvLowf3VmjmFFkLdSgfth054sb2eLgmF0RamiVVYjLl_V6bm5VokInP4iw'
                : row.type === 'Light Duty'
                ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcPO_aDS7yPjGq2ZbzzHQcAXA0RRxG8xxml-lgM47st9DASIqlghQQLafqe_Ak6X3eKbEsqhrsSFMUJYYneFUVdBd95ucpKYaHW4aegU69HSVxrxfotlD4_AUAW3XK-DVAKtsshExskxJBYve-ka1QoCX2XedGkwJyqT8xotfSAAvWXyJZV2YZcxClUwtCoid9axqLowoybGVU7hnfmfCuFGR9XV9glnOGS9T0BdvNdpj_rCUohJ5hkw'
                : 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3Q6E5pZHaxVBPZLaJSqgfdEkWaD8joVrIT151dAD0Yi7MhGklvZhf-Q6DnC_TOidEyNIcc5a3fPQ4LfiXSt-1ezhuNm7J4XgD2FXcsn593xu-bj-0SY1UdYyysBEi03caEZEgKIX1mdeZPdGVIfqoT8O9UoRbaZm4amZ57sZv2nA17drQ33B6rlh7HqPHfUUobTQe2HoqDd8lMnEA-C7CY8_shFnI9zmnL3XB2E9AbQEpFXCdmFTGZg'
              } 
              alt={row.name} 
            />
          </div>
          <div>
            <p className="font-title-md text-on-surface font-semibold">{row.name}</p>
            <p className="text-label-md text-on-surface-variant font-medium uppercase">{row.id} • REG: {row.registrationNumber}</p>
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: (value, row) => {
        let mappedStatus = 'neutral';
        if (row.status === 'Available') mappedStatus = 'active';
        else if (row.status === 'On Trip') mappedStatus = 'info';
        else if (row.status === 'In Shop') mappedStatus = 'warning';
        else if (row.status === 'Retired') mappedStatus = 'critical';
        
        return <StatusBadge status={mappedStatus} label={row.status} />;
      }
    },
    {
      title: 'Assigned Driver',
      key: 'driver',
      render: (value, row) => {
        // Find active driver from active trips
        const activeTrip = trips.find(t => t.vehicleId === row.id && t.status !== 'Completed' && t.status !== 'Cancelled');
        if (!activeTrip) {
          return <span className="text-body-md text-on-surface-variant italic">Unassigned</span>;
        }

        const initials = activeTrip.driverName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const badgeBg = row.id.charCodeAt(row.id.length - 1) % 2 === 0 
          ? 'bg-secondary-fixed text-on-secondary-fixed' 
          : 'bg-primary-fixed text-primary';

        return (
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${badgeBg}`}>
              {initials}
            </div>
            <span className="text-body-md text-on-surface">{activeTrip.driverName}</span>
          </div>
        );
      }
    },
    {
      title: 'Capacity',
      key: 'capacity',
      render: (value) => <span className="font-body-md text-on-surface font-mono">{Number(value).toLocaleString()} lbs</span>
    },
    {
      title: 'Odometer',
      key: 'odometer',
      render: (value) => <span className="font-body-md text-on-surface font-mono">{Number(value).toLocaleString()} mi</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleOpenEditModal(row)}
            className="p-1 text-primary hover:bg-surface-container rounded-lg transition-colors flex items-center justify-center"
            title="Edit Asset"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
          <button 
            onClick={() => handleOpenDeleteConfirm(row)}
            className="p-1 text-error hover:bg-error-container/20 rounded-lg transition-colors flex items-center justify-center"
            title="Delete Asset"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      )
    }
  ];

  // Actions Handlers
  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setCurrentVehicleId(null);
    setFormData({
      name: '',
      registrationNumber: '',
      type: 'Heavy Duty',
      capacity: '',
      odometer: '',
      cost: '',
      status: 'Available'
    });
    setShowFormModal(true);
  };

  const handleOpenEditModal = (vehicle) => {
    setIsEditMode(true);
    setCurrentVehicleId(vehicle.id);
    setFormData({
      name: vehicle.name,
      registrationNumber: vehicle.registrationNumber,
      type: vehicle.type,
      capacity: vehicle.capacity,
      odometer: vehicle.odometer,
      cost: vehicle.cost,
      status: vehicle.status
    });
    setShowFormModal(true);
  };

  const handleOpenDeleteConfirm = (vehicle) => {
    setVehicleToDelete(vehicle);
    setShowConfirmDelete(true);
  };

  const handleDeleteExecute = async () => {
    if (vehicleToDelete) {
      await deleteVehicle(vehicleToDelete.id);
    }
    setShowConfirmDelete(false);
    setVehicleToDelete(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.name.trim() || !formData.registrationNumber.trim()) {
      triggerToast('Name and Registration Number are required.', 'error');
      return;
    }
    if (Number(formData.capacity) <= 0 || Number(formData.odometer) < 0 || Number(formData.cost) < 0) {
      triggerToast('Numerical fields must be valid and non-negative.', 'error');
      return;
    }

    if (isEditMode) {
      const success = await editVehicle(currentVehicleId, formData);
      if (success) setShowFormModal(false);
    } else {
      const success = await addVehicle(formData);
      if (success) setShowFormModal(false);
    }
  };

  // Filter, Sort, and Search queries
  const searchedVehicles = vehicles.filter(v => {
    const query = activeSearchQuery.toLowerCase();
    return (
      v.name.toLowerCase().includes(query) ||
      v.registrationNumber.toLowerCase().includes(query) ||
      v.id.toLowerCase().includes(query)
    );
  });

  const tabFilteredVehicles = activeTab === 'all'
    ? searchedVehicles
    : searchedVehicles.filter(v => v.type === activeTab);

  const sortedVehicles = [...tabFilteredVehicles].sort((a, b) => {
    if (sortField === 'name') return a.name.localeCompare(b.name);
    if (sortField === 'capacity') return b.capacity - a.capacity;
    if (sortField === 'odometer') return b.odometer - a.odometer;
    return 0;
  });

  // Pagination Slice
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVehicles = sortedVehicles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedVehicles.length / itemsPerPage) || 1;

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const blob = await reportService.exportFleetReport();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vehicles.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      triggerToast('Vehicle CSV data exported successfully.', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      triggerToast('Failed to export vehicle data.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-gutter">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Fleet Assets</h2>
          <p className="text-body-lg text-on-surface-variant">Manage and monitor active transit vehicles across your logistics network.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportCSV}
            className="px-unit-md py-2 flex items-center gap-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined select-none">file_download</span>
            Export Data
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="px-unit-md py-2 flex items-center gap-2 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 active:scale-[0.98] transition-all soft-shadow"
          >
            <span className="material-symbols-outlined select-none">add</span>
            Add Vehicle
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <KPICard 
          title="Total Assets"
          value={totalAssets.toString()}
          icon="local_shipping"
          iconBgClass="bg-primary-fixed text-primary"
        />
        <KPICard 
          title="Operational"
          value={operationalAssets.toString()}
          icon="check_circle"
          iconBgClass="bg-secondary-container text-on-secondary-container"
          trendText={`${uptimePct}% uptime`}
          trendType="info"
        />
        <KPICard 
          title="In Maintenance"
          value={inMaintenance.toString()}
          icon="build"
          iconBgClass="bg-tertiary-fixed text-on-tertiary-fixed"
        />
        <KPICard 
          title="Vehicles On Trip"
          value={onTripVehs.toString()}
          icon="speed"
          iconBgClass="bg-surface-variant text-primary"
        />
      </section>

      {/* Asset Table Section */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant soft-shadow overflow-hidden">
        {/* Table Filters header */}
        <div className="p-4 border-b border-outline-variant flex flex-wrap gap-4 items-center justify-between bg-surface-container-low/50">
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
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
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px] select-none">search</span>
              <input
                type="text"
                placeholder="Search assets..."
                value={activeSearchQuery}
                onChange={(e) => { setLocalSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-8 pr-3 py-1.5 bg-white border border-outline-variant rounded-lg text-xs w-48 outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="rounded-lg border-outline-variant text-xs py-1.5 px-3 bg-white focus:outline-none"
            >
              <option value="name">Sort by Name</option>
              <option value="capacity">Sort by Capacity</option>
              <option value="odometer">Sort by Odometer</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <Table 
          columns={vehiclesColumns} 
          data={currentVehicles} 
          emptyMessage="No vehicles matching the filter found"
        />

        {/* Pagination footer */}
        <div className="p-4 border-t border-outline-variant flex items-center justify-between bg-surface-container-low/50">
          <p className="text-body-md text-on-surface-variant">
            Showing <span className="font-bold text-on-surface">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedVehicles.length)}</span> of {sortedVehicles.length} assets
          </p>
          
          <div className="flex items-center gap-2 select-none">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined select-none text-[18px]">chevron_left</span>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                onClick={() => handlePageChange(pNum)}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                  currentPage === pNum
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'border border-outline-variant text-on-surface hover:bg-surface-container'
                }`}
              >
                {pNum}
              </button>
            ))}

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined select-none text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* Reusable Interactive Fleet Map Bento */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Reusable Leaflet Map */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant soft-shadow overflow-hidden min-h-[400px] relative">
          <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur px-4 py-2 rounded-lg border border-outline-variant shadow-sm text-on-surface">
            <p className="text-label-md font-bold">Live Fleet Tracking Map</p>
            <p className="text-label-sm text-on-surface-variant">Real-time coordinates of assets in Maharashtra/Gujarat region</p>
          </div>
          <FleetMap height="400px" />
        </div>

        {/* Fleet health tasks panel */}
        <div className="bg-surface-container-lowest p-unit-md rounded-xl border border-outline-variant soft-shadow flex flex-col justify-between">
          <h3 className="font-title-md text-on-surface font-semibold mb-4">Fleet Health Tasks</h3>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-error-container/20 border border-error/10">
              <span className="material-symbols-outlined text-error mt-0.5 select-none">warning</span>
              <div>
                <p className="text-body-md font-bold text-on-surface">Tire Pressure Alert</p>
                <p className="text-label-md text-on-surface-variant mt-0.5">V-402 reports low pressure in rear axle 2.</p>
                <button className="mt-2 text-primary font-semibold text-label-md hover:underline">Route to Service</button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant">
              <span className="material-symbols-outlined text-primary mt-0.5 select-none">info</span>
              <div>
                <p className="text-body-md font-bold text-on-surface">Scheduled Maintenance</p>
                <p className="text-label-md text-on-surface-variant mt-0.5">3 regional units are due for 50k mile inspection this week.</p>
                <button className="mt-2 text-primary font-semibold text-label-md hover:underline">View Schedule</button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant">
              <span className="material-symbols-outlined text-secondary mt-0.5 select-none">eco</span>
              <div>
                <p className="text-body-md font-bold text-on-surface">Efficiency Report</p>
                <p className="text-label-md text-on-surface-variant mt-0.5">Your fleet's CO2 emissions decreased by 4% this month.</p>
                <button className="mt-2 text-primary font-semibold text-label-md hover:underline">Download Report</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add / Edit Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest p-unit-lg rounded-2xl border border-outline-variant shadow-xl max-w-md w-full relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="font-title-md text-title-md text-on-surface mb-4 font-bold border-b border-outline-variant/30 pb-2">
              {isEditMode ? 'Edit Vehicle Asset' : 'Add New Vehicle'}
            </h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4 text-on-surface">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Vehicle Model Name *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ford Transit #09" 
                  className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Registration Number *</label>
                <input 
                  type="text" 
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  placeholder="e.g. MH-12-ST-4500" 
                  className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                  >
                    <option value="Heavy Duty">Heavy Duty</option>
                    <option value="Light Duty">Light Duty</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                    disabled={isEditMode && formData.status === 'On Trip'} // Cannot change status directly if on trip
                  >
                    <option value="Available">Available</option>
                    <option value="In Shop">In Shop</option>
                    <option value="Retired">Retired</option>
                    {isEditMode && <option value="On Trip">On Trip</option>}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-on-surface-variant uppercase mb-1">Capacity (lbs)</label>
                  <input 
                    type="number" 
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="40000" 
                    className="w-full bg-white border border-outline-variant rounded-lg p-2 outline-none focus:ring-1 focus:ring-primary text-body-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-on-surface-variant uppercase mb-1">Odometer (mi)</label>
                  <input 
                    type="number" 
                    value={formData.odometer}
                    onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                    placeholder="120000" 
                    className="w-full bg-white border border-outline-variant rounded-lg p-2 outline-none focus:ring-1 focus:ring-primary text-body-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-on-surface-variant uppercase mb-1">Cost ($)</label>
                  <input 
                    type="number" 
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    placeholder="125000" 
                    className="w-full bg-white border border-outline-variant rounded-lg p-2 outline-none focus:ring-1 focus:ring-primary text-body-md"
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
                  {isEditMode ? 'Save Changes' : 'Add Vehicle'}
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
            <h3 className="font-title-md text-title-md font-bold text-error mb-2">Delete Vehicle Asset</h3>
            <p className="text-body-md text-on-surface-variant mb-6">
              Are you sure you want to permanently delete vehicle <span className="font-semibold text-on-surface">{vehicleToDelete?.name}</span>? This action cannot be undone.
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

export default Vehicles;
