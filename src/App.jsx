import { Routes, Route, Navigate } from 'react-router-dom';
import StatusTracker from './pages/StatusTracker';
import CustomerIntelligence from './pages/CustomerIntelligence';
import ReportGenerator from './pages/ReportGenerator';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/status-tracker" replace />} />
      <Route path="/status-tracker" element={<StatusTracker />} />
      <Route path="/customer-intelligence" element={<CustomerIntelligence />} />
      <Route path="/report-generator" element={<ReportGenerator />} />
    </Routes>
  );
}

export default App;