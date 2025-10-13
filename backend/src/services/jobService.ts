import { createHash } from 'crypto';
import { preprocess } from './preprocess';
import path from 'path';
import HttpError from '../middlewares/HttpError';
import { JobData, MulterFile, UploadedFiles } from '../../types/types';


/**
 * Creates a new job with the provided files and options
 * @param files The uploaded network files
 * @param density The density to run BLANT in
 * @param graphletSize The size of the graphlet to use for the job
 * @returns JobData or RedirectResponse
 */
const createJob = async (
    file: MulterFile,
    density: number,
    graphletSize: number,

): Promise<JobData> => {
    const networkFullName = file.originalname;

    if (!networkFullName) {
        throw new HttpError('Invalid file names: network must have valid names', { status: 400 });
    }

    // Extract network names
    const networkName = networkFullName.substring(0, networkFullName.lastIndexOf('.'));

    if (!networkName) {
        throw new HttpError(
            `Failed to extract network names from file: ${networkFullName}`, 
            { status: 400 }
        );
    }

    // Generate job ID
    const timestamp = Date.now();
    const jobId = createHash('md5')
        .update(`${timestamp}-${networkName}`)
        .digest('hex');

    // Get file extension and validate
    const extension = path.extname(file.originalname).toLowerCase();
    if (!extension) {
        throw new HttpError(`Invalid file extension for network: ${file.originalname}`, { status: 400 });
    }

    // Create job data
    const jobData: JobData = {
        id: jobId,
        status: 'preprocessing',
        // jobLocation: `/app/uploads/${jobId}`, 
        jobLocation: `./process/${jobId}`, 
        extension,
        networkName,
        density,
        graphletSize,
        attempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    console.log(`Created job data:`, JSON.stringify(jobData, null, 2));
    
    try {
        await preprocess(file, jobData);
        console.log('Preprocessing completed successfully');
        return jobData;
    } catch (error: any) {
        // // Update job status to error
        // jobData.status = 'error';
        // jobData.error = error.message;
        // jobData.updatedAt = new Date();
        
        // // Save the error state if needed
        // // await saveJobError(jobData);
        
        throw new HttpError(
            `Error during preprocessing: ${error.message}`,
            { status: 500, errorLog: error.stack }
        );
    }
};



export { createJob };
