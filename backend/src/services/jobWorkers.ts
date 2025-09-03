import { Worker, Job } from 'bullmq';
import { JobData } from '../../types/types';
import IORedis from 'ioredis';
import { exec } from 'child_process';
import { promisify } from 'util';
require('dotenv').config();
console.log("Worker started");

const connection = new IORedis({
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
});

const execAsync = promisify(exec);
const blantLocation = '/blant/blant';
const worker = new Worker('jobQueue', async (job: Job) => {
        console.log("Worker Started Processing Job: ", job.id);
        await jobWorker(job.id, job.data);
        console.log("Worker Completed Job: ", job.id);
    },
    {
        connection,
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
        concurrency: 4,
    },
);

worker.on('failed', (job: Job | undefined, error: Error, prev: string) => {

    console.error(`Job failed:`, { jobId: job?.id, error: error.message, prev });
});

worker.on('completed', (job: Job, returnvalue: any) => {

    console.log(`Job completed:`, { jobId: job.id, returnvalue });
});  

const jobWorker = async (jobId: string, jobData: JobData) => {

        // Construct absolute paths
        const inputFile = `${jobData.jobLocation}/networks/${jobData.networkName}/${jobData.networkName}.el`;
        const outputFile = `${jobData.jobLocation}/blant_runtime.log`;
        
        let optionString = 'cd /blant && ';
        optionString += `${blantLocation} `;
        optionString += `-k ${jobData.graphletSize} `;
        optionString += `-m ${jobData.mode} `;
        optionString += `"${inputFile}" > "${outputFile}" 2>&1`;
        
        console.log(`Executing command for job ${jobId}:`, optionString);
        
        // Run the command
        const { stdout, stderr } = await execAsync(optionString);
        
        if (stderr) {
            console.warn(`Job ${jobId} stderr:`, stderr);
        }
        
        console.log(`Job ${jobId} completed successfully`);
        return { success: true, stdout, stderr };
}

export { worker, jobWorker };