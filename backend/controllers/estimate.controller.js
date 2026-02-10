const { PrismaClient } = require('@prisma/client');
const { generateEstimate } = require('../ai/estimator');
const prisma = new PrismaClient();

async function createEstimate(req, res) {
  try {
    const { jobId, useAI, laborHours, totalCost, timeline, materials, notes } = req.body;

    // Get job details
    const job = await prisma.job.findUnique({
      where: { id: jobId, companyId: req.companyId }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job not found' }
      });
    }

    let estimateData;

    if (useAI) {
      // Use AI to generate estimate
      estimateData = await generateEstimate({
        propertyType: job.propertyType,
        roofSize: job.roofSize,
        roofPitch: job.roofPitch,
        description: job.description
      });
    } else {
      // Manual estimate
      estimateData = {
        laborHours,
        totalCost,
        timeline,
        materials,
        notes,
        aiGenerated: false
      };
    }

    // Create estimate in database
    const estimate = await prisma.estimate.create({
      data: {
        jobId,
        companyId: req.companyId,
        createdBy: req.user.id,
        laborHours: estimateData.laborHours,
        totalCost: estimateData.totalCost,
        timeline: estimateData.timeline,
        aiGenerated: estimateData.aiGenerated || false,
        aiConfidence: estimateData.confidenceScore,
        notes: estimateData.notes,
        materials: {
          create: estimateData.materials.map(m => ({
            name: m.name,
            quantity: m.quantity,
            unit: m.unit,
            estimatedCost: m.estimatedCost
          }))
        }
      },
      include: {
        materials: true
      }
    });

    res.status(201).json({
      success: true,
      data: estimate
    });
  } catch (error) {
    console.error('Create estimate error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create estimate' }
    });
  }
}

async function getEstimate(req, res) {
  try {
    const { id } = req.params;

    const estimate = await prisma.estimate.findFirst({
      where: { id, companyId: req.companyId },
      include: {
        materials: true,
        job: true,
        creator: { select: { id: true, firstName: true, lastName: true } }
      }
    });

    if (!estimate) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Estimate not found' }
      });
    }

    res.json({
      success: true,
      data: estimate
    });
  } catch (error) {
    console.error('Get estimate error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get estimate' }
    });
  }
}

async function updateEstimate(req, res) {
  try {
    const { id } = req.params;
    const { laborHours, totalCost, timeline, notes, materials } = req.body;

    // Check if estimate exists and belongs to company
    const existingEstimate = await prisma.estimate.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!existingEstimate) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Estimate not found' }
      });
    }

    // Update estimate
    const estimate = await prisma.estimate.update({
      where: { id },
      data: {
        laborHours,
        totalCost,
        timeline,
        notes,
        aiGenerated: false // Manual edit overrides AI generation
      }
    });

    // Update materials if provided
    if (materials && Array.isArray(materials)) {
      // Delete existing materials
      await prisma.estimateMaterial.deleteMany({
        where: { estimateId: id }
      });

      // Create new materials
      await prisma.estimateMaterial.createMany({
        data: materials.map(m => ({
          estimateId: id,
          name: m.name,
          quantity: m.quantity,
          unit: m.unit,
          estimatedCost: m.estimatedCost
        }))
      });
    }

    const updatedEstimate = await prisma.estimate.findUnique({
      where: { id },
      include: { materials: true }
    });

    res.json({
      success: true,
      data: updatedEstimate
    });
  } catch (error) {
    console.error('Update estimate error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update estimate' }
    });
  }
}

async function getEstimates(req, res) {
  try {
    const estimates = await prisma.estimate.findMany({
      where: { companyId: req.companyId },
      include: {
        materials: true,
        job: {
          select: { title: true, address: true, jobNumber: true }
        },
        creator: { select: { firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: {
        estimates
      }
    });
  } catch (error) {
    console.error('Get estimates error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch estimates' }
    });
  }
}

module.exports = { createEstimate, getEstimate, updateEstimate, getEstimates };
