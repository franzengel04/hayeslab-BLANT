import { Router, Request, Response, NextFunction } from 'express';
import {
    uploadMiddleware,
    validateSingleFileMiddleware,
    cleanupFileErrorHandler,
} from '../middlewares/upload';
import {
    downloadZipJob,
    getJobResults,
    submitJobController,
    processController,
    submitDefaultController,
} from '../controllers/jobController';

const router: Router = Router();


// router.get('/:id/zip', downloadZipJob);

//chill
router.post(
    '/preprocess',
    uploadMiddleware,
    validateSingleFileMiddleware,
    submitJobController,
    cleanupFileErrorHandler,
);
// router.post('/process', processController);
// router.get('/:id', getJobResults);

// router.get('/api/jobs', lookupJobsController); <-- for admin page in future

// router.post(
//     '/submit-default',
//     supabaseAuth,
//     uploadMiddleware,
//     validateSingleFileMiddleware,
//     submitDefaultController,
//     cleanupFileErrorHandler
// );


export default router;
