import { JobMode } from '../../types/types';

/**
 * Type guard to check if a value is a valid JobMode
 */
export function isValidJobMode(value: any): value is JobMode {
    return typeof value === 'string' && ['f', 'o', 'g', 'i', 'j'].includes(value);
}

/**
 * Alternative: More explicit type guard with better error info
 */
export function validateJobMode(value: any): JobMode {
    if (!isValidJobMode(value)) {
        throw new Error(`Invalid JobMode: "${value}". Must be one of: f, o, g, i, j`);
    }
    return value;
}

/**
 * Get all valid JobMode values
 */
export function getValidJobModes(): JobMode[] {
    return ['f', 'o', 'g', 'i', 'j'];
} 