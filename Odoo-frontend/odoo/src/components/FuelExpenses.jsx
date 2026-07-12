import React, { useState } from 'react';
import KPICard from './common/KPICard';
import Table from './common/Table';
import StatusBadge from './common/StatusBadge';

const FuelExpenses = ({ searchQuery = '' }) => {
  const [activeTab, setActiveTab] = useState('Week');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Expense Trend Mock Data by Tab
  const expenseChartData = {
    Week: [
      { label: 'Mon', height: 'h-24', value: '$4,200' },
      { label: 'Tue', height: 'h-48', value: '$8,400' },
      { label: 'Wed', height: 'h-32', value: '$5,600' },
      { label: 'Thu', height: 'h-56', value: '$9,800', highlight: true },
      { label: 'Fri', height: 'h-40', value: '$7,000' },
      { label: 'Sat', height: 'h-20', value: '$3,500' },
      { label: 'Sun', height: 'h-24', value: '$4,200' },
    ],
    Month: [
      { label: 'W1', height: 'h-40', value: '$28,000' },
      { label: 'W2', height: 'h-56', value: '$39,200', highlight: true },
      { label: 'W3', height: 'h-48', value: '$33,600' },
      { label: 'W4', height: 'h-32', value: '$22,400' },
    ],
    Quarter: [
      { label: 'Q1', height: 'h-44', value: '$112,000' },
      { label: 'Q2', height: 'h-52', value: '$130,000' },
      { label: 'Q3', height: 'h-60', value: '$150,000', highlight: true },
      { label: 'Q4', height: 'h-36', value: '$98,000' },
    ],
  };

  const handleAction = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const recentTransactions = [
    {
      date: 'Oct 24, 08:32 AM',
      vehicle: 'Freightliner #4402',
      plate: 'TX-GR9921',
      driver: 'Marcus Thorne',
      location: 'Shell, Houston TX',
      volume: '112.5 Gal',
      amount: '$386.42',
      status: 'success',
      label: 'Verified',
    },
    {
      date: 'Oct 23, 04:15 PM',
      vehicle: 'Freightliner #8812',
      plate: 'TX-AB4450',
      driver: 'Elena Rodriguez',
      location: "Love's Travel, Dallas",
      volume: '98.2 Gal',
      amount: '$332.14',
      status: 'pending',
      label: 'Pending Review',
    },
    {
      date: 'Oct 23, 11:20 AM',
      vehicle: 'Sprinter Van #12',
      plate: 'CA-XY0012',
      driver: 'James Wilson',
      location: 'Exxon, San Diego',
      volume: '24.5 Gal',
      amount: '$95.80',
      status: 'success',
      label: 'Verified',
    },
    {
      date: 'Oct 22, 09:45 PM',
      vehicle: 'Freightliner #4402',
      plate: 'TX-GR9921',
      driver: 'Marcus Thorne',
      location: 'Pilot J, San Antonio',
      volume: '120.0 Gal',
      amount: '$412.00',
      status: 'critical',
      label: 'High Usage Alert',
    },
  ];

  const filteredTransactions = recentTransactions.filter(
    (tx) =>
      tx.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.plate.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const tableColumns = [
    {
      title: 'Transaction Date',
      key: 'date',
      render: (value) => <span className="font-label-md">{value}</span>,
    },
    {
      title: 'Vehicle / Plate',
      key: 'vehicle',
      render: (value, row) => (
        <div className="flex items-center">
          <span className="material-symbols-outlined text-outline mr-2">local_shipping</span>
          <div>
            <p className="font-bold text-on-surface">{row.vehicle}</p>
            <p className="text-label-sm text-on-surface-variant">{row.plate}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Driver',
      key: 'driver',
      render: (value) => <span className="text-on-surface">{value}</span>,
    },
    {
      title: 'Location',
      key: 'location',
      render: (value) => <span className="text-on-surface-variant">{value}</span>,
    },
    {
      title: 'Volume',
      key: 'volume',
      render: (value) => <span className="text-on-surface">{value}</span>,
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (value) => <span className="font-bold text-on-surface">{value}</span>,
    },
    {
      title: 'Status',
      key: 'status',
      render: (value, row) => <StatusBadge status={row.status} label={row.label} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <button className="material-symbols-outlined text-outline hover:text-primary transition-colors flex items-center justify-center">
          more_vert
        </button>
      ),
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-margin-desktop space-y-unit-lg">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-unit-lg">
        <div>
          <nav className="flex text-label-md text-on-surface-variant mb-2">
            <span>Dashboard</span>
            <span className="mx-2">/</span>
            <span className="text-primary font-bold">Fuel & Expenses</span>
          </nav>
          <h2 class="font-headline-lg text-headline-lg text-on-surface">Operational Expenditures</h2>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <button
            onClick={() => handleAction('Exporting expenditure data...')}
            className="flex-1 sm:flex-none flex items-center justify-center px-unit-md py-2 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg hover:bg-surface-container transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined mr-2 text-[20px]">download</span>
            Export Report
          </button>
          <button
            onClick={() => handleAction('Fuel entry form opened.')}
            className="flex-1 sm:flex-none flex items-center justify-center px-unit-md py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined mr-2 text-[20px]">add</span>
            Log Fuel Entry
          </button>
        </div>
      </div>

      {/* Bento Grid Dashboard */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* KPI Cards */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <KPICard
            title="Total Spend (MTD)"
            value="$42,850.40"
            icon="payments"
            iconBgClass="bg-surface-container-high text-primary"
            trendText="12.5%"
            trendType="success"
            subtext="v.s. $38,100 last month"
          />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <KPICard
            title="Fuel Consumption"
            value="12,450 Gal"
            icon="local_gas_station"
            iconBgClass="bg-surface-container-high text-primary"
            trendText="4.2%"
            trendType="error"
            subtext="Avg $3.44 per Gallon"
          />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <KPICard
            title="Fuel Efficiency"
            value="7.2 MPG"
            icon="speed"
            iconBgClass="bg-surface-container-high text-primary"
            trendText="2.1%"
            trendType="success"
            subtext="Fleet-wide average"
          />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <KPICard
            title="Pending Approvals"
            value="14"
            icon="receipt_long"
            iconBgClass="bg-surface-container-high text-primary"
            subtext="$2,140 requiring review"
          />
        </div>

        {/* Main Expenditure Chart */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md soft-shadow h-[400px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-title-md text-on-surface">Expense Trends</h4>
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
                <span className="text-label-sm text-on-surface-variant mt-2">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Distribution */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md soft-shadow h-[400px] flex flex-col justify-between">
          <h4 className="font-title-md text-on-surface mb-6">Cost Breakdown</h4>
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex justify-between text-label-md mb-2">
                <span className="text-on-surface-variant">Fuel Charges</span>
                <span className="font-bold">68%</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-label-md mb-2">
                <span className="text-on-surface-variant">Maintenance & Parts</span>
                <span className="font-bold">22%</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-secondary" style={{ width: '22%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-label-md mb-2">
                <span className="text-on-surface-variant">Tolls & Parking</span>
                <span className="font-bold">6%</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-tertiary" style={{ width: '6%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-label-md mb-2">
                <span className="text-on-surface-variant">Other Miscellaneous</span>
                <span className="font-bold">4%</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-outline" style={{ width: '4%' }}></div>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-outline-variant flex justify-center">
            <button
              onClick={() => handleAction('Viewing Category Details...')}
              className="text-primary font-bold text-label-md hover:underline flex items-center bg-transparent border-none"
            >
              View Category Details
              <span className="material-symbols-outlined text-[18px] ml-1">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Recent Fuel Logs Table */}
        <div className="col-span-12 bg-surface-container-lowest border border-outline-variant rounded-xl soft-shadow overflow-hidden">
          <div className="p-unit-md border-b border-outline-variant flex justify-between items-center bg-white">
            <h4 className="font-title-md text-on-surface">Recent Fuel Transactions</h4>
            <div className="flex items-center space-x-2">
              <span className="text-label-md text-on-surface-variant">Showing latest 25</span>
              <button
                onClick={() => handleAction('Filtering Transactions...')}
                className="material-symbols-outlined p-1 hover:bg-surface-container rounded flex items-center justify-center"
              >
                filter_list
              </button>
            </div>
          </div>

          <Table columns={tableColumns} data={filteredTransactions} />

          <div className="p-unit-md border-t border-outline-variant flex justify-center bg-surface-container-lowest">
            <button
              onClick={() => handleAction('Navigating to full fuel history...')}
              className="text-primary font-bold text-body-md hover:underline bg-transparent border-none"
            >
              View All Fuel History
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-unit-lg right-unit-lg z-50">
        <button
          onClick={() => handleAction('Expense form opened.')}
          className="w-14 h-14 bg-primary text-white rounded-full soft-shadow flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative border-none"
        >
          <span className="material-symbols-outlined text-[28px]">add</span>
          <span className="absolute right-16 bg-inverse-surface text-white px-3 py-1 rounded-lg text-label-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
            New Expense
          </span>
        </button>
      </div>

      {/* Action Toast */}
      <div
        className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 z-50 ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
        }`}
      >
        <span
          className="material-symbols-outlined text-secondary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
        <span className="font-semibold text-body-md">{toastMessage}</span>
      </div>
    </div>
  );
};

export default FuelExpenses;
