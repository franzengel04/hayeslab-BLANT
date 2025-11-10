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
            redirect: `/lookup-job/${jobId}`,
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
            redirect: `/lookup-job/${jobId}`,
            execLogFileOutput: null,
        };
    }
    
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
            redirect: `/lookup-job/${jobId}`,
        };
    }
    
};


export { jobProcess };
