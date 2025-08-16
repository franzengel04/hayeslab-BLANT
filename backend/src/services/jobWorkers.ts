import { Worker, Job } from 'bullmq';
import { JobData } from '../../types/types';
import { connection } from '../config/queue';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join as pathJoin } from 'path';

const execAsync = promisify(exec);
const blantLocation = pathJoin(__dirname, '..', '..', '..', 'BLANT', '/blant');
const worker = new Worker('jobQueue', async (job: Job) => {
        const jobData  = job.data;

        try {
            await jobWorker(job.id, jobData);
        } catch (error) {
            console.error(`Job ${job.id} failed:`, error);
            throw error;
        }
    },
    {
        connection,
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
        concurrency: 4,
    },
);

worker.on('failed', (job: Job | undefined, error: Error, prev: string) => {
    // Do something with the return value.
    console.error(`Job failed:`, { jobId: job?.id, error: error.message, prev });
});

worker.on('completed', (job: Job, returnvalue: any) => {
    // Do something with the return value.
    console.log(`Job completed:`, { jobId: job.id, returnvalue });
});  

const jobWorker = async (jobId: string, jobData: JobData) => {
    try {
        // Generate the command string
        
        let optionString = '';
        optionString += `cd "${jobData.jobLocation}" && "${blantLocation}" `;
        optionString += `-m${jobData.mode} `;
        optionString += `-k${jobData.graphletSize} `
        optionString += `networks/${jobData.networkName}/${jobData.networkName}.el > log/blant_runtime.log 2>&1`;
        
        console.log(`Executing command for job ${jobId}:`, optionString);
        
        // Run the command
        const { stdout, stderr } = await execAsync(optionString);
        
        if (stderr) {
            console.warn(`Job ${jobId} stderr:`, stderr);
        }
        
        console.log(`Job ${jobId} completed successfully`);
        return { success: true, stdout, stderr };
        
    } catch (error) {
        console.error(`Job ${jobId} execution failed:`, error);
        throw error;
    }
}

export { worker, jobWorker };