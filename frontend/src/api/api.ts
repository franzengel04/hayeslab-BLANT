// import { 
//     SubmitJobResponse, ContactResponse, ProcessJobResponse,
//     GetJobResultResponse,
//     ApiOptions, ContactFormData, ErrorResponseSchema,
//     ContactResponseSchema,
//     ProcessResponseSchema,
//     SubmitJobResponseSchema,
//     GetJobResultSuccessResponseSchema, // Use this one for success cases
//   } from './apiValidation';

interface SubmitJobResponse {
  success: boolean;
  status: string;
  jobId: string;
  execLogFileOutput?: string;
  redirect?: string;

  // maybe
  note?: string;
  zipDownloadUrl?: string;
}


export const API_URL = import.meta.env.VITE_API_URL; // ?? 'http://localhost:4000';
// export const API_URL = "https://hayeslab.ics.uci.edu/blant-backend/api";
console.log("API_URL is: ", API_URL);
/**
 * Generic API request function with improved error handling and type validation
 */
const apiRequest = async <T extends object>(
  endpoint: string,
//   schema: z.ZodType<T>,
  options: any = {},
  hasMultipart: boolean = false
): Promise<T> => {
  const url = `${API_URL}${endpoint}`;
	console.log("making api call to the backend route: ", url);
  
  const headers = {
    ...options.headers,
  };
  
  if (!hasMultipart) {
    headers["Content-Type"] = "application/json";
  }
  
  try {
    const requestOptions = {
      headers,
      ...options
    }
    console.log("requestOptions: ", requestOptions);
    const response = await fetch(url, requestOptions);

    const data = await response.json();
    if (response.status != 302 && (response.status < 200 || response.status >= 300)) {
      console.error(`HTTP error! status: ${response.status}`, data);
      throw new ApiError(
        "An unexpected error occurred",
        response.status,
        { message: "Invalid error response format", data }
      );
    } else {
        return data;
    }
    
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("API request failed:", error);
    throw new ApiError(
      error instanceof Error ? error.message : "Unknown error",
      500,
      { originalError: error }
    );
  }
};

/**
 * Custom API error class
 */
export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number = 500, details: unknown = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/**
 * API interface with strongly typed methods
 */
interface Api {
//   contactUs: (formData: ContactFormData) => Promise<ContactResponse>;
//   upload: (formData: FormData) => Promise<SubmitJobResponse>;
//   process: (jobId: string) => Promise<ProcessJobResponse>;
  submitJob: (formData: FormData) => Promise<any>;
  getJobStatus: (
    jobId: string
  ) => Promise<any>;
  downloadJobZip: (jobId: string) => Promise<Blob>;
}

/**
 * API implementation with Zod validation
 */
const api: Api = {
//   contactUs: async (formData) => {
//     return await apiRequest(
//       "/contact",
//       ContactResponseSchema,
//       {
//         method: "POST",
//         body: JSON.stringify(formData),
//       }
//     );
//   },
  
  submitJob: async (formData: FormData): Promise<any> => {
    // const response = await apiRequest<SubmitJobResponse>(
    //   // "/jobs/preprocess",
    //   "/jobs/submitJob",
    //   {
    //     method: "POST",
    //     body: formData,
    //   },
    //   true
    // );
    const url = `${API_URL}/jobs/submitJob`;
    const requestOptions = {
      method: "POST",
      body: formData,
    }
    console.log("submitJob requestOptions: ", requestOptions);
    const response = await fetch(url, requestOptions);
    const responseData = await response.json();
    console.log("submitJob api.submitJob response:", responseData);
    return responseData;
  },

//   process: async (jobId) => {
//     return await apiRequest(
//       "/jobs/process",
//       ProcessResponseSchema,
//       {
//         method: "POST",
//         body: JSON.stringify({ id: jobId }),
//       }
//     );
//   },
  getJobStatus: async (jobId) => {
    // return await apiRequest(`/jobs/status/${jobId}`, { method: 'GET' });
    console.log('getJobStatus api.getJobStatus jobId:', jobId);
    const response = await fetch(`${API_URL}/jobs/status/${jobId}`, { method: 'GET' });
    const responseData = await response.json();
    return responseData;
  },

  downloadJobZip: async (jobId) => {
    const url = `${API_URL}/jobs/${jobId}/zip`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        `Failed to download job zip: ${response.statusText}`,
        response.status,
        errorData
      );
    }
    
    return await response.blob();
  },
};

export default api;
