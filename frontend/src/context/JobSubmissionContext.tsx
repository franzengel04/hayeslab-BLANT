import {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";
import { useNavigate } from "react-router";
// import { z } from "zod";
import api from "../api/api.ts";

// export const JobSubmissionContext = createContext<JobSubmissionContextType | null>(null);

export interface blantOptions {
    graphletSize: number,
    density?: number,
    samplingMethod: 'precision' | 'sample_number',
    outputMode: 'frequency' | 'odv',
    precision?: number,
    numSamples?: number,
}

interface JobSubmissionContextSchema {
    networkFile: File | null,
    setNetworkFile: (file: File | null) => void,
    blantOptions: blantOptions,
    setBlantOptions: (options: blantOptions) => void,
    fileError: string | null,
    validateFile: (file: File) => [boolean, string | null],
    handleSubmit: () => Promise<void>,
    isSubmitted: boolean,
    setIsSubmitted: (isSubmitted: boolean) => void,
    resetForm: () => void,
    handleFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<boolean>,
    handleBlantOptionsChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>, optionName: keyof blantOptions) => Promise<boolean>,
}

const JobSubmissionContext = createContext<JobSubmissionContextSchema | null>(null);

// Option ranges schema with validation
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export function JobSubmissionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const navigate = useNavigate();
    const [networkFile, setNetworkFile] = useState<File | null>(null);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false); 
    const [blantOptions, setBlantOptions] = useState<blantOptions>({
        graphletSize: 4,
        outputMode: 'frequency',
        samplingMethod: 'precision',
        precision: 1,
        density: 1,
        numSamples: 10000,
    });
    const [fileError, setFileError] = useState<string | null>(null);

    const validateFile = (
        file: File,
    ): [boolean, string | null] => {
        const fileName = file.name.toLowerCase();
        if (!fileName.endsWith('.el')) {
            // setFileError("File extension must be .el");
            return [false, "[INVALID FILE] File extension must be .el"];
        }
        if (file.size > 1 * 1024 * 1024) { // 5 MB in bytes
            // setFileError("File size must not exceed 5 MB");
            return [false, "[INVALID FILE] File size must not exceed 5 MB"];
        }
        return [true, null];
    };

    const handleFileInputChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) : Promise<boolean> => {
        console.log("handleFileInputChange event.target: ", event.target);
        const file = event.target.files?.[0];
        console.log("handleFileInputChange file: ", file);
        if (!file) return false;

        try {
            const [isValid, errorMessage] = await validateFile(file);
            console.log("Is valid: ", isValid);
            if (isValid) {
                setNetworkFile(file);
                return true;
            }
            // file is not valid
            // alert("Invalid file. Please upload a valid network file format (.el)");
            // alert(fileError);
            alert(errorMessage);
            event.target.value = '';
            setNetworkFile(null);
            return false;
        } catch (error) {
            console.error("File validation error:", error);
            return false;
        }
    };

    const handleBlantOptionsChange = async (
        event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
        optionName: keyof blantOptions  
    ) : Promise<boolean> => {
        if (!event.target.value || !blantOptions) return false;

        // Helper to check if a string is a number (integer or decimal)
        const isNumericString = (s: string) => /^\d+(\.\d+)?$/.test(s);
        let value; 
        if (isNumericString(event.target.value)) {
            value = parseFloat(event.target.value);
        } else {
            value = event.target.value;
        }

        // // input validation
        // if (optionName === 'density' && typeof value === 'number') {
        //     if (value < 0.01 || value > 1) {
        //         event.target.value = '1';
        //         return false;
        //         // return false;
        //     }
        // }
    
        const newBlantOptions = { ...blantOptions, [optionName]: value };
        // const newBlantOptions = { ...blantOptions, ...newData };
        setBlantOptions(newBlantOptions);
        console.log("handleBlantOptionsChange newBlantOptions: ", newBlantOptions);
        return true;
    };

    const handleSubmit = async (): Promise<void> => {
        try {
            // Validate required files
            console.log("handleSubmit networkFile: ", networkFile);
            console.log("handleSubmit blantOptions: ", blantOptions);
            if (!networkFile) {
                setFileError("Please upload a network file.");
                return;
            }

            const formData = new FormData();
            formData.append("file", networkFile);
            formData.append("options", JSON.stringify(blantOptions));

            // Log FormData contents
            console.log("FormData contents:");
            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            console.log("Submitting form data: ", formData);
            const response = await api.submitJob(formData)
            console.log("jobSubmission api.upload response:", response);

            if (response.redirect) {
                navigate(response.redirect); // redirects to /submit-jobs/[jobID] url
            }
        } catch (error) {
            // console.error("Submit preparation error:", error);
            setFileError(
                String(error)
            );
            setIsSubmitted(false);
            alert("An error occurred during submission: " + String(error));
            console.error("Submit preparation error:", error);
            // setIsSubmitted(false);
        }
    };

    const resetForm = () => {
        setNetworkFile(null);
        setFileError(null);
        // setBlantOptions(null);
    };

    useEffect(() => {
        console.log(
            "useEffect: blantOptions updated:",
            blantOptions
        );
    }, [blantOptions]);

    return (
        <JobSubmissionContext.Provider
            value={{
                networkFile,
                setNetworkFile,
                blantOptions,
                setBlantOptions,
                validateFile,
                handleSubmit,
                isSubmitted,
                setIsSubmitted,
                handleFileInputChange,
                handleBlantOptionsChange,
                resetForm,
                fileError,
            }}
        >
            {children}
        </JobSubmissionContext.Provider>
    );
}

export function useJobSubmission() {
    const context = useContext(JobSubmissionContext);

    if (!context) {
        throw new Error(
            "useJobSubmission has to be used within <JobSubmission.Provider>"
        );
    }

    return context;
}
