import React, { useState } from 'react';
import { 
  Building2, MapPin, Briefcase, GraduationCap, UploadCloud, 
  CheckCircle2, ArrowRight, Loader2, Sparkles, BookOpen,
  ChevronRight, AlertCircle, PlayCircle, LogOut
} from 'lucide-react';
import './RojgarJobseeker.css';

const RojgarJobseeker = () => {
  const [step, setStep] = useState(1); // 1: SignUp/OTP, 2: Upload, 3: Dashboard
  const [authStage, setAuthStage] = useState('signup'); // 'signup', 'otp'
  const [formData, setFormData] = useState({ name: '', aadhaar: '', otp: '' });
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle', 'uploading', 'done'
  const [toastMessage, setToastMessage] = useState('');
  const [currentJobPage, setCurrentJobPage] = useState(1);

  // Hardcoded User Data
  const mockProfile = {
    name: 'Rahul Sharma',
    age: 24,
    location: 'Dehradun, Uttarakhand',
    education: 'B.Tech Computer Science, Graphic Era University (2022)',
    experience: '1 year, Junior Data Analyst at TechNova Solutions',
    skills: [
      { name: 'Python', value: 72 },
      { name: 'SQL', value: 65 },
      { name: 'Data Analysis', value: 58 },
      { name: 'Excel', value: 80 },
      { name: 'Communication', value: 70 }
    ]
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.aadhaar) {
      setAuthStage('otp');
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (formData.otp === '123456') {
      setStep(2);
    } else {
      alert("Invalid OTP. Use 123456 for demo.");
    }
  };

  const handleFileUpload = (e) => {
    if (e && e.target && e.target.files) {
      if (e.target.files.length === 0) return; // user cancelled file selection
    }
    setUploadStatus('uploading');
    setTimeout(() => {
      setUploadStatus('done');
    }, 2000);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleLogout = () => {
    setStep(1);
    setAuthStage('signup');
    setFormData({ name: '', aadhaar: '', otp: '' });
    setUploadStatus('idle');
  };

  const mockJobs = [
    { id: 1, title: 'Data Analyst', company: 'NIC Dehradun', type: 'Govt', match: 87, location: 'Dehradun', salary: '₹4.2–5.8 LPA', source: 'Naukri.com' },
    { id: 2, title: 'MIS Executive', company: 'Uttarakhand Power Corp', type: 'Govt', match: 81, location: 'Dehradun', salary: '₹3.8–4.5 LPA', source: 'Naukri.com' },
    { id: 3, title: 'Junior Data Analyst', company: 'TCS Dehradun', type: 'Private', match: 76, location: 'Dehradun', salary: '₹3.5–5 LPA', source: 'LinkedIn' },
    { id: 4, title: 'Business Analyst Intern', company: 'Infosys Haridwar', type: 'Private', match: 68, location: 'Haridwar', salary: '₹2.5–3.5 LPA', source: 'Naukri.com' },
    { id: 5, title: 'Data Scientist', company: 'Wipro Dehradun', type: 'Private', match: 65, location: 'Dehradun', salary: '₹6.0–8.0 LPA', source: 'LinkedIn' },
    { id: 6, title: 'Research Analyst', company: 'Forest Research Institute', type: 'Govt', match: 62, location: 'Dehradun', salary: '₹4.0–5.5 LPA', source: 'Naukri.com' },
    { id: 7, title: 'Python Developer', company: 'TechNova', type: 'Private', match: 58, location: 'Roorkee', salary: '₹4.5–6.0 LPA', source: 'Indeed' },
    { id: 8, title: 'Data Entry Operator', company: 'State Health Dept', type: 'Govt', match: 55, location: 'Haldwani', salary: '₹2.0–3.0 LPA', source: 'Naukri.com' },
    { id: 9, title: 'BI Analyst', company: 'Cognizant', type: 'Private', match: 52, location: 'Dehradun', salary: '₹5.0–7.0 LPA', source: 'LinkedIn' },
    { id: 10, title: 'Operations Analyst', company: 'ONGC Dehradun', type: 'Govt', match: 50, location: 'Dehradun', salary: '₹5.5–7.5 LPA', source: 'Naukri.com' }
  ];

  const jobsPerPage = 4;
  const totalPages = Math.ceil(mockJobs.length / jobsPerPage);
  const displayedJobs = mockJobs.slice((currentJobPage - 1) * jobsPerPage, currentJobPage * jobsPerPage);

  return (
    <div className="rj-layout">
      {/* Top Navbar */}
      <nav className="rj-navbar">
        <div className="rj-logo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Seal_of_Uttarakhand.svg/250px-Seal_of_Uttarakhand.svg.png" alt="Uttarakhand Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <div className="rj-logo-text">
            <h2>Rojgar Prayag 2.0</h2>
            <p>Unified Portal for Skilling — Govt of Uttarakhand</p>
          </div>
        </div>
        
        {step > 1 && (
          <div className="rj-nav-user">
            <div className="rj-avatar">RS</div>
            <button className="rj-logout-btn" onClick={handleLogout}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        )}
      </nav>

      <main className="rj-main">
        {/* STEP 1: Landing & Sign Up */}
        {step === 1 && (
          <div className="rj-auth-container glass-panel">
            <div className="rj-auth-card">
              <div className="rj-auth-header">
                <h1 className="glow-blue">Welcome to Rojgar Prayag</h1>
                <p>Register to unlock AI-powered job matches</p>
              </div>

              {authStage === 'signup' ? (
                <form onSubmit={handleSignupSubmit}>
                  <div className="rj-form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      className="rj-input" 
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="rj-form-group">
                    <label>Aadhaar Number (12-digit)</label>
                    <input 
                      type="text" 
                      name="aadhaar" 
                      className="rj-input" 
                      placeholder="XXXX XXXX XXXX"
                      maxLength="12"
                      value={formData.aadhaar}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <button type="submit" className="rj-btn">Send OTP <ArrowRight size={16} /></button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit}>
                  <div className="rj-form-group">
                    <label>Enter 6-digit OTP</label>
                    <p style={{ fontSize: '12px', color: 'var(--accent-orange)', marginBottom: '12px', fontWeight: 500 }}>
                      OTP sent to Aadhaar-linked mobile: +91 XXXXXX8910
                    </p>
                    <input 
                      type="text" 
                      name="otp" 
                      className="rj-input" 
                      placeholder="Enter OTP"
                      maxLength="6"
                      value={formData.otp}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <button type="submit" className="rj-btn">Verify & Proceed <CheckCircle2 size={16} /></button>
                  <p className="rj-hint">Use OTP: 123456 for demo</p>
                </form>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Resume Upload */}
        {step === 2 && (
          <div className="rj-upload-container">
            <div className="rj-upload-header">
              <h1>Build Your Profile</h1>
              {uploadStatus === 'done' ? (
                <p style={{ color: 'var(--accent-green)', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Data successfully parsed from your resume
                </p>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>Upload your resume and let our AI do the heavy lifting.</p>
              )}
            </div>

            {uploadStatus === 'idle' && (
              <label className="rj-dropzone glass-panel" style={{ display: 'flex', cursor: 'pointer' }}>
                <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFileUpload} />
                <div className="rj-dropzone-icon">
                  <UploadCloud size={32} />
                </div>
                <h3>Upload your Resume (PDF)</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Click or drag and drop your PDF here</p>
              </label>
            )}

            {uploadStatus === 'uploading' && (
              <div className="rj-loader-container glass-panel">
                <Loader2 size={48} className="rj-spinner" />
                <h3 className="glow-blue">AI is parsing your resume...</h3>
                <p style={{ color: 'var(--text-muted)' }}>Extracting skills, education, and experience</p>
              </div>
            )}

            {uploadStatus === 'done' && (
              <div className="rj-profile-card glass-panel">
                <div className="rj-profile-header">
                  <div className="rj-profile-avatar">RS</div>
                  <div className="rj-profile-info">
                    <h2>{mockProfile.name}</h2>
                    <p><MapPin size={14} /> {mockProfile.location} | Age: {mockProfile.age}</p>
                  </div>
                </div>

                <div className="rj-profile-grid">
                  <div className="rj-profile-section">
                    <h3><GraduationCap size={16} /> Education</h3>
                    <p style={{ fontSize: '14px' }}>{mockProfile.education}</p>
                  </div>
                  <div className="rj-profile-section">
                    <h3><Briefcase size={16} /> Experience</h3>
                    <p style={{ fontSize: '14px' }}>{mockProfile.experience}</p>
                  </div>
                </div>

                <div className="rj-profile-section" style={{ marginBottom: '32px' }}>
                  <h3><Sparkles size={16} /> Detected Skills</h3>
                  <div className="rj-skill-tags">
                    {mockProfile.skills.map(s => (
                      <span key={s.name} className="rj-skill-tag">{s.name} ({s.value}%)</span>
                    ))}
                  </div>
                </div>

                <button className="rj-btn" onClick={() => setStep(3)}>
                  Continue to Dashboard <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Jobseeker Dashboard */}
        {step === 3 && (
          <div className="rj-dashboard">
            <div className="rj-dashboard-header">
              <div>
                <h1>Welcome back, Rahul</h1>
                <p style={{ color: 'var(--text-muted)' }}>Here is your personalized skilling and job intelligence dashboard.</p>
              </div>
            </div>

            <div className="rj-dashboard-grid-top">
              {/* Section A: AI Resume Score */}
              <div className="rj-dashboard-card glass-panel">
                <h3 className="rj-card-title"><Sparkles size={18} className="glow-purple" /> AI Resume Score</h3>
                
                <div className="rj-score-container">
                  <div className="rj-score-circle">
                    <svg viewBox="0 0 140 140" className="rj-score-svg">
                      <circle cx="70" cy="70" r="60" className="rj-score-bg" />
                      <circle cx="70" cy="70" r="60" className="rj-score-progress" style={{ strokeDashoffset: 377 - (377 * 0.74) }} />
                    </svg>
                    <div className="rj-score-value">74<span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>/100</span></div>
                  </div>
                  <div className="rj-score-label">Good — Improve keywords for better visibility</div>
                  
                  <div className="rj-suggestions">
                    <div style={{ fontSize: '13px', fontWeight: 600, margin: '16px 0 8px 0', color: 'var(--accent-blue)' }}>Missing Keywords (Add to resume)</div>
                    <div className="rj-skill-tags" style={{ marginBottom: '16px' }}>
                      <span className="rj-skill-tag" style={{ borderStyle: 'dashed', cursor: 'pointer', background: 'white' }}>+ Data Visualization</span>
                      <span className="rj-skill-tag" style={{ borderStyle: 'dashed', cursor: 'pointer', background: 'white' }}>+ Pandas</span>
                      <span className="rj-skill-tag" style={{ borderStyle: 'dashed', cursor: 'pointer', background: 'white' }}>+ A/B Testing</span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, margin: '16px 0 8px 0', color: 'var(--accent-blue)' }}>Other Recommendations</div>
                    <div className="rj-suggestion-item"><CheckCircle2 size={14} color="var(--text-muted)" /> Add certifications</div>
                    <div className="rj-suggestion-item"><CheckCircle2 size={14} color="var(--text-muted)" /> Quantify achievements</div>
                    <div className="rj-suggestion-item"><CheckCircle2 size={14} color="var(--text-muted)" /> Add a LinkedIn URL</div>
                  </div>
                </div>
              </div>

              {/* Section B: Skill Gap Analysis */}
              <div className="rj-dashboard-card glass-panel">
                <h3 className="rj-card-title"><BookOpen size={18} className="glow-blue" /> Skill Gap for Data Analyst roles</h3>
                
                <div className="rj-skill-gap-list">
                  {/* Skill 1 */}
                  <div className="rj-skill-gap-item">
                    <div className="rj-skill-gap-header">
                      <span>Python</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>72% (have) vs 90% (req)</span>
                    </div>
                    <div className="rj-skill-gap-bars">
                      <div className="rj-skill-bar-req" style={{ width: '90%' }}></div>
                      <div className="rj-skill-bar-have" style={{ width: '72%', background: 'var(--accent-blue)' }}></div>
                    </div>
                    <div className="rj-skill-gap-footer">
                      <span style={{ color: 'var(--accent-yellow)' }}>Gap: 18%</span>
                      <button className="rj-course-btn"><PlayCircle size={12} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/> View Course</button>
                    </div>
                  </div>

                  {/* Skill 2 */}
                  <div className="rj-skill-gap-item">
                    <div className="rj-skill-gap-header">
                      <span>SQL</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>65% vs 85%</span>
                    </div>
                    <div className="rj-skill-gap-bars">
                      <div className="rj-skill-bar-req" style={{ width: '85%' }}></div>
                      <div className="rj-skill-bar-have" style={{ width: '65%', background: 'var(--accent-blue)' }}></div>
                    </div>
                    <div className="rj-skill-gap-footer">
                      <span style={{ color: 'var(--accent-yellow)' }}>Gap: 20%</span>
                      <button className="rj-course-btn"><PlayCircle size={12} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/> View Course</button>
                    </div>
                  </div>

                  {/* Skill 3 (Warning) */}
                  <div className="rj-skill-gap-item">
                    <div className="rj-skill-gap-header">
                      <span>Machine Learning</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>10% vs 70%</span>
                    </div>
                    <div className="rj-skill-gap-bars">
                      <div className="rj-skill-bar-req" style={{ width: '70%' }}></div>
                      <div className="rj-skill-bar-have" style={{ width: '10%', background: '#ef4444' }}></div>
                    </div>
                    <div className="rj-skill-gap-footer">
                      <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> Gap: 60%</span>
                      <button className="rj-course-btn"><PlayCircle size={12} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/> View Course</button>
                    </div>
                  </div>

                  {/* Skill 4 (Warning) */}
                  <div className="rj-skill-gap-item">
                    <div className="rj-skill-gap-header">
                      <span>Tableau</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>0% vs 60%</span>
                    </div>
                    <div className="rj-skill-gap-bars">
                      <div className="rj-skill-bar-req" style={{ width: '60%' }}></div>
                      <div className="rj-skill-bar-have" style={{ width: '0%', background: '#ef4444' }}></div>
                    </div>
                    <div className="rj-skill-gap-footer">
                      <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> Gap: 60%</span>
                      <button className="rj-course-btn"><PlayCircle size={12} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/> View Course</button>
                    </div>
                  </div>

                  {/* Skill 5 (Surplus) */}
                  <div className="rj-skill-gap-item">
                    <div className="rj-skill-gap-header">
                      <span>Excel</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>80% vs 75%</span>
                    </div>
                    <div className="rj-skill-gap-bars">
                      <div className="rj-skill-bar-req" style={{ width: '75%' }}></div>
                      <div className="rj-skill-bar-have" style={{ width: '80%', background: 'var(--accent-green)' }}></div>
                    </div>
                    <div className="rj-skill-gap-footer">
                      <span style={{ color: 'var(--accent-green)' }}>Surplus</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Section C: AI Job Recommendations */}
            <div className="rj-dashboard-card glass-panel" style={{ width: '100%' }}>
              <h3 className="rj-card-title"><Briefcase size={18} className="glow-yellow" /> Recommended Jobs for You</h3>
              
              <div className="rj-jobs-grid">
                {displayedJobs.map((job) => (
                  <div key={job.id} className="rj-job-card">
                    <div className="rj-job-header">
                      <div>
                        <div className="rj-job-title">{job.title}</div>
                        <div className="rj-job-company"><Building2 size={12} /> {job.company} <span className={`rj-badge ${job.type === 'Govt' ? 'rj-badge-gov' : 'rj-badge-pvt'}`}>{job.type}</span></div>
                      </div>
                      <div className={`rj-job-match ${job.match >= 80 ? 'high' : job.match >= 70 ? 'medium' : 'low'}`}><Sparkles size={12} /> {job.match}% Match</div>
                    </div>
                    <div className="rj-job-details">
                      <div className="rj-job-detail-item"><MapPin size={14} /> {job.location}</div>
                      <div className="rj-job-detail-item">{job.salary}</div>
                      <div className="rj-job-detail-item" style={{ color: 'var(--accent-orange)' }}>Source: {job.source}</div>
                    </div>
                    <div className="rj-job-actions">
                      <button className="rj-apply-btn" onClick={() => showToast(`Application submitted to ${job.company}!`)}>Apply Now</button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '32px' }}>
                <button 
                  className="rj-course-btn" 
                  disabled={currentJobPage === 1} 
                  style={{ opacity: currentJobPage === 1 ? 0.5 : 1 }}
                  onClick={() => setCurrentJobPage(prev => Math.max(1, prev - 1))}
                >&lt; Prev</button>
                
                {[...Array(totalPages)].map((_, idx) => (
                  <button 
                    key={idx + 1}
                    className="rj-course-btn" 
                    style={{ background: currentJobPage === idx + 1 ? 'var(--accent-orange)' : 'transparent', color: currentJobPage === idx + 1 ? 'white' : 'var(--accent-orange)' }}
                    onClick={() => setCurrentJobPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button 
                  className="rj-course-btn" 
                  disabled={currentJobPage === totalPages}
                  style={{ opacity: currentJobPage === totalPages ? 0.5 : 1 }}
                  onClick={() => setCurrentJobPage(prev => Math.min(totalPages, prev + 1))}
                >Next &gt;</button>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Global Toast */}
      {toastMessage && (
        <div className="rj-toast">
          <CheckCircle2 size={18} />
          {toastMessage}
        </div>
      )}

    </div>
  );
};

export default RojgarJobseeker;
