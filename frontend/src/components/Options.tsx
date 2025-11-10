// src/components/Options.tsx
import React from 'react';
import './Options.css';
import { useState } from 'react'
import type { blantOptions } from '../context/JobSubmissionContext';
import AccordionSection from './AccordionSection';

interface OptionsProps {
  onDataChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>, optionName: keyof blantOptions) => void;
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
        <div className="os-optionsContainer">
          <div className="os-optionsGrid">
            <div className="os-inputGroup">
              <label htmlFor="graphletSize" className="os-labelWithInfo">
                Graphlet Size
                <span className="os-infoIcon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor">i</text>
                  </svg>
                  <span className="os-infoTooltip">The number of nodes in the graphlets to sample (3-7) </span>
                </span>
              </label>
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
                <label htmlFor="precision" className="os-labelWithInfo">
                  Edge Density
                  <span className="os-infoIcon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor">i</text>
                    </svg>
                    <span className="os-infoTooltip">Lower bound on the edge density for communities to discover,<br />produces overlapping communities.</span>
                  </span>
                </label>
                <input type="number" id="precision" className="os-numberInput" defaultValue={initialData.density} onChange={(e) => onDataChange(e, 'density')} />
              </div>
          </div>
          <div className="os-optionsGrid">
              <div className="os-inputGroup">
                <label htmlFor="precision" className="os-labelWithInfo">
                  Fractional Overlap
                  <span className="os-infoIcon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor">i</text>
                    </svg>
                    <span className="os-infoTooltip">Fractional overlap allowed between two found clusters</span>
                  </span>
                </label>
                <input type="number" id="precision" className="os-numberInput" defaultValue={initialData.fractionalOverlap} onChange={(e) => onDataChange(e, 'fractionalOverlap')} />
              </div>
          </div>
        </div>
      </div>
    </AccordionSection>
    
    </>
  );
};

export default Options;