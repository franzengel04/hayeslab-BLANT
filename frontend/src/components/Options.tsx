// src/components/Options.tsx
import React from 'react';
import './Options.css';
import { useState } from 'react'
import type { blantOptions } from '../context/JobSubmissionContext';
import AccordionSection from './AccordionSection';

interface OptionsProps {
  // onNext: () => void;
  // onPrevious: () => void;
  // onDataChange: (data: Partial<FormData>) => void;
  onDataChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>, optionName: keyof blantOptions) => void;
  // initialData: FormData;
  initialData: blantOptions;
}

const Options: React.FC<OptionsProps> = ({ onDataChange, initialData }) => {

  const [isActive, setIsActive] = useState<boolean>(false);
  return (
    <>
    <AccordionSection
      title="Advanced Options"
      isActive={isActive}
      isCompleted={true}
      isLocked={false}
      onClick={() => {setIsActive(!isActive);}}
    >

      <div className="os-stepContainer">
        {/* <div className="os-noteBox">
          <h4>NOTE</h4>
          <ul>
            <li><p><strong>Graphlet Size:</strong> The number of nodes in the graphlets to sample (required, 3-7). Default is 4, which is usually sufficient. Larger values may take longer to run. </p></li>
            <li><p><strong>Edge Density:</strong> Set the lower bound on the edge density (fraction of all possible edges among the nodes) for communities you wish to discover. Note that we will produce <i>overlapping</i> communities.</p></li>
          </ul>
          Want to learn more about BLANT? Check out the paper <a href="https://www.liebertpub.com/doi/abs/10.1089/cmb.2025.0095" target="_blank">here</a>.
        </div> */}

        <div className="os-optionsContainer">
          <div className="os-optionsGrid">
            <div className="os-inputGroup">
              <label htmlFor="graphletSize">Graphlet Size</label>
              <select id="graphletSize" className="os-selectInput" value={initialData.graphletSize || 4} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onDataChange(e, 'graphletSize')}>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
              </select>
            </div>
          </div>
          <div className="os-optionsGrid">
              <div className="os-inputGroup">
                <label htmlFor="precision">Edge Density</label>
                <input type="number" id="precision" className="os-numberInput" defaultValue={initialData.density} onChange={(e) => onDataChange(e, 'density')} />
              </div>
          </div>
        </div>
      </div>
    </AccordionSection>
      {/* <div className="os-buttonContainer">
        <button onClick={onPrevious} className="os-navButton os-navButton-previous">&larr; Previous</button>
        <button onClick={onNext} className="os-navButton">Next &rarr;</button>
      </div> */}
    
    </>
  );
};

export default Options;