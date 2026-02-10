const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticate } = require('../middleware/auth.middleware');
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  assignCrew,
  uploadPhoto
} = require('../controllers/job.controller');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// All routes require authentication
router.use(authenticate);

// POST /api/jobs - Create job
router.post('/', createJob);

// GET /api/jobs - List jobs with filters
router.get('/', getJobs);

// GET /api/jobs/:id - Get job details
router.get('/:id', getJob);

// PATCH /api/jobs/:id - Update job
router.patch('/:id', updateJob);

// POST /api/jobs/:id/assign - Assign crew to job
router.post('/:id/assign', assignCrew);

// POST /api/jobs/:id/photos - Upload photo to job
router.post('/:id/photos', upload.single('photo'), uploadPhoto);

module.exports = router;
