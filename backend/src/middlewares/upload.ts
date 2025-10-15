// FILE: middlewares/upload.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import HttpError from './HttpError'; 
import { MulterFile } from '../../types/types';

// Constants
// const tmpDir: string = '/app/tmp';
const tmpDir: string = path.join(__dirname, '../tmp');

// Configure multer storage
const storage = multer.diskStorage({
    destination: tmpDir,
    filename: (req: Request, file: MulterFile, cb: (error: Error | null, filename: string) => void) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { 
        fileSize: 1000000, 
        files: 1 
    },
    fileFilter: (req: Request, file: MulterFile, cb: multer.FileFilterCallback) => {
        // Validate file extension
        console.log("upload fileFilter file:", file);
        console.log("upload fileFilter req.body:", req.body);
        console.log("upload fileFilter req.file:", req.file);
        
        const fileExt = path.extname(file.originalname).toLowerCase().slice(1);
        if (fileExt !== 'el' && fileExt !== 'gw') {
            return cb(
                new HttpError(
                    `Invalid file extension: ${fileExt}. Must be .el or .gw`,
                    { status: 400 },
                ),
            );
        }

        if (/\s/.test(file.originalname)) {
            return cb(new HttpError('File names cannot contain whitespace.', { status: 400 }));
        }
        
        cb(null, true);
    },
});

const validateSingleFileMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.file) {
            throw new HttpError('A .el or .gw file must be uploaded.', { status: 400 });
        }
        
        // console.log(`File uploaded: ${req.file.originalname} (${req.file.size} bytes)`);
        // console.log(`File path: ${req.file.path}`);
        next();
    } catch (error) {

        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error(`Error deleting file ${req.file.path}:`, err);
            });
        }
        next(error);
    }
};

const cleanupFile = (file: MulterFile | undefined): void => {
    if (!file || !file.path) return;
    
    fs.unlink(file.path, (err) => {
        if (err) console.error(`Error deleting file ${file.path}:`, err);
    });
};

const cleanupFileErrorHandler = async (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    cleanupFile(req.file);
    console.error('Job processing error:', err);
    next(new HttpError(err.message || 'An error occurred during job processing', { status: 500 }));
};

const uploadMiddleware = upload.single('file'); 

export {
    uploadMiddleware,
    validateSingleFileMiddleware, 
    cleanupFile,
    cleanupFileErrorHandler, 
    tmpDir
};
