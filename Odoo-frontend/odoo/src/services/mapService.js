import api from './api';

export const mapService = {
  getFleetLocations: async () => {
    const res = await api.get('/api/map/fleet');
    return res.data;
  },

  getVehicleLocation: async (vehicleId) => {
    const res = await api.get(`/api/map/vehicle/${vehicleId}`);
    return res.data;
  },
};

export default mapService;
