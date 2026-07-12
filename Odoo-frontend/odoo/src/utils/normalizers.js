/**
 * normalizers.js
 *
 * Bidirectional field-name adapters between:
 *   - Backend DTO field names  (camelCase from Spring Boot)
 *   - Frontend model field names (what the UI views expect)
 *
 * INBOUND  (backend → frontend): normalize*  functions
 * OUTBOUND (frontend → backend): toBackend* functions
 */

/* ────────────────────────────────────────────────────────────────────── */
/* STATUS MAPS                                                            */
/* ────────────────────────────────────────────────────────────────────── */

/** Convert backend enum (AVAILABLE) → frontend display string (Available) */
const vehicleStatusMap = {
  AVAILABLE:   'Available',
  ON_TRIP:     'On Trip',
  IN_SHOP:     'In Shop',
  RETIRED:     'Retired',
};

const driverStatusMap = {
  AVAILABLE:  'Available',
  ON_TRIP:    'On Trip',
  SUSPENDED:  'Suspended',
  INACTIVE:   'Inactive',
};

const tripStatusMap = {
  DRAFT:      'On Schedule',
  DISPATCHED: 'En Route',
  COMPLETED:  'Completed',
  CANCELLED:  'Cancelled',
};

const maintenanceStatusMap = {
  SCHEDULED:   'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED:   'Completed',
  CANCELLED:   'Cancelled',
};

/** Convert frontend display string → backend enum */
const toVehicleStatusEnum = (s) =>
  Object.entries(vehicleStatusMap).find(([, v]) => v === s)?.[0] ?? s;
const toDriverStatusEnum = (s) =>
  Object.entries(driverStatusMap).find(([, v]) => v === s)?.[0] ?? s;
const toVehicleTypeEnum = (s) => {
  const map = {
    'Heavy Duty': 'HEAVY_DUTY',
    'Light Duty': 'LIGHT_DUTY',
    'Electric':   'ELECTRIC',
    'Minibus':    'MINIBUS',
    'Van':        'VAN',
  };
  return map[s] ?? s;
};
const fromVehicleTypeEnum = (s) => {
  const map = {
    HEAVY_DUTY: 'Heavy Duty',
    LIGHT_DUTY: 'Light Duty',
    ELECTRIC:   'Electric',
    MINIBUS:    'Minibus',
    VAN:        'Van',
  };
  return map[s] ?? s;
};

/* ────────────────────────────────────────────────────────────────────── */
/* INBOUND: Backend Response → Frontend Model                            */
/* ────────────────────────────────────────────────────────────────────── */

export const normalizeVehicle = (v) => ({
  id:                 String(v.id),
  name:               v.name,
  registrationNumber: v.registrationNumber,
  model:              v.model,
  make:               v.make,
  year:               v.year,
  type:               fromVehicleTypeEnum(v.type),
  status:             vehicleStatusMap[v.status] ?? v.status,
  capacity:           v.maxLoadCapacity,
  odometer:           v.odometerReading,
  cost:               v.acquisitionCost,
  latitude:           v.latitude,
  longitude:          v.longitude,
  notes:              v.notes,
  createdAt:          v.createdAt,
  updatedAt:          v.updatedAt,
});

export const normalizeDriver = (d) => ({
  id:              String(d.id),
  name:            d.name,
  licenseNumber:   d.licenseNumber,
  licenseCategory: d.licenseCategory,
  licenseExpiry:   d.licenseExpiryDate,       // frontend uses licenseExpiry
  licenseExpired:  d.licenseExpired,
  licenseExpiringSoon: d.licenseExpiringSoon,
  contact:         d.contactNumber,            // frontend uses contact
  email:           d.email,
  status:          driverStatusMap[d.status] ?? d.status,
  safetyScore:     d.safetyScore ?? 90,
  totalTrips:      d.totalTrips ?? 0,
  experience:      d.totalTrips ?? 0,          // frontend uses experience
  latitude:        d.latitude,
  longitude:       d.longitude,
  notes:           d.notes,
  createdAt:       d.createdAt,
  updatedAt:       d.updatedAt,
});

export const normalizeTrip = (t) => ({
  id:               String(t.id),
  origin:           t.source,                  // frontend uses origin
  destination:      t.destination,
  vehicleId:        String(t.vehicleId),
  vehicleName:      t.vehicleName,
  vehicleReg:       t.vehicleRegistration,
  driverId:         String(t.driverId),
  driverName:       t.driverName,
  cargoWeight:      t.cargoWeight,
  distance:         t.plannedDistance,          // frontend uses distance
  actualDistance:   t.actualDistance,
  fuelConsumed:     t.fuelConsumed,
  status:           tripStatusMap[t.status] ?? t.status,
  startTime:        t.startTime,
  endTime:          t.endTime,
  eta:              t.estimatedArrival ? new Date(t.estimatedArrival).toLocaleTimeString() : 'TBD',
  remarks:          t.remarks,
  sourceLat:        t.sourceLat,
  sourceLng:        t.sourceLng,
  destLat:          t.destLat,
  destLng:          t.destLng,
  // Compatibility fields the frontend map/progress displays use
  progress:         t.status === 'COMPLETED' ? 100 : t.status === 'DISPATCHED' ? 50 : 0,
  speed:            '0 mph',
  fuel:             '100%',
  createdAt:        t.createdAt,
  updatedAt:        t.updatedAt,
});

