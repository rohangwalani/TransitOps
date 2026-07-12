import React, { useState } from 'react';
import { useTransitOps } from '../../hooks/TransitOpsContext';
import FleetMap from '../common/FleetMap';
import { isDriverAvailableForDispatch } from '../../utils/validation';

const Trips = () => {
  const { 
    trips, 
    vehicles, 
    drivers, 
    addTrip, 
    dispatchTrip, 
    completeTrip, 
    cancelTrip,
    triggerToast,
    searchQuery
  } = useTransitOps();

  // Search & Selector State
  const [selectedTripId, setSelectedTripId] = useState(trips[0]?.id || 'TR-8821');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form Field State
  const [formData, setFormData] = useState({
    origin: 'Mumbai',
    destination: 'Pune',
    vehicleId: '',
    driverId: '',
    cargoWeight: '',
    distance: ''
  });

  const activeTrips = trips.filter(t => {
    const isNotFinished = t.status !== 'Completed' && t.status !== 'Cancelled';
    if (!isNotFinished) return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      t.id.toLowerCase().includes(query) ||
      t.origin.toLowerCase().includes(query) ||
      t.destination.toLowerCase().includes(query) ||
      (t.vehicleName && t.vehicleName.toLowerCase().includes(query)) ||
      (t.driverName && t.driverName.toLowerCase().includes(query))
    );
  });
  const selectedTrip = trips.find(t => t.id === selectedTripId) || trips[0];

  // Helper arrays for selectable assets
  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  
  // Filter drivers using the validation helper to exclude suspended, on trip, and license expired
  const availableDrivers = drivers.filter(d => isDriverAvailableForDispatch(d));

  const handleOpenCreateModal = () => {
    // Prefill first available assets if any
    setFormData({
      origin: 'Mumbai',
      destination: 'Pune',
      vehicleId: availableVehicles[0]?.id || '',
      driverId: availableDrivers[0]?.id || '',
      cargoWeight: '',
      distance: ''
    });
    setShowCreateModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Field checks
    if (!formData.vehicleId || !formData.driverId || !formData.cargoWeight || !formData.distance) {
      triggerToast('All form fields are required.', 'error');
      return;
    }
    if (Number(formData.cargoWeight) <= 0 || Number(formData.distance) <= 0) {
      triggerToast('Cargo weight and distance must be greater than zero.', 'error');
      return;
    }

    const success = await addTrip({
      origin: formData.origin,
      destination: formData.destination,
      vehicleId: formData.vehicleId,
      driverId: formData.driverId,
      cargoWeight: Number(formData.cargoWeight),
      distance: Number(formData.distance)
    });

    if (success) {
      setShowCreateModal(false);
    }
  };

  const handleTripAction = (action, tripId) => {
    if (action === 'dispatch') {
      dispatchTrip(tripId);
    } else if (action === 'complete') {
      completeTrip(tripId);
    } else if (action === 'cancel') {
      cancelTrip(tripId);
    }
  };

  return (
    <div className="space-y-gutter">
      {/* Page Header */}
      <section className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Trips Management</h2>
          <p className="text-body-lg text-outline">Real-time oversight of active deployments across the region.</p>
        </div>
        <div className="flex gap-unit-sm">
          <button 
            onClick={() => triggerToast('Trip CSV report generated.', 'info')}
            className="bg-surface-container-lowest border border-outline-variant px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-surface-container transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined select-none text-[20px]">filter_list</span>
            Export Log
          </button>
          <button 
            onClick={handleOpenCreateModal}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all soft-shadow cursor-pointer"
          >
            <span className="material-symbols-outlined select-none text-[20px]">add</span>
            New Trip Dispatch
          </button>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-gutter">
        
        {/* Left Column: Active Trips Feed */}
        <section className="col-span-12 lg:col-span-4 space-y-unit-md">
          <div className="flex items-center justify-between select-none">
            <h3 className="font-title-md text-title-md flex items-center gap-2 font-semibold">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
              Active Now ({activeTrips.length})
            </h3>
            <span className="text-label-md bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-mono">LIVE FEED</span>
          </div>

          <div className="space-y-unit-md max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {activeTrips.map((trip) => {
              const isActive = selectedTripId === trip.id;
              const isDelayed = trip.status === 'Delayed';

              let borderClasses = 'border-outline-variant';
              if (isActive) {
                borderClasses = isDelayed ? 'border-error ring-1 ring-error' : 'border-primary ring-1 ring-primary';
              }
              if (isDelayed) {
                borderClasses += ' border-l-4 border-l-error';
              }

              // Lookup vehicle model
              const vehicle = vehicles.find(v => v.id === trip.vehicleId);
              const vehicleName = vehicle ? vehicle.name : 'Unknown';

              return (
                <div 
                  key={trip.id}
                  onClick={() => setSelectedTripId(trip.id)}
                  className={`bg-surface-container-lowest border p-unit-md rounded-xl transition-all cursor-pointer soft-shadow group ${borderClasses}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-label-md text-outline font-mono">#{trip.id}</span>
                      <h4 className="font-bold text-body-lg text-on-surface group-hover:text-primary transition-colors">
                        {trip.origin} → {trip.destination}
                      </h4>
                    </div>
                    <span className={`text-label-sm px-2 py-1 rounded-full ${
                      isDelayed 
                        ? 'bg-error-container text-on-error-container font-semibold' 
                        : 'bg-surface-variant text-on-surface-variant font-medium'
                    }`}>
                      {trip.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex -space-x-2 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-[10px] font-bold border-2 border-white select-none">
                        {trip.driverName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                    </div>
                    
                    <div className="text-label-sm text-outline">
                      Driver: <span className="text-on-surface font-semibold">{trip.driverName}</span> • Unit: <span className="text-on-surface font-semibold">{trip.vehicleId}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isDelayed ? 'bg-error' : 'bg-secondary'}`} 
                      style={{ width: `${trip.progress}%` }}
                    ></div>
                  </div>

                  {/* Footer Text */}
                  <div className={`flex justify-between mt-2 text-label-sm ${isDelayed ? 'text-error font-bold' : 'text-outline'}`}>
                    <span>{isDelayed ? trip.alertText || 'Delayed' : `${trip.progress}% Completed`}</span>
                    <span className="font-mono text-on-surface">{isDelayed ? trip.eta : `ETA: ${trip.eta}`}</span>
                  </div>

                  {/* Action buttons inside the feed card */}
                  <div className="flex items-center justify-end gap-2 mt-4 pt-2 border-t border-outline-variant/30 select-none">
                    {trip.status === 'On Schedule' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleTripAction('dispatch', trip.id); }}
                        className="px-2.5 py-1 text-xs bg-primary text-white rounded font-bold hover:opacity-90 transition-all"
                      >
                        Dispatch
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleTripAction('complete', trip.id); }}
                      className="px-2.5 py-1 text-xs bg-secondary text-white rounded font-bold hover:opacity-90 transition-all"
                    >
                      Complete
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleTripAction('cancel', trip.id); }}
                      className="px-2.5 py-1 text-xs bg-error text-white rounded font-bold hover:opacity-90 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })}

            {activeTrips.length === 0 && (
              <p className="text-body-md text-on-surface-variant italic text-center p-4">No active trips dispatched.</p>
            )}
          </div>
        </section>

        {/* Right Column: Dispatch Map & Timeline */}
        <section className="col-span-12 lg:col-span-8 space-y-gutter">
          
          {/* Dispatch Map Container */}
          <div className="relative bg-surface-container-highest rounded-2xl overflow-hidden h-[500px] border border-outline-variant soft-shadow">
            <FleetMap height="500px" />
          </div>

          {/* Quick Intelligence Action Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-unit-md select-none">
            <div 
              onClick={() => triggerToast('Optimizing traffic route algorithms...', 'info')}
              className="bg-surface-container-low border border-outline-variant p-unit-md rounded-xl hover:bg-surface-container transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-2 text-primary">
                <span className="material-symbols-outlined select-none">bolt</span>
                <span className="font-bold text-body-md">Smart Re-route</span>
              </div>
              <p className="text-label-sm text-outline">Auto-suggest optimized paths based on real-time traffic data.</p>
              <div className="mt-4 flex justify-end">
                <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all select-none">
                  arrow_forward
                </span>
              </div>
            </div>

            <div 
              onClick={() => triggerToast('Broadcast warning sent to drivers.', 'info')}
              className="bg-surface-container-low border border-outline-variant p-unit-md rounded-xl hover:bg-surface-container transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-2 text-tertiary">
                <span className="material-symbols-outlined select-none">chat_bubble</span>
                <span className="font-bold text-body-md">Driver Broadcast</span>
              </div>
              <p className="text-label-sm text-outline">Send priority instructions to all active units in Region 4.</p>
              <div className="mt-4 flex justify-end">
                <span className="material-symbols-outlined text-outline group-hover:text-tertiary group-hover:translate-x-1 transition-all select-none">
                  send
                </span>
              </div>
            </div>

            <div 
              onClick={() => triggerToast('Auditing recent driver shifts...', 'info')}
              className="bg-surface-container-low border border-outline-variant p-unit-md rounded-xl hover:bg-surface-container transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-2 text-secondary">
                <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  analytics
                </span>
                <span className="font-bold text-body-md">Performance Audit</span>
              </div>
              <p className="text-label-sm text-outline">Review shift efficiency and safety scores for last 24h.</p>
              <div className="mt-4 flex justify-end">
                <span className="material-symbols-outlined text-outline group-hover:text-secondary group-hover:translate-x-1 transition-all select-none">
                  trending_up
                </span>
              </div>
            </div>
          </div>

          {/* Operational Timeline */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-unit-lg soft-shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-title-md text-title-md text-on-surface font-semibold">Trip Timeline: Operational Flux</h3>
              <div className="flex gap-2 select-none">
                <span className="px-2 py-1 bg-surface-container rounded text-label-sm text-on-surface">Past 8 Hours</span>
              </div>
            </div>

            <div className="relative pt-4 pb-8 px-4">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-outline-variant -translate-y-1/2 z-0"></div>
              
              <div className="relative flex justify-between z-10 select-none">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-primary rounded-full ring-4 ring-primary-fixed"></div>
                  <div className="mt-4 text-center">
                    <p className="text-label-md font-mono text-on-surface font-semibold">06:00 AM</p>
                    <p className="text-label-sm text-outline">Shift Commencement</p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-primary rounded-full ring-4 ring-primary-fixed"></div>
                  <div className="mt-4 text-center">
                    <p className="text-label-md font-mono text-on-surface font-semibold">07:45 AM</p>
                    <p className="text-label-sm text-outline">Hub Clearances (14)</p>
                  </div>
                </div>

                <div className="flex flex-col items-center relative">
                  <div className="w-4 h-4 bg-error rounded-full ring-4 ring-error-container animate-ping absolute"></div>
                  <div className="w-4 h-4 bg-error rounded-full ring-4 ring-error-container relative z-10"></div>
                  <div className="mt-4 text-center">
                    <p className="text-label-md font-mono text-error font-bold">09:12 AM</p>
                    <p className="text-label-sm text-error font-semibold">Incident Detected</p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-secondary rounded-full ring-4 ring-secondary-container"></div>
                  <div className="mt-4 text-center">
                    <p className="text-label-md font-mono text-on-surface font-semibold">10:30 AM</p>
                    <p className="text-label-sm text-outline">Route Recalculation</p>
                  </div>
                </div>

                <div className="flex flex-col items-center opacity-40">
                  <div className="w-4 h-4 bg-outline-variant rounded-full"></div>
                  <div className="mt-4 text-center">
                    <p className="text-label-md font-mono text-on-surface">14:00 PM</p>
                    <p className="text-label-sm text-outline">Est. Shift Rotation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Action Button (FAB) for Creating Trip */}
      <button 
        onClick={handleOpenCreateModal}
        className="fixed bottom-8 right-8 bg-primary text-on-primary w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group cursor-pointer"
      >
        <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform duration-300 select-none">
          add
        </span>
        <span className="absolute right-full mr-4 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-lg text-label-md font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
          Dispatch New Unit
        </span>
      </button>

      {/* Dispatch Create Trip Form Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest p-unit-lg rounded-2xl border border-outline-variant shadow-xl max-w-md w-full relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="font-title-md text-title-md text-on-surface mb-4 font-bold border-b border-outline-variant/30 pb-2">
              New Fleet Dispatch
            </h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4 text-on-surface">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Source / Origin City *</label>
                  <select 
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Nashik">Nashik</option>
                    <option value="Thane">Thane</option>
                    <option value="Nagpur">Nagpur</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Surat">Surat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Destination City *</label>
                  <select 
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Nashik">Nashik</option>
                    <option value="Thane">Thane</option>
                    <option value="Nagpur">Nagpur</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Surat">Surat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Available Vehicle *</label>
                <select 
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                  required
                >
                  <option value="" disabled>-- Select Vehicle --</option>
                  {availableVehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.id} - Cap: {v.capacity} lbs)</option>
                  ))}
                </select>
                {availableVehicles.length === 0 && (
                  <p className="text-[11px] text-error font-medium mt-1">No Available vehicles left in Depot.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Available Driver *</label>
                <select 
                  value={formData.driverId}
                  onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                  className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                  required
                >
                  <option value="" disabled>-- Select Driver --</option>
                  {availableDrivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.id} - Safety: {d.safetyScore})</option>
                  ))}
                </select>
                {availableDrivers.length === 0 && (
                  <p className="text-[11px] text-error font-medium mt-1">No Available drivers left on duty.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Cargo Weight (lbs) *</label>
                  <input 
                    type="number" 
                    value={formData.cargoWeight}
                    onChange={(e) => setFormData({ ...formData, cargoWeight: e.target.value })}
                    placeholder="e.g. 15000" 
                    className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Trip Distance (mi) *</label>
                  <input 
                    type="number" 
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    placeholder="e.g. 120" 
                    className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/30">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-outline-variant rounded-lg text-body-md font-semibold hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg text-body-md font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
                >
                  Dispatch Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Trips;
