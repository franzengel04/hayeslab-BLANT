// src/components/Processing.tsx
import React from 'react';
import './Processing.css'; // We will create this CSS file next
import LoadingCircle from '../LoadingCircle';

const Processing: React.FC = () => {
  return (
    <div className="pr-stepContainer">
      <LoadingCircle />
      <h3 className="pr-statusText">Submitting Job...</h3>
    </div>
  );
};

export default Processing;
