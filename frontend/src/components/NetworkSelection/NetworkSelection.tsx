// src/components/NetworkSelection.tsx
import React from 'react';
import './NetworkSelection.css';

interface NetworkSelectionProps {
  onDataChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<boolean>, 
}

const NetworkSelection: React.FC<NetworkSelectionProps> = ({ onDataChange }) => {

  return (
    <div className="ns-stepContainer">
      <p className="ns-infoText">
        Please select the network you would like to analyze. The most common file type is an edge list.
      </p>
      <ul className="ns-fileTypeList">
        <li>Edge List - <code>.el</code></li>
      </ul>
      <div className="ns-noteBox">
        <h4>NOTE</h4>
        <ul>
          <li>The network file should contain one edge per line (e.g., "node1 node2").</li>
          <li>Files must be less than or equal to 1MB for this web interface.</li>
          <li>For larger files, consider using the command-line version of BLANT.</li>
        </ul>
      </div>

      <div className="ns-fileInputGroup">
        <label htmlFor="sourceNetwork">Select Network File</label>
        <input type="file" id="sourceNetwork" className="ns-fileInput" onChange={onDataChange} />
      </div>
    </div>
  );
};

export default NetworkSelection;