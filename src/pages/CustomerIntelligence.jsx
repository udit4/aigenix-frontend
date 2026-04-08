import React, { useState } from 'react';
import { 
  Users, Layers, Settings, HelpCircle, Bell, History, 
  ChevronLeft, ChevronRight, Lock, Copy, CheckCircle2, 
  PieChart, Search, ArrowUpRight, ArrowDownRight, User, Database, Package, Sparkles
} from 'lucide-react';
import './CustomerIntelligence.css';

// Generating mock data for 20 customers
const mockCustomers = Array.from({ length: 20 }, (_, i) => {
  const isTarget = i === 0; // First profile customized closely to screenshot
  
  return {
    id: `CUST${String(i + 1).padStart(3, '0')}`,
    name: isTarget ? "Arjun Mehta" : `Customer ${i + 1}`,
    location: isTarget ? "Mumbai, MH" : ["Delhi, DL", "Bangalore, KA", "Chennai, TN", "Pune, MH"][Math.floor(Math.random() * 4)],
    age: isTarget ? 34 : Math.floor(Math.random() * 40) + 22,
    spendDistribution: {
      total: isTarget ? "₹42.8k" : `₹${(Math.random() * 100 + 10).toFixed(1)}k`,
      dining: isTarget ? 60 : Math.floor(Math.random() * 50) + 10,
      travel: isTarget ? 25 : Math.floor(Math.random() * 30) + 10,
      utilities: isTarget ? 15 : Math.floor(Math.random() * 40) + 10,
    },
    metrics: {
      totalSpend: isTarget ? "₹5.12L" : `₹${(Math.random() * 10 + 1).toFixed(2)}L`,
      avgBalance: isTarget ? "₹1.2L" : `₹${(Math.random() * 5 + 0.5).toFixed(2)}L`,
      tenure: isTarget ? "4.2 Yrs" : `${(Math.random() * 10 + 1).toFixed(1)} Yrs`,
    },
    existingProducts: isTarget 
      ? ["Federal Basic Savings", "Auto Loan"] 
      : ["Premium Savings", "Personal Loan"].slice(0, Math.floor(Math.random() * 2) + 1),
    insights: isTarget ? [
      "Frequent weekend transactions on Swiggy and Zomato (Avg ₹800/order).",
      "High wallet stickiness with utility bill autopayments active.",
      "International travel spikes identified every December.",
      "Preference for digital-first customer service interactions."
    ] : [
      "High proportion of spend on e-commerce platforms.",
      "Maintains strong monthly average balance.",
      "Occasional cross-border transactions identified.",
      "Low utilization of existing credit lines."
    ],
    aiMatch: {
      score: isTarget ? 91 : Math.floor(Math.random() * 20) + 75,
      productName: isTarget ? "MagniFi Fi-Federal Credit Card" : ["Celesta Credit Card", "Signet Credit Card", "Imperio Credit Card"][Math.floor(Math.random() * 3)],
      tier: "Personalized Premium Tier Selection",
      rationale: isTarget
        ? "Arjun's spending profile shows a 42% increase in dining and food delivery over the last quarter. The MagniFi card offers 5x reward points on curated dining partners which directly aligns with his highest-spend category, maximizing his potential cashback yield."
        : "Customer's spending behavior indicates a strong alignment with premium rewards structures, specifically optimized for digital and lifestyle spending categories.",
      hook: isTarget
        ? `"Unlock 5x rewards on every meal with Sapphire. Exclusive for your lifestyle."`
        : `"Get more from every purchase with a card designed around your spending habits."`
    }
  };
});

