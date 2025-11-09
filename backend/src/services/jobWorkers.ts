import { Worker, Job } from 'bullmq';
import { JobData } from '../../types/types';
import IORedis from 'ioredis';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import { updateJobInQueue } from '../config/queue';
import * as path from 'path';
require('dotenv').config();

console.log("Worker started");

const connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
    password: process.env.REDIS_PASSWORD,
});

const blantDirectory = process.env.BLANT_DIRECTORY;

// const execAsync = promisify(exec);
// const spawnAsync = promisify(spawn);
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

        const optionString = `cd ${blantDirectory} && source ./setup.sh && stdbuf -oL -eL ./scripts/blant-clusters.sh` 
                             + ` ./blant ${jobData.graphletSize} ${jobData.density} ${networkDir}`;
        // let optionString = `cd ${blantPath} && ./scripts/blant-clusters.sh ./blant ${jobData.graphletSize} ${jobData.density} `;
        // optionString += `\"${inputFile}\" > \"${outputFile}\" 2>&1`;
        
        console.log(`Executing command for job ${jobId}:`, optionString);
        
        // CURRENT: Using execAsync (buffers all output in memory)
        // const { stdout, stderr } = await execAsync(optionString, {shell:'/bin/bash'});
        
        // if (stderr) {   
        //     console.warn(`Job ${jobId} stderr:`, stderr);
        // }
        
        // console.log(`Job ${jobId} completed successfully`);
        // return { success: true, stdout, stderr };
        
        // ALTERNATIVE: Using spawn() for real-time streaming (more memory efficient for large outputs):
        return new Promise((resolve, reject) => {
            const child = spawn('/bin/bash', ['-c', optionString]);
            const logStream = fs.createWriteStream(outputFile, { flags: 'a', autoClose: false });
            let stdout = '';
            // let stderr = '';
            
            child.stdout.on('data', async (data: string) => {
                stdout += data.toString();
                // Optional: log in real-time
                console.log(`Job ${jobId} stdout data.toString():`, data.toString());
                console.log(`Job ${jobId} stdout data:`, data);
                logStream.write(data);
                await updateJobInQueue(jobId, { execLogFileOutput: stdout });
            });
            
            child.stderr.on('data', async (data: string) => {
                stdout += data.toString();
                console.warn(`Job ${jobId} stderr:`, data.toString());
                logStream.write(data);
                await updateJobInQueue(jobId, { execLogFileOutput: stdout });
            });
            
            child.on('close', (code) => {
                logStream.end();
                if (code === 0) {
                    console.log(`Job ${jobId} completed successfully with code ${code}`);
                    resolve({ success: true, stdout });
                } else {
                    console.error(`Job ${jobId} failed with code ${code}`);
                    reject(new Error(`Process exited with code ${code}`));
                }
            });
            
            child.on('error', (error) => {
                console.error(`Job ${jobId} error:`, error);
                logStream.end();
                reject(error);
            });
        });

}

export { worker, jobWorker };