import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Building2, Globe, LogOut, TrendingUp, Download, Calendar, MessageSquare, Settings } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="ra-layout">
      {/* ... navigation and other sections ... */}
      <nav className="ra-navbar">
        <div className="ra-logo">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Seal_of_Uttarakhand.svg/250px-Seal_of_Uttarakhand.svg.png" 
            alt="Uttarakhand Logo" 
            className="ra-logo-img" 
          />
          <div className="ra-logo-text">
            <h2>Rojgar Prayag 2.0 | Admin Panel</h2>
            <p>Govt of Uttarakhand — Unified Portal for Skilling</p>
          </div>
        </div>
        
        <div className="ra-nav-right">
          <div className="ra-officer-info">
            <span className="ra-officer-name">Officer: Priya Negi</span>
            <span className="ra-officer-dept">Dept of Skills Development</span>
          </div>
          <Link to="/" className="ra-logout-link">
            <LogOut size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Logout
          </Link>
        </div>
      </nav>

      <main className="ra-main">
        {/* Stat Cards Row */}
        <div className="ra-stats-grid">
          <div className="ra-stat-card">
            <div className="ra-stat-title">Total Registered Jobseekers</div>
            <span className="ra-stat-value">53,284</span>
            <span className="ra-stat-subtitle ra-trend-up">
              <TrendingUp size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              ↑ 12% this month
            </span>
          </div>

          <div className="ra-stat-card">
            <div className="ra-stat-title">Active Service Providers</div>
            <span className="ra-stat-value">1,847</span>
            <span className="ra-stat-subtitle" style={{ color: 'var(--text-muted)' }}>across 8 districts</span>
          </div>

          <div className="ra-stat-card">
            <div className="ra-stat-title">Vacancies Filled (this year)</div>
            <span className="ra-stat-value">368</span>
            <span className="ra-stat-subtitle" style={{ color: 'var(--text-muted)' }}>Target: 500</span>
          </div>

          <div className="ra-stat-card">
            <div className="ra-stat-title">Departments Onboarded</div>
            <span className="ra-stat-value">35</span>
            <span className="ra-stat-subtitle" style={{ color: 'var(--text-muted)' }}>All state departments</span>
          </div>
        </div>

        {/* Charts Row */}
        <div className="ra-dashboard-grid">
          {/* Section 1: Service Providers */}
          <div className="ra-card">
            <div className="ra-card-header">
              <h3 className="ra-card-title">Service Providers by Category</h3>
              <select className="ra-select">
                <option>All Districts</option>
                <option>Dehradun</option>
                <option>Haridwar</option>
                <option>Nainital</option>
                <option>Almora</option>
              </select>
            </div>
            <div className="ra-bar-list">
              {[
                { name: 'Electricians', count: 412, total: 412 },
                { name: 'Plumbers', count: 387, total: 412 },
                { name: 'Carpenters', count: 298, total: 412 },
                { name: 'AC Technicians', count: 201, total: 412 },
                { name: 'Beauticians', count: 183, total: 412 },
                { name: 'Painters', count: 167, total: 412 },
                { name: 'Nursing Care', count: 142, total: 412 },
                { name: 'Diagnostic Services', count: 57, total: 412 },
              ].map((cat) => (
                <div key={cat.name} className="ra-bar-item">
                  <div className="ra-bar-info">
                    <span>{cat.name}</span>
                    <span>{cat.count}</span>
                  </div>
                  <div className="ra-bar-bg">
                    <div className="ra-bar-fill" style={{ width: `${(cat.count / cat.total) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Jobseekers by District */}
          <div className="ra-card">
            <div className="ra-card-header">
              <h3 className="ra-card-title">Jobseekers by District</h3>
            </div>
            <div className="ra-district-list">
              {[
                { name: 'Dehradun', count: 14820, total: 14820 },
                { name: 'Haridwar', count: 9340, total: 14820 },
                { name: 'Nainital', count: 6210, total: 14820 },
                { name: 'Udham Singh Nagar', count: 5870, total: 14820 },
                { name: 'Almora', count: 4120, total: 14820 },
                { name: 'Pauri Garhwal', count: 3890, total: 14820 },
                { name: 'Tehri', count: 3240, total: 14820 },
                { name: 'Others', count: 5794, total: 14820 },
              ].map((dist, idx) => (
                <div key={dist.name} className="ra-district-item">
                  <div className="ra-district-rank">{idx + 1}</div>
                  <div className="ra-district-content">
                    <div className="ra-district-info">
                      <span>{dist.name}</span>
                      <span>{dist.count.toLocaleString()}</span>
                    </div>
                    <div className="ra-district-bar-bg">
                      <div className="ra-district-bar-fill" style={{ width: `${(dist.count / dist.total) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Recent Applications */}
        <div className="ra-card" style={{ marginBottom: '32px' }}>
          <div className="ra-card-header">
            <h3 className="ra-card-title">Pending Provider Verifications</h3>
          </div>
          <div className="ra-table-container">
            <table className="ra-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>District</th>
                  <th>KYC Status</th>
                  <th>Applied On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Mohan Rawat', cat: 'Electrician', dist: 'Dehradun', status: 'Aadhaar Verified', date: '03 May 2026' },
                  { name: 'Sunita Bisht', cat: 'Beautician', dist: 'Haridwar', status: 'Pending', date: '02 May 2026' },
                  { name: 'Ravi Kumar', cat: 'Plumber', dist: 'Nainital', status: 'Aadhaar Verified', date: '01 May 2026' },
                  { name: 'Geeta Devi', cat: 'Nursing Care', dist: 'Almora', status: 'Pending', date: '30 Apr 2026' },
                  { name: 'Anil Chauhan', cat: 'Carpenter', dist: 'Tehri', status: 'Aadhaar Verified', date: '29 Apr 2026' },
                  { name: 'Pooja Shah', cat: 'AC Technician', dist: 'Dehradun', status: 'Aadhaar Verified', date: '28 Apr 2026' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{row.name}</td>
                    <td>{row.cat}</td>
                    <td>{row.dist}</td>
                    <td>
                      <span className={`ra-badge-kyc ${row.status === 'Pending' ? 'ra-badge-pending' : 'ra-badge-verified'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>{row.date}</td>
                    <td className="ra-action-btns">
                      <button className="ra-btn-approve" onClick={() => alert(`Provider ${row.name} approved`)}>Approve</button>
                      <button className="ra-btn-reject" onClick={() => alert(`Provider ${row.name} rejected`)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Quick Links */}
        <div className="ra-quick-links-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {[
            { label: 'Download MIS Report', icon: <Download size={20} /> },
            { label: 'Job Fair Management', icon: <Calendar size={20} /> },
            { label: 'Send SMS Alerts', icon: <MessageSquare size={20} /> },
            { label: 'Manage Departments', icon: <Settings size={20} /> },
          ].map((link) => (
            <div key={link.label} className="ra-card ra-quick-link" style={{ cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s' }}>
              <div style={{ color: 'var(--accent-orange)', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>{link.icon}</div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-blue)' }}>{link.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
