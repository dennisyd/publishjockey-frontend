import React from "react";

interface TestImageGridProps {
  images: any[];
  onDelete: (id: string) => void;
}

const TestImageGrid: React.FC<TestImageGridProps> = ({ images, onDelete }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }}
  >
    {images.map(img => (
      <div
        key={img.id}
        style={{
          border: "1px solid #eee",
          borderRadius: 8,
          padding: 8,
          background: "#fafbfc",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <img
          src={img.url}
          alt={img.filename}
          style={{
            width: "100%",
            height: 80,
            objectFit: "cover",
            borderRadius: 4,
            marginBottom: 6
          }}
        />
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>
          {img.filename}
        </div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
          {img.size} MB
        </div>
        <button
          style={{
            fontSize: 12,
            background: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "2px 8px",
            cursor: "pointer"
          }}
          onClick={() => onDelete(img.id)}
        >
          Delete
        </button>
      </div>
    ))}
  </div>
);

export default TestImageGrid;