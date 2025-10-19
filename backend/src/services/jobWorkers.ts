import { Worker, Job } from 'bullmq';
import { JobData } from '../../types/types';
import IORedis from 'ioredis';
import { exec } from 'child_process';
import { promisify } from 'util';
import 'fs';
import * as path from 'path';
const fs = require('fs');
require('dotenv').config();

console.log("Worker started");

const connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
    password: process.env.REDIS_PASSWORD,
});

const blantDirectory = process.env.BLANT_DIRECTORY;

const execAsync = promisify(exec);
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

        const networkDir = path.resolve(`./process/${jobId}`, 'networks', `${jobData.networkName}${jobData.extension}`);

        const outputFile = path.resolve(`./process/${jobId}`, 'blant_runtime.log');

        const optionString = `cd ${blantDirectory} && source ./setup.sh && ./scripts/blant-clusters.sh` 
                             + ` ./blant ${jobData.graphletSize} ${jobData.density} ${networkDir} > ${outputFile} 2>&1`;
        // let optionString = `cd ${blantPath} && ./scripts/blant-clusters.sh ./blant ${jobData.graphletSize} ${jobData.density} `;
        // optionString += `\"${inputFile}\" > \"${outputFile}\" 2>&1`;
        
        console.log(`Executing command for job ${jobId}:`, optionString);
        // Run the command
        const { stdout, stderr } = await execAsync(optionString, {shell:'/bin/bash'});
        
        if (stderr) {   
            console.warn(`Job ${jobId} stderr:`, stderr);
        }
        
        console.log(`Job ${jobId} completed successfully`);
        return { success: true, stdout, stderr };
}

export { worker, jobWorker };