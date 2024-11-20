import React from 'react';

interface InfoProps {
  selectedNodes: any[];
}

const Info: React.FC<InfoProps> = ({ selectedNodes }) => {
  return (
    <div className="info-panel">
      <h3>Selected Nodes</h3>
      {selectedNodes.length > 0 ? (
        selectedNodes.map((node, index) => (
          <div key={index}>
            <h4>{node.label}</h4>
            <p>ID: {node.id}</p>
            <p>Color: {node.color}</p>
          </div>
        ))
      ) : (
        <p>No nodes selected.</p>
      )}
    </div>
  );
};

export default Info;
