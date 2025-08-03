// src/components/Options.tsx
import React, { useState } from 'react';
import './Options.css';
// The 'type' keyword is added here to fix the error
import type { FormData } from '../pages/SubmitJob';

interface OptionsProps {
  onNext: () => void;
  onPrevious: () => void;
  onDataChange: (data: Partial<FormData>) => void;
  initialData: FormData;
}

const Options: React.FC<OptionsProps> = ({ onNext, onPrevious, onDataChange, initialData }) => {
  const [showHelp, setShowHelp] = useState(false);
  
  const [samplingMethod, setSamplingMethod] = useState(initialData.samplingMethod);

  const handleSamplingChange = (method: string) => {
      setSamplingMethod(method);
      onDataChange({ samplingMethod: method });
  }

  return (
    <div className="os-stepContainer">
       <div className="os-noteBox">
        <h4>NOTE</h4>
        <p>Hover over an option to see its description or click the button to view the entire help menu.</p>
        <button 
          onClick={() => setShowHelp(!showHelp)} 
          className="os-helpButton"
        >
          {showHelp ? 'Hide Options Help Menu' : 'Show Options Help Menu'}
        </button>
        {showHelp && (
          <div className="os-helpContent">
            <p><strong>Graphlet Size (-k):</strong> The number of nodes in the graphlets to sample (required, 3-8).</p>
            <p><strong>Output Mode (-m):</strong> Choose the format for the final alignment results.</p>
            <p><strong>Sampling Method (-p or -n):</strong> Control the alignment process by either specifying a desired precision or a fixed number of samples.</p>
          </div>
        )}
      </div>

      <div className="os-optionsGrid">
        <div className="os-inputGroup">
          <label htmlFor="graphletSize">Graphlet Size (-k)</label>
          <select id="graphletSize" className="os-selectInput" defaultValue={initialData.graphletSize} onChange={(e) => onDataChange({ graphletSize: parseInt(e.target.value) })}>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>

        <div className="os-inputGroup">
          <label htmlFor="outputMode">Output Mode (-m)</label>
          <select id="outputMode" className="os-selectInput" defaultValue={initialData.outputMode} onChange={(e) => onDataChange({ outputMode: e.target.value })}>
            <option value="f">Frequency (default)</option>
            <option value="o">Orbit Degree Vector (ODV)</option>
          </select>
        </div>
      </div>

      <div className="os-radioGroup">
        <h4>Sampling Method</h4>
        <label>
          <input type="radio" name="samplingMethod" value="precision" checked={samplingMethod === 'precision'} onChange={() => handleSamplingChange('precision')} />
          Specify Precision (-p)
        </label>
        <label>
          <input type="radio" name="samplingMethod" value="samples" checked={samplingMethod === 'samples'} onChange={() => handleSamplingChange('samples')} />
          Specify Number of Samples (-n)
        </label>
      </div>

      <div className="os-optionsGrid">
        {samplingMethod === 'precision' ? (
          <div className="os-inputGroup">
            <label htmlFor="precision">Precision</label>
            <input type="number" id="precision" className="os-numberInput" defaultValue={initialData.precision} step="0.01" onChange={(e) => onDataChange({ precision: parseFloat(e.target.value) })} />
          </div>
        ) : (
          <div className="os-inputGroup">
            <label htmlFor="numSamples">Number of Samples</label>
            <input type="number" id="numSamples" className="os-numberInput" defaultValue={initialData.numSamples} onChange={(e) => onDataChange({ numSamples: parseInt(e.target.value) })} />
          </div>
        )}
      </div>

      <div className="os-buttonContainer">
        <button onClick={onPrevious} className="os-navButton os-navButton-previous">&larr; Previous</button>
        <button onClick={onNext} className="os-navButton">Next &rarr;</button>
      </div>
    </div>
  );
};

export default Options;