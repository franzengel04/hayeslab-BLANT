import * as fs from 'fs';
import * as path from 'path';
import { JobData, ProcessJobData } from '../../types/types';
import { addJobToQueue, getJobFromQueue } from '../config/queue';

const jobProcess = async (jobId: string, jobData: JobData): Promise<ProcessJobData> => {
    // Step 1: Check that there is an id supplied - done in controller
    console.log("Attempting to add job to queue: ", jobId);
    const jobDir = `/app/uploads/${jobId}`;

    if (!fs.existsSync(jobDir) || !fs.lstatSync(jobDir).isDirectory()) {
        return {
            jobId: jobId,
            success: false,
            status: `Job does not exist at ${jobDir}`,
        };
    }
    
    // Step 2: Check that the job is not already processed
    const job = await getJobFromQueue(jobId);
    if (job && (job.data.status === 'active' || job.data.status === 'completed' || job.data.status === 'failed')) {
        return {
            jobId: jobId,
            success: true,
            status: `Job already exists and is ${job.data.status}`,
        };
    }

    // Step 3: Add job to queue
    addJobToQueue(jobId, jobData);
    return new Promise<ProcessJobData>((resolve, reject) => {
        const res: ProcessJobData = {
            success: true,
            status: 'Job added to queue',
            jobId: jobId,
            execLogFileOutput: undefined,
        };
        resolve(res);
    });
    
};


export { jobProcess };
