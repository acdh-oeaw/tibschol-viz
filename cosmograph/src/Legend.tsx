import React from 'react';
import './Legend.css'; // Assuming styles are in a separate CSS file

interface LegendItem {
  label: string;
  color: string;
}

const legendItems: LegendItem[] = [
  { label: 'Person', color: '#FF99D2' },
  { label: 'Work', color: '#2748A4' },
  { label: 'Instance', color: '#88C6FF' },
  { label: 'Place', color: '#C2F0C2' },
];

const Legend: React.FC = () => {
  return (
    <div className="legend">
      {legendItems.map((item, index) => (
        <div className="legend-item" key={index}>
          <span className="color-box" style={{ backgroundColor: item.color }}></span>
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default Legend;
