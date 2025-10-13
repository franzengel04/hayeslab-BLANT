// src/components/Processing.tsx
import React from 'react';
import './Processing.css'; // We will create this CSS file next

const Processing: React.FC = () => {
  return (
    <div className="pr-stepContainer">
      <h3 className="pr-statusText">Preprocessing Networks...</h3>
      
      {/* The yellow note box */}
      <div className="pr-noteBox">
        <h4>NOTE</h4>
        <p>If this page doesn't redirect, try again in a different browser.</p>
      </div>
    </div>
  );
};

export default Processing;
