const { PrismaClient } = require('@prisma/client');
const { generateEstimate } = require('../ai/estimator');
const prisma = new PrismaClient();

/**
 * Helper function to calculate estimate totals
 */
function calculateEstimateTotals(materials, installationCost, transportationCost, discountPercent, discountAmount) {
  // Calculate materials subtotal (selling price * quantity - discount)
  const materialsSubtotal = materials.reduce((sum, m) => {
    const lineTotal = (m.sellingPrice * m.quantity) - (m.discount || 0);
    return sum + lineTotal;
  }, 0);

  // Calculate subtotal
  const subtotal = materialsSubtotal + installationCost + transportationCost;

  // Calculate total discount
  const percentDiscount = subtotal * (discountPercent / 100);
  const totalDiscount = percentDiscount + discountAmount;

  // Calculate final total
  const finalTotal = subtotal - totalDiscount;

  // Calculate total buying cost
  const totalBuyingCost = materials.reduce((sum, m) => {
    return sum + ((m.buyingPrice || 0) * m.quantity);
  }, 0) + installationCost + transportationCost;

  // Calculate profit margin
  const profitMargin = finalTotal > 0 ? ((finalTotal - totalBuyingCost) / finalTotal) * 100 : 0;

  return {
    materialsSubtotal,
    subtotal,
    totalDiscount,
    finalTotal,
    totalBuyingCost,
    profitMargin
  };
}

