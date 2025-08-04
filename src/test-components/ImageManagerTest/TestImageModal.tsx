import React, { useState } from "react";
import TestUploader from "./TestUploader";
import TestStorageBar from "./TestStorageBar";
import TestImageGrid from "./TestImageGrid";
import { mockImageService } from "./test-image-service";

const TestImageModal: React.FC<{
  open: boolean;
  onClose: () => void;
  images: any[];
  storage: { used: number; total: number; percentage: number };
  reloadImages: () => void;
  reloadStorage: () => void;
  storageFull: boolean;
}> = ({ open, onClose, images, storage, reloadImages, reloadStorage, storageFull }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    setLoading(true);
    await mockImageService.uploadImage(file);
    await reloadImages();
    await reloadStorage();
    setLoading(false);
    console.log("[IMAGE TEST] Upload started:", file.name);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this image?")) return;
    setLoading(true);
    await mockImageService.deleteImage(id);
    await reloadImages();
    await reloadStorage();
    setLoading(false);
    console.log("[IMAGE TEST] Deleted image:", id);
  };

  return open ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 400,
        height: "100vh",
        background: "#fff",
        boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease-out"
      }}
    >
      <div style={{ padding: 16, borderBottom: "1px solid #eee" }}>
        <span style={{ fontWeight: "bold" }}>Image Manager</span>
        <button
          style={{ float: "right" }}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div style={{ padding: 16, borderBottom: "1px solid #eee" }}>
        <TestUploader onUpload={handleUpload} disabled={storage.percentage >= 100} storageFull={storageFull} />
      </div>
      <div style={{ padding: 16, borderBottom: "1px solid #eee" }}>
        <TestStorageBar
          used={storage.used}
          total={storage.total}
          percentage={storage.percentage}
          onUpgrade={() => {
            mockImageService.reset();
            reloadStorage();
            console.log("[IMAGE TEST] Storage upgraded");
          }}
        />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: 40 }}>Loading...</div>
        ) : images.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
            No images yet. Upload your first image!
          </div>
        ) : (
          <TestImageGrid images={images} onDelete={handleDelete} />
        )}
      </div>
    </div>
  ) : null;
};

export default TestImageModal;