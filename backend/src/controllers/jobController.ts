import fs from 'fs';
import { Response, NextFunction } from 'express';
import HttpError from '../middlewares/HttpError';
import { createJob } from '../services/jobService';
import { jobProcess } from '../services/processService';
import {
    DownloadZipRequest,
    GetJobResultsRequest,
    GetJobStatusRequest,
    JobData,
    JobStatusResponse,
    ProcessedJobResponse,
    ProcessJobData,
    SubmitJobOptions,
    SubmitJobRequest,
    UnifiedResponse,
} from '../../types/types';
import path from 'path';
// import { getJobFromQueue } from '../config/queue';
/**
 * Downloads the zip file for a job based on the request parameters.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 * @returns A Promise that resolves when the download is complete or rejects with an error.
 */
const downloadZipJob = async (req: DownloadZipRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const jobId = req.params.id;
        if (!jobId) {
            throw new HttpError('Job ID is required.', { status: 400 });
        }

        const jobDir = path.join(__dirname, '../process', jobId);
        const infoFilePath = path.join(jobDir, 'info.json');

        // Check if job directory exists
        if (!fs.existsSync(jobDir) || !fs.lstatSync(jobDir).isDirectory()) {
            throw new HttpError('Job not found.', { status: 404 });
        }

        // Check if info.json exists
        if (!fs.existsSync(infoFilePath)) {
            throw new HttpError('Job data not found. The job might not have been processed yet.', {
                status: 500,
            });
        }

        // Read job data
        try {
            const infoJsonContent = fs.readFileSync(infoFilePath, 'utf8');
            const jobData = JSON.parse(infoJsonContent);

            if (!jobData.zipName) {
                throw new HttpError('Invalid job data: missing zip file name.', {
                    status: 500,
                });
            }

            const zipLocation = path.join(jobDir, jobData.zipName);

            if (!fs.existsSync(zipLocation)) {
                throw new HttpError('Zip file not found.', { status: 404 });
            }

            // Send the zip file
            res.download(zipLocation, jobData.zipName, (err) => {
                if (err) {
                    console.error('Error sending zip file:', err);
                    // log the error and let the download fail gracefully
                }
            });

        } catch (error) {
            console.error('Error reading job data:', error);
            throw new HttpError('Could not read job data.', { status: 500 });
        }
    } catch (err) {
        next(err);
    }
};

/**
 * Controller to handle job submission with file uploads.
 */
const submitJobController = async (req: SubmitJobRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        //  Validate required fields
        console.log("submitJobController req.body:", req.body);
        const jobOptions: SubmitJobOptions = JSON.parse(req.body.options);
        console.log("submitJobController jobOptions object:", jobOptions);
        // if (!req.body.options.density) {
        if (!jobOptions.density) {
            throw HttpError.badRequest('density is required.');
        }
        // if (isNaN(req.body.options.density)) {
        if (isNaN(jobOptions.density)) {
            throw HttpError.badRequest('density must be a valid number.');
        // } else if (req.body.options.density > 1 || req.body.options.density < 0.01) {
        } else if (jobOptions.density > 1 || jobOptions.density < 0.01) {
            throw HttpError.badRequest('density must be between 0.01 and 1.00.');
        }
        
        // if (!req.body.options.graphletSize ) {
        if (!jobOptions.graphletSize ) {
            throw HttpError.badRequest('graphletSize is required.');
        }
        // if (isNaN(req.body.options.graphletSize)) {
        if (isNaN(jobOptions.graphletSize)) {
            throw HttpError.badRequest('graphletSize must be a valid number.');
        // } else if (req.body.options.graphletSize > 8 || req.body.options.graphletSize < 3) {
        } else if (jobOptions.graphletSize > 8 || jobOptions.graphletSize < 3) {
            throw HttpError.badRequest('graphletSize must be between 3 and 8.');
        }

        //  Create job with validated inputs
        if (!req.file) {
            throw new HttpError('No file uploaded', { status: 400 });
        }
        // creates job and runs preprocessing (creating the directory for output files, moving the network files there, etc... but does not actually start running the job)
        // const result = await createJob(req.file, req.body.options.density, req.body.options.graphletSize);
        const result = await createJob(req.file, jobOptions.density, jobOptions.graphletSize);
        console.log("cratead job with preprocess data:", result);
        //  Send successful response
        const response: UnifiedResponse<JobData> = {
            status: 'success',
            message: 'Job submitted successfully',
            data: result,
        };
        const processResult = await processController(result);
        res.status(201).json(processResult);
    } catch (err) {
        next(err);
    }
};
 
// Controller to process a job after submission.
const processController = async (data: JobData): Promise<ProcessJobData> => {
    const jobId = data.id;
    const jobData = data;
    if (!jobId) {
        throw new HttpError('id field is required in request.body', { status: 400 });
    }
    return await jobProcess(jobId, jobData);
};

const _parseJobStatusFile = async(jobId: string): Promise<JobStatusResponse> => {
    const jobDir = path.join(__dirname, '../process', jobId);

    // Check if job directory exists
    const jobDirExists = fs.existsSync(jobDir);
    // const jobDirIsDirectory = fs.lstatSync(jobDir).isDirectory();
    console.log('jobDirExists:', jobDirExists);
    // console.log('jobDirIsDirectory:', jobDirIsDirectory);
    if (!jobDirExists) {
        throw new HttpError('Job not found.', { status: 404 });
    }

    // Check if info.json exists
    const infoJsonPath = path.join(jobDir, 'info.json');
    if (!fs.existsSync(infoJsonPath)) {
        throw new HttpError('Job data not found. The job might not have been processed yet.', {
            status: 500,
        });
    }

    // Read job data
    const infoJsonContent = fs.readFileSync(infoJsonPath, 'utf8');
    const jobData = JSON.parse(infoJsonContent);
    jobData['id'] = jobId;

    return jobData;

    // Handle different job statuses
    // const status = jobData.status;

};