export const normalizeMaintenance = (m) => ({
  id:          String(m.id),
  vehicleId:   String(m.vehicleId),
  vehicleName: m.vehicleName,
  vehicleReg:  m.vehicleRegistration,
  type:        m.maintenanceType?.toLowerCase() ?? 'service',
  title:       m.description ?? m.maintenanceType,   // backend has no 'title', use description
  description: m.description,
  status:      maintenanceStatusMap[m.status] ?? m.status,
  cost:        m.estimatedCost ?? 0,
  actualCost:  m.actualCost,
  date:        m.scheduledDate,
  completedAt: m.completedDate,
  technicianName: m.technicianName,
  workshopName:   m.workshopName,
  notes:       m.notes,
  createdAt:   m.createdAt,
  updatedAt:   m.updatedAt,
});

export const normalizeFuel = (f) => ({
  id:           String(f.id),
  vehicleId:    String(f.vehicleId),
  vehicleName:  f.vehicleName,
  vehicleReg:   f.vehicleRegistration,
  tripId:       f.tripId ? String(f.tripId) : null,
  fuel:         f.volumeLiters,                // frontend uses 'fuel' for volume
  pricePerLiter: f.pricePerLiter,
  cost:         f.totalCost,                   // frontend uses 'cost' for total cost
  station:      f.fuelStation,
  location:     f.location,
  date:         f.date,
  odometer:     f.odometerReading,
  notes:        f.notes,
  createdAt:    f.createdAt,
  updatedAt:    f.updatedAt,
});

/* ────────────────────────────────────────────────────────────────────── */
/* OUTBOUND: Frontend Form Data → Backend Request DTO                    */
/* ────────────────────────────────────────────────────────────────────── */

export const toVehicleRequest = (form) => ({
  name:               form.name,
  registrationNumber: form.registrationNumber,
  model:              form.model,
  make:               form.make,
  year:               form.year ? Number(form.year) : null,
  type:               toVehicleTypeEnum(form.type),
  maxLoadCapacity:    Number(form.capacity),
  odometerReading:    form.odometer ? Number(form.odometer) : 0,
  acquisitionCost:    form.cost ? Number(form.cost) : null,
  status:             form.status ? toVehicleStatusEnum(form.status) : 'AVAILABLE',
  latitude:           form.latitude ? Number(form.latitude) : null,
  longitude:          form.longitude ? Number(form.longitude) : null,
  notes:              form.notes,
});

export const toDriverRequest = (form) => ({
  name:              form.name,
  licenseNumber:     form.licenseNumber,
  licenseCategory:   form.licenseCategory,
  licenseExpiryDate: form.licenseExpiry,        // backend expects licenseExpiryDate
  contactNumber:     form.contact,              // backend expects contactNumber
  email:             form.email,
  status:            form.status ? toDriverStatusEnum(form.status) : 'AVAILABLE',
  safetyScore:       form.safetyScore ? Number(form.safetyScore) : 90,
  latitude:          form.latitude ? Number(form.latitude) : null,
  longitude:         form.longitude ? Number(form.longitude) : null,
  notes:             form.notes,
});

export const toTripRequest = (form) => ({
  source:           form.origin,               // backend expects source
  destination:      form.destination,
  vehicleId:        Number(form.vehicleId),
  driverId:         Number(form.driverId),
  cargoWeight:      Number(form.cargoWeight),
  plannedDistance:  form.distance ? Number(form.distance) : null,
  remarks:          form.remarks,
});

export const toMaintenanceRequest = (form) => ({
  vehicleId:       Number(form.vehicleId),
  maintenanceType: (form.type ?? 'service').toUpperCase(),
  title:           form.title ?? form.type,
  description:     form.description ?? form.notes,
  estimatedCost:   form.cost ? Number(form.cost) : 0,
  scheduledDate:   form.date,
  technicianName:  form.technician,
  notes:           form.notes,
});

export const toFuelRequest = (form) => ({
  vehicleId:       Number(form.vehicleId),
  tripId:          form.tripId ? Number(form.tripId) : null,
  volumeLiters:    Number(form.fuel),               // frontend uses 'fuel' for liters
  pricePerLiter:   form.pricePerLiter
    ? Number(form.pricePerLiter)
    : form.fuel && form.cost
      ? Number(form.cost) / Number(form.fuel)       // derive from total cost / volume
      : null,
  date:            form.date || new Date().toISOString().split('T')[0],
  fuelStation:     form.station || form.fuelStation,
  location:        form.location,
  odometerReading: form.odometer ? Number(form.odometer) : null,
  notes:           form.notes,
});
