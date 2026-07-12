/**
 * Validates whether a vehicle registration number is unique
 */
export const isRegNumberUnique = (regNumber, vehicles, excludeId = null) => {
  const normalized = regNumber.trim().toUpperCase();
  return !vehicles.some(v => v.id !== excludeId && v.registrationNumber.trim().toUpperCase() === normalized);
};

/**
 * Checks if a vehicle can be dispatched (must be strictly 'Available')
 */
export const isVehicleAvailableForDispatch = (vehicle) => {
  if (!vehicle) return false;
  return vehicle.status === 'Available';
};

/**
 * Checks if a driver can be dispatched (must be strictly 'Available' and license not expired)
 */
export const isDriverAvailableForDispatch = (driver, currentDateStr = '2026-07-12') => {
  if (!driver) return false;
  
  // Check explicit status
  if (driver.status !== 'Available') return false;

  // Check license expiry
  if (!driver.licenseExpiry) return false;
  
  const expiry = new Date(driver.licenseExpiry);
  const current = new Date(currentDateStr);
  if (expiry < current) return false;

  return true;
};

/**
 * Checks if cargo weight exceeds vehicle capacity
 */
export const isCargoWithinCapacity = (cargoWeight, vehicle) => {
  if (!vehicle) return false;
  return Number(cargoWeight) <= Number(vehicle.capacity);
};
