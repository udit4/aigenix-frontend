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
  const ghcInputRef = useRef(null);
  const rafInputRef = useRef(null);
  const termInputRef = useRef(null);
  const calInputRef = useRef(null);

  const [ghcFile, setGhcFile] = useState(null);
  const [rafFile, setRafFile] = useState(null);
  const [termFile, setTermFile] = useState(null);
  const [calFile, setCalFile] = useState(null);

  const [ghcDragActive, setGhcDragActive] = useState(false);
  const [rafDragActive, setRafDragActive] = useState(false);
  const [termDragActive, setTermDragActive] = useState(false);
  const [calDragActive, setCalDragActive] = useState(false);

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
    setGhcFile(null);
    setRafFile(null);
    setTermFile(null);
    setCalFile(null);
    setGhcDragActive(false);
    setRafDragActive(false);
    setTermDragActive(false);
    setCalDragActive(false);
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

  const handleGhcFile = (file) => {
    if (!validateFile(file)) return;
    setError("");
    setSuccess(false);
    setGhcFile(file);
  };

  const handleRafFile = (file) => {
    if (!validateFile(file)) return;
    setError("");
    setSuccess(false);
    setRafFile(file);
  };

  const handleTermFile = (file) => {
    if (!validateFile(file)) return;
    setError("");
    setSuccess(false);
    setTermFile(file);
  };

  const handleCalFile = (file) => {
    if (!validateFile(file)) return;
    setError("");
    setSuccess(false);
    setCalFile(file);
  };

  const handleUpload = async () => {
    if (!ghcFile || !rafFile) {
      setError("Please select both GHC and RAF Excel files.");
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
      formData.append("ghc_file", ghcFile);
      formData.append("raf_file", rafFile);
      if (termFile) {
        formData.append("termination_file", termFile);
      }
      if (calFile) {
        formData.append("master_calendar_file", calFile);
      }

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Failed to process Excel files.";

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
            Upload your GHC and RAF Excel files. You can optionally upload Termination 
            and Master Calendar workbooks to enrich Last Working Day (LWD) and calendar descriptions.
          </p>
        </div>

        <div className="otl-upload-grid">
          {/* GHC Upload */}
          <div
            className={`upload-card ${ghcDragActive ? "drag-active" : ""}`}
            onDragEnter={(e) => {
              e.preventDefault();
              setGhcDragActive(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setGhcDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setGhcDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setGhcDragActive(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleGhcFile(file);
            }}
          >
            <div className="upload-icon">📊</div>
            <h2>GHC Sheet</h2>
            <p>Drag & drop GHC file or click to browse.</p>
            <button
              className="browse-btn"
              onClick={() => ghcInputRef.current?.click()}
            >
              Browse GHC
            </button>
            <input
              ref={ghcInputRef}
              type="file"
              accept=".xlsx"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleGhcFile(file);
              }}
            />
          </div>

          {/* RAF Upload */}
          <div
            className={`upload-card ${rafDragActive ? "drag-active" : ""}`}
            onDragEnter={(e) => {
              e.preventDefault();
              setRafDragActive(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setRafDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setRafDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setRafDragActive(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleRafFile(file);
            }}
          >
            <div className="upload-icon">📋</div>
            <h2>RAF Sheet</h2>
            <p>Drag & drop RAF file or click to browse.</p>
            <button
              className="browse-btn"
              onClick={() => rafInputRef.current?.click()}
            >
              Browse RAF
            </button>
            <input
              ref={rafInputRef}
              type="file"
              accept=".xlsx"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleRafFile(file);
              }}
            />
          </div>

          {/* Termination Upload */}
          <div
            className={`upload-card ${termDragActive ? "drag-active" : ""}`}
            onDragEnter={(e) => {
              e.preventDefault();
              setTermDragActive(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setTermDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setTermDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setTermDragActive(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleTermFile(file);
            }}
          >
            <div className="upload-icon">🛑</div>
            <h2>Termination Sheet (Optional)</h2>
            <p>Drag & drop Termination file or click to browse.</p>
            <button
              className="browse-btn"
              onClick={() => termInputRef.current?.click()}
            >
              Browse Termination
            </button>
            <input
              ref={termInputRef}
              type="file"
              accept=".xlsx"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleTermFile(file);
              }}
            />
          </div>

          {/* Master Calendar Upload */}
          <div
            className={`upload-card ${calDragActive ? "drag-active" : ""}`}
            onDragEnter={(e) => {
              e.preventDefault();
              setCalDragActive(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setCalDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setCalDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCalDragActive(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleCalFile(file);
            }}
          >
            <div className="upload-icon">📅</div>
            <h2>Master Calendar (Optional)</h2>
            <p>Drag & drop Master Calendar file or click to browse.</p>
            <button
              className="browse-btn"
              onClick={() => calInputRef.current?.click()}
            >
              Browse Calendar
            </button>
            <input
              ref={calInputRef}
              type="file"
              accept=".xlsx"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCalFile(file);
              }}
            />
          </div>
        </div>

        {ghcFile && (
          <div className="file-info-card">
            <div>
              <h3>GHC: {ghcFile.name}</h3>
              <span>{formatFileSize(ghcFile.size)}</span>
            </div>
            <button className="clear-btn" onClick={() => setGhcFile(null)}>
              Clear GHC
            </button>
          </div>
        )}

        {rafFile && (
          <div className="file-info-card">
            <div>
              <h3>RAF: {rafFile.name}</h3>
              <span>{formatFileSize(rafFile.size)}</span>
            </div>
            <button className="clear-btn" onClick={() => setRafFile(null)}>
              Clear RAF
            </button>
          </div>
        )}

        {termFile && (
          <div className="file-info-card">
            <div>
              <h3>Termination: {termFile.name}</h3>
              <span>{formatFileSize(termFile.size)}</span>
            </div>
            <button className="clear-btn" onClick={() => setTermFile(null)}>
              Clear Termination
            </button>
          </div>
        )}

        {calFile && (
          <div className="file-info-card">
            <div>
              <h3>Master Calendar: {calFile.name}</h3>
              <span>{formatFileSize(calFile.size)}</span>
            </div>
            <button className="clear-btn" onClick={() => setCalFile(null)}>
              Clear Calendar
            </button>
          </div>
        )}

        {loading && (
          <div className="processing-card">
            <div className="loader"></div>

            <h3>Processing Files...</h3>

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
          disabled={loading || !ghcFile || !rafFile}
          onClick={handleUpload}
        >
          {loading ? "Processing Files..." : "Process Excel Sheets"}
        </button>
      </div>
    </div>
  );
}