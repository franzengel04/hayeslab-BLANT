// src/pages/SubmitJobPage.tsx
import React from 'react';
import './SubmitJob.css';
import NetworkSelection from '../../components/NetworkSelection';
import Options from '../../components/Options';
import Processing from '../../components/Processing';
import { useJobSubmission } from '../../context/JobSubmissionContext';
import { useNavigate } from 'react-router-dom';

export interface FormData {
  networkFile: File | null;
  graphletSize: number;
  edgeDensity: number;
  fractionalOverlap: number;
}

const SubmitJobPage: React.FC = () => {
  const navigate = useNavigate();
  // const [isSubmitted, setIsSubmitted] = useState<boolean>(false); 
  const { 
    blantOptions, 
    handleSubmit, 
    handleFileInputChange,
    handleBlantOptionsChange,
    isSubmitted,
    setIsSubmitted,
  } = useJobSubmission();

  const handleSubmitJob = async () => {
      // setIsSubmitted(true); // Set submission status to true
      // if (await handleSubmit()) {
      //   setIsSubmitted(true);
      // } else {
      //   setIsSubmitted(false);
      // }
      try {
        await handleSubmit();
        setIsSubmitted(true);
      } catch (error) {
        alert(String(error));
        setIsSubmitted(false);
      }
  }

  const handleBackToHome = () => {
    navigate('/');
  }

  const JobSubmissionMenu = (
    <div className="sjp-accordion">
      <NetworkSelection 
        onDataChange={handleFileInputChange}
      />
        <Options 
        onDataChange={handleBlantOptionsChange}
        initialData={blantOptions}
        />
        <div className="sjp-buttonContainer">
          <button onClick={handleBackToHome} className="os-navButton os-navButton-previous">&larr; Back to Home </button>
          <button onClick={handleSubmitJob} className="os-navButton">Submit &rarr;</button>
      </div>
    </div>
  )

  return (
    <div className="sjp-submitJobPage">
      <h1 className="sjp-pageTitle">Community Detection</h1>

      {
        isSubmitted ? (
          <div className="sjp-accordion">
            <Processing />
          </div>
        ) : (
          JobSubmissionMenu
        )
      }
    </div>
  );
};

export default SubmitJobPage;
