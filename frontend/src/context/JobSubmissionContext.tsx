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

interface blantOptions {
    graphletSize: number,
    edgeDensity?: number,
    samplingMethod: 'precision' | 'sample_number',
    outputMode: 'frequency' | 'odv',
    precision?: number,
}

interface JobSubmissionContextSchema {
    networkFile: File | null,
    blantOptions: blantOptions | null,
    fileError: string | null,
    validateFile: (file: File) => boolean,
    handleSubmit: () => Promise<void>,
    resetForm: () => void,
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
    const [blantOptions, setBlantOptions] = useState<blantOptions | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const validateFile = (
        file: File,
    ): boolean => {
        const fileName = file.name.toLowerCase();
        if (!fileName.endsWith('.el')) {
            setFileError("File extension must be .el");
            return false;
        }
        return true;
    };

    const handleSubmit = async (): Promise<void> => {
        try {
            // Validate required files
            if (!networkFile) {
                setFileError("Please upload a network file.");
                return;
            }

            const formData = new FormData();
            formData.append("files", networkFile);
            formData.append("options", JSON.stringify(blantOptions));

            // Log FormData contents
            console.log("FormData contents:");
            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            try {
                const response = await api.submitJob(formData);
                console.log("jobSubmission api.upload response:", response);

                if (response.redirect) {
                    navigate(response.redirect); // redirects to /submit-jobs/[jobID] url
                }
            } catch (error) {
                setFileError("An error occurred during submission: " + String(error));
            }
        } catch (error) {
            // console.error("Submit preparation error:", error);
            setFileError(
                String(error)
            );
            console.error("Submit preparation error:", error);
        }
    };

    const resetForm = () => {
        setNetworkFile(null);
        setFileError(null);
        setBlantOptions(null);
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
                blantOptions,
                validateFile,
                handleSubmit,
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
