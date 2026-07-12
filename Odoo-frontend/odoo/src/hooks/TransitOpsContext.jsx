/**
 * TransitOpsContext — API-driven global state with field normalization.
 *
 * All data from the backend is normalized to match what the UI expects.
 * All outgoing mutations transform UI form data to backend DTO format.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import vehiclesService    from '../services/vehiclesService';
import driversService     from '../services/driversService';
import tripsService       from '../services/tripsService';
import maintenanceService from '../services/maintenanceService';
import fuelService        from '../services/fuelService';
import dashboardService   from '../services/dashboardService';
import {
  normalizeVehicle, normalizeDriver, normalizeTrip, normalizeMaintenance, normalizeFuel,
  toVehicleRequest, toDriverRequest, toTripRequest, toMaintenanceRequest, toFuelRequest,
} from '../utils/normalizers';

const TransitOpsContext = createContext();

export const TransitOpsProvider = ({ children }) => {
  /* ------------------------------------------------------------------ */
  /* State                                                                 */
  /* ------------------------------------------------------------------ */
  const [vehicles,    setVehicles]    = useState([]);
  const [drivers,     setDrivers]     = useState([]);
  const [trips,       setTrips]       = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [fuel,        setFuel]        = useState([]);
  const [kpis,        setKpis]        = useState(null);
  const [toasts,      setToasts]      = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState({
    vehicles: false, drivers: false, trips: false,
    maintenance: false, fuel: false, kpis: false,
  });

  /* ------------------------------------------------------------------ */
  /* Toast helpers                                                         */
  /* ------------------------------------------------------------------ */
  const triggerToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const setKey = (key, val) => setLoading(prev => ({ ...prev, [key]: val }));

  /* ------------------------------------------------------------------ */
  /* Error extraction                                                      */
  /* ------------------------------------------------------------------ */
  const extractError = (err) => {
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.response?.data)           return String(err.response.data);
    if (err?.message)                  return err.message;
    return 'An unexpected error occurred.';
  };

  const normalizeArray = (data, fn) => {
    const arr = Array.isArray(data) ? data : data?.content ?? [];
    return arr.map(fn);
  };

  /* ================================================================== */
  /* FETCH functions                                                       */
  /* ================================================================== */
  const fetchVehicles = useCallback(async () => {
    setKey('vehicles', true);
    try {
      const data = await vehiclesService.getAll();
      setVehicles(normalizeArray(data, normalizeVehicle));
    } catch (err) {
      triggerToast('Failed to load vehicles: ' + extractError(err), 'error');
    } finally { setKey('vehicles', false); }
  }, [triggerToast]);

  const fetchDrivers = useCallback(async () => {
    setKey('drivers', true);
    try {
      const data = await driversService.getAll();
      setDrivers(normalizeArray(data, normalizeDriver));
    } catch (err) {
      triggerToast('Failed to load drivers: ' + extractError(err), 'error');
    } finally { setKey('drivers', false); }
  }, [triggerToast]);

  const fetchTrips = useCallback(async () => {
    setKey('trips', true);
    try {
      const data = await tripsService.getAll();
      setTrips(normalizeArray(data, normalizeTrip));
    } catch (err) {
      triggerToast('Failed to load trips: ' + extractError(err), 'error');
    } finally { setKey('trips', false); }
  }, [triggerToast]);

  const fetchMaintenance = useCallback(async () => {
    setKey('maintenance', true);
    try {
      const data = await maintenanceService.getAll();
      setMaintenance(normalizeArray(data, normalizeMaintenance));
    } catch (err) {
      triggerToast('Failed to load maintenance: ' + extractError(err), 'error');
    } finally { setKey('maintenance', false); }
  }, [triggerToast]);

  const fetchFuel = useCallback(async () => {
    setKey('fuel', true);
    try {
      const data = await fuelService.getAll();
      setFuel(normalizeArray(data, normalizeFuel));
    } catch (err) {
      triggerToast('Failed to load fuel logs: ' + extractError(err), 'error');
    } finally { setKey('fuel', false); }
  }, [triggerToast]);

  const fetchKpis = useCallback(async () => {
    setKey('kpis', true);
    try {
      const data = await dashboardService.getKpis();
      setKpis(data);
    } catch (err) {
      console.warn('KPI fetch failed:', extractError(err));
    } finally { setKey('kpis', false); }
  }, []);

  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
    fetchTrips();
    fetchMaintenance();
    fetchFuel();
    fetchKpis();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ================================================================== */
  /* VEHICLES                                                             */
  /* ================================================================== */
  const addVehicle = async (vehicle) => {
    try {
      const created = await vehiclesService.create(toVehicleRequest(vehicle));
      setVehicles(prev => [normalizeVehicle(created), ...prev]);
      triggerToast(`Vehicle ${created.name} added successfully!`, 'success');
      return true;
    } catch (err) {
      triggerToast(extractError(err), 'error');
      return false;
    }
  };

  const editVehicle = async (id, updatedVehicle) => {
    try {
      const updated = await vehiclesService.update(id, toVehicleRequest(updatedVehicle));
      setVehicles(prev => prev.map(v => String(v.id) === String(id) ? normalizeVehicle(updated) : v));
      triggerToast(`Vehicle updated.`, 'success');
      return true;
    } catch (err) {
      triggerToast(extractError(err), 'error');
      return false;
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await vehiclesService.delete(id);
      setVehicles(prev => prev.filter(v => String(v.id) !== String(id)));
      triggerToast('Vehicle deleted successfully.', 'success');
      return true;
    } catch (err) {
      triggerToast(extractError(err), 'error');
      return false;
    }
  };

  /* ================================================================== */
  /* DRIVERS                                                              */
  /* ================================================================== */
  const addDriver = async (driver) => {
    try {
      const created = await driversService.create(toDriverRequest(driver));
      setDrivers(prev => [normalizeDriver(created), ...prev]);
      triggerToast(`Driver ${created.name} added successfully.`, 'success');
      return true;
    } catch (err) {
      triggerToast(extractError(err), 'error');
      return false;
    }
  };

  const editDriver = async (id, updatedDriver) => {
    try {
      const updated = await driversService.update(id, toDriverRequest(updatedDriver));
      setDrivers(prev => prev.map(d => String(d.id) === String(id) ? normalizeDriver(updated) : d));
      triggerToast(`Driver updated.`, 'success');
      return true;
    } catch (err) {
      triggerToast(extractError(err), 'error');
      return false;
    }
  };

  const deleteDriver = async (id) => {
    try {
      await driversService.delete(id);
      setDrivers(prev => prev.filter(d => String(d.id) !== String(id)));
      triggerToast('Driver profile removed.', 'success');
      return true;
    } catch (err) {
      triggerToast(extractError(err), 'error');
      return false;
    }
  };

  /* ================================================================== */
  /* TRIPS                                                                */
  /* ================================================================== */
  const addTrip = async (tripForm) => {
    try {
      const created    = await tripsService.create(toTripRequest(tripForm));
      const dispatched = await tripsService.dispatch(created.id);
      setTrips(prev => [normalizeTrip(dispatched), ...prev]);
      fetchVehicles();
      fetchDrivers();
      triggerToast(`Trip ${dispatched.id} dispatched successfully!`, 'success');
      return true;
    } catch (err) {
      triggerToast(extractError(err), 'error');
      return false;
    }
  };

  const dispatchTrip = async (tripId) => {
    try {
      const updated = await tripsService.dispatch(tripId);
      setTrips(prev => prev.map(t => String(t.id) === String(tripId) ? normalizeTrip(updated) : t));
      fetchVehicles();
      fetchDrivers();
      triggerToast(`Trip ${tripId} dispatched.`, 'info');
    } catch (err) {
      triggerToast(extractError(err), 'error');
    }
  };

  const completeTrip = async (tripId) => {
    try {
      const updated = await tripsService.complete(tripId, {});
      setTrips(prev => prev.map(t => String(t.id) === String(tripId) ? normalizeTrip(updated) : t));
      fetchVehicles();
      fetchDrivers();
      triggerToast(`Trip ${tripId} marked as Completed. Assets returned to depot.`, 'success');
    } catch (err) {
      triggerToast(extractError(err), 'error');
    }
  };

  const cancelTrip = async (tripId, reason) => {
    try {
      const updated = await tripsService.cancel(tripId, reason);
      setTrips(prev => prev.map(t => String(t.id) === String(tripId) ? normalizeTrip(updated) : t));
      fetchVehicles();
      fetchDrivers();
      triggerToast(`Trip ${tripId} has been Cancelled. Assets released.`, 'warning');
    } catch (err) {
      triggerToast(extractError(err), 'error');
    }
  };

  /* ================================================================== */
  /* MAINTENANCE                                                          */
  /* ================================================================== */
  const addMaintenance = async (task) => {
    try {
      const created   = await maintenanceService.create(toMaintenanceRequest(task));
      const activated = await maintenanceService.activate(created.id);
      setMaintenance(prev => [normalizeMaintenance(activated), ...prev]);
      fetchVehicles();
      triggerToast(`Maintenance scheduled. Vehicle moved to In Shop.`, 'success');
      return true;
    } catch (err) {
      triggerToast(extractError(err), 'error');
      return false;
    }
  };

  const completeMaintenance = async (taskId, actualCost) => {
    try {
      const updated = await maintenanceService.complete(taskId, actualCost);
      setMaintenance(prev => prev.map(m => String(m.id) === String(taskId) ? normalizeMaintenance(updated) : m));
      fetchVehicles();
      triggerToast(`Maintenance task ${taskId} completed. Vehicle returned to Available.`, 'success');
    } catch (err) {
      triggerToast(extractError(err), 'error');
    }
  };

  const updateMaintenanceStatus = async (taskId, newStatus) => {
    try {
      if (newStatus === 'In Progress' || newStatus === 'Active' || newStatus === 'IN_PROGRESS') {
        const updated = await maintenanceService.activate(taskId);
        setMaintenance(prev => prev.map(m => String(m.id) === String(taskId) ? normalizeMaintenance(updated) : m));
        fetchVehicles();
      } else if (newStatus === 'Completed' || newStatus === 'COMPLETED') {
        await completeMaintenance(taskId);
        return;
      }
      triggerToast(`Task ${taskId} status updated.`, 'info');
    } catch (err) {
      triggerToast(extractError(err), 'error');
    }
  };

  /* ================================================================== */
  /* FUEL                                                                 */
  /* ================================================================== */
  const addFuelLog = async (log) => {
    try {
      const created = await fuelService.create(toFuelRequest(log));
      setFuel(prev => [normalizeFuel(created), ...prev]);
      triggerToast(`Fuel log recorded.`, 'success');
      return true;
    } catch (err) {
      triggerToast(extractError(err), 'error');
      return false;
    }
  };

  const editFuelLog = async (id, log) => {
    try {
      const updated = await fuelService.update(id, toFuelRequest(log));
      setFuel(prev => prev.map(f => String(f.id) === String(id) ? normalizeFuel(updated) : f));
      triggerToast('Fuel log updated.', 'success');
      return true;
    } catch (err) {
      triggerToast(extractError(err), 'error');
      return false;
    }
  };

  const deleteFuelLog = async (id) => {
    try {
      await fuelService.delete(id);
      setFuel(prev => prev.filter(f => String(f.id) !== String(id)));
      triggerToast('Fuel log deleted.', 'success');
      return true;
    } catch (err) {
      triggerToast(extractError(err), 'error');
      return false;
    }
  };

  /* ================================================================== */
  /* Context value                                                         */
  /* ================================================================== */
  return (
    <TransitOpsContext.Provider value={{
      vehicles, drivers, trips, maintenance, fuel, kpis, loading,
      toasts, triggerToast, removeToast,
      searchQuery, setSearchQuery,
      fetchVehicles, fetchDrivers, fetchTrips, fetchMaintenance, fetchFuel, fetchKpis,
      addVehicle, editVehicle, deleteVehicle,
      addDriver, editDriver, deleteDriver,
      addTrip, dispatchTrip, completeTrip, cancelTrip,
      addMaintenance, completeMaintenance, updateMaintenanceStatus,
      addFuelLog, editFuelLog, deleteFuelLog,
    }}>
      {children}
    </TransitOpsContext.Provider>
  );
};

export const useTransitOps = () => {
  const context = useContext(TransitOpsContext);
  if (!context) throw new Error('useTransitOps must be used within a TransitOpsProvider');
  return context;
};

export default TransitOpsContext;
