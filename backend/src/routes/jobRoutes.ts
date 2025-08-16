import { Router } from 'express';
import {
    uploadMiddleware,
    validateSingleFileMiddleware,
    cleanupFileErrorHandler,
} from '../middlewares/upload';
import {
    getJobResults,
    getJobStatus,
    submitJobController,
} from '../controllers/jobController';

const router: Router = Router();

// Single endpoint for job submission that handles preprocessing and queueing
router.post(
    '/submit',
    uploadMiddleware,
    validateSingleFileMiddleware,
    submitJobController,
    cleanupFileErrorHandler,
);

router.get('/status/:id', getJobStatus);

// Future endpoints
// router.get('/:id/zip', downloadZipJob);
// router.get('/:id', getJobResults);
// router.get('/api/jobs', lookupJobsController); <-- for admin page in future

export default router;