/**
 * Controller function to retrieve job results based on a job ID.
 *
 * @param req - Express request object containing the job ID in `params`.
 * @param res - Express response object that sends back a JSON response.
 * @param next - Express next middleware function for error handling.
 * @returns A Promise that resolves when the response is sent.
 */
const getJobStatus = async (req: GetJobResultsRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const jobId = req.params.id;
        console.log('getJobStatus jobId:', jobId);

        if (!jobId) {
            throw new HttpError('Job ID is required.', { status: 400 });
        }

        // const result = await getJob(jobId);

        const jobDir = path.join(__dirname, '../process', jobId);

        // // Check if job directory exists
        // if (!fs.existsSync(jobDir) || !fs.lstatSync(jobDir).isDirectory()) {
        //     throw new HttpError('Job not found.', { status: 404 });
        // }

        // // Check if info.json exists
        // const infoJsonPath = path.join(jobDir, 'info.json');
        // if (!fs.existsSync(infoJsonPath)) {
        //     throw new HttpError('Job data not found. The job might not have been processed yet.', {
        //         status: 500,
        //     });
        // }

        // // Read job data
        // const infoJsonContent = fs.readFileSync(infoJsonPath, 'utf8');
        // const jobData = JSON.parse(infoJsonContent);

        // // Handle different job statuses
        // const status = jobData.status;

        const jobData = await _parseJobStatusFile(jobId);

        const status = jobData.status;

        if (status === 'failed') {
            // Read the run.log file for error details
            const runLogPath = path.join(jobDir, 'run.log');
            let runLogContent = '';

            try {
                if (fs.existsSync(runLogPath)) {
                    runLogContent = fs.readFileSync(runLogPath, 'utf8');
                    runLogContent = runLogContent
                        .split('\n')
                        .map((line) => `<span>${line.trim()}</span>`)
                        .join('\n');
                } else {
                    runLogContent = 'Run log file not found';
                }
            } catch (err) {
                console.error('Error reading run.log:', err);
                runLogContent = 'Error reading run log file';
            }

            throw new HttpError('The alignment of the networks failed. See execution log below:', {
                status: 400,
                errorLog: runLogContent,
            });
        }

        if (status === 'preprocessed') {
            const redirectResponse: UnifiedResponse = {
                status: 'redirect',
                message: 'Job is still being processed. Redirecting...',
                // redirect: `/submit-job/${jobId}`,
                redirect: `/lookup-job/${jobId}`,
            };
            res.status(200).json(redirectResponse);
            return;
        }

        if (status === 'processed') {
            // if (!jobData.zipName) {
            //     throw new HttpError('Invalid job data: missing zip file name.', {
            //         status: 500,
            //     });
            // }

            // Get execution log
            const execLogFilePath = path.join(jobDir, 'run.log');
            let execLogFileOutput = '';

            if (fs.existsSync(execLogFilePath)) {
                try {
                    const execLogFileContent = fs.readFileSync(execLogFilePath, 'utf8');
                    const lines = execLogFileContent.split('\n');
                    execLogFileOutput = lines.map((line) => `<span>${line.trim()}</span>`).join('');
                } catch (err) {
                    execLogFileOutput = 'Problem opening execution log file.';
                }
            } else {
                execLogFileOutput = 'Job execution log file does not exist.';
            }

            // Construct base URL for download link
            const baseUrl = `${req.protocol}://${req.get('host')}`;


            const response: UnifiedResponse<ProcessedJobResponse> = {
                status: 'success',
                message: 'Job Results',
                data: {
                    jobId: jobId,
                    note: `These results can be accessed on the results page using the Job ID ${jobId}, 
                        or directly accessed using ${baseUrl}/results?id=${jobId}.`,
                    zipDownloadUrl: `${baseUrl}/api/download/${jobId}`,
                    execLogFileOutput: execLogFileOutput,
                },
            };

            res.status(200).json(response);
            return;
        } else {
            // Unhandled status
            throw new HttpError(`Unhandled job status: ${status}`, { status: 500 });
        }
    } catch (err) {
        next(err);
    }
};

// const getJobStatus = async (req: GetJobStatusRequest, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const jobId = req.params.id;
//         if (!jobId) {
//             throw new HttpError('Job ID is required.', { status: 400 });
//         }

//         // const job = await getJobFromQueue(jobId);

//         if (!job) {
//             throw new HttpError(`Job for id ${jobId} not found.`, { status: 404 });
//         }

//         const status = job.data.status;

//         const response: UnifiedResponse<JobStatusResponse> = {
//             status: 'success',
//             message: 'Job status retrieved successfully',
//             data: {
//                 id: jobId,
//                 status: status,
//             },
//         };

//         res.status(200).json(response); 
//     } catch (err) {
//         const response: UnifiedResponse<JobStatusResponse> = {
//             status: 'error',
//             message: `${err}`,
//         };

//         res.status(500).json(response);
//     }
// }

export { 
    downloadZipJob, 
    // getJobResults, 
    getJobStatus,
    submitJobController, 
    processController,
    // getJobStatus,
};
