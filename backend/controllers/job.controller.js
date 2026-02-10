const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createJob(req, res) {
  try {
    const { title, description, address, propertyType, roofSize, roofPitch, latitude, longitude } = req.body;

    // Generate job number
    const year = new Date().getFullYear();
    const jobCount = await prisma.job.count({
      where: {
        companyId: req.companyId,
        jobNumber: { startsWith: `JOB-${year}` }
      }
    });
    const jobNumber = `JOB-${year}-${String(jobCount + 1).padStart(3, '0')}`;

    const job = await prisma.job.create({
      data: {
        jobNumber,
        title,
        description,
        address,
        propertyType,
        roofSize,
        roofPitch,
        latitude,
        longitude,
        status: 'PROSPECT',
        companyId: req.companyId
      }
    });

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create job' }
    });
  }
}

async function getJobs(req, res) {
  try {
    const { status, assignedTo, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const where = { companyId: req.companyId };
    if (status) where.status = status;
    if (assignedTo) {
      where.assignments = {
        some: { userId: assignedTo }
      };
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          assignments: {
            include: { user: { select: { id: true, firstName: true, lastName: true, role: true } } }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.job.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get jobs' }
    });
  }
}

async function getJob(req, res) {
  try {
    const { id } = req.params;

    const job = await prisma.job.findFirst({
      where: { id, companyId: req.companyId },
      include: {
        assignments: {
          include: { user: { select: { id: true, firstName: true, lastName: true, role: true } } }
        },
        photos: true,
        materials: {
          include: { material: true }
        },
        estimates: {
          include: { materials: true }
        },
        quotes: true,
        invoices: true,
        timeLogs: {
          include: { user: { select: { id: true, firstName: true, lastName: true } } }
        },
        incidents: true,
        lead: true
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job not found' }
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get job' }
    });
  }
}

async function updateJob(req, res) {
  try {
    const { id } = req.params;
    const { title, description, address, propertyType, roofSize, roofPitch, status, scheduledStart, scheduledEnd, actualStart, actualEnd, estimatedCost, actualCost, latitude, longitude } = req.body;

    const job = await prisma.job.updateMany({
      where: { id, companyId: req.companyId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(address && { address }),
        ...(propertyType && { propertyType }),
        ...(roofSize !== undefined && { roofSize }),
        ...(roofPitch !== undefined && { roofPitch }),
        ...(status && { status }),
        ...(scheduledStart && { scheduledStart: new Date(scheduledStart) }),
        ...(scheduledEnd && { scheduledEnd: new Date(scheduledEnd) }),
        ...(actualStart && { actualStart: new Date(actualStart) }),
        ...(actualEnd && { actualEnd: new Date(actualEnd) }),
        ...(estimatedCost !== undefined && { estimatedCost }),
        ...(actualCost !== undefined && { actualCost }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude })
      }
    });

    if (job.count === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job not found' }
      });
    }

    const updatedJob = await prisma.job.findUnique({
      where: { id }
    });

    res.json({
      success: true,
      data: updatedJob
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update job' }
    });
  }
}

async function assignCrew(req, res) {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;

    // Check if job exists and belongs to company
    const job = await prisma.job.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job not found' }
      });
    }

    // Check if user exists and belongs to company
    const user = await prisma.user.findFirst({
      where: { id: userId, companyId: req.companyId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' }
      });
    }

    // Create assignment
    const assignment = await prisma.jobAssignment.create({
      data: {
        jobId: id,
        userId,
        role
      }
    });

    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Assign crew error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to assign crew' }
    });
  }
}

async function uploadPhoto(req, res) {
  try {
    const { id } = req.params;
    const { caption, latitude, longitude } = req.body;

    // Check if job exists and belongs to company
    const job = await prisma.job.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job not found' }
      });
    }

    // For now, we'll use a placeholder URL. In production, this would upload to cloud storage
    const url = req.file ? `/uploads/${req.file.filename}` : 'https://via.placeholder.com/800x600';

    const photo = await prisma.jobPhoto.create({
      data: {
        url,
        caption,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        jobId: id,
        uploadedBy: req.user.id
      }
    });

    res.status(201).json({
      success: true,
      data: photo
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to upload photo' }
    });
  }
}

module.exports = {
  createJob,
  getJobs,
  getJob,
  updateJob,
  assignCrew,
  uploadPhoto
};
