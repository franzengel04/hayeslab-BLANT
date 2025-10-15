// src/components/Confirm.tsx
import React from 'react';
import './Confirm.css'; // We will create this CSS file

// This component will receive all the form data as props
interface ConfirmProps {
  formData: {
    networkFile: File | null;
    graphletSize: number,
    density?: number,
    samplingMethod: 'precision' | 'sample_number',
    outputMode: 'frequency' | 'odv',
    precision?: number,
    numSamples?: number,
    // graphletSize: number;
    // outputMode: string;
    // samplingMethod: string;
    // precision?: number;
    // density?: number;
    // numSamples?: number;
  };
  onPrevious: () => void;
  onSubmit: () => void;
}

const Confirm: React.FC<ConfirmProps> = ({ formData, onPrevious, onSubmit }) => {
  return (
    <div className="cf-stepContainer">
      <div className="cf-noteBox">
        <h4>NOTE</h4>
        <p>Please note the following:</p>
        <ul>
          <li>The network will be analyzed with the following options, which cannot be changed after submission.</li>
          <li>To proceed, click the "Submit Job" button. To make changes, click the "Previous" button.</li>
          <li>Faded values are the default settings.</li>
        </ul>
      </div>

      <h3 className="cf-summaryTitle">Job Summary</h3>
      
      <div className="cf-summaryGrid">
        <div className="cf-summaryItem">
          <label>Network File</label>
          <input type="text" value={formData.networkFile?.name || 'No file selected'} disabled />
        </div>
        <div className="cf-summaryItem">
          <label>Graphlet Size</label>
          <input type="text" value={formData.graphletSize} disabled />
        </div>
        <div className="cf-summaryItem">
          <label>Output Mode</label>
          <input type="text" value={formData.outputMode === 'frequency' ? 'Frequency' : 'ODV'} disabled />
        </div>
        <div className="cf-summaryItem">
          <label>Sampling Method</label>
          <input type="text" value={formData.samplingMethod === 'precision' ? `Precision (${formData.density})` : `Samples (${formData.numSamples})`} disabled />
        </div>
      </div>

      <div className="cf-buttonContainer">
        <button onClick={onPrevious} className="cf-navButton cf-navButton-previous">
          &larr; Previous
        </button>
        <button onClick={onSubmit} className="cf-navButton">
          Submit Job
        </button>
      </div>
    </div>
  );
};

export default Confirm;
