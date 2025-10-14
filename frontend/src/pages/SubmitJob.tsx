// src/pages/SubmitJobPage.tsx
import React, { useState } from 'react';
import './SubmitJob.css';
import AccordionSection from '../components/AccordionSection';
import NetworkSelection from '../components/NetworkSelection';
import Options from '../components/Options';
import Confirm from '../components/Confirm';
import Processing from '../components/Processing';
import { useJobSubmission } from '../context/JobSubmissionContext';

// Define a type for all the form data
export interface FormData {
  networkFile: File | null;
  graphletSize: number;
  edgeDensity?: number;
  outputMode: string;
  samplingMethod: string;
  precision: number;
  numSamples: number;
}

const SubmitJobPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false); // State to track submission
  const { 
    networkFile, 
    setNetworkFile,
    blantOptions, 
    setBlantOptions,
    validateFile, 
    handleSubmit, 
    handleFileInputChange,
    handleBlantOptionsChange,
    resetForm, 
    fileError 
  } = useJobSubmission();

  
  const [formData, setFormData] = useState<FormData>({
    networkFile: null,
    graphletSize: 3,
    outputMode: 'f',
    samplingMethod: 'precision',
    precision: 0.01,
    numSamples: 10000,
  });

  // const handleDataChange = (newData: Partial<FormData>) => {
  //   setFormData(prev => ({ ...prev, ...newData }));
  // };


  
  const handleNext = () => {
    // There are now 4 steps total (0, 1, 2, 3)
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 3));
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleSubmitJob = () => {
      console.log('Submitting Job with data:', formData);
      setIsSubmitted(true); // Set submission status to true
      // Move to the "Processing" step
      handleSubmit();
      handleNext(); 
  }

  return (
    <div className="sjp-submitJobPage">
      <h1 className="sjp-pageTitle">Submit New Job</h1>

      <div className="sjp-accordion">
        <AccordionSection
          title="1. Select Network"
          isActive={currentStep === 0}
          isCompleted={currentStep > 0}
          isLocked={isSubmitted} // Pass submission status
          onClick={() => currentStep > 0 && !isSubmitted && setCurrentStep(0)}
        >
          {/* <NetworkSelection 
            onNext={handleNext} 
            onDataChange={handleBlantOptionsChange}
          /> */}
          {/* <NetworkSelection 
            onNext={handleNext} 
            onDataChange={setNetworkFile}
          /> */}
          <NetworkSelection 
            onNext={handleNext} 
            onDataChange={handleFileInputChange}
          />
        </AccordionSection>

        <AccordionSection
          title="2. Options"
          isActive={currentStep === 1}
          isCompleted={currentStep > 1}
          isLocked={isSubmitted} // Pass submission status
          onClick={() => currentStep > 1 && !isSubmitted && setCurrentStep(1)}
        >
           <Options 
            onNext={handleNext} 
            onPrevious={handlePrevious} 
            onDataChange={handleBlantOptionsChange}
            initialData={formData}
           />
        </AccordionSection>
        
        <AccordionSection
          title="3. Confirm"
          isActive={currentStep === 2}
          isCompleted={currentStep > 2}
          isLocked={isSubmitted} // Pass submission status
          onClick={() => currentStep > 2 && !isSubmitted && setCurrentStep(2)}
        >
           <Confirm 
            formData={formData}
            onPrevious={handlePrevious}
            onSubmit={handleSubmitJob}
           />
        </AccordionSection>

        {/* This section now uses the new Processing component */}
        <AccordionSection
          title="4. Processing"
          isActive={currentStep === 3}
          isCompleted={false}
          isLocked={isSubmitted}
          onClick={()=>{}}
        >
          <Processing />
        </AccordionSection>
      </div>
    </div>
  );
};

export default SubmitJobPage;
