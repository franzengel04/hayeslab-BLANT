
export interface blantOptions {
    graphletSize: number,
    density: number,
    fractionalOverlap: number,
}

export interface JobSubmissionContextSchema {
    networkFile: File | null,
    setNetworkFile: (file: File | null) => void,
    blantOptions: blantOptions,
    setBlantOptions: (options: blantOptions) => void,
    fileError: string | null,
    validateFile: (file: File) => [boolean, string | null],
    handleSubmit: () => Promise<boolean>,
    isSubmitted: boolean,
    setIsSubmitted: (isSubmitted: boolean) => void,
    resetForm: () => void,
    handleFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<boolean>,
    handleBlantOptionsChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>, optionName: keyof blantOptions) => Promise<boolean>,
}

export interface FormData {
    networkFile: File | null;
    graphletSize: number;
    edgeDensity: number;
    fractionalOverlap: number;
}



