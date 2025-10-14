// src/pages/LookupJob.tsx
import React, { useState, useEffect, } from 'react';
import { useNavigate } from "react-router";
import { useParams } from 'react-router-dom';
import './LookupJob.css';
import api from '../api/api';

const LookupJob: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [jobId, setJobId] = useState('');
  const [jobOutput, setJobOutput] = useState<string | null>(null);
  const navigate = useNavigate();

  // Set the jobId from URL parameter if it exists
  async function getJobStatus(id: string) {
    console.log('getting job status for id:', id);
    const result = await api.getJobStatus(id);
    console.log('Job Result:', result);
    // console.log('Job Result execLogFileOutput:', result.execLogFileOutput);
    setJobOutput(result.data.execLogFileOutput);
  }

  useEffect(() => {
    if (id) {
      setJobId(id);
      // setTimeout(() => getJobStatus(id), 3000);
      getJobStatus(id);
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to look up the job will go here
    // console.log('Searching for Job ID:', jobId);
    // getJobStatus(jobId);
    navigate(`${jobId}`)
    // navigate(`/lookup-job/${jobId}`);


    // alert(`Searching for Job ID: ${jobId}`);
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
        {
          jobOutput && (
            <div className="lj-output">
              <h3 className="lj-outputTitle">Job Output</h3>
              {/* <pre className="lj-outputContent">{jobOutput}</pre> */}
              {jobOutput}
            </div>
          )
        }
      </div>
    </div>
  );
};

export default LookupJob;
