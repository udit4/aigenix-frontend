import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { RefreshCw, Zap, CheckCircle2, Sun, Moon } from 'lucide-react';

function StatusTracker() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedGeo, setSelectedGeo] = useState('All');
  const [selectedBU, setSelectedBU] = useState('All Projects');

  // Apply theme class to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  // Utility to enforce a minimum delay for UX purposes
  const delay = ms => new Promise(res => setTimeout(res, ms));

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
      
      // We run the fetch and a 600ms minimum timeout concurrently.
      // This ensures the gorgeous loading overlay stays visible long enough for the user to register it!
      const [response] = await Promise.all([
        fetch(`${baseUrl}/status-tracker/refresh`),
        delay(600)
      ]);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result.data || []);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message + " - Please ensure backend is running at " + (import.meta.env.VITE_API_BASE_URL || '127.0.0.1:8000'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute Metrics
  const totalInitiatives = data.length;
  const activePOCs = data.filter(d => d.Status && d.Status.includes('Active POC')).length;
  const paidOrders = data.filter(d => d['Paid Order'] === 'Yes' || d['Paid Order'] === 'Paid').length;
  
  // Compute unique Geos safely
  const uniqueGeos = new Set();
  data.forEach(d => {
    if (d.Geo) {
      d.Geo.split(',').forEach(geo => {
        uniqueGeos.add(geo.trim());
      });
    }
  });

  // Dynamically compute Business Unit counts
  const buCounts = { 'All Projects': data.length };
  data.forEach(d => {
    const bu = d['Business Unit'];
    if (bu) {
      buCounts[bu] = (buCounts[bu] || 0) + 1;
    }
  });
  const uniqueBUs = Object.keys(buCounts).filter(k => k !== 'All Projects').sort();

  const filteredData = data.filter(row => {
    const matchGeo = selectedGeo === 'All' || (row.Geo && row.Geo.split(',').map(g => g.trim()).includes(selectedGeo));
    const matchBU = selectedBU === 'All Projects' || row['Business Unit'] === selectedBU;
    return matchGeo && matchBU;
  });

  return (
    <div className="app-container">
      {/* UX LOADER OVERLAY */}
      {loading && (
        <div className="overlay-loader">
          <div className="loader-box glass-panel">
            <RefreshCw size={36} className="spin" color="var(--accent-blue)" />
            <h3 style={{marginTop: '20px', fontSize: '18px'}}>Syncing Database...</h3>
            <p style={{color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px'}}>Fetching latest AIGenix initiatives</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="app-header">
        <div className="header-title-container">
          <div style={{background: 'rgba(62, 139, 255, 0.1)', padding: '8px', borderRadius: '8px'}}>
            <Zap size={24} color="var(--accent-blue)" />
          </div>
          <h1 style={{ fontWeight: 800, fontSize: '24px', letterSpacing: '-0.5px' }}>
            AIGeniX <span style={{fontWeight: 400, color: 'var(--text-muted)'}}>Initiative Tracker</span>
          </h1>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            style={{background: 'var(--bg-card)', border: '1px solid var(--border-glass)', padding: '8px', cursor: 'pointer', borderRadius: '8px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center'}}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <span className="last-refresh">
            Last refreshed: {format(lastRefreshed, 'hh:mm a, d MMM yyyy')}
          </span>
          <button className="btn-primary" onClick={fetchData} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </header>

      {error && (
        <div style={{color: '#ff6b6b', padding: '16px', background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)', borderRadius: '8px', fontSize: '14px'}}>
          ⚠️ {error}
        </div>
      )}

      {/* KPI DASHBOARD */}
      <section className="kpi-grid">
        <div className="kpi-card glass-panel" style={{borderTop: '3px solid var(--accent-blue)'}}>
          <h3 className="kpi-title">Total Initiatives</h3>
          <div className="kpi-value glow-blue">{totalInitiatives}</div>
          <p className="kpi-subtitle">Across all business units</p>
        </div>
        
        <div className="kpi-card glass-panel" style={{borderTop: '3px solid var(--accent-green)'}}>
          <h3 className="kpi-title">Active POCs</h3>
          <div className="kpi-value glow-green">{activePOCs}</div>
          <p className="kpi-subtitle">Currently in execution</p>
        </div>
        
        <div className="kpi-card glass-panel" style={{borderTop: '3px solid var(--accent-yellow)'}}>
          <h3 className="kpi-title">Paid Orders</h3>
          <div className="kpi-value glow-yellow">{paidOrders}</div>
          <p className="kpi-subtitle">Revenue-generating projects</p>
        </div>
        
        <div className="kpi-card glass-panel" style={{borderTop: '3px solid var(--accent-purple)'}}>
          <h3 className="kpi-title">Geos Active</h3>
          <div className="kpi-value glow-purple">{uniqueGeos.size}</div>
          <p className="kpi-subtitle" style={{textTransform: 'uppercase', fontSpacing: '1px'}}>
            {Array.from(uniqueGeos).join(' • ') || 'Loading...'}
          </p>
        </div>
      </section>

      {/* GEO FILTER */}
      <section style={{display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap'}}>
        <span style={{color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600, marginRight: '4px', letterSpacing: '0.5px'}}>GEO:</span>
        <button 
          onClick={() => setSelectedGeo('All')}
          style={{
            background: selectedGeo === 'All' ? 'var(--accent-blue)' : 'var(--bg-card)',
            color: selectedGeo === 'All' ? '#fff' : 'var(--text-muted)',
            border: `1px solid ${selectedGeo === 'All' ? 'var(--accent-blue)' : 'var(--border-glass)'}`,
            padding: '8px 24px', borderRadius: '24px', cursor: 'pointer', fontSize: '15px', fontWeight: 500, transition: 'all 0.2s', backdropFilter: 'blur(4px)'
          }}
        >
          All
        </button>
        {Array.from(uniqueGeos).sort().map(geo => (
          <button 
            key={geo}
            onClick={() => setSelectedGeo(geo)}
            style={{
              background: selectedGeo === geo ? 'var(--accent-blue)' : 'var(--bg-card)',
              color: selectedGeo === geo ? '#fff' : 'var(--text-muted)',
              border: `1px solid ${selectedGeo === geo ? 'var(--accent-blue)' : 'var(--border-glass)'}`,
              padding: '8px 24px', borderRadius: '24px', cursor: 'pointer', fontSize: '15px', fontWeight: 500, transition: 'all 0.2s', backdropFilter: 'blur(4px)'
            }}
          >
            {geo}
          </button>
        ))}
      </section>

      {/* DATA TABLE */}
      <section className="table-container glass-panel">
        
        {/* BU TABS */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-glass)', padding: '0 8px', overflowX: 'auto' }}>
          <div 
            onClick={() => setSelectedBU('All Projects')}
            style={{ 
              padding: '16px 20px', display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px',
              borderBottom: selectedBU === 'All Projects' ? '2px solid var(--accent-blue)' : '2px solid transparent',
              color: selectedBU === 'All Projects' ? 'var(--accent-blue)' : 'var(--text-muted)',
              fontWeight: 600, fontSize: '14px', transition: 'all 0.2s', whiteSpace: 'nowrap'
            }}
          >
            All Projects
            <span style={{ 
              background: selectedBU === 'All Projects' ? 'rgba(62, 139, 255, 0.15)' : (isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'), 
              color: selectedBU === 'All Projects' ? 'var(--accent-blue)' : 'var(--text-muted)',
              padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 
            }}>
              {buCounts['All Projects']}
            </span>
          </div>
          {uniqueBUs.map(bu => (
            <div 
              key={bu}
              onClick={() => setSelectedBU(bu)}
              style={{ 
                padding: '16px 20px', display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px',
                borderBottom: selectedBU === bu ? '2px solid var(--accent-blue)' : '2px solid transparent',
                color: selectedBU === bu ? 'var(--accent-blue)' : 'var(--text-muted)',
                fontWeight: 600, fontSize: '14px', transition: 'all 0.2s', whiteSpace: 'nowrap'
              }}
            >
              {bu}
              <span style={{ 
                background: selectedBU === bu ? 'rgba(62, 139, 255, 0.15)' : (isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'), 
                color: selectedBU === bu ? 'var(--accent-blue)' : 'var(--text-muted)',
                padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 
              }}>
                {buCounts[bu]}
              </span>
            </div>
          ))}
        </div>

        <table className="data-table" style={{ marginTop: '0' }}>
          <thead>
            <tr>
              <th style={{width: '20%'}}>Project</th>
              <th style={{width: '30%'}}>Business Objective</th>
              <th style={{width: '12%'}}>Status</th>
              <th style={{width: '8%'}}>Paid</th>
              <th style={{width: '10%'}}>Geo</th>
              <th style={{width: '20%'}}>Team</th>
            </tr>
          </thead>
          <tbody>
            {loading && data.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '60px', color: 'var(--text-muted)'}}>Fetching tracker data...</td></tr>
            ) : filteredData.length === 0 ? (
               <tr><td colSpan="6" style={{textAlign: 'center', padding: '60px', color: 'var(--text-muted)'}}>No initiatives found.</td></tr>
            ) : (
              filteredData.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="project-name">{row['Project Name'] || 'Unnamed Initiative'}</div>
                    <div className="project-bu">{row['Business Unit']}</div>
                  </td>
                  <td>
                    <div className="business-obj">
                      {row['Business Objective'] || '-'}
                    </div>
                  </td>
                  <td>
                    {row.Status ? (
                      <div className={`status-pill ${row.Status.includes('POC') ? 'green' : 'yellow'}`}>
                        <div className={`status-dot ${row.Status.includes('POC') ? 'green' : 'yellow'}`}></div>
                        {row.Status}
                      </div>
                    ) : <span style={{color: 'var(--text-muted)'}}>-</span>}
                  </td>
                  <td>
                    {row['Paid Order'] === 'Yes' || row['Paid Order'] === 'Paid' ? (
                      <span style={{color: 'var(--accent-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px'}}>
                        <CheckCircle2 size={16} /> Paid
                      </span>
                    ) : <span style={{color: 'var(--text-muted)'}}>-</span>}
                  </td>
                  <td>
                    {row.Geo ? (
                      <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                        {row.Geo.split(',').map(g => (
                          <span key={g.trim()} className="geo-tag">{g.trim()}</span>
                        ))}
                      </div>
                    ) : <span style={{color: 'var(--text-muted)'}}>-</span>}
                  </td>
                  <td>
                    <div className="team-details">{row['Working Team'] || '-'}</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default StatusTracker;
