import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { JobData } from '../../types/types';
require('dotenv').config();

const connection = new IORedis({
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
});

const jobQueue = new Queue('jobQueue', { connection });

async function addJobToQueue(jobId: string, jobData: JobData) {
    console.log('Adding job to queue', jobId);
    await jobQueue.add(
        jobId, 
        jobData,
        { removeOnComplete: true, removeOnFail: true },
    );
}

async function getJobFromQueue(jobId: string) {
    const job = await jobQueue.getJob(jobId);
    return job;
}

export { addJobToQueue, connection, getJobFromQueue };