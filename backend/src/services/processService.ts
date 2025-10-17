import * as fs from 'fs';
import { JobData, ProcessJobData } from '../../types/types';
// import { addJobToQueue, getJobFromQueue } from '../config/queue'
import { addJobToQueue, getJobFromQueue } from '../config/queue';

// success: boolean;
//     status: string;
//     jobId: string;
//     execLogFileOutput?: string;
//     redirect?: string;
const jobProcess = async (jobId: string, jobData: JobData): Promise<ProcessJobData> => {
    // Step 1: Check that there is an id supplied - done in controller
    console.log("Attempting to add job to queue: ", jobId);
    // const jobDir = `/app/uploads/${jobId}`;
    const jobDir = `./process/${jobId}`;

    if (!fs.existsSync(jobDir) || !fs.lstatSync(jobDir).isDirectory()) {
        return {
            jobId: jobId,
            success: false,
            status: `Job does not exist at ${jobDir}`,
        };
    }
    
    // Step 2: Check that the job is not already processed
    const job = await getJobFromQueue(jobId);
   
    if (job) {
        const jobStatus = await job.getState();

        if (jobStatus === 'completed' || jobStatus === 'failed') {
            return {
                jobId: jobId,
                success: jobStatus === 'completed',
                status: jobStatus === 'completed' ? 'Networks already analyzed.' : 'Network analysis failed.',
                redirect: `/lookup-job/${jobId}`,
            };

        } else {
            return { 
                jobId: jobId, 
                success: false,
                status: `Job Status is ${jobStatus}.`, 
            };
        }
    }

    // Step 3: Add job to queue
    try {
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
    } catch {
        return new Promise<ProcessJobData>((resolve, reject) => {
            const res: ProcessJobData = {
                success: false,
                status: 'Job not added to queue',
                jobId: jobId,
                execLogFileOutput: undefined,
            };
            resolve(res);
        });
    }
  

    // below is from backend-wip branch
    
    // Step 2: Check that the job is not already processed
    // const job = await getJobFromQueue(jobId);
    // if (job && (job.data.status === 'active' || job.data.status === 'completed' || job.data.status === 'failed')) {
    //     return {
    //         jobId: jobId,
    //         success: true,
    //         status: `Job already exists and is ${job.data.status}`,
    //     };
    // }

    // Step 3: Add job to queue
    // addJobToQueue(jobId, jobData);
    // return new Promise<ProcessJobData>((resolve, reject) => {
    //     const res: ProcessJobData = {
    //         success: true,
    //         status: 'Job added to queue',
    //         jobId: jobId,
    //         execLogFileOutput: undefined,
    //     };
    //     resolve(res);
    // });
    
};


export { jobProcess };
