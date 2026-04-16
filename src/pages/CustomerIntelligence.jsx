import React, { useState, useEffect } from 'react';
import { 
  Users, Layers, Settings, HelpCircle, Bell, History, 
  ChevronLeft, ChevronRight, Lock, Copy, CheckCircle2, 
  PieChart, Search, ArrowUpRight, ArrowDownRight, User, Database, Package, Sparkles, ChevronDown,
  RefreshCw, TrendingUp, Briefcase, MapPin, Calendar, Percent, CreditCard, Wallet, Landmark,
  Loader2, ExternalLink
} from 'lucide-react';
import './CustomerIntelligence.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

function CustomerIntelligence() {
  const [customers, setCustomers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedLlm, setSelectedLlm] = useState("Llama 3.2 8B");
  const [isLlmDropdownOpen, setIsLlmDropdownOpen] = useState(false);
  
  const llmOptions = ["Llama 3.2 8B", "Llama 3.2 1B", "Qwen 2.5 7B", "Mistral NeMo", "On-Premise Default"];
  const [activeTab, setActiveTab] = useState("Portfolio"); // "Portfolio" or "Campaign"
  const [activeSidebarTab, setActiveSidebarTab] = useState("Employee");
  
  const [pgSelectedCustId, setPgSelectedCustId] = useState("");
  const [pgSelectedCategory, setPgSelectedCategory] = useState("");
  const [pgCategories, setPgCategories] = useState([]);
  const [pgMatchResult, setPgMatchResult] = useState(null);
  const [isPgMatching, setIsPgMatching] = useState(false);
  
  const commonCategories = ["Dining", "Travel", "Fuel", "Groceries", "Shopping", "Entertainment", "Utilities", "Investment", "Health", "Education"];

  // 1. Fetch initial customer list
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/customers/`);
        if (!res.ok) throw new Error("Failed to fetch customer list");
        const data = await res.json();
        const customerList = Array.isArray(data) ? data : (data.data && Array.isArray(data.data) ? data.data : []);
        setCustomers(customerList);
        if (customerList.length === 0) setLoading(false);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // 2. Fetch profile whenever index or customers change
  useEffect(() => {
    if (customers.length > 0) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const cId = customers[currentIndex].customer_id || customers[currentIndex].id;
          const res = await fetch(`${API_BASE_URL}/customers/${cId}/profile`);
          if (!res.ok) throw new Error("Failed to fetch customer profile");
          const data = await res.json();
          setCustomer(data);
        } catch (err) {
          console.error("Error fetching profile:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
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
    const hook = customer?.product_matching?.campaign_notification || customer?.product_matching?.why_this_match;
    if (hook) {
      navigator.clipboard.writeText(hook);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Helper to format currency
  const fmt = (val) => {
    if (val === undefined || val === null) return "₹0";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const fmtK = (val) => {
    if (val === undefined || val === null) return "₹0";
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
    return `₹${val}`;
  };

  if (!customer && loading) {
    return (
      <div className="ci-layout" style={{justifyContent: 'center', alignItems: 'center', background: '#0B1120'}}>
        <div style={{textAlign: 'center', color: 'white'}}>
           <RefreshCw size={48} className="ci-spin" color="#3E8BFF" style={{marginBottom: '24px'}} />
           <h2 style={{fontSize: '20px', fontWeight: 700}}>Initializing CampaignIQ Engine</h2>
           <p style={{color: '#8A94A6', marginTop: '8px'}}>Syncing intelligence data...</p>
        </div>
      </div>
    );
  }

  if (!customer && !loading && customers.length === 0) {
    return (
      <div className="ci-layout" style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <Database size={48} color="#cbd5e1" style={{marginBottom: '16px'}} />
          <h2 style={{fontSize: '18px', color: '#64748b'}}>No customer records found.</h2>
          <p style={{color: '#94a3b8', marginTop: '8px'}}>Please run the ingestion pipeline.</p>
        </div>
      </div>
    );
  }

  if (!customer && !loading && customers.length > 0) {
    return (
      <div className="ci-layout" style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <h2 style={{fontSize: '18px', color: '#64748b'}}>Unable to load profile data.</h2>
          <p style={{color: '#94a3b8', marginTop: '8px'}}>Check API connection.</p>
        </div>
      </div>
    );
  }

  const catColors = ['#2563EB', '#3E8BFF', '#7DD3FC', '#BAE6FD', '#E0F2FE'];

  const getDonutSegments = () => {
    if (!customer?.top_categories?.length) return null;
    let offset = 0;
    return customer.top_categories.slice(0, 3).map((cat, idx) => {
      const dashArray = `${(cat.share_pct / 100) * 251.2} 251.2`;
      const currentOffset = offset;
      offset -= (cat.share_pct / 100) * 251.2;
      return {
        dashArray,
        offset: currentOffset,
        color: catColors[idx],
        category: cat.category,
        pct: cat.share_pct
      };
    });
  };

  const segments = getDonutSegments();

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
          <div className={`ci-nav-item ${activeSidebarTab === "Employee" ? "active" : ""}`} onClick={() => setActiveSidebarTab("Employee")}><Users size={18} /> Employee</div>
          <div className={`ci-nav-item ${activeSidebarTab === "Playground" ? "active" : ""}`} onClick={() => setActiveSidebarTab("Playground")}><Layers size={18} /> Playground</div>

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
              <div className="ci-sidebar-data-tag"><div className="ci-pulse"></div> Local Matching Engine</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="ci-main">
        {loading && (
          <div className="ci-loading-overlay">
            <RefreshCw size={36} className="ci-spin" color="#3E8BFF" />
            <p style={{fontWeight: 600, color: '#3E8BFF', fontSize: '14px'}}>Fetching Intelligence...</p>
          </div>
        )}

        {/* Top Navbar */}
        <header className="ci-topbar">
          <div className="ci-tabs">
            {activeSidebarTab === "Employee" ? (
              <>
                <div className={`ci-tab ${activeTab === "Portfolio" ? "active" : ""}`} onClick={() => setActiveTab("Portfolio")}>Portfolio</div>
                <div className={`ci-tab ${activeTab === "Campaign" ? "active" : ""}`} onClick={() => setActiveTab("Campaign")}>Campaign Overview</div>
              </>
            ) : (
                <div className="ci-tab active">Interactive Match</div>
            )}
          </div>

          <div className="ci-user-area">
            <div style={{ display: 'flex', gap: '16px', color: '#64748b' }}>
              <Bell size={18} style={{ cursor: 'pointer' }} />
              <History size={18} style={{ cursor: 'pointer' }} />
            </div>
            <div className="ci-user-profile">
              <div style={{textAlign: 'right'}}>
                <div style={{fontSize: '12px', fontWeight: 'bold', color: '#0f172a'}}>Priya Sharma</div>
                <div style={{fontSize: '10px', color: '#64748b'}}>Marketing Manager, Federal Bank</div>
              </div>
              <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#ff7b72', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'}}>
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {activeSidebarTab === "Playground" ? (
          <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
            <div className="ci-page-header">
              <div className="ci-page-title">
                <h1>LLM Match Playground</h1>
                <p>Simulate customer attributes and test realtime semantic matching.</p>
              </div>
              <div className="ci-paginator">
                <button onClick={handlePrev} disabled={currentIndex === 0 || loading} style={{ opacity: (currentIndex === 0 || loading) ? 0.3 : 1 }}>
                  <ChevronLeft size={16} />
                </button>
                <span>Customer <span style={{color: '#0f172a', fontSize: '15px'}}>{currentIndex + 1}</span> of {customers.length}</span>
                <button onClick={handleNext} disabled={currentIndex === customers.length - 1} style={{opacity: currentIndex === customers.length - 1 ? 0.3 : 1}}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            
            {customer && !loading && (
              <div className="ci-dashboard">
                <div className="ci-panel-left">
                  <div className="ci-card">
                    <div className="ci-profile-header" style={{padding: '24px 32px', borderBottom: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px'}}>
                      <div className="ci-detail-box" style={{gridColumn: 'span 2'}}>
                         <div className="label" style={{fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase'}}>Customer Name</div>
                         <div className="val" style={{fontSize: '20px', fontWeight: 750, color: '#0f172a'}}>{customer.name}</div>
                      </div>
                      <div className="ci-detail-box">
                         <div className="label" style={{fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase'}}>Customer ID</div>
                         <div className="val" style={{fontSize: '14px', fontWeight: 700}}>{customer.customer_id}</div>
                      </div>
                      <div className="ci-detail-box">
                         <div className="label" style={{fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase'}}>Age</div>
                         <div className="val" style={{fontSize: '14px', fontWeight: 700}}>{customer.age} Yrs</div>
                      </div>
                      <div className="ci-detail-box">
                         <div className="label" style={{fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase'}}>Risk Profile</div>
                         <div className="val">
                            <span className={`ci-risk-tag ci-risk-${(customer.risk_profile || 'Medium').toLowerCase()}`} style={{padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700}}>
                              {customer.risk_profile}
                            </span>
                         </div>
                      </div>
                      <div className="ci-detail-box">
                         <div className="label" style={{fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase'}}>Location</div>
                         <div className="val" style={{fontSize: '14px', fontWeight: 700}}>{customer.city}</div>
                      </div>
                      <div className="ci-detail-box">
                         <div className="label" style={{fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase'}}>EMI Load</div>
                         <div className="val" style={{fontSize: '14px', fontWeight: 700}}>{fmt(customer.emi_load)}</div>
                      </div>
                      <div className="ci-detail-box">
                         <div className="label" style={{fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase'}}>Channel</div>
                         <div className="val" style={{fontSize: '14px', fontWeight: 700}}>{customer.primary_channel}</div>
                      </div>
                    </div>

                    <div className="ci-spend-section" style={{padding: '32px'}}>
                      <div className="ci-section-title" style={{fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'}}><PieChart size={14} /> SPEND CATEGORIES (EDITABLE)</div>
                      
                      <div style={{display: 'flex', gap: 12, marginBottom: 24}}>
                          <select 
                             value={pgSelectedCategory} 
                             onChange={e => setPgSelectedCategory(e.target.value)}
                             style={{flex: 1, padding: '10px 16px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', color: '#0f172a', fontWeight: 600, background: '#f8fafc'}}
                          >
                             <option value="">-- Select Category --</option>
                             {commonCategories.map(cat => (
                               <option key={cat} value={cat}>{cat}</option>
                             ))}
                          </select>
                          <button 
                             onClick={() => {
                               if(pgSelectedCategory && !pgCategories.includes(pgSelectedCategory)) {
                                 setPgCategories([...pgCategories, pgSelectedCategory]);
                                 setPgSelectedCategory("");
                               }
                             }}
                             className="ci-btn-cta"
                             style={{padding: '0 32px', borderRadius: 8, fontSize: 13, border: 'none', fontWeight: 600, cursor: 'pointer'}}
                          >
                             Add
                          </button>
                      </div>

                      {pgCategories.length > 0 ? (
                         <div style={{display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32}}>
                            {pgCategories.map(c => (
                               <div key={c} style={{background: '#eff6ff', border: '1px solid #bfdbfe', padding: '8px 16px', borderRadius: 24, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, color: '#1e3a8a'}}>
                                  {c} 
                                  <span style={{cursor: 'pointer', color: '#ef4444', fontSize: '15px', marginLeft: 4}} onClick={() => setPgCategories(pgCategories.filter(x => x !== c))}>&times;</span>
                               </div>
                            ))}
                         </div>
                      ) : (
                         <div style={{fontSize: 13, color: '#94a3b8', fontStyle: 'italic', marginBottom: 32, padding: '16px', background: '#f1f5f9', borderRadius: 8, textAlign: 'center'}}>No categories added yet. Add categories to simulate spend profile.</div>
                      )}

                      <div>
                        <button className="ci-btn-cta" onClick={async () => {
                           if(pgCategories.length === 0) return;
                           setIsPgMatching(true);
                           setPgMatchResult(null);
                           try {
                             const payload = {
                               customer_id: customer.customer_id || customer.id,
                               name: customer.name,
                               age: customer.age,
                               city: customer.city,
                               occupation: customer.occupation,
                               risk_profile: customer.risk_profile,
                               avg_monthly_balance: customer.avg_monthly_balance,
                               monthly_salary: customer.monthly_salary,
                               existing_products: customer.existing_products,
                               tenure_years: customer.tenure_years,
                               emi_load: customer.emi_load,
                               primary_channel: customer.primary_channel,
                               top_categories: pgCategories.map((c, i) => ({
                                 category: c,
                                 monthly_avg: 15000 + (i * 2000), 
                                 frequency: 5,
                                 share_pct: 100 / pgCategories.length
                               })),
                               total_monthly_spend: 50000
                             };
                             const res = await fetch(`${API_BASE_URL}/customers/realtime-match`, {
                               method: "POST",
                               headers: { "Content-Type": "application/json" },
                               body: JSON.stringify(payload)
                             });
                             const data = await res.json();
                             setPgMatchResult(data.product_matching || data);
                           } catch(e) {
                             console.error(e);
                           }
                           setIsPgMatching(false);
                        }} style={{width: '100%', padding: '16px', borderRadius: 8, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12}}>
                           {isPgMatching ? <RefreshCw className="ci-spin" size={18} /> : <Sparkles size={18} />}
                           {isPgMatching ? "Generating Match..." : "Run LLM Match"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="ci-panel-right">
                  <div className="ci-match-card" style={{padding: '32px'}}>
                    <div style={{fontSize: '11px', color: '#6366f1', fontWeight: 800, textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '1px'}}>Realtime Playground AI Match</div>

                    {isPgMatching && (
                       <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60%', textAlign:'center'}}>
                          <RefreshCw className="ci-spin" size={40} color="#3E8BFF" style={{marginBottom:16}} />
                          <span style={{color: '#3E8BFF', fontSize: 14, fontWeight: 700}}>Analyzing semantic spend profile...</span>
                       </div>
                    )}
                    
                    {!isPgMatching && pgMatchResult && (pgMatchResult.matched_product_name || pgMatchResult.product_name) && (
                       <>
                          <div style={{fontSize: '24px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: '8px'}}>{pgMatchResult.matched_product_name || pgMatchResult.product_name}</div>
                          <div style={{fontSize: '13px', color: '#64748b', fontWeight: 500, marginBottom: '32px'}}>Simulated Recommendation</div>
                          
                          <div className="ci-section-title" style={{fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: 12}}>STRATEGIC RATIONALE</div>
                          <div className="ci-rationale" style={{borderLeft: '3px solid #cbd5e1', paddingLeft: 16, marginBottom: 32}}>
                            <p style={{fontSize: 14, color: '#475569', fontStyle: 'italic', margin: 0, lineHeight: 1.6}}>"{pgMatchResult.why_this_match}"</p>
                          </div>
                          
                          <div className="ci-section-title" style={{fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: 12}}>CAMPAIGN NOTIFICATION</div>
                          <div className="ci-hook-box" style={{background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 40}}>
                             <p style={{fontSize: '15px', fontWeight: 700, margin: 0, color: '#0f172a', lineHeight: 1.4}}>
                                "{pgMatchResult.campaign_notification}"
                             </p>
                          </div>
                          
                          <button className="ci-btn-cta" onClick={() => {
                             navigator.clipboard.writeText(pgMatchResult.campaign_notification);
                             setCopied(true);
                             setTimeout(() => setCopied(false), 2000);
                          }} style={{width: '100%', background: '#0052FF', color: 'white', padding: '16px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}}>
                             {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                             {copied ? "Copied!" : "Copy Hook"}
                          </button>
                       </>
                    )}
                    
                    {!isPgMatching && pgMatchResult && !pgMatchResult.matched_product_name && !pgMatchResult.product_name && (
                       <div style={{padding: 24, background: '#fef2f2', color: '#ef4444', borderRadius: 8, fontSize: 14, fontWeight: 600, border: '1px solid #fecaca'}}>
                          Could not generate an AI product mapping.
                       </div>
                    )}
                    
                    {!isPgMatching && !pgMatchResult && (
                       <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60%', textAlign:'center', color: '#94a3b8'}}>
                          <Sparkles size={48} style={{marginBottom: '16px', opacity: 0.5}} />
                          <p style={{fontSize: '14px'}}>Add spend categories and press Run LLM Match to simulate.</p>
                       </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
            {/* Page Header */}
            <div className="ci-page-header">
              <div className="ci-page-title">
                <h1>Customer Intelligence</h1>
                <p>Federal Bank — AI-Powered Product Matching</p>
              </div>
    
              <div className="ci-paginator">
                <button onClick={handlePrev} disabled={currentIndex === 0 || loading} style={{ opacity: (currentIndex === 0 || loading) ? 0.3 : 1 }}>
                  <ChevronLeft size={16} />
                </button>
                <span>Customer <span style={{color: '#0f172a', fontSize: '15px'}}>{currentIndex + 1}</span> of {customers.length}</span>
                <button onClick={handleNext} disabled={currentIndex === customers.length - 1} style={{opacity: currentIndex === customers.length - 1 ? 0.3 : 1}}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            {activeTab === "Portfolio" ? (
          <div className="ci-dashboard">
            
            {/* LEFT PANEL : CUSTOMER SPECS */}
            <div className="ci-panel-left">
              <div className="ci-card">
                
                {/* Profile Header Details - Requested Order */}
                <div className="ci-profile-header" style={{padding: '24px 32px', borderBottom: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px'}}>
                  <div className="ci-detail-box" style={{gridColumn: 'span 2'}}>
                     <div className="label" style={{fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase'}}>Customer Name</div>
                     <div className="val" style={{fontSize: '20px', fontWeight: 750, color: '#0f172a'}}>{customer.name}</div>
                  </div>
                  <div className="ci-detail-box">
                     <div className="label" style={{fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase'}}>Customer ID</div>
                     <div className="val" style={{fontSize: '14px', fontWeight: 700}}>{customer.customer_id}</div>
                  </div>
                  <div className="ci-detail-box">
                     <div className="label" style={{fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase'}}>Age</div>
                     <div className="val" style={{fontSize: '14px', fontWeight: 700}}>{customer.age} Yrs</div>
                  </div>
                  
                  <div className="ci-detail-box">
                     <div className="label" style={{fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase'}}>Risk Profile</div>
                     <div className="val">
                        <span className={`ci-risk-tag ci-risk-${(customer.risk_profile || 'Medium').toLowerCase()}`} style={{padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700}}>
                          {customer.risk_profile}
                        </span>
                     </div>
                  </div>
                  <div className="ci-detail-box">
                     <div className="label" style={{fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase'}}>Location</div>
                     <div className="val" style={{fontSize: '14px', fontWeight: 700}}>{customer.city}</div>
                  </div>
                  <div className="ci-detail-box">
                     <div className="label" style={{fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase'}}>EMI Load</div>
                     <div className="val" style={{fontSize: '14px', fontWeight: 700}}>{fmt(customer.emi_load)}</div>
                  </div>
                  <div className="ci-detail-box">
                     <div className="label" style={{fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase'}}>Channel</div>
                     <div className="val" style={{fontSize: '14px', fontWeight: 700}}>{customer.primary_channel}</div>
                  </div>
                </div>

                {/* Existing Portfolio */}
                <div className="ci-existing-portfolio" style={{padding: '24px 32px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc'}}>
                  <div className="ci-section-title" style={{fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}><Lock size={14} /> ACTIVE PORTFOLIO</div>
                  <div className="ci-portfolio-list" style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                    {(customer.existing_products || []).map(prod => (
                      <div key={prod} className="ci-portfolio-tag" style={{background: 'white', border: '1px solid #cbd5e1', padding: '6px 16px', borderRadius: '24px', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8}}><CheckCircle2 size={14} color="#10B981" /> {prod}</div>
                    ))}
                  </div>
                </div>

                {/* Spend Distribution Analysis */}
                <div className="ci-spend-section" style={{padding: '32px', borderBottom: '1px solid #e2e8f0'}}>
                  <div className="ci-section-title" style={{fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'}}><PieChart size={14} /> SPEND DISTRIBUTION ANALYSIS</div>
                  
                  <div style={{display: 'flex', alignItems: 'center', gap: '64px'}}>
                     <div style={{position: 'relative', width: '150px', height: '150px'}}>
                        <svg viewBox="0 0 100 100" style={{transform: 'rotate(-90deg)'}}>
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                          {segments && segments.map((seg, i) => (
                             <circle 
                                key={i}
                                cx="50" cy="50" r="40" 
                                fill="transparent" 
                                stroke={seg.color} 
                                strokeWidth="12" 
                                strokeDasharray={seg.dashArray}
                                strokeDashoffset={seg.offset}
                                style={{transition: 'all 0.5s ease'}}
                             />
                          ))}
                        </svg>
                        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                           <div style={{fontSize: '10px', fontWeight: 700, color: '#64748b'}}>TOTAL</div>
                           <div style={{fontSize: '20px', fontWeight: 800}}>{fmtK(customer.total_monthly_spend)}</div>
                        </div>
                     </div>

                     <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '16px'}}>
                        {segments && segments.map((seg, i) => (
                          <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                             <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                <div style={{width: '10px', height: '10px', borderRadius: '50%', background: seg.color}}></div>
                                <span style={{fontSize: '14px', fontWeight: 600, color: '#334155'}}>{seg.category}</span>
                             </div>
                             <span style={{fontSize: '14px', fontWeight: 700}}>{seg.pct}%</span>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>

                {/* KPI Strip */}
                <div className="ci-kpi-row" style={{display: 'flex'}}>
                  <div className="ci-kpi-box" style={{flex: 1, padding: '24px 32px', borderRight: '1px solid #f1f5f9', textAlign: 'center'}}>
                    <div className="label" style={{fontSize: '10px', color: '#94a3b8', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase'}}>Avg Monthly Salary</div>
                    <div className="val" style={{fontSize: '18px', fontWeight: 800}}>{fmt(customer.monthly_salary)}</div>
                  </div>
                  <div className="ci-kpi-box" style={{flex: 1, padding: '24px 32px', borderRight: '1px solid #f1f5f9', textAlign: 'center'}}>
                    <div className="label" style={{fontSize: '10px', color: '#94a3b8', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase'}}>Avg Balance</div>
                    <div className="val" style={{fontSize: '18px', fontWeight: 800}}>{fmt(customer.avg_monthly_balance)}</div>
                  </div>
                  <div className="ci-kpi-box" style={{flex: 1, padding: '24px 32px', textAlign: 'center'}}>
                    <div className="label" style={{fontSize: '10px', color: '#94a3b8', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase'}}>Tenure</div>
                    <div className="val" style={{fontSize: '18px', fontWeight: 800}}>{customer.tenure_years} Years</div>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT PANEL : AI MATCH */}
            <div className="ci-panel-right">
              <div className="ci-match-card" style={{padding: '32px'}}>
                
                <div style={{fontSize: '11px', color: '#6366f1', fontWeight: 800, textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '1px'}}>Top AI Match</div>

                {customer.product_matching ? (
                  <>
                    <div style={{fontSize: '24px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: '8px'}}>
                         {customer.product_matching.matched_product_name}
                    </div>
                    <div style={{fontSize: '13px', color: '#64748b', fontWeight: 500, marginBottom: '32px'}}>Personalized Recommendation</div>

                    <div className="ci-section-title" style={{fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: 12}}>STRATEGIC RATIONALE</div>
                    <div className="ci-rationale" style={{borderLeft: '3px solid #cbd5e1', paddingLeft: 16, marginBottom: 32}}>
                      <p style={{fontSize: 14, color: '#475569', fontStyle: 'italic', margin: 0, lineHeight: 1.6}}>"{customer.product_matching.why_this_match}"</p>
                    </div>

                    <div className="ci-section-title" style={{fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: 12}}>CAMPAIGN NOTIFICATION</div>
                    <div className="ci-hook-box" style={{background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 40}}>
                      <p style={{fontSize: '15px', fontWeight: 700, margin: 0, color: '#0f172a', lineHeight: 1.4}}>
                        "{customer.product_matching.campaign_notification}"
                      </p>
                    </div>

                    <button className="ci-btn-cta" onClick={copyHook} style={{width: '100%', background: '#0052FF', color: 'white', padding: '16px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}}>
                      {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                      {copied ? "Copied!" : "Copy Hook to Campaign"}
                    </button>
                  </>
                ) : (
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60%', textAlign:'center', color: '#94a3b8'}}>
                     <Sparkles size={48} style={{marginBottom: '16px', opacity: 0.5}} />
                     <p style={{fontSize: '14px'}}>AI match results will appear here after calculation.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="ci-dashboard" style={{flexDirection: 'column'}}>
            <div className="ci-card" style={{flex: 1, padding: '32px', overflowY: 'auto'}}>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px'}}>
                  <div>
                    <h2 style={{fontSize: '24px', fontWeight: 800}}>Global Campaign Matrix</h2>
                    <p style={{color: '#64748b', fontSize: '14px'}}>AI Recommendations for all {customers.length} customers</p>
                  </div>
                  <button className="ci-btn-cta" style={{padding: '10px 20px', fontSize: '13px'}}>Export Campaign CSV</button>
               </div>

               <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
                  <thead>
                     <tr style={{borderBottom: '2px solid #f1f5f9'}}>
                        <th style={{padding: '16px', fontSize: '11px', color: '#94a3b8', fontWeight: 700}}>CUSTOMER</th>
                        <th style={{padding: '16px', fontSize: '11px', color: '#94a3b8', fontWeight: 700}}>MATCHED PRODUCT</th>
                        <th style={{padding: '16px', fontSize: '11px', color: '#94a3b8', fontWeight: 700}}>CAMPAIGN HOOK</th>
                        <th style={{padding: '16px', fontSize: '11px', color: '#94a3b8', fontWeight: 700}}>ACTION</th>
                     </tr>
                  </thead>
                  <tbody>
                     {customers.map((c, idx) => (
                       <tr key={c.id || c.customer_id} style={{borderBottom: '1px solid #f1f5f9'}}>
                          <td style={{padding: '16px'}}>
                             <div style={{fontWeight: 700, color: '#0f172a'}}>{c.name}</div>
                             <div style={{fontSize: '12px', color: '#64748b'}}>{c.id || c.customer_id}</div>
                          </td>
                          <td style={{padding: '16px'}}>
                             {c.product_matching?.matched_product_name ? (
                               <div style={{background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', padding: '4px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, display: 'inline-block'}}>
                                 {c.product_matching.matched_product_name}
                               </div>
                             ) : (
                               <div style={{color: '#94a3b8', fontSize: '13px', fontStyle: 'italic'}}>Pending Analysis...</div>
                             )}
                          </td>
                          <td style={{padding: '16px'}}>
                             <div style={{fontSize: '13px', color: '#475569', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                {c.product_matching?.campaign_notification || "No notification generated."}
                             </div>
                          </td>
                          <td style={{padding: '16px'}}>
                             <button 
                                onClick={() => {
                                  setCurrentIndex(idx);
                                  setActiveTab("Portfolio");
                                }}
                                style={{background: 'white', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer'}}
                             >
                               View Profile
                             </button>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}
        </div>
      )}
      </main>
    </div>
  );
}

export default CustomerIntelligence;
