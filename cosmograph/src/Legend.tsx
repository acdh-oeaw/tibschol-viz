import React from 'react';
import './Legend.css'; // Assuming styles are in a separate CSS file

interface LegendItem {
  label: string;
  color: string;
}
const legendItems: LegendItem[] = [
  { label: 'Person', color: '#58A6FF' },
  { label: 'Work', color: '#8DFF58' },
  { label: 'Instance', color: '#FFD700' },
  { label: 'Place', color: '#FF6F61' },
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
