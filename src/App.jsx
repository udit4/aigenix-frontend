import { Routes, Route, Navigate } from 'react-router-dom';
import StatusTracker from './pages/StatusTracker';
import CustomerIntelligence from './pages/CustomerIntelligence';
import ReportGenerator from './pages/ReportGenerator';
import AttendanceExtractor from './pages/AttendanceExtractor';
import RojgarJobseeker from './pages/RojgarJobseeker';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/status-tracker" replace />} />
      <Route path="/status-tracker" element={<StatusTracker />} />
      <Route path="/customer-intelligence" element={<CustomerIntelligence />} />
      <Route path="/report-generator" element={<ReportGenerator />} />
      <Route path="/attendance" element={<AttendanceExtractor />} />
      <Route path="/rojgar-jobseeker" element={<RojgarJobseeker />} />
      <Route path="/rojgar-admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;