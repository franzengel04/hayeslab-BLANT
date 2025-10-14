import { Request } from 'express';
import { SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
 
declare global {
    namespace Express {
        interface Request {
            supabase?: SupabaseClient;
            user?: SupabaseUser;
            userProfile?: UserRecord; 
            extractDir?: string;
        }
    }
}
// request types
//export type MulterFile = Parameters<ReturnType<typeof import('multer')>['any']>[0]['files'][0];
// ✅ Manually defined — works with any Multer config
export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer;
}

export interface UploadedFiles {
    files: MulterFile[];
    similarityFiles?: MulterFile[];
}


export interface SubmitJobRequest extends Request{
    body: {
        options:  string
            // {
            //     density: number,
            //     graphletSize: number,
            //     outputMode: string,
            //     samplingMethod: string,
            //     precision?: number,
            // }
        file: MulterFile;
    };
}

export interface SubmitJobOptions {
    density: number,
    graphletSize: number,
    outputMode: string,
    samplingMethod: string,
    precision?: number,
}

export interface ProcessJobRequest extends Request{
    body: {
        id?: string;
        jobData?: object;
    };
}

export interface DownloadZipRequest extends ProcessJobRequest{};
export interface GetJobResultsRequest extends ProcessJobRequest{};
export interface GetJobStatusRequest extends ProcessJobRequest{};
// // response types

export interface ErrorDetails<T = undefined> {
    message: string;
    errorLog?: string;
    stackTrace?: string;
    data?: T;
}

export interface UnifiedResponse<T = undefined, E = undefined> {
    status: 'success' | 'error' | 'redirect';
    message: string;
    data?: T;
    error?: ErrorDetails<E>;
    redirect?: string;
}

export type JobStatus = 'preprocessing' | 'processing' | 'processed' | 'failed';
// type JobStatus = 'pending' | 'preprocessed' | 'processing' | 'completed' | 'failed';

export type JobMode = 'f' | 'o' | 'g' | 'i' | 'j' ;

export type JobData = {
    // identifiers
    id: string;
    status: JobStatus;
    density: number;
    graphletSize: number;
    // file info
    networkName: string;
    extension: string;
    jobLocation: string;
    // processing details
    attempts: number;
    result?: any;
    error?: string;
    // timestamps (as ISO strings for JSON serialization)
    createdAt: string;
    updatedAt: string;
    startedAt?: string;
    completedAt?: string;
    failedAt?: string;
};

export interface JobStatusResponse {
    id: string;
    status: "processed" | "failed" | "preprocessed" | "preprocessing";
    command: string,
}

// BullMQ job payload type
export interface BullMQJobData {
    jobData: JobData;
    files: UploadedFiles;
    density: number;
    graphletSize: number;
}

// BullMQ job options type
export interface BullMQJobOptions {
    priority?: number;
    delay?: number;
    attempts?: number;
    backoff?: {
        type: 'fixed' | 'exponential';
        delay: number;
    };
    removeOnComplete?: number;
    removeOnFail?: number;
}

export interface JobInfoFile {
    status: JobStatus; 
    data: JobData; 
    density: number; 
    graphletSize: number;
};

export interface SuccessJobInfoFile{
    status: 'processed';
    // zipName: string;
    command: string;
};

export interface FailedJobInfoFile {
    status: 'failed';
    log: string;
    command: string;
};


export interface ProcessJobData {
    success: boolean;
    status: string;
    jobId: string;
    execLogFileOutput?: string;
    redirect?: string;

    // maybe
    note?: string;
    zipDownloadUrl?: string;
}

export interface ProcessedJobResponse {
    jobId: string;
    note: string;
    zipDownloadUrl: string;
    execLogFileOutput: string;
};

// AUTH TYPES
// export interface User {
//     id: number;
//     google_id: string | null;
//     email: string;
//     first_name: string | null;
//     last_name: string | null;
//     hashed_password: string | null;
//     api_key: string;
// }

export interface UserRecord {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    api_key: string;
    created_at: string;
}

export interface InsertUser {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
}

export interface DbInsertUser extends InsertUser {
    api_key: string;
};

export type PublicUser = Omit<UserRecord, 'api_key' | 'created_at'>;


// API key response type (for secure routes)
export interface ApiKeyResponse {
    api_key: string;
}

// Update payload type
export interface UserUpdateBody {
    first_name?: string;
    last_name?: string;
    email?: string;
}

// Response types
export interface AuthResponse {
    status: 'success' | 'error';
    data?: {
        user: PublicUser;
    };
    error?: {
        message: string;
    };
}

export interface ApiKeyAuthResponse {
    status: 'success' | 'error';
    data?: {
        api_key: string;
    };
    error?: {
        message: string;
    };
}

export interface AuthenticatedRequest extends Omit<Request, 'user'> {
    user: UserRecord;
}