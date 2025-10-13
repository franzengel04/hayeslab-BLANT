// src/pages/LookupJob.tsx
import React, { useState } from 'react';
import './LookupJob.css';

const LookupJob: React.FC = () => {
  const [jobId, setJobId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to look up the job will go here
    console.log('Searching for Job ID:', jobId);
    alert(`Searching for Job ID: ${jobId}`);
  };

  return (
    <div className="lj-pageContainer">
      <div className="lj-lookupBox">
        <h2 className="lj-title">Job Lookup</h2>
        <form onSubmit={handleSubmit}>
          <div className="lj-formGroup">
            <label htmlFor="jobId" className="lj-label">Job ID To Search For:</label>
            <input
              type="text"
              id="jobId"
              className="lj-input"
              placeholder="Previous Job ID"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
            />
          </div>
          <button type="submit" className="lj-submitButton">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default LookupJob;