async function createEstimate(req, res) {
  try {
    const {
      jobId,
      useAI,
      laborHours,
      totalCost,
      timeline,
      materials,
      notes,
      installationCost,
      transportationCost,
      discountPercent,
      discountAmount,
      status
    } = req.body;

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
    const instCost = installationCost || 0;
    const transCost = transportationCost || 0;
    const discPercent = discountPercent || 0;
    const discAmount = discountAmount || 0;

    // Prepare materials with defaults
    const processedMaterials = materials && materials.length > 0
      ? materials.map(m => ({
          name: m.name || '',
          quantity: m.quantity || 0,
          unit: m.unit || 'piece',
          buyingPrice: m.buyingPrice || 0,
          sellingPrice: m.sellingPrice || m.estimatedCost || 0,
          discount: m.discount || 0,
          estimatedCost: (m.sellingPrice || m.estimatedCost || 0) * (m.quantity || 0)
        }))
      : [];

    // Calculate totals
    const totals = calculateEstimateTotals(processedMaterials, instCost, transCost, discPercent, discAmount);

    if (useAI) {
      // Use AI to generate estimate
      const aiResult = await generateEstimate({
        propertyType: job.propertyType,
        roofSize: job.roofSize,
        roofPitch: job.roofPitch,
        description: job.description
      });

      // Merge AI materials with pricing fields
      estimateData = {
        ...aiResult,
        materials: aiResult.materials.map(m => ({
          ...m,
          buyingPrice: m.estimatedCost * 0.6, // Assume 40% markup
          sellingPrice: m.estimatedCost,
          discount: 0
        }))
      };

      // Recalculate with AI materials
      const aiTotals = calculateEstimateTotals(
        estimateData.materials,
        instCost,
        transCost,
        discPercent,
        discAmount
      );
      estimateData.totals = aiTotals;
    } else {
      // Manual estimate
      estimateData = {
        laborHours: laborHours || 0,
        totalCost: totalCost || totals.finalTotal,
        timeline: timeline || '',
        materials: processedMaterials,
        notes: notes || '',
        aiGenerated: false,
        totals
      };
    }

    // Create estimate in database
    const estimate = await prisma.estimate.create({
      data: {
        jobId,
        companyId: req.companyId,
        createdBy: req.user.id,
        laborHours: estimateData.laborHours,
        totalCost: estimateData.totals?.finalTotal || estimateData.totalCost,
        timeline: estimateData.timeline,
        aiGenerated: estimateData.aiGenerated || false,
        aiConfidence: estimateData.confidenceScore,
        notes: estimateData.notes,
        // Business fields
        installationCost: instCost,
        transportationCost: transCost,
        discountPercent: discPercent,
        discountAmount: discAmount,
        subtotal: estimateData.totals?.subtotal || 0,
        profitMargin: estimateData.totals?.profitMargin || 0,
        status: status || 'DRAFT',
        materials: {
          create: estimateData.materials.map(m => ({
            name: m.name,
            quantity: m.quantity,
            unit: m.unit,
            estimatedCost: (m.sellingPrice || 0) * m.quantity,
            buyingPrice: m.buyingPrice || 0,
            sellingPrice: m.sellingPrice || 0,
            discount: m.discount || 0
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
    const {
      laborHours,
      totalCost,
      timeline,
      notes,
      materials,
      installationCost,
      transportationCost,
      discountPercent,
      discountAmount,
      status
    } = req.body;

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

    // Process materials if provided
    let processedMaterials = materials;
    let calculatedTotals = null;

    if (materials && Array.isArray(materials)) {
      processedMaterials = materials.map(m => ({
        name: m.name || '',
        quantity: m.quantity || 0,
        unit: m.unit || 'piece',
        buyingPrice: m.buyingPrice || 0,
        sellingPrice: m.sellingPrice || m.estimatedCost || 0,
        discount: m.discount || 0
      }));

      // Calculate totals
      calculatedTotals = calculateEstimateTotals(
        processedMaterials,
        installationCost || existingEstimate.installationCost,
        transportationCost || existingEstimate.transportationCost,
        discountPercent || existingEstimate.discountPercent,
        discountAmount || existingEstimate.discountAmount
      );
    }

    // Update estimate
    const estimate = await prisma.estimate.update({
      where: { id },
      data: {
        laborHours,
        totalCost: calculatedTotals?.finalTotal || totalCost,
        timeline,
        notes,
        aiGenerated: false, // Manual edit overrides AI generation
        // Business fields
        installationCost,
        transportationCost,
        discountPercent,
        discountAmount,
        subtotal: calculatedTotals?.subtotal,
        profitMargin: calculatedTotals?.profitMargin,
        status
      }
    });

    // Update materials if provided
    if (processedMaterials && Array.isArray(processedMaterials)) {
      // Delete existing materials
      await prisma.estimateMaterial.deleteMany({
        where: { estimateId: id }
      });

      // Create new materials
      await prisma.estimateMaterial.createMany({
        data: processedMaterials.map(m => ({
          estimateId: id,
          name: m.name,
          quantity: m.quantity,
          unit: m.unit,
          estimatedCost: (m.sellingPrice || 0) * m.quantity,
          buyingPrice: m.buyingPrice || 0,
          sellingPrice: m.sellingPrice || 0,
          discount: m.discount || 0
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

// Trial management functions
async function startTrial(req, res) {
  try {
    const companyId = req.companyId;
    const TRIAL_DAYS = 14;

    // Get current subscription
    const subscription = await prisma.subscription.findUnique({
      where: { companyId }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Subscription not found' }
      });
    }

    // Check if trial already used
    if (subscription.trialUsed) {
      return res.status(400).json({
        success: false,
        error: { code: 'TRIAL_USED', message: 'Trial has already been used' }
      });
    }

    // Check if trial is already active
    if (subscription.isTrialActive && subscription.trialEndDate) {
      const now = new Date();
      const trialEnd = new Date(subscription.trialEndDate);
      if (trialEnd > now) {
        const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return res.json({
          success: true,
          data: {
            isTrialActive: true,
            trialEndDate: subscription.trialEndDate,
            daysRemaining
          }
        });
      }
    }

    // Start new trial
    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + TRIAL_DAYS);

    const updatedSubscription = await prisma.subscription.update({
      where: { companyId },
      data: {
        trialStartDate,
        trialEndDate,
        isTrialActive: true,
        trialUsed: true, // Mark as used (can only trial once)
        tier: 'PRO', // Upgrade to PRO during trial
        status: 'ACTIVE'
      }
    });

    res.json({
      success: true,
      data: {
        isTrialActive: true,
        trialStartDate,
        trialEndDate,
        daysRemaining: TRIAL_DAYS,
        message: 'Free trial started successfully'
      }
    });
  } catch (error) {
    console.error('Start trial error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to start trial' }
    });
  }
}

async function getTrialStatus(req, res) {
  try {
    const companyId = req.companyId;

    const subscription = await prisma.subscription.findUnique({
      where: { companyId }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Subscription not found' }
      });
    }

    const now = new Date();
    let isTrialActive = subscription.isTrialActive;
    let daysRemaining = 0;

    if (subscription.trialEndDate) {
      const trialEnd = new Date(subscription.trialEndDate);
      if (trialEnd > now) {
        daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        isTrialActive = true;
      } else {
        isTrialActive = false;
        daysRemaining = 0;
      }
    }

    res.json({
      success: true,
      data: {
        isTrialActive,
        trialUsed: subscription.trialUsed,
        trialStartDate: subscription.trialStartDate,
        trialEndDate: subscription.trialEndDate,
        daysRemaining,
        tier: subscription.tier,
        status: subscription.status
      }
    });
  } catch (error) {
    console.error('Get trial status error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get trial status' }
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

module.exports = { createEstimate, getEstimate, updateEstimate, getEstimates, startTrial, getTrialStatus };
