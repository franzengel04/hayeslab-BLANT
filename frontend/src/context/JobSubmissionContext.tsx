import {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";
import { useNavigate } from "react-router";
import api from "../api/api.ts";
import { type JobSubmissionContextSchema, type blantOptions } from "../types/types";

const JobSubmissionContext = createContext<JobSubmissionContextSchema | null>(null);

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
        density: 1,
        fractionalOverlap: 0.5,
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
        if (file.size > 5 * 1024 * 1024) { // 5 MB in bytes
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

        const newBlantOptions = { ...blantOptions, [optionName]: value };
        setBlantOptions(newBlantOptions);
        console.log("handleBlantOptionsChange newBlantOptions: ", newBlantOptions);
        return true;
    };

    const _validateBlantOptions = (options: blantOptions): void => {
        let errorMessage = '';
        if (options.graphletSize < 3 || options.graphletSize > 7) {
            errorMessage = "Graphlet size must be between 3 and 7 (inclusive).";
        }
        if (options.density < 0.01 || options.density > 1) {
            errorMessage += "\nDensity must be between 0.01 and 1 (inclusive).";
        }
        if (options.fractionalOverlap < 0 || options.fractionalOverlap >= 1) {
            errorMessage += "\nFractional overlap must be between 0 (inclusive) and 1 (exclusive).";
        }
        if (errorMessage) {
            throw new Error(errorMessage);
        }
    };

    const handleSubmit = async (): Promise<boolean> => {
        // try {
            // Validate required files
            console.log("handleSubmit networkFile: ", networkFile);
            console.log("handleSubmit blantOptions: ", blantOptions);
            if (!networkFile) {
                throw new Error("Please upload a network file.");
            }

            _validateBlantOptions(blantOptions);
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
            return true;
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
