import React, { useState } from 'react';

const Trips = () => {
  // Store selected trip ID for interactive map highlights
  const [selectedTripId, setSelectedTripId] = useState('TR-8821');

  const activeTripsData = [
    {
      id: 'TR-8821',
      origin: 'Port of Newark',
      destination: 'Albany Hub',
      status: 'On Schedule',
      statusType: 'success',
      driverName: 'James D.',
      driverInitials: 'JD',
      unit: 'V-402',
      progress: 65,
      eta: '14:45',
      speed: '58mph',
      fuel: '74%',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxLogaFpE_z6uZ7vpP1JVsZ1c0jJAVz630G7F0adjOSXWzql_FTRWNtwgIiCPpDM8JdFkKIFnDycu1NQUysyjeFfwU-_DLV1Pb4oU2cnwRm1OrpTthaijwkq12Z2UtsfXPZC3dTNfs0O-7Ukrs4GMIh3w1FZs0LVz_XsuFx8SHT3rBJmWRxhIC10cxQtBk6YIA4Ftm-J6wKdELn_0efPg2yuOl0rSEg9ycebNd27gemqUIHyxeUIDNkg'
    },
    {
      id: 'TR-8825',
      origin: 'JFK Air Cargo',
      destination: 'Stamford',
      status: 'Delayed',
      statusType: 'danger',
      driverName: 'Maria S.',
      driverInitials: 'MS',
      unit: 'V-119',
      progress: 22,
      eta: '+45m',
      speed: '12mph',
      fuel: '88%',
      alertText: 'Traffic Congestion (I-95)',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAk4stdkaPpJI_Ot2HrTgP3B0iVFvWIvsxlPbeIjUi9i-4JyuO8TbK21YG-W8XHxoHOMKcYuPPmH3FpGohdR6EMAVA7_MB4ARZUwK3AtQ3yC71FUu48hoLUe_o1AJXYVzAj1Qs7TeIK78QWDLWBjOqcoOjIY8HDKfllsf1qRpO95RuEcmO1E2EIHFgtyN3J7tMuOAtJ5BagXz1_km8kRa7GM88nGURDsRfvF890qbFYWJBzyf0Tx8wviA'
    },
    {
      id: 'TR-8830',
      origin: 'Boston DC',
      destination: 'Providence',
      status: 'En Route',
      statusType: 'success',
      driverName: 'Robert K.',
      driverInitials: 'RK',
      unit: 'V-088',
      progress: 92,
      eta: '11:15',
      speed: '62mph',
      fuel: '41%',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6Ujpp1zyrf97-57e7_HFSC0FeWH8HYGRaZclUUD6kioYK0KTU-yHVMZDPxGU3Wr-MrTVwHzsjBkGjbOrS9NnVnJvzhtfqQ6ltinPg2byys7S-gvTpC1meyoAwOZj17PS8nxnrJKaMVL7WJrTHaw8smqcq0jhczPP6aWNE5ZMxgOcUlBbJyqKcqvfZ8vUpJ2J8s3W7VXwtE8b8nOA_nCsRCsGhBqCsxB1DhhIwCPi5VkWPWY5pWxwMlw'
    }
  ];

  const selectedTrip = activeTripsData.find(t => t.id === selectedTripId) || activeTripsData[0];

  return (
    <div className="space-y-gutter">
      {/* Page Header */}
      <section className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Trips Management</h2>
          <p className="text-body-lg text-outline">Real-time oversight of 42 active deployments across the Northeast region.</p>
        </div>
        <div className="flex gap-unit-sm">
          <button className="bg-surface-container-lowest border border-outline-variant px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined select-none text-[20px]">filter_list</span>
            Filter View
          </button>
          <button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all soft-shadow">
            <span className="material-symbols-outlined select-none text-[20px]">add</span>
            New Trip Dispatch
          </button>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-gutter">
        
        {/* Left Column: Active Trips Feed */}
        <section className="col-span-12 lg:col-span-4 space-y-unit-md">
          <div className="flex items-center justify-between">
            <h3 className="font-title-md text-title-md flex items-center gap-2 font-semibold">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
              Active Now (14)
            </h3>
            <span className="text-label-md bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-mono">LIVE FEED</span>
          </div>

          <div className="space-y-unit-md max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {activeTripsData.map((trip) => {
              const isActive = selectedTripId === trip.id;
              const isDelayed = trip.statusType === 'danger';

              let borderClasses = 'border-outline-variant';
              if (isActive) {
                borderClasses = isDelayed ? 'border-error ring-1 ring-error' : 'border-primary ring-1 ring-primary';
              }
              if (isDelayed) {
                borderClasses += ' border-l-4 border-l-error';
              }

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
                      {trip.image ? (
                        <img 
                          className="w-8 h-8 rounded-full border-2 border-white object-cover" 
                          src={trip.image} 
                          alt="Vehicle Unit" 
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center border-2 border-white text-outline">
                          <span className="material-symbols-outlined text-sm">local_shipping</span>
                        </div>
                      )}
                      <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed text-[10px] font-bold border-2 border-white">
                        {trip.driverInitials}
                      </div>
                    </div>
                    
                    <div className="text-label-sm text-outline">
                      Driver: <span className="text-on-surface font-semibold">{trip.driverName}</span> • Unit: <span className="text-on-surface font-semibold">{trip.unit}</span>
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
                    <span>{isDelayed ? trip.alertText : `${trip.progress}% Completed`}</span>
                    <span className="font-mono text-on-surface">{isDelayed ? trip.eta : `ETA: ${trip.eta}`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Column: Dispatch Map & Timeline */}
        <section className="col-span-12 lg:col-span-8 space-y-gutter">
          
          {/* Dispatch Map Container */}
          <div className="relative bg-surface-container-highest rounded-2xl overflow-hidden h-[500px] border border-outline-variant soft-shadow">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-700" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCiprVW8bxhfUE-vL_vx6wKDCRSd5YLMfGDUzPh4UASoOj99lobF06vI5tAkhsNfNvOT236rJ0L6Klam8u4DDgf1X2TxyylAhy-pCkbb-zGXpoZp1YBT4o-sOthSl-N-SnnQDZkpMWnfN_kz9IVXjXLueJtkvUBtyMmxe7Smk_1gaXypP2TvuItmhpCfKoZPnSgc8oi4yUG791kp7HPJRAt6ziztzWEG9GHcAlwbq2ilsrlvzegBVw9IQ')" }}
              alt="New York Metropolitan Area Live Dispatch Map"
            ></div>

            {/* Map Floating HUD Overlays */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <div className="glass-panel p-2 rounded-lg shadow-lg flex items-center gap-3 bg-white/85 backdrop-blur-md border border-white/30 text-on-surface">
                <span className="w-3 h-3 bg-secondary rounded-full"></span>
                <span className="text-label-sm font-bold">38 VEHICLES ACTIVE</span>
              </div>
              <div className="glass-panel p-2 rounded-lg shadow-lg flex items-center gap-3 bg-white/85 backdrop-blur-md border border-white/30 text-on-surface">
                <span className="w-3 h-3 bg-error rounded-full animate-pulse"></span>
                <span className="text-label-sm font-bold">4 WEATHER ALERTS</span>
              </div>
            </div>

            {/* Zoom / Location Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
              <button className="bg-surface-container-lowest p-2 rounded-lg shadow-lg hover:bg-surface-container transition-all flex items-center justify-center">
                <span className="material-symbols-outlined">add</span>
              </button>
              <button className="bg-surface-container-lowest p-2 rounded-lg shadow-lg hover:bg-surface-container transition-all flex items-center justify-center">
                <span className="material-symbols-outlined">remove</span>
              </button>
              <button className="bg-primary text-on-primary p-2 rounded-lg shadow-lg hover:opacity-90 transition-all flex items-center justify-center">
                <span className="material-symbols-outlined">my_location</span>
              </button>
            </div>

            {/* Active Selected Route Telemetry HUD */}
            <div className="absolute bottom-4 left-4 glass-panel p-4 rounded-xl shadow-xl w-64 border border-primary/20 bg-white/85 backdrop-blur-md z-10">
              <h5 className="text-label-sm text-primary font-bold mb-1 uppercase tracking-tighter">Selected Trip</h5>
              <p className="font-bold text-body-md truncate mb-2 text-on-surface">
                {selectedTrip.id}: {selectedTrip.origin}
              </p>
              <div className="flex items-center justify-between text-label-sm text-outline">
                <span>Speed: {selectedTrip.speed}</span>
                <span>Fuel: {selectedTrip.fuel}</span>
              </div>
            </div>
          </div>

          {/* Quick Intelligence Action Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-unit-md">
            {/* Smart Re-route */}
            <div className="bg-surface-container-low border border-outline-variant p-unit-md rounded-xl hover:bg-surface-container transition-colors cursor-pointer group">
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

            {/* Driver Broadcast */}
            <div className="bg-surface-container-low border border-outline-variant p-unit-md rounded-xl hover:bg-surface-container transition-colors cursor-pointer group">
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

            {/* Performance Audit */}
            <div className="bg-surface-container-low border border-outline-variant p-unit-md rounded-xl hover:bg-surface-container transition-colors cursor-pointer group">
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
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-surface-container rounded text-label-sm text-on-surface">Past 8 Hours</span>
              </div>
            </div>

            <div className="relative pt-4 pb-8 px-4">
              {/* Horizontal Timeline Line */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-outline-variant -translate-y-1/2 z-0"></div>
              
              <div className="relative flex justify-between z-10">
                {/* Commenced */}
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-primary rounded-full ring-4 ring-primary-fixed"></div>
                  <div className="mt-4 text-center">
                    <p className="text-label-md font-mono text-on-surface font-semibold">06:00 AM</p>
                    <p className="text-label-sm text-outline">Shift Commencement</p>
                  </div>
                </div>

                {/* Clearances */}
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-primary rounded-full ring-4 ring-primary-fixed"></div>
                  <div className="mt-4 text-center">
                    <p className="text-label-md font-mono text-on-surface font-semibold">07:45 AM</p>
                    <p className="text-label-sm text-outline">Hub Clearances (14)</p>
                  </div>
                </div>

                {/* Incident (Pulsing Red) */}
                <div className="flex flex-col items-center relative">
                  <div className="w-4 h-4 bg-error rounded-full ring-4 ring-error-container animate-ping absolute"></div>
                  <div className="w-4 h-4 bg-error rounded-full ring-4 ring-error-container relative z-10"></div>
                  <div className="mt-4 text-center">
                    <p className="text-label-md font-mono text-error font-bold">09:12 AM</p>
                    <p className="text-label-sm text-error font-semibold">I-95 Incident Detected</p>
                  </div>
                </div>

                {/* Recalculation */}
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-secondary rounded-full ring-4 ring-secondary-container"></div>
                  <div className="mt-4 text-center">
                    <p className="text-label-md font-mono text-on-surface font-semibold">10:30 AM</p>
                    <p className="text-label-sm text-outline">Route Recalculation</p>
                  </div>
                </div>

                {/* Future rotation (Disabled look) */}
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

      {/* Floating Action Button (FAB) */}
      <button className="fixed bottom-8 right-8 bg-primary text-on-primary w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
        <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform duration-300 select-none">
          add
        </span>
        <span className="absolute right-full mr-4 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-lg text-label-md font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
          Dispatch New Unit
        </span>
      </button>
    </div>
  );
};

export default Trips;
