import React, { useState } from 'react';
import axios from 'axios';
import { FileText, Download, Loader2, UploadCloud, AlertCircle } from 'lucide-react';
import './AttendanceExtractor.css';

function AttendanceExtractor() {
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = [...e.dataTransfer.files];
    const pdf = files.find(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (pdf) {
      setPdfFile(pdf);
      setError(null);
    }
  };

  const removePdf = () => setPdfFile(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      setError('Please select a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', pdfFile);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/attendance/extract`, formData, {
        responseType: 'blob',
      });

      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'attendance_extracted.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Extraction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-extractor">
      <div className="attendance-header">
        <h1>Attendance Sheet Extractor</h1>
        <p>Upload a scanned PDF attendance sheet. The system extracts employee data, daily statuses, and summary totals into an Excel file.</p>
      </div>

      <div className="attendance-card">
        <form onSubmit={handleSubmit}>
          <div className="upload-section">
            <label className="upload-label">
              <FileText size={18} />
              Attendance PDF
            </label>
            <div
              className={`file-input-wrapper ${pdfFile ? 'has-file' : ''} ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                id="pdf-upload"
                disabled={loading}
              />
              <label htmlFor="pdf-upload" className="file-label">
                {pdfFile ? (
                  <span className="file-name">{pdfFile.name}</span>
                ) : (
                  <>
                    <UploadCloud size={24} />
                    <span>Choose PDF file or drag it here</span>
                  </>
                )}
              </label>
            </div>
            {pdfFile && (
              <div className="file-list">
                <div className="file-tag">
                  <FileText size={14} />
                  <span>{pdfFile.name}</span>
                  <button type="button" onClick={removePdf} disabled={loading}>×</button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="spinner" />
                Extracting Attendance...
              </>
            ) : (
              <>
                <Download size={18} />
                Extract to Excel
              </>
            )}
          </button>
        </form>
      </div>

      <div className="info-box">
        <h3>What this does</h3>
        <ul>
          <li>Accepts scanned PDF attendance sheets (monthly tables).</li>
          <li>Uses AI (GPT‑4o) to extract employee details, daily statuses (P/A/WO/H), and summary totals.</li>
          <li>Outputs a clean Excel file with correct column ordering (1‑31 days, summary columns).</li>
          <li>Handles both full matrices and single‑employee irregular sheets.</li>
        </ul>
      </div>
    </div>
  );
}

export default AttendanceExtractor;