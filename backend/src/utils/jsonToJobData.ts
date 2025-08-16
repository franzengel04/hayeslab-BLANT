import { JobData } from '../../types/types';

export function jsonToJobData(json: any): JobData {

    if (!json.id || typeof json.id !== 'string') {
        throw new Error('Invalid job ID');
    }
    
    return {
        id: json.id,
        status: json.status || 'pending',
        jobLocation: json.jobLocation,
        extension: json.extension,
        networkName: json.networkName,
        mode: json.mode,
        graphletSize: Number(json.graphletSize) || 3,
        attempts: Number(json.attempts) || 0,
        createdAt: json.createdAt || new Date().toISOString(),
        updatedAt: json.updatedAt || new Date().toISOString()
    };
}

