import { Routes, Route, Navigate } from 'react-router-dom';
import StatusTracker from './pages/StatusTracker';
import CustomerIntelligence from './pages/CustomerIntelligence';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Root path automatically redirects to our status tracker interface */}
      <Route path="/" element={<Navigate to="/status-tracker" replace />} />
      <Route path="/status-tracker" element={<StatusTracker />} />
      <Route path="/customer-intelligence" element={<CustomerIntelligence />} />
      
      {/* Future endpoints (e.g. /cost-dashboard, /user-management) can be added cleanly here */}
    </Routes>
  );
}

export default App;
