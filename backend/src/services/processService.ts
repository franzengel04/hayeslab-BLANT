import * as fs from 'fs';
import * as path from 'path';
import { FailedJobInfoFile, JobData, JobInfoFile, ProcessJobData, SuccessJobInfoFile } from '../../types/types';
// import { addJobToQueue, getJobFromQueue } from '../config/queue';
import { readInfoFile, writeInfoFile, isProcessedJob, isFailedJob } from '../utils/infoFileHandlers';
import HttpError from '../middlewares/HttpError';
import { spawn } from 'child_process';

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
    const infoFilePath = path.join(jobDir, 'info.json');
    let info: JobInfoFile | SuccessJobInfoFile | FailedJobInfoFile;
    try {
        info = readInfoFile(jobDir);

        if (isProcessedJob(info) || isFailedJob(info)) {
            return {
                jobId: jobId,
                success: isProcessedJob(info),
                status: isProcessedJob(info) ? 'Networks already analyzed.' : 'Network analysis failed.',
                redirect: `/lookup-job/${jobId}`,
            };
        } else if (info.status === 'processing') {
            return { jobId, success: true, status: 'Networks are still being aligned.' };
        }

       // Step 3: Update status to 'processing' in info.json
        const updatedInfo: JobInfoFile = {
            ...info,
            status: 'processing',
        };
        writeInfoFile(jobDir, updatedInfo);
    } catch (err) {
        throw new HttpError('Could not read info.json', { status: 500 });
    }
    const blantDirectory = process.env.BLANT_DIRECTORY;

    const networkDir = path.resolve(jobDir, 'networks', `${jobData.networkName}${jobData.extension}`);

    // Step 4: generate the command-line string
    const commandLine = `cd ${blantDirectory} && source ./setup.sh && ./scripts/blant-clusters.sh ./blant ${jobData.graphletSize} ${jobData.density} ${networkDir}`;
    
    // Step 5: Run the script
    return new Promise<ProcessJobData>((resolve, reject) => {
        console.log('Current working directory:', process.cwd());
        console.log('Job location:', jobDir);
        
        // Capture stdout and stderr as streams
        let stdoutData = '';
        let stderrData = '';
        
        const child = spawn('sh', ['-c', commandLine], { 
            cwd: jobDir,
            stdio: ['ignore', 'pipe', 'pipe']  // Capture stdout and stderr as streams
        });
        
        // Collect stdout data
        child.stdout?.on('data', (data) => {
            stdoutData += data.toString();
        });
        
        // Collect stderr data
        child.stderr?.on('data', (data) => {
            stderrData += data.toString();
        });
        
        child.on('error', (error) => {
            console.error('Failed to start command:', error);
            reject(error);
        });
        
        child.on('close', (code) => {
            // Write captured output to log file
            const logPath = path.join(jobDir, 'run.log');
            const logContent = `${stdoutData}`;
            fs.writeFileSync(logPath, logContent);
            
            if (code !== 0) { // BLANT failed during execution 
                const failedInfo: FailedJobInfoFile = {
                    status: 'failed',
                    log: stderrData,
                    command: commandLine,
                };
                fs.writeFileSync(infoFilePath, JSON.stringify(failedInfo));
                
                console.log('Process failed with code:', code);
                console.log('STDOUT:', stdoutData);
                console.log('STDERR:', stderrData);
                
                resolve({
                    jobId,
                    success: false,
                    status: 'Networks could not be analyzed.',
                    execLogFileOutput: stderrData,
                    redirect: `/lookup-job/${jobId}`,
                });
            } else { // SANA executed successfully
                console.log('Process completed successfully');
                console.log('STDOUT:', stdoutData);
                console.log('STDERR:', stderrData);

                // Step 7: Update info.json with status 'processed'
                const successInfo: SuccessJobInfoFile = {
                    status: 'processed',
                    command: commandLine,
                };
                fs.writeFileSync(infoFilePath, JSON.stringify(successInfo));
                resolve({
                    jobId,
                    success: true,
                    status: 'Networks successfully processed.',
                    execLogFileOutput: stdoutData,
                    redirect: `/lookup-job/${jobId}`,
                });
            }
        });
    });

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
