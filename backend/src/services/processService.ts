import * as fs from 'fs';
import { JobData, ProcessJobData } from '../../types/types';
import { getJobFromQueue } from '../config/queue';
import path from 'path';

const jobProcess = async (jobId: string, jobData: JobData): Promise<ProcessJobData> => {
    // Step 1: Check that there is an id supplied - done in controller
    console.log("Attempting to add job to queue: ", jobId);
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

    if (!job) {
        return {
            jobId: undefined,
            success: false,
            status: `ERROR: Job does not exist in queue.`,
            execLogFileOutput: null,
        };
    }
   
    // if (job) {
    const jobStatus = await job.getState();

    if (jobStatus === 'completed' || jobStatus === 'failed') {
        const execLogFilePath = path.join(jobDir, 'blant_runtime.log');
        let execLogFileOutput = '';

        if (fs.existsSync(execLogFilePath)) {
            try {
                const execLogFileContent = fs.readFileSync(execLogFilePath, 'utf8');
                execLogFileOutput = execLogFileContent;
            } catch (err) {
                execLogFileOutput = 'Problem opening execution log file.';
            }
        } else {
            execLogFileOutput = `Job execution log file at ${execLogFilePath} does not exist.`;
        }

        return {
            jobId: jobId,
            success: jobStatus === 'completed',
            status: jobStatus === 'completed' ? 'Job has been completed.' : 'Job failed.',
            redirect: `/lookup-job/${jobId}`,
            execLogFileOutput: execLogFileOutput,
        };

    } else {
        return { 
            jobId: jobId, 
            success: false,
            status: `Job Status is ${jobStatus}.`, 
        };
    }
    // }

    // Step 3: Add job to queue
    // try {
    //     addJobToQueue(jobId, jobData);
    //     return new Promise<ProcessJobData>((resolve, reject) => {
    //         const res: ProcessJobData = {
    //             success: true,
    //             status: 'Job added to queue',
    //             jobId: jobId,
    //             execLogFileOutput: undefined,
    //             redirect: `/lookup-job/${jobId}`,
    //         };
    //         resolve(res);
    //     });
    // } catch {
    //     return new Promise<ProcessJobData>((resolve, reject) => {
    //         const res: ProcessJobData = {
    //             success: false,
    //             status: 'Job not added to queue',
    //             jobId: jobId,
    //             execLogFileOutput: undefined,
    //             redirect: `/lookup-job/${jobId}`,
    //         };
    //         resolve(res);
    //     });
    // }
  

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