function CustomerIntelligence() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  
  const customer = mockCustomers[currentIndex];

  const handleNext = () => {
    if (currentIndex < mockCustomers.length - 1) setCurrentIndex(prev => prev + 1);
    setCopied(false);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    setCopied(false);
  };

  const copyHook = () => {
    navigator.clipboard.writeText(customer.aiMatch.hook);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG for the Donut Chart based on distribution
  const totalPercent = customer.spendDistribution.dining + customer.spendDistribution.travel + customer.spendDistribution.utilities;
  // Normalizing to 100 just in case
  const dNorm = (customer.spendDistribution.dining / totalPercent) * 100;
  const tNorm = (customer.spendDistribution.travel / totalPercent) * 100;
  
  // Calculate stroke-dasharray for CSS circle (using circumference ~ 314 for r=50)
  const dDash = (dNorm / 100) * 314;
  const tDash = (tNorm / 100) * 314;
  
  return (
    <div className="ci-layout">
      {/* Left Sidebar */}
      <aside className="ci-sidebar">
        <div className="ci-logo-area">
          <div className="ci-logo-icon">C</div>
          <div className="ci-logo-text">
            <h2>CampaignIQ</h2>
            <p>Institutional Architect</p>
          </div>
        </div>
        
        <nav className="ci-nav">
          <div className="ci-nav-item active"><Users size={18} /> Customers</div>
          <div className="ci-nav-item"><Layers size={18} /> Cohort Builder</div>
        </nav>
        
        <div className="ci-sidebar-bottom">
          <div className="ci-llm-badge">
            <Lock size={14} /> On-Premise LLM Active
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:'12px', marginTop:'24px'}}>
            <div className="ci-nav-item" style={{padding: '8px 4px'}}><Settings size={18} /> Settings</div>
            <div className="ci-nav-item" style={{padding: '8px 4px'}}><HelpCircle size={18} /> Support</div>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="ci-main">
        {/* Top Navbar */}
        <header className="ci-topbar">
          <div className="ci-tabs">
            <div className="ci-tab active">Portfolio</div>
            <div className="ci-tab">Analytics</div>
            <div className="ci-tab">Reports</div>
          </div>
          
          <div className="ci-user-area">
            <div style={{display: 'flex', gap: '16px', color: '#64748b'}}>
              <Bell size={18} style={{cursor: 'pointer'}} />
              <History size={18} style={{cursor: 'pointer'}} />
            </div>
            <div className="ci-user-profile">
              <div style={{textAlign: 'right'}}>
                <div style={{fontSize: '12px', fontWeight: 'bold', color: '#0f172a'}}>Priya Sharma</div>
                <div style={{fontSize: '10px', color: '#64748b'}}>Marketing Manager, Federal Bank</div>
              </div>
              <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#ff7b72', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', overflow: 'hidden'}}>
                {/* Fallback avatar visual */}
                <User size={20} />
              </div>
            </div>
            <button className="ci-btn ci-btn-blue">New Campaign</button>
          </div>
        </header>

        {/* Page Header */}
        <div className="ci-page-header">
          <div className="ci-page-title">
            <h1>Customer Intelligence</h1>
            <p>Federal Bank — AI-Powered Product Matching</p>
          </div>
          
          <div className="ci-paginator">
            <button onClick={handlePrev} disabled={currentIndex === 0} style={{opacity: currentIndex === 0 ? 0.3 : 1}}>
              <ChevronLeft size={16} />
            </button>
            <span>Customer <span style={{color: '#0f172a'}}>{currentIndex + 1}</span> of {mockCustomers.length}</span>
            <button onClick={handleNext} disabled={currentIndex === mockCustomers.length - 1} style={{opacity: currentIndex === mockCustomers.length - 1 ? 0.3 : 1}}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Core Dashboard UI */}
        <div className="ci-dashboard">
          
          {/* LEFT PANEL : CUSTOMER SPECS */}
          <div className="ci-panel-left">
            <div className="ci-card">
              {/* Profile Bar */}
              <div className="ci-profile-header">
                <div className="ci-profile-name">
                  <h2>{customer.name}</h2>
                  <p>CUSTOMER ID: {customer.id}</p>
                </div>
                <div className="ci-profile-meta">
                  <div className="ci-meta-item"><div className="label">Location</div><div className="val">{customer.location}</div></div>
                  <div className="ci-meta-item"><div className="label">Age</div><div className="val">{customer.age} Yrs</div></div>
                </div>
              </div>
              
              {/* Existing Products - specifically injected based on prompt */}
              <div className="ci-existing-portfolio">
                <div className="ci-section-title"><Lock size={14} /> EXISTING PORTFOLIO</div>
                <div className="ci-portfolio-list">
                  {customer.existingProducts.map(prod => (
                    <div key={prod} className="ci-portfolio-tag"><CheckCircle2 size={14} color="#10B981" /> {prod}</div>
                  ))}
                </div>
              </div>

              {/* Spend Distribution */}
              <div className="ci-spend-section">
                <div>
                  <div className="ci-section-title"><PieChart size={14} /> SPEND DISTRIBUTION ANALYSIS</div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '40px', marginTop: '24px'}}>
                    
                    {/* SVG Donut implementation matching the image */}
                    <div className="ci-donut">
                      <svg viewBox="0 0 100 100" width="140" height="140" style={{transform: 'rotate(-90deg)', position: 'absolute'}}>
                        {/* Base Circle / Light Blue / Utilities */}
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#BAE6FD" strokeWidth="20" />
                        
                        {/* Travel Circle / Medium Blue */}
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3E8BFF" strokeWidth="20" 
                          strokeDasharray={`${dDash + tDash} 314`} 
                        />
                        
                        {/* Dining Circle / Dark Blue */}
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2563EB" strokeWidth="20" 
                          strokeDasharray={`${dDash} 314`}
                        />
                      </svg>
                      
                      {/* Center white overlay for donut */}
                      <div style={{width: '90px', height: '90px', borderRadius: '50%', background: 'white', position: 'absolute', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'}}>
                         <div className="ci-donut-center">
                            <div className="label">TOTAL</div>
                            <div className="val">{customer.spendDistribution.total}</div>
                         </div>
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="ci-legend">
                      <div className="ci-legend-item">
                        <div><span className="ci-legend-dot" style={{background: '#2563EB'}}></span> Dining & Food</div>
                        <div>{customer.spendDistribution.dining}%</div>
                      </div>
                      <div className="ci-legend-item">
                        <div><span className="ci-legend-dot" style={{background: '#3E8BFF'}}></span> Travel & Fuel</div>
                        <div>{customer.spendDistribution.travel}%</div>
                      </div>
                      <div className="ci-legend-item">
                        <div><span className="ci-legend-dot" style={{background: '#BAE6FD'}}></span> Utilities & Others</div>
                        <div>{customer.spendDistribution.utilities}%</div>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>

              {/* KPI Strip */}
              <div className="ci-kpi-row">
                <div className="ci-kpi-box">
                  <div className="label">Total Aggregated Spend</div>
                  <div className="val">{customer.metrics.totalSpend}</div>
                </div>
                <div className="ci-kpi-box">
                  <div className="label">Avg Monthly Balance</div>
                  <div className="val">{customer.metrics.avgBalance}</div>
                </div>
                <div className="ci-kpi-box">
                  <div className="label">Customer Tenure</div>
                  <div className="val">{customer.metrics.tenure}</div>
                </div>
              </div>

              {/* Behavioral Insights */}
              <div style={{paddingBottom: '0'}}>
                <div className="ci-section-title" style={{padding: '32px 32px 0'}}><Sparkles size={14} /> BEHAVIORAL INSIGHTS</div>
                <div className="ci-behavior-grid">
                  {customer.insights.map((insight, idx) => (
                    <div className="ci-behavior-item" key={idx}>
                      <CheckCircle2 size={16} className="ci-behavior-icon" />
                      <div>{insight}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT PANEL : AI MATCH */}
          <div className="ci-panel-right">
            <div className="ci-match-card">
              
              <div className="ci-match-header">
                <div className="ci-ai-match-tag">TOP AI MATCH</div>
                <div className="ci-score-circle">
                  <span className="num">{customer.aiMatch.score}%</span>
                  <span className="text">SCORE</span>
                </div>
              </div>

              <div className="ci-product-title">{customer.aiMatch.productName}</div>
              <div className="ci-product-subtitle">{customer.aiMatch.tier}</div>

              <div className="ci-section-title">AI RATIONALE</div>
              <div className="ci-rationale">
                <p>"{customer.aiMatch.rationale}"</p>
              </div>

              <div className="ci-section-title">SUGGESTED CAMPAIGN HOOK</div>
              <div className="ci-hook-box">
                <p>{customer.aiMatch.hook}</p>
              </div>

              <div className="ci-match-actions">
                <button className="ci-btn-cta" onClick={copyHook}>
                  {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                  {copied ? "Hook Copied!" : "Copy Hook to Campaign"}
                </button>
                <button className="ci-btn-secondary">View Product Details</button>
              </div>

            </div>
          </div>
          
        </div>

        {/* Footer Active Trackers */}
        <div className="ci-footer-bar">
          <div className="ci-footer-title">
            <Database size={14} /> DATA SOURCES ACTIVE
          </div>
          <div className="ci-footer-tags">
            <div className="ci-footer-tag"><div className="ci-pulse"></div> Transaction Data</div>
            <div className="ci-footer-tag"><div className="ci-pulse"></div> Product Catalog</div>
            <div className="ci-footer-tag"><div className="ci-pulse"></div> LLM Engine</div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default CustomerIntelligence;
