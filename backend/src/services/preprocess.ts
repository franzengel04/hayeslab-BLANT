import path from 'path';
import fs from 'fs';
import HttpError from '../middlewares/HttpError';
import { JobData, MulterFile } from '../../types/types';


const preprocess = async (
  file: MulterFile, 
  jobData: JobData,
  mode: string,
  graphletSize: number
): Promise<void> => {
    // create directories for the job
    const jobLocation: string = jobData.jobLocation;
    const networkDir: string = path.join(
        jobLocation,
        "networks",
        jobData.networkName
    );


    try {
        fs.mkdirSync(jobLocation, { recursive: true });
        fs.mkdirSync(path.join(jobLocation, "networks"), {recursive: true});
        fs.mkdirSync(networkDir, { recursive: true });
    } catch (e: any) {
        throw new HttpError(
            `Error creating directories: ${e.message}`,
            {status: 500}
        );
    }

    // 5. Move the network file into their directory
    const networkLocation: string = path.join(networkDir, `${jobData.networkName}${jobData.extension}`);
    try {
        fs.mkdirSync(path.dirname(networkLocation), { recursive: true });
        fs.renameSync(file.path, networkLocation);
    } catch (error: any) {
        throw new HttpError(
            `File ${file.originalname} could not be moved to ${networkLocation}`,
            {status: 500}
        );
    }

    // Write job info to a JSON file
    const statusFile: string = path.join(jobLocation, "info.json");
    try {
        fs.writeFileSync(
            statusFile,
            JSON.stringify({
                status: "preprocessed",
                data: jobData,
            })
        );
    } catch (error: any) {
        throw new HttpError(`Error writing job info to JSON file`, {status: 500});
    }
};

export {
    preprocess,
    JobData,
};