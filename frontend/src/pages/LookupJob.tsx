// src/pages/LookupJob.tsx
import React, { useState, useEffect, } from 'react';
import { useNavigate } from "react-router";
import { useParams } from 'react-router-dom';
import './LookupJob.css';
import api from '../api/api';
import LoadingCircle from '../components/LoadingCircle';

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
    if (result.status === 'success') {
      setJobOutput(result.data.execLogFileOutput);
    } else if (result.status === 'processing') {
      setTimeout(() => getJobStatus(id), 3000); // query again in 3 seconds
    } else if (result.status === 'error') {
      setJobOutput(result.error.message);
    }
  }

  useEffect(() => {
    if (id) {
      setJobId(id);
      getJobStatus(id);
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/lookup-job/${jobId}`)
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
            {
              (jobOutput === null && id != undefined) ? (
                <LoadingCircle />
              ) : (
                'Submit'
              )
            }
          </button>
        </form>
        {
          jobOutput && (
            <div className="lj-output">
              <h3 className="lj-outputTitle">Job Output</h3>
              <pre className="lj-outputContent">{jobOutput}</pre>
            </div>
          )
        }
        {
          jobOutput === null && id != undefined && (
            <div className="lj-output">
              <h3 className="lj-outputTitle">Job Output</h3>
              Job is still being processed...
            </div>
            )
        }
      </div>
    </div>
  );
};

export default LookupJob;
