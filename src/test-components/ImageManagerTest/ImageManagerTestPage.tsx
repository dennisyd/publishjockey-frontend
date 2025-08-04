import React, { useState, useEffect } from "react";
import TestImageModal from "./TestImageModal";
import { mockImageService } from "./test-image-service";

const buttonStyle: React.CSSProperties = {
  background: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "6px 14px",
  fontWeight: 500,
  fontSize: 14,
  cursor: "pointer",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  transition: "background 0.2s",
};

const thStyle: React.CSSProperties = {
  padding: "8px 6px",
  fontWeight: 600,
  color: "#333",
  background: "#f5f6fa",
  borderBottom: "1px solid #e0e0e0",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  padding: "7px 6px",
  color: "#444",
  background: "#fafbfc",
};

const UPGRADE_AMOUNT_MB = 250;
const UPGRADE_COST = 10;

const ImageManagerTestPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [storage, setStorage] = useState({ used: 0, total: 0, percentage: 0 });
  const [upgradeCount, setUpgradeCount] = useState(0);

  useEffect(() => {
    loadImages();
    loadStorage();
  }, []);

  const loadImages = async () => {
    const imgs = await mockImageService.getUserImages();
    setImages(imgs);
  };

  const loadStorage = async () => {
    const stats = await mockImageService.getStorageStats();
    setStorage(stats);
  };

  // Debug/test controls
  const handleAddRandomImage = async () => {
    await mockImageService.uploadImage({ name: `random-${Date.now()}.jpg`, size: 2 });
    await loadImages();
    await loadStorage();
    console.log("[IMAGE TEST] Random image added");
  };

  const handleFillTo80 = async () => {
    let stats = await mockImageService.getStorageStats();
    while (stats.percentage < 80) {
      await mockImageService.uploadImage({ name: `fill-${Date.now()}.jpg`, size: 2 });
      stats = await mockImageService.getStorageStats();
      await loadImages();
      setStorage(stats);
    }
    console.log("[IMAGE TEST] Filled to 80% capacity");
  };

  const handleReset = () => {
    mockImageService.reset();
    loadImages();
    loadStorage();
    setUpgradeCount(0);
    console.log("[IMAGE TEST] Data reset");
  };

  const handleSimulateUpgrade = async () => {
    if (mockImageService.increaseTotalStorage) {
      mockImageService.increaseTotalStorage(UPGRADE_AMOUNT_MB);
    }
    setUpgradeCount((prev) => prev + 1);
    await loadStorage(); // Ensure storageFull is recalculated
    console.log("[IMAGE TEST] Storage upgraded");
  };

  const storageFull = storage.used >= storage.total;

  return (
    <div style={{ padding: 32 }}>
      <h1>Image Manager Test Prototype</h1>
      <button onClick={() => setModalOpen(true)} style={{ ...buttonStyle, marginBottom: 24 }}>Open Image Manager Modal</button>
      <div
        style={{
          margin: "24px 0",
          padding: 24,
          background: "#fff",
          border: "1px solid #e0e0e0",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          maxWidth: 480,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 18, marginRight: 8 }}>Debug Panel</span>
          <span
            style={{
              background: "#f5f6fa",
              color: "#007bff",
              fontSize: 12,
              borderRadius: 6,
              padding: "2px 10px",
              marginLeft: "auto",
            }}
          >
            Test Mode
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <button onClick={handleAddRandomImage} style={{ ...buttonStyle }}>Add Random Image</button>
          <button onClick={handleFillTo80} style={{ ...buttonStyle }}>Fill to 80%</button>
          <button onClick={handleReset} style={{ ...buttonStyle }}>Reset Data</button>
          <button onClick={handleSimulateUpgrade} style={{ ...buttonStyle }}>
            Simulate Upgrade (+{UPGRADE_AMOUNT_MB} MB / ${UPGRADE_COST})
          </button>
        </div>
        <div style={{ marginBottom: 10, fontSize: 15, color: "#333" }}>
          <strong>Storage:</strong>{" "}
          <span style={{ color: "#007bff" }}>{storage.used.toFixed(1)} MB</span> used,
          <span style={{ color: "#28a745", marginLeft: 4 }}>
            {(storage.total - storage.used).toFixed(1)} MB
          </span>{" "}
          available
          <span style={{ color: "#888", marginLeft: 8 }}>
            (Total: {storage.total} MB)
          </span>
        </div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 8 }}>
          Upgrades purchased: <strong>{upgradeCount}</strong> &nbsp;|&nbsp;
          Total spent: <strong>${upgradeCount * UPGRADE_COST}</strong>
        </div>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fafbfc",
          borderRadius: 8,
          overflow: "hidden",
          fontSize: 14,
          marginBottom: 0,
        }}>
          <thead>
            <tr style={{ background: "#f5f6fa" }}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Filename</th>
              <th style={thStyle}>Size (MB)</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {images.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#aaa", padding: 12 }}>
                  No images in test data.
                </td>
              </tr>
            ) : (
              images.map((img, idx) => (
                <tr key={img.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={tdStyle}>{idx + 1}</td>
                  <td style={tdStyle}>{img.filename}</td>
                  <td style={tdStyle}>{img.size}</td>
                  <td style={tdStyle}>{img.uploadDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <TestImageModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          images={images}
          storage={storage}
          reloadImages={loadImages}
          reloadStorage={loadStorage}
          storageFull={storageFull}
        />
      )}
    </div>
  );
};

export default ImageManagerTestPage;