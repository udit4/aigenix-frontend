import React, { useRef, useState } from "react";
import "./OtlAutomation.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
const API_URL = `${API_BASE_URL}/otl-automation/generate`;
console.log("Resolved API URL:", API_URL);

const PROCESSING_STEPS = [
  "Loading template metadata...",
  "Validating exact column headers...",
  "Performing 1:1 sequential copy...",
  "Generating final workbook...",
];

export default function OtlAutomation() {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [downloadBlob, setDownloadBlob] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    const kb = bytes / 1024;

    if (kb < 1024) {
      return `${kb.toFixed(2)} KB`;
    }

    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const resetState = () => {
    setSelectedFile(null);
    setDragActive(false);
    setLoading(false);
    setSuccess(false);
    setError("");
    setDownloadBlob(null);
    setCurrentStep(0);
  };

  const validateFile = (file) => {
    if (!file.name.endsWith(".xlsx")) {
      setError("Only .xlsx Excel files are supported.");
      return false;
    }

    return true;
  };

  const handleFile = (file) => {
    if (!validateFile(file)) return;

    setError("");
    setSuccess(false);
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a GHC Excel file.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= PROCESSING_STEPS.length - 1) {
          return prev;
        }

        return prev + 1;
      });
    }, 1500);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Failed to process Excel file.";

        try {
          const errorJson = await response.json();
          errorMessage = errorJson.detail || errorMessage;
        } catch (_) {}

        throw new Error(errorMessage);
      }

      const blob = await response.blob();

      setDownloadBlob(blob);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Unexpected error occurred.");
    } finally {
      clearInterval(interval);
      setLoading(false);
      setCurrentStep(0);
    }
  };

  const handleDownload = () => {
    if (!downloadBlob) return;

    const url = window.URL.createObjectURL(downloadBlob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "otl_automation_output.xlsx";

    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="otl-page">
      <div className="otl-container">
        <div className="otl-header-card">
          <div className="otl-badge">Phase 1 MVP</div>

          <h1>OTL Excel Processor</h1>

          <p>
            Upload your GHC Excel file. The system dynamically reads
            template mappings, validates exact column headers, and copies
            rows 1:1 into the final OTL output workbook.
          </p>
        </div>

        <div
          className={`upload-card ${dragActive ? "drag-active" : ""}`}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
          onDrop={handleDrop}
        >
          <div className="upload-icon">📄</div>

          <h2>Upload GHC Excel File</h2>

          <p>Drag & drop your .xlsx file here or browse manually.</p>

          <button
            className="browse-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse File
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>

        {selectedFile && (
          <div className="file-info-card">
            <div>
              <h3>{selectedFile.name}</h3>
              <span>{formatFileSize(selectedFile.size)}</span>
            </div>

            <button className="clear-btn" onClick={resetState}>
              Clear
            </button>
          </div>
        )}

        {loading && (
          <div className="processing-card">
            <div className="loader"></div>

            <h3>Processing File...</h3>

            <p>{PROCESSING_STEPS[currentStep]}</p>
          </div>
        )}

        {error && (
          <div className="error-card">
            <h3>Validation Failed</h3>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="success-card">
            <h3>Excel Processed Successfully</h3>

            <p>
              Your OTL workbook has been generated successfully.
            </p>

            <button className="download-btn" onClick={handleDownload}>
              Download Processed Excel
            </button>

            <button className="reset-link" onClick={resetState}>
              Process Another File
            </button>
          </div>
        )}

        <button
          className="process-btn"
          disabled={loading || !selectedFile}
          onClick={handleUpload}
        >
          {loading ? "Processing File..." : "Process Excel Sheet"}
        </button>
      </div>
    </div>
  );
}