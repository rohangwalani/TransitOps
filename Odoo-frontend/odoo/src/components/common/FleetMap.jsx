import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTransitOps } from '../../hooks/TransitOpsContext';

// Fallback city coordinates when real GPS data is not available
const CITY_COORDINATES = {
  Depot:   [19.0760, 72.8777],
  Mumbai:  [19.0760, 72.8777],
  Pune:    [18.5204, 73.8567],
  Nashik:  [19.9975, 73.7898],
  Nagpur:  [21.1458, 79.0882],
  Surat:   [21.1702, 72.8311],
  Thane:   [19.2183, 72.9781],
};

// Fix default Leaflet marker assets resolving
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Create custom DOM-based markers colored by vehicle status
const createCustomIcon = (status) => {
  let color = '#006c49'; // Available -> Green
  if (status === 'On Trip') color = '#004ac6'; // On Trip -> Blue
  if (status === 'In Shop') color = '#ba1a1a'; // In Shop / Maintenance -> Red
  if (status === 'Retired') color = '#737686'; // Retired -> Gray

  return new L.DivIcon({
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border: 2.5px solid white; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.4); transform: translate(-1px, -1px);"></div>`,
    className: 'custom-marker-wrapper',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

export const FleetMap = ({ height = '100%' }) => {
  const { vehicles, trips, drivers } = useTransitOps();

  // Offset logic to avoid markers stack directly over each other at the Depot
  const getOffsetCoords = (baseCoords, index) => {
    if (index === 0) return baseCoords;
    const angle = (index * 2 * Math.PI) / 12;
    const offsetRadius = 0.008; // slightly offset coordinates
    return [
      baseCoords[0] + Math.sin(angle) * offsetRadius,
      baseCoords[1] + Math.cos(angle) * offsetRadius
    ];
  };

  return (
    <div style={{ height, width: '100%', borderRadius: '1rem', overflow: 'hidden', position: 'relative' }}>
      <MapContainer 
        center={[19.5, 73.5]}
        zoom={8} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {vehicles.map((vehicle, index) => {
          let position;
          let activeTrip = null;

          if (vehicle.status === 'On Trip') {
            activeTrip = trips.find(t => t.vehicleId === vehicle.id && t.status !== 'Completed' && t.status !== 'Cancelled');
            if (activeTrip) {
              // Use real source/dest coordinates if available
              const hasRealCoords = activeTrip.sourceLat && activeTrip.destLat;
              if (hasRealCoords) {
                const progressPct = (activeTrip.progress || 0) / 100;
                const lat = activeTrip.sourceLat + (activeTrip.destLat - activeTrip.sourceLat) * progressPct;
                const lng = activeTrip.sourceLng + (activeTrip.destLng - activeTrip.sourceLng) * progressPct;
                position = [lat, lng];
              } else {
                const start = CITY_COORDINATES[activeTrip.origin] || CITY_COORDINATES.Depot;
                const end = CITY_COORDINATES[activeTrip.destination] || CITY_COORDINATES.Depot;
                const progressPct = (activeTrip.progress || 0) / 100;
                const lat = start[0] + (end[0] - start[0]) * progressPct;
                const lng = start[1] + (end[1] - start[1]) * progressPct;
                position = [lat, lng];
              }
            } else {
              position = vehicle.latitude && vehicle.longitude
                ? [vehicle.latitude, vehicle.longitude]
                : getOffsetCoords(CITY_COORDINATES.Depot, index);
            }
          } else {
            // Use vehicle's own coordinates if set, otherwise depot offset
            position = vehicle.latitude && vehicle.longitude
              ? [vehicle.latitude, vehicle.longitude]
              : getOffsetCoords(CITY_COORDINATES.Depot, index);
          }

          // Fetch associated driver name
          const assignedDriver = activeTrip 
            ? activeTrip.driverName 
            : drivers.find(d => d.status === 'Available')?.name || 'None';

          return (
            <React.Fragment key={vehicle.id}>
              {/* Render route polyline for active trips */}
              {vehicle.status === 'On Trip' && activeTrip && (
                <Polyline 
                  positions={[
                    CITY_COORDINATES[activeTrip.origin] || CITY_COORDINATES.Depot,
                    CITY_COORDINATES[activeTrip.destination] || CITY_COORDINATES.Depot
                  ]}
                  pathOptions={{
                    color: '#004ac6',
                    weight: 3.5,
                    dashArray: '8, 8',
                    lineCap: 'round',
                    opacity: 0.8
                  }}
                />
              )}

              {/* Marker pin */}
              <Marker position={position} icon={createCustomIcon(vehicle.status)}>
                <Popup>
                  <div className="font-body-md text-on-surface p-1 min-w-[200px]">
                    <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2 mb-2">
                      <span className="font-bold text-primary">{vehicle.name}</span>
                      <span className="font-mono text-xs bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface-variant font-semibold">
                        {vehicle.id}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs text-on-surface-variant font-medium">
                      <p>
                        <span className="text-outline">Reg No:</span> {vehicle.registrationNumber}
                      </p>
                      <p>
                        <span className="text-outline">Status:</span>{' '}
                        <span className={`font-semibold ${
                          vehicle.status === 'Available' ? 'text-secondary' : 
                          vehicle.status === 'On Trip' ? 'text-primary' : 'text-error'
                        }`}>
                          {vehicle.status}
                        </span>
                      </p>
                      <p>
                        <span className="text-outline">Driver:</span> {assignedDriver}
                      </p>
                      {activeTrip && (
                        <>
                          <p>
                            <span className="text-outline">Destination:</span> {activeTrip.destination}
                          </p>
                          <p>
                            <span className="text-outline">Weight:</span> {activeTrip.cargoWeight} lbs
                          </p>
                          <p>
                            <span className="text-outline">ETA:</span> {activeTrip.eta}
                          </p>
                          <div className="mt-2">
                            <div className="flex justify-between text-[10px] mb-1">
                              <span>Progress</span>
                              <span>{activeTrip.progress}%</span>
                            </div>
                            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                              <div className="bg-primary h-full" style={{ width: `${activeTrip.progress}%` }}></div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default FleetMap;
