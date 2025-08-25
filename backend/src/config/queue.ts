import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { JobData } from '../../types/types';

const connection = new IORedis({
    host: 'redis',
    port: 6379,
  });

const jobQueue = new Queue('jobQueue', { connection });

async function addJobToQueue(jobId: string, jobData: JobData) {
    await jobQueue.add(
        jobId, 
        { jobData },
        { removeOnComplete: true, removeOnFail: true },
    );
}

async function getJobFromQueue(jobId: string) {
    const job = await jobQueue.getJob(jobId);
    return job;
}

export { addJobToQueue, connection, getJobFromQueue };