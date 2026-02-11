const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getMaterials(req, res) {
    try {
        const materials = await prisma.material.findMany({
            where: { companyId: req.companyId },
            orderBy: { name: 'asc' }
        });

        res.json({
            success: true,
            data: { materials }
        });
    } catch (error) {
        console.error('Get materials error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: 'Failed to get materials' }
        });
    }
}

async function createMaterial(req, res) {
    try {
        const { name, category, unit, costPerUnit, supplier } = req.body;

        const material = await prisma.material.create({
            data: {
                name,
                category,
                unit,
                costPerUnit: parseFloat(costPerUnit),
                supplier,
                companyId: req.companyId
            }
        });

        res.status(201).json({
            success: true,
            data: material
        });
    } catch (error) {
        console.error('Create material error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: 'Failed to create material' }
        });
    }
}

module.exports = {
    getMaterials,
    createMaterial
};
