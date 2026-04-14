import React, { useState } from 'react';
import axios from 'axios';
import { FileSpreadsheet, FileText, Download, Loader2, UploadCloud, AlertCircle, Settings, FileDown } from 'lucide-react';
import './ReportGenerator.css';

function ReportGenerator() {
  const [excelFile, setExcelFile] = useState(null);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [threshold, setThreshold] = useState(75);
  const [pdfType, setPdfType] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleExcelChange = (e) => {
    setExcelFile(e.target.files[0]);
    setError(null);
  };

  const handlePdfChange = (e) => {
    setPdfFiles([...e.target.files]);
    setError(null);
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
    const pdfs = files.filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    const excels = files.filter(f =>
      f.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      f.type === 'application/vnd.ms-excel' ||
      f.name.endsWith('.xlsx') ||
      f.name.endsWith('.xls')
    );

    if (excels.length > 0) setExcelFile(excels[0]);
    if (pdfs.length > 0) setPdfFiles(prev => [...prev, ...pdfs]);
    setError(null);
  };

  const removePdf = (index) => {
    setPdfFiles(prev => prev.filter((_, i) => i !== index));
  };

  const downloadBase64File = (base64Data, filename) => {
    const link = document.createElement('a');
    link.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64Data}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSampleExcel = () => {
    const link = document.createElement('a');
    link.href = '/sample_excel.xlsx';
    link.download = 'sample_excel.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!excelFile) {
      setError('Please select an Excel file.');
      return;
    }
    if (pdfFiles.length === 0) {
      setError('Please select at least one PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('excel', excelFile);
    pdfFiles.forEach((file) => formData.append('pdfs', file));
    formData.append('threshold', threshold);
    if (pdfType !== 'auto') {
      formData.append('pdf_type', pdfType);
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/report/generate', formData);
      const { matched, unmatched } = response.data;

      if (matched && matched.data) {
        downloadBase64File(matched.data, matched.filename);
      }
      if (unmatched && unmatched.data) {
        downloadBase64File(unmatched.data, unmatched.filename);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to generate reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rg-layout">
      <main className="rg-main">
        <div className="rg-page-header">
          <h1>Excel‑PDF Report Generator</h1>
          <p>Upload your Excel master and BCTPL/TNMAS PDFs to generate matched reports.</p>
          <button
            type="button"
            className="rg-sample-btn"
            onClick={downloadSampleExcel}
          >
            <FileDown size={16} />
            Download Sample Excel
          </button>
        </div>

        <div className="rg-card">
          <form onSubmit={handleSubmit}>
            {/* Excel Upload */}
            <div className="rg-upload-section">
              <label className="rg-label">
                <FileSpreadsheet size={18} />
                Excel Master File
              </label>
              <div
                className={`rg-file-input-wrapper ${excelFile ? 'has-file' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelChange}
                  id="excel-upload"
                  disabled={loading}
                />
                <label htmlFor="excel-upload" className="rg-file-label">
                  {excelFile ? (
                    <span className="rg-file-name">{excelFile.name}</span>
                  ) : (
                    <>
                      <UploadCloud size={24} />
                      <span>Choose Excel file or drag it here</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* PDF Upload */}
            <div className="rg-upload-section">
              <label className="rg-label">
                <FileText size={18} />
                PDF Files (BCTPL / TNMAS)
              </label>
              <div
                className={`rg-file-input-wrapper ${pdfFiles.length > 0 ? 'has-file' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handlePdfChange}
                  id="pdf-upload"
                  disabled={loading}
                />
                <label htmlFor="pdf-upload" className="rg-file-label">
                  {pdfFiles.length > 0 ? (
                    <span className="rg-file-name">{pdfFiles.length} file(s) selected</span>
                  ) : (
                    <>
                      <UploadCloud size={24} />
                      <span>Choose PDF files or drag them here</span>
                    </>
                  )}
                </label>
              </div>

              {/* Selected PDFs list */}
              {pdfFiles.length > 0 && (
                <div className="rg-pdf-list">
                  {pdfFiles.map((file, idx) => (
                    <div key={idx} className="rg-pdf-tag">
                      <FileText size={14} />
                      <span>{file.name}</span>
                      <button type="button" onClick={() => removePdf(idx)} disabled={loading}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PDF Type Dropdown */}
            <div className="rg-upload-section">
              <label className="rg-label">
                <Settings size={18} />
                PDF Type
              </label>
              <select
                value={pdfType}
                onChange={(e) => setPdfType(e.target.value)}
                disabled={loading}
                className="rg-select"
              >
                <option value="auto">Auto-detect (from filename)</option>
                <option value="BCTPL">BCTPL</option>
                <option value="TNMAS">TNMAS</option>
              </select>
              <div className="rg-threshold-hint">
                Auto‑detection works if filename contains "tnmas" or "mah it".
              </div>
            </div>

            {/* Threshold Slider */}
            <div className="rg-threshold-section">
              <label className="rg-label">
                Match Threshold: <span>{threshold}</span>
              </label>
              <input
                type="range"
                min="50"
                max="100"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                disabled={loading}
                className="rg-slider"
              />
              <div className="rg-threshold-hint">
                Lower values match more loosely (useful for name variations).
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rg-error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="rg-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={18} className="spinner" />
                  Generating Reports...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Generate Reports
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="rg-info-box">
          <h3>What this does</h3>
          <ul>
            <li>Reads SI No and Resource Name from the Excel file (sheet containing "DMA").</li>
            <li>Extracts all names and payment details from the PDFs.</li>
            <li>Fuzzy‑matches Excel names to PDF names.</li>
            <li>Produces <strong>matched.docx</strong> (Excel rows with PDF data) and <strong>unmatched.docx</strong> (Excel rows without PDF data).</li>
            <li>Works with both BCTPL and TNMAS PDF formats (auto‑detected or manually selected).</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default ReportGenerator;