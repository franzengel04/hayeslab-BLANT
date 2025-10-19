import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { JobData } from '../../types/types';
require('dotenv').config();

const connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
    password: process.env.REDIS_PASSWORD,
});

const jobQueue = new Queue('jobQueue', { connection });

async function addJobToQueue(jobId: string, jobData: JobData) {
    console.log('Adding job to queue', jobId);
    await jobQueue.add(
        'BLANT Job', 
        jobData,
        {
            jobId: jobId,
        },
    );
}

async function getJobFromQueue(jobId: string) {
    const job = await jobQueue.getJob(jobId);
    return job;
}

export { addJobToQueue, connection, getJobFromQueue, jobQueue };