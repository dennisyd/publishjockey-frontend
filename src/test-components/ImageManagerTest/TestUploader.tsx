import React, { useRef, useState } from "react";

interface TestUploaderProps {
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
  storageFull?: boolean;
}

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const TestUploader: React.FC<TestUploaderProps> = ({ onUpload, disabled, storageFull }) => {
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (disabled || storageFull) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    setSuccess(false);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Invalid file type.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError("File too large.");
      return;
    }
    setProgress(0);
    // Simulate upload progress
    for (let i = 1; i <= 10; i++) {
      setProgress(i * 10);
      await new Promise((res) => setTimeout(res, 60));
    }
    try {
      await onUpload(file);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1200);
    } catch (err: any) {
      if ((err.message && err.message.toLowerCase().includes("storage limit")) || storageFull) {
        setError("You have reached your storage limit. Please delete some images or purchase additional storage to add more.");
      } else {
        setError(err.message || "Upload failed.");
      }
    }
    setProgress(0);
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
      onDrop={handleDrop}
      style={{
        border: dragActive ? "2px solid #007bff" : "2px dashed #bbb",
        borderRadius: 8,
        padding: 16,
        background: dragActive ? "#e6f0ff" : "#fafbfc",
        textAlign: "center",
        transition: "background 0.2s, border 0.2s",
        opacity: disabled || storageFull ? 0.5 : 1
      }}
    >
      <input
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        style={{ display: "none" }}
        ref={inputRef}
        onChange={e => {
          if (disabled || storageFull) return;
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        disabled={disabled || storageFull}
      />
      <div>
        <button
          type="button"
          onClick={() => !disabled && !storageFull && inputRef.current?.click()}
          style={{ marginBottom: 8 }}
          disabled={disabled || storageFull}
        >
          Choose Image
        </button>
      </div>
      <div style={{ color: "#888", fontSize: 13 }}>
        or drag & drop here (JPG, PNG, WEBP, max {MAX_SIZE_MB}MB)
      </div>
      {progress > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ width: "100%", background: "#eee", borderRadius: 4 }}>
            <div
              style={{
                width: `${progress}%`,
                background: "#007bff",
                height: 8,
                borderRadius: 4,
                transition: "width 0.2s"
              }}
            />
          </div>
          <div style={{ fontSize: 12 }}>{progress}%</div>
        </div>
      )}
      {error && <div style={{ color: "#dc3545", marginTop: 12, fontWeight: 500 }}>{error}</div>}
      {success && <div style={{ color: "green", marginTop: 8 }}>Upload successful!</div>}
      {storageFull && !error && (
        <div style={{ color: "#dc3545", marginTop: 12, fontWeight: 500 }}>
          You have reached your storage limit.<br />
          Please delete some images or purchase additional storage to add more.
        </div>
      )}
    </div>
  );
};

export default TestUploader;