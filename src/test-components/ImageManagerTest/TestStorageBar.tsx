import React from "react";

interface TestStorageBarProps {
  used: number;
  total: number;
  percentage: number;
  onUpgrade: () => void;
}

const getBarColor = (percentage: number) => {
  if (percentage < 80) return "#28a745";
  if (percentage < 95) return "#ffc107";
  return "#dc3545";
};

const TestStorageBar: React.FC<TestStorageBarProps> = ({
  used,
  total,
  percentage,
  onUpgrade
}) => (
  <div>
    <div style={{
      width: "100%",
      height: 16,
      background: "#eee",
      borderRadius: 8,
      overflow: "hidden",
      marginBottom: 4
    }}>
      <div
        style={{
          width: `${Math.min(percentage, 100)}%`,
          height: "100%",
          background: getBarColor(percentage),
          transition: "width 0.3s"
        }}
      />
    </div>
    <div style={{ fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span>
        {used.toFixed(1)} MB of {total} MB used
      </span>
      {percentage > 75 && (
        <button
          style={{
            marginLeft: 8,
            fontSize: 12,
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "2px 8px"
          }}
          onClick={onUpgrade}
        >
          Upgrade
        </button>
      )}
    </div>
  </div>
);

export default TestStorageBar;