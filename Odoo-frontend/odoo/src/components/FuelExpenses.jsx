import React, { useState } from 'react';
import { useTransitOps } from '../hooks/TransitOpsContext';
import KPICard from './common/KPICard';
import Table from './common/Table';
import StatusBadge from './common/StatusBadge';

const FuelExpenses = () => {
  const { 
    fuel, 
    vehicles, 
    trips, 
    maintenance, 
    addFuelLog,
    triggerToast 
  } = useTransitOps();

  const [activeTab, setActiveTab] = useState('Week');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    vehicleId: '',
    fuel: '',
    cost: '',
    date: ''
  });

  // Calculate dynamic KPIs from context
  const totalFuelCost = fuel.reduce((sum, item) => sum + item.cost, 0);
  const totalFuelVolume = fuel.reduce((sum, item) => sum + item.fuel, 0);
  const totalMaintCost = maintenance.reduce((sum, item) => sum + item.cost, 0);
  const totalAllCosts = totalFuelCost + totalMaintCost;

  // Expense Trend Mock Data by Tab
  const expenseChartData = {
    Week: [
      { label: 'Mon', height: 'h-24', value: `$4,200` },
      { label: 'Tue', height: 'h-48', value: `$8,400` },
      { label: 'Wed', height: 'h-32', value: `$5,600` },
      { label: 'Thu', height: 'h-56', value: `$9,800`, highlight: true },
      { label: 'Fri', height: 'h-40', value: `$7,000` },
      { label: 'Sat', height: 'h-20', value: `$3,500` },
      { label: 'Sun', height: 'h-24', value: `$4,200` },
    ],
    Month: [
      { label: 'W1', height: 'h-40', value: `$28,000` },
      { label: 'W2', height: 'h-56', value: `$39,200`, highlight: true },
      { label: 'W3', height: 'h-48', value: `$33,600` },
      { label: 'W4', height: 'h-32', value: `$22,400` },
    ],
    Quarter: [
      { label: 'Q1', height: 'h-44', value: `$112,000` },
      { label: 'Q2', height: 'h-52', value: `$130,000` },
      { label: 'Q3', height: 'h-60', value: `$150,000`, highlight: true },
      { label: 'Q4', height: 'h-36', value: `$98,000` },
    ],
  };

  const handleOpenAddModal = () => {
    setFormData({
      vehicleId: vehicles[0]?.id || '',
      fuel: '',
      cost: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vehicleId || !formData.fuel || !formData.cost || !formData.date) {
      triggerToast('All fields are required.', 'error');
      return;
    }
    if (Number(formData.fuel) <= 0 || Number(formData.cost) <= 0) {
      triggerToast('Fuel volume and cost must be positive numbers.', 'error');
      return;
    }

    const success = await addFuelLog({
      vehicleId: formData.vehicleId,
      fuel: Number(formData.fuel),
      cost: Number(formData.cost),
      date: formData.date
    });

    if (success) {
      setShowAddModal(false);
    }
  };

  // Map fuel logs for standard list rendering
  const mappedTransactions = fuel.map(log => {
    const vehicleObj = vehicles.find(v => v.id === log.vehicleId);
    const vehicleName = vehicleObj ? vehicleObj.name : 'Unknown';
    const regNo = vehicleObj ? vehicleObj.registrationNumber : 'MH-XX-XX-0000';
    
    // Find matching driver from trips
    const tripObj = trips.find(t => t.vehicleId === log.vehicleId);
    const driverName = tripObj ? tripObj.driverName : 'Depot Staff';

    return {
      id: log.id,
      date: log.date,
      vehicle: `${vehicleName} (${log.vehicleId})`,
      plate: regNo,
      driver: driverName,
      location: 'Depot Fuel Station',
      volume: `${log.fuel} Gal`,
      amount: `$${log.cost}`,
      status: 'success',
      label: 'Verified'
    };
  });

  const filteredTransactions = recentTransactions.filter(
    (tx) =>
      tx.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.plate.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const tableColumns = [
    {
      title: 'Transaction Date',
      key: 'date',
      render: (value) => <span className="font-label-md font-bold">{value}</span>,
    },
    {
      title: 'Vehicle / Plate',
      key: 'vehicle',
      render: (value, row) => (
        <div>
          <p className="font-semibold text-on-surface">{row.vehicle}</p>
          <p className="text-xs text-outline uppercase font-mono">{row.plate}</p>
        </div>
      ),
    },
    {
      title: 'Driver',
      key: 'driver',
      render: (value) => <span className="font-body-md text-on-surface">{value}</span>,
    },
    {
      title: 'Merchant Station',
      key: 'location',
      render: (value) => <span className="font-body-md text-on-surface-variant">{value}</span>,
    },
    {
      title: 'Volume',
      key: 'volume',
      render: (value) => <span className="font-body-md text-on-surface font-mono">{value}</span>,
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (value) => <span className="font-body-md font-bold text-primary font-mono">{value}</span>,
    },
    {
      title: 'Status',
      key: 'status',
      render: (value, row) => <StatusBadge status={row.status} label={row.label} />,
    }
  ];

  return (
    <div className="space-y-gutter">
      
      {/* KPI Section */}
      <div className="grid grid-cols-12 gap-gutter select-none">
        
        {/* Total Expense */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <KPICard
            title="Total Expenses"
            value={`$${totalAllCosts.toLocaleString()}`}
            icon="monetization_on"
            iconBgClass="bg-primary-fixed text-primary"
            subtext="Fuel & Repairs combined"
          />
        </div>
        
        {/* Total Fuel Volume */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <KPICard
            title="Total Fuel Volume"
            value={`${totalFuelVolume.toLocaleString()} Gal`}
            icon="gas_meter"
            iconBgClass="bg-tertiary-fixed text-on-tertiary-fixed-variant"
            subtext="Accumulated volume"
          />
        </div>
        
        {/* Fuel Efficiency */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <KPICard
            title="Fuel Efficiency"
            value="8.2 MPG"
            icon="speed"
            iconBgClass="bg-surface-container-high text-primary"
            trendText="Optimal"
            trendType="success"
            subtext="Fleet-wide average"
          />
        </div>
        
        {/* Pending Approvals */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <KPICard
            title="Total Maintenance Cost"
            value={`$${totalMaintCost.toLocaleString()}`}
            icon="build"
            iconBgClass="bg-error-container text-error"
            subtext="Repairs cost logs"
          />
        </div>

        {/* Main Expenditure Chart */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md soft-shadow h-[400px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-title-md text-on-surface font-semibold">Expense Trends</h4>
            <div className="flex bg-surface-container rounded-lg p-1">
              {['Week', 'Month', 'Quarter'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-label-md rounded-md transition-all ${
                    activeTab === tab ? 'bg-white soft-shadow text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between px-4 pb-4 border-b border-outline-variant">
            {expenseChartData[activeTab].map((bar, idx) => (
              <div key={idx} className="flex flex-col items-center w-12 group">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 cursor-pointer ${bar.height} ${
                    bar.highlight
                      ? 'bg-primary-container group-hover:bg-primary'
                      : 'bg-surface-container-high group-hover:bg-primary-container'
                  }`}
                  title={`${bar.label}: ${bar.value}`}
                ></div>
                <span className="text-label-sm text-on-surface-variant mt-2 font-medium">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Cost Breakdown */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md soft-shadow h-[400px] flex flex-col justify-between">
          <h4 className="font-title-md text-on-surface mb-6 font-semibold">Cost Breakdown</h4>
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex justify-between text-label-md mb-2">
                <span className="text-on-surface-variant font-medium">Fuel Charges</span>
                <span className="font-bold">68%</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-label-md mb-2">
                <span className="text-on-surface-variant font-medium">Maintenance & Parts</span>
                <span className="font-bold">22%</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-secondary" style={{ width: '22%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-label-md mb-2">
                <span className="text-on-surface-variant font-medium">Tolls & Parking</span>
                <span className="font-bold">6%</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-tertiary" style={{ width: '6%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-label-md mb-2">
                <span className="text-on-surface-variant font-medium">Other Miscellaneous</span>
                <span className="font-bold">4%</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-outline" style={{ width: '4%' }}></div>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-outline-variant flex justify-center">
            <button
              onClick={() => triggerToast('Cost analytics breakdown detailed reports (stub).', 'info')}
              className="text-primary font-bold text-label-md hover:underline flex items-center bg-transparent border-none cursor-pointer"
            >
              View Category Details
              <span className="material-symbols-outlined text-[18px] ml-1">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Recent Fuel Logs Table */}
        <div className="col-span-12 bg-surface-container-lowest border border-outline-variant rounded-xl soft-shadow overflow-hidden">
          <div className="p-unit-md border-b border-outline-variant flex justify-between items-center bg-white">
            <h4 className="font-title-md text-on-surface font-semibold">Recent Fuel Transactions</h4>
            <div className="flex items-center space-x-2">
              <span className="text-label-md text-on-surface-variant">Showing latest logs</span>
              <button
                onClick={() => triggerToast('Toggled filter details list.', 'info')}
                className="material-symbols-outlined p-1 hover:bg-surface-container rounded flex items-center justify-center cursor-pointer"
              >
                filter_list
              </button>
            </div>
          </div>

          <Table columns={tableColumns} data={mappedTransactions} />

          <div className="p-unit-md border-t border-outline-variant flex justify-center bg-surface-container-lowest select-none">
            <button
              onClick={() => triggerToast('Loading complete historical fuel audits (stub).', 'info')}
              className="text-primary font-bold text-body-md hover:underline bg-transparent border-none cursor-pointer"
            >
              View All Fuel History
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button (FAB) to Add Fuel Log */}
      <div className="fixed bottom-unit-lg right-unit-lg z-50">
        <button
          onClick={handleOpenAddModal}
          className="w-14 h-14 bg-primary text-white rounded-full soft-shadow flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative border-none cursor-pointer"
        >
          <span className="material-symbols-outlined text-[28px] select-none">add</span>
          <span className="absolute right-16 bg-inverse-surface text-white px-3 py-1 rounded-lg text-label-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
            New Fuel Log
          </span>
        </button>
      </div>

      {/* Add Fuel Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest p-unit-lg rounded-2xl border border-outline-variant shadow-xl max-w-md w-full relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="font-title-md text-title-md text-on-surface mb-4 font-bold border-b border-outline-variant/30 pb-2 animate-fade-in">
              Record Fuel Log
            </h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4 text-on-surface">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Select Fleet Vehicle *</label>
                <select 
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                  required
                >
                  <option value="" disabled>-- Select Vehicle --</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.id})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Fuel Volume (Gal) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.fuel}
                    onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                    placeholder="e.g. 112.5" 
                    className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Log Date *</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Total Transaction Cost ($) *</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  placeholder="e.g. 386.42" 
                  className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/30">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-outline-variant rounded-lg text-body-md font-semibold hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg text-body-md font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FuelExpenses;
