import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import DashboardLayout from './layouts/DashboardLayout';
import OperationalOverview from './components/views/OperationalOverview';
import Vehicles from './components/views/Vehicles';
import Drivers from './components/views/Drivers';
import Trips from './components/views/Trips';
import Maintenance from './components/views/Maintenance';
import FuelExpenses from './components/FuelExpenses';
import Reports from './components/Reports';
import Settings from './components/Settings';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/common/ProtectedRoute';
import { TransitOpsProvider } from './hooks/TransitOpsContext';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <TransitOpsProvider>
                <DashboardLayout />
              </TransitOpsProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<OperationalOverview />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="trips" element={<Trips />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="fuel" element={<FuelExpenses />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
