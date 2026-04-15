import React, { useState, useEffect } from 'react';
import {
  Users, Layers, Settings, HelpCircle, Bell, History,
  ChevronLeft, ChevronRight, Lock, Copy, CheckCircle2,
  PieChart, Search, ArrowUpRight, ArrowDownRight, User, Database, Package, Sparkles, ChevronDown, Loader2
} from 'lucide-react';
import './CustomerIntelligence.css';

const API_BASE_URL = 'http://localhost:8000/api/v1/customers';

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
  const [customers, setCustomers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedLlm, setSelectedLlm] = useState("Llama 3.2 8B");
  const [isLlmDropdownOpen, setIsLlmDropdownOpen] = useState(false);

  const llmOptions = ["Llama 3.2 8B", "Llama 3.2 3B", "Qwen 2.5 7B", "Mistral NeMo", "On-Premise Default"];

  // 1. Fetch Customer List on Mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/`);
        const data = await response.json();
        setCustomers(data);
        setListLoading(false);
      } catch (err) {
        console.error("Failed to fetch customers", err);
        setListLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // 2. Fetch Profile when current index changes
  useEffect(() => {
    if (customers.length === 0) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const customerId = customers[currentIndex].customer_id;
        const response = await fetch(`${API_BASE_URL}/${customerId}/profile`);
        const data = await response.json();

        // Enhance with mock AI match data since backend doesn't provide it yet
        const topCat = data.top_categories?.[0]?.category || "Dining";
        const enhancedData = {
          ...data,
          aiMatch: {
            score: 91,
            productName: "MagniFi Fi-Federal Credit Card",
            tier: "Personalized Premium Tier Selection",
            rationale: `${data.name}'s spending profile shows a significant portion in ${topCat.toLowerCase()} delivery over the last quarter. The MagniFi card offers 5x reward points on curated partners which directly aligns with this highest-spend category.`,
            hook: `"Unlock 5x rewards on every transaction with Sapphire. Exclusive for your lifestyle."`
          }
        };

        setCustomer(enhancedData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentIndex, customers]);

  const handleNext = () => {
    if (currentIndex < customers.length - 1) setCurrentIndex(prev => prev + 1);
    setCopied(false);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    setCopied(false);
  };

  const copyHook = () => {
    if (customer) {
      navigator.clipboard.writeText(customer.aiMatch.hook);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Helper to format currency values to ₹XK
  const formatK = (val) => {
    if (!val) return "₹0";
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
    return `₹${val}`;
  };

  // SVG for the Donut Chart based on distribution
  const getDonutData = () => {
    if (!customer || !customer.top_categories) return { dDash: 0, tDash: 0, total: "₹0" };

    const cats = customer.top_categories;
    const dNorm = cats[0]?.share_pct || 0;
    const tNorm = cats[1]?.share_pct || 0;

    return {
      dDash: (dNorm / 100) * 314,
      tDash: (tNorm / 100) * 314,
      total: formatK(customer.total_monthly_spend)
    };
  };

  const { dDash, tDash, total } = getDonutData();

  return (
    <div className="ci-layout">
      {/* Left Sidebar */}
      <aside className="ci-sidebar">
        <div className="ci-logo-area">
          <div className="ci-logo-icon">C</div>
          <div className="ci-logo-text">
            <h2>CampaignIQ</h2>
            <p>INSTITUTIONAL ARCHITECT</p>
          </div>
        </div>

        <nav className="ci-nav">
          <div className="ci-nav-item active"><Users size={18} /> Employees</div>

          <div className="ci-custom-dropdown-container">
            <div style={{ fontSize: '11px', color: '#8A94A6', marginBottom: '8px', paddingLeft: '4px', fontWeight: 600, letterSpacing: '0.5px' }}>
              <Lock size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} /> ACTIVE MODEL
            </div>
            <div
              className="ci-custom-dropdown-value"
              onClick={() => setIsLlmDropdownOpen(!isLlmDropdownOpen)}
            >
              {selectedLlm}
              <ChevronDown size={14} style={{ transform: isLlmDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </div>

            {isLlmDropdownOpen && (
              <div className="ci-custom-dropdown-menu">
                {llmOptions.map(llm => (
                  <div
                    key={llm}
                    className={`ci-custom-dropdown-option ${selectedLlm === llm ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedLlm(llm);
                      setIsLlmDropdownOpen(false);
                    }}
                  >
                    {llm}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="ci-sidebar-bottom">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            <div className="ci-nav-item" style={{ padding: '8px 4px' }}><Settings size={18} /> Settings</div>
            <div className="ci-nav-item" style={{ padding: '8px 4px' }}><HelpCircle size={18} /> Support</div>
          </div>

          <div className="ci-sidebar-data">
            <div className="ci-sidebar-data-title">
              <Database size={12} /> DATA SOURCES ACTIVE
            </div>
            <div className="ci-sidebar-data-list">
              <div className="ci-sidebar-data-tag"><div className="ci-pulse"></div> Transaction Data</div>
              <div className="ci-sidebar-data-tag"><div className="ci-pulse"></div> Product Catalog</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="ci-main">
        {/* Top Navbar */}
        <header className="ci-topbar">
          <div className="ci-tabs">
            <div className="ci-tab active">Portfolio</div>
          </div>

          <div className="ci-user-area">
            <div style={{ display: 'flex', gap: '16px', color: '#64748b' }}>
              <Bell size={18} style={{ cursor: 'pointer' }} />
              <History size={18} style={{ cursor: 'pointer' }} />
            </div>
            <div className="ci-user-profile">
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>Priya Sharma</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Marketing Manager, Federal Bank</div>
              </div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ff7b72', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', overflow: 'hidden' }}>
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
            <h1>Employee Intelligence</h1>
            <p>Federal Bank — AI-Powered Product Matching</p>
          </div>

          <div className="ci-paginator">
            <button onClick={handlePrev} disabled={currentIndex === 0 || loading} style={{ opacity: (currentIndex === 0 || loading) ? 0.3 : 1 }}>
              <ChevronLeft size={16} />
            </button>
            <span>Employee <span style={{ color: '#0f172a' }}>{currentIndex + 1}</span> of {listLoading ? "..." : customers.length}</span>
            <button onClick={handleNext} disabled={currentIndex === customers.length - 1 || loading} style={{ opacity: (currentIndex === customers.length - 1 || loading) ? 0.3 : 1 }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Core Dashboard UI with Loading Overlay */}
        <div className="ci-dashboard">
          {loading && (
            <div className="ci-loading-overlay">
              <Loader2 className="ci-spin" size={48} color="#0052FF" />
              <p>Fetching Intelligence...</p>
            </div>
          )}

          {customer && (
            <>
              {/* LEFT PANEL : CUSTOMER SPECS */}
              <div className="ci-panel-left">
                <div className="ci-card">
                  {/* Profile Summary Strip */}
                  <div className="ci-profile-summary">
                    <div className="ci-profile-main">
                      <h2>{customer.name}</h2>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className="ci-profile-id">ID: {customer.customer_id}</span>
                        <div className="ci-detail-pill ci-salary">Income: {formatK(customer.monthly_salary)}</div>
                      </div>
                    </div>
                    <div className="ci-profile-details">
                      <div className="ci-detail-pill">Age: {customer.age || '28'}</div>
                      <div className="ci-detail-pill">{customer.city || 'Mumbai'}</div>
                      <div className="ci-detail-pill ci-occupation">{customer.occupation || 'Salaried'}</div>
                      <div className={`ci-detail-pill ci-risk-${customer.risk_profile ? customer.risk_profile.toLowerCase() : 'medium'}`}>
                        {customer.risk_profile || 'Medium'} Risk
                      </div>
                    </div>
                  </div>

                  {/* Existing Products */}
                  <div className="ci-existing-portfolio">
                    <div className="ci-section-title"><Lock size={14} /> EXISTING PORTFOLIO</div>
                    <div className="ci-portfolio-list">
                      {customer.existing_products.map(prod => (
                        <div key={prod} className="ci-portfolio-tag"><CheckCircle2 size={14} color="#10B981" /> {prod}</div>
                      ))}
                    </div>
                  </div>

                  {/* Spend Distribution */}
                  <div className="ci-spend-section">
                    <div style={{ width: '100%' }}>
                      <div className="ci-section-title-row">
                        <div className="ci-section-title"><PieChart size={14} /> SPEND DISTRIBUTION ANALYSIS</div>
                        <div className="ci-channel-badge">Preferred: {customer.primary_channel}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '64px', marginTop: '32px', paddingRight: '24px' }}>

                        <div className="ci-donut" style={{ flexShrink: 0 }}>
                          <svg viewBox="0 0 100 100" width="140" height="140" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#BAE6FD" strokeWidth="20" />
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3E8BFF" strokeWidth="20" strokeDasharray={`${dDash + tDash} 314`} />
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2563EB" strokeWidth="20" strokeDasharray={`${dDash} 314`} />
                          </svg>

                          <div className="ci-donut-center-overlay">
                            <div className="ci-donut-center">
                              <div className="label">TOTAL</div>
                              <div className="val">{total}</div>
                            </div>
                          </div>
                        </div>

                        <div className="ci-legend">
                          {customer.top_categories.slice(0, 3).map((cat, idx) => (
                            <div className="ci-legend-item" key={cat.category}>
                              <div>
                                <span className="ci-legend-dot" style={{ background: idx === 0 ? '#2563EB' : idx === 1 ? '#3E8BFF' : '#BAE6FD' }}></span>
                                {cat.category}
                              </div>
                              <div>{cat.share_pct}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* KPI Strip */}
                  <div className="ci-kpi-row">
                    <div className="ci-kpi-box">
                      <div className="label">Total Aggregated Spend</div>
                      <div className="val">{formatK(customer.total_monthly_spend * 12)}</div>
                    </div>
                    <div className="ci-kpi-box">
                      <div className="label">Avg Monthly Balance</div>
                      <div className="val">{formatK(customer.avg_monthly_balance)}</div>
                    </div>
                    <div className="ci-kpi-box">
                      <div className="label">Employee Tenure</div>
                      <div className="val">{customer.tenure_years} Yrs</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL : AI MATCH */}
              <div className="ci-panel-right">
                <div className="ci-match-card">
                  <div className="ci-match-header">
                    <div className="ci-ai-match-tag">TOP AI MATCH</div>
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default CustomerIntelligence;
