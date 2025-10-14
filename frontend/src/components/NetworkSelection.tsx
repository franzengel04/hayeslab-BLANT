// src/components/NetworkSelection.tsx
import React from 'react';
import './NetworkSelection.css';
// The 'type' keyword is added here to fix the error
import type { FormData } from '../pages/SubmitJob';

// 'onPrevious' and 'initialData' have been removed to fix the warnings
interface NetworkSelectionProps {
  onNext: () => void;
  // onDataChange: (data: Partial<FormData>) => void;
  // onDataChange: (file: File | null) => void
  onDataChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<boolean>,
  
}

const NetworkSelection: React.FC<NetworkSelectionProps> = ({ onNext, onDataChange }) => {
  
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     // onDataChange({ networkFile: e.target.files[0] });
  //     onDataChange(e.target.files[0]);
  //   }
  // };

  return (
    <div className="ns-stepContainer">
      <p className="ns-infoText">
        Please select the network you would like to analyze. The most common file type is an edge list.
      </p>
      <ul className="ns-fileTypeList">
        <li>Edge List - <code>.el</code></li>
        <li>LEDA - <code>.gw</code></li>
      </ul>
      <div className="ns-noteBox">
        <h4>NOTE</h4>
        <p>Please note the following:</p>
        <ul>
          <li>The network file should contain one edge per line (e.g., "node1 node2").</li>
          <li>Files must be less than or equal to 1MB for this web interface.</li>
          <li>For larger files, consider using the command-line version of BLANT.</li>
        </ul>
      </div>

      <div className="ns-fileInputGroup">
        <label htmlFor="sourceNetwork">Select Network File</label>
        {/* <input type="file" id="sourceNetwork" className="ns-fileInput" onChange={handleFileChange} /> */}
        <input type="file" id="sourceNetwork" className="ns-fileInput" onChange={onDataChange} />
      </div>

      <p className="ns-loginPrompt">
        Need to run jobs on larger files? <a href="/login">Log in</a> for more resources.
      </p>

      <div className="ns-buttonContainer">
        {/* Previous button is not needed in the first step */}
        <div></div> 
        <button onClick={onNext} className="ns-navButton">
          Next &rarr;
        </button>
      </div>
    </div>
  );
};

export default NetworkSelection;