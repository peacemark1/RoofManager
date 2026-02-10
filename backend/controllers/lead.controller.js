const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createLead(req, res) {
  try {
    const { firstName, lastName, email, phone, address, source, notes } = req.body;

    const lead = await prisma.lead.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        source,
        status: 'NEW',
        notes,
        companyId: req.companyId
      }
    });

    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create lead' }
    });
  }
}

async function getLeads(req, res) {
  try {
    const { status, source, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const where = { companyId: req.companyId };
    if (status) where.status = status;
    if (source) where.source = source;

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.lead.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        leads,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get leads' }
    });
  }
}

async function getLead(req, res) {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findFirst({
      where: { id, companyId: req.companyId },
      include: { job: true }
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Lead not found' }
      });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get lead' }
    });
  }
}

async function updateLead(req, res) {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, address, source, status, notes } = req.body;

    const lead = await prisma.lead.updateMany({
      where: { id, companyId: req.companyId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(address !== undefined && { address }),
        ...(source && { source }),
        ...(status && { status }),
        ...(notes !== undefined && { notes })
      }
    });

    if (lead.count === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Lead not found' }
      });
    }

    const updatedLead = await prisma.lead.findUnique({
      where: { id }
    });

    res.json({
      success: true,
      data: updatedLead
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update lead' }
    });
  }
}

async function deleteLead(req, res) {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.deleteMany({
      where: { id, companyId: req.companyId }
    });

    if (lead.count === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Lead not found' }
      });
    }

    res.json({
      success: true,
      data: { message: 'Lead deleted successfully' }
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to delete lead' }
    });
  }
}

async function convertLeadToJob(req, res) {
  try {
    const { id } = req.params;
    const { title, description, propertyType, roofSize, roofPitch } = req.body;

    // Check if lead exists and belongs to company
    const lead = await prisma.lead.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Lead not found' }
      });
    }

    // Generate job number
    const year = new Date().getFullYear();
    const jobCount = await prisma.job.count({
      where: {
        companyId: req.companyId,
        jobNumber: { startsWith: `JOB-${year}` }
      }
    });
    const jobNumber = `JOB-${year}-${String(jobCount + 1).padStart(3, '0')}`;

    // Create job in transaction
    const result = await prisma.$transaction(async (tx) => {
      const job = await tx.job.create({
        data: {
          jobNumber,
          title,
          description,
          address: lead.address || '',
          propertyType,
          roofSize,
          roofPitch,
          status: 'PROSPECT',
          companyId: req.companyId,
          leadId: id
        }
      });

      // Update lead status
      await tx.lead.update({
        where: { id },
        data: { status: 'CONVERTED' }
      });

      return { job };
    });

    res.status(201).json({
      success: true,
      data: {
        job: result.job,
        lead: { id, status: 'CONVERTED' }
      }
    });
  } catch (error) {
    console.error('Convert lead error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to convert lead to job' }
    });
  }
}

module.exports = {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  convertLeadToJob
};
