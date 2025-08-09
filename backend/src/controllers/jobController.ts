import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import HttpError from '../middlewares/HttpError';
import { createJob } from '../services/jobService';
import { jobProcess } from '../services/processService';
import getJobExecutionLog from '../utils/getJobExecutionLog';
import {
    DownloadZipRequest,
    GetJobResultsRequest,
    JobData,
    JobMode,
    ProcessedJobResponse,
    ProcessJobData,
    ProcessJobRequest,
    SubmitJobRequest,
    UnifiedResponse,
} from '../../types/types';
import path from 'path';
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
        if (!req.body.mode) {
            throw HttpError.badRequest('Mode is required.');
        } else if (typeof(req.body.mode) !== 'string' || 
            (req.body.mode !== 'f' && 
            req.body.mode !== 'o' && 
            req.body.mode !== 'g' && 
            req.body.mode !== 'i' && 
            req.body.mode !== 'j')) {
            throw HttpError.badRequest('Mode must be a valid string.');
        }

        if (!req.body.graphletSize ) {
            throw HttpError.badRequest('graphlet size is required.');
        }
        // Parse graphletSize to number and validate
        const graphletSize = parseInt(req.body.graphletSize, 10);
        if (isNaN(graphletSize)) {
            throw HttpError.badRequest('graphlet size must be a valid number.');
        } else if (graphletSize > 8 || graphletSize < 3) {
            throw HttpError.badRequest('graphlet size must be between 3 and 8.');
        }

        //  Create job with validated inputs
        if (!req.file) {
            throw new HttpError('No file uploaded', { status: 400 });
        }
        
        const result = await createJob(req.file, req.body.mode, graphletSize);

        //  Send successful response
        const response: UnifiedResponse<JobData> = {
            status: 'success',
            message: 'Job submitted successfully',
            data: result,
        };

        res.status(201).json(response);
    } catch (err) {
        next(err);
    }
};

/**
 * Controller to process a job after submission.
 */
const processController = async (req: ProcessJobRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const jobId = req.body.id;
        if (!jobId) {
            throw new HttpError('id field is required in request.body', { status: 400 });
        }
        const result = await jobProcess(jobId);
        console.log('processing done'); //TESTING

        // Check if we need to include execution log
        let execLogFileOutput: string | undefined;
        if (result.status === 'Networks are still being aligned.') {
            execLogFileOutput = getJobExecutionLog(jobId);
        }

        if (result.redirect) {
            // Return redirect response
            const redirectResponse: UnifiedResponse = {
                status: 'redirect',
                message: result.status,
                redirect: result.redirect,
            };
            res.status(200).json(redirectResponse);
            return;
        } else {
            const processedJobData: ProcessJobData = {
                ...result,
                execLogFileOutput: execLogFileOutput || result.execLogFileOutput,
            };

            const successResponse: UnifiedResponse<ProcessJobData> = {
                status: 'success',
                message: result.status,
                data: processedJobData,
            };
            res.status(200).json(successResponse);
            return;
        }

    } catch (error) {
        next(error);
    }
};


/**
 * Controller function to retrieve job results based on a job ID.
 *
 * @param req - Express request object containing the job ID in `params`.
 * @param res - Express response object that sends back a JSON response.
 * @param next - Express next middleware function for error handling.
 * @returns A Promise that resolves when the response is sent.
 */
const getJobResults = async (req: GetJobResultsRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const jobId = req.params.id;

        if (!jobId) {
            throw new HttpError('Job ID is required.', { status: 400 });
        }

        // const result = await getJob(jobId);

        const jobDir = path.join(__dirname, '../process', jobId);

        // Check if job directory exists
        if (!fs.existsSync(jobDir) || !fs.lstatSync(jobDir).isDirectory()) {
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

        // Handle different job statuses
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

        if (status === 'preprocessed' || status === 'processing') {
            const redirectResponse: UnifiedResponse = {
                status: 'redirect',
                message: 'Job is still being processed. Redirecting...',
                redirect: `/submit-job/${jobId}`,
            };
            res.status(200).json(redirectResponse);
            return;
        }

        if (status === 'processed') {
            if (!jobData.zipName) {
                throw new HttpError('Invalid job data: missing zip file name.', {
                    status: 500,
                });
            }

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


// Controller to handle job submission with single .el file using default settings
const submitDefaultController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // File is already validated by middleware
        if (!req.file) {
            throw new HttpError('A .el file is required.', { status: 400 });
        }
 
        // Create job with default options
        const result = await createJob(req.file, 'f', 3);
        
        // Send successful response
        const response: UnifiedResponse<JobData> = {
            status: 'success',
            message: 'Job submitted successfully with default settings',
            data: result,
        };
        
        if (process.env.REDIRECT_AFTER_SUBMIT === 'true') {
            const redirectResponse: UnifiedResponse = {
                status: 'redirect',
                message: 'Job submitted successfully. Redirecting...',
                redirect: `/submit-job/${result.id}`,
            };
            res.status(302).json(redirectResponse);
            return;
        }
        
        res.status(201).json(response);
    } catch (err) {
        next(err);
    }
};

export { 
    downloadZipJob, 
    getJobResults, 
    submitJobController, 
    processController,
    submitDefaultController
};
