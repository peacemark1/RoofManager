const bcrypt = require('bcrypt');  
const jwt = require('jsonwebtoken');  
const { PrismaClient } = require('@prisma/client');  
const prisma = new PrismaClient();  
  
async function register(req, res) {  
  try {  
    const { company, user } = req.body;  
    const existingCompany = await prisma.company.findUnique({ where: { subdomain: company.subdomain } });  
    if (existingCompany) { return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Subdomain already taken' } }); }  
    const existingUser = await prisma.user.findUnique({ where: { email: user.email } });  
    if (existingUser) { return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Email already registered' } }); }  
    const hashedPassword = await bcrypt.hash(user.password, 10);  
    const result = await prisma.$transaction(async (tx) => {  
      const newCompany = await tx.company.create({ data: { name: company.name, subdomain: company.subdomain } });  
      const newUser = await tx.user.create({ data: { email: user.email, password: hashedPassword, firstName: user.firstName, lastName: user.lastName, phone: user.phone, role: 'ADMIN', companyId: newCompany.id } });  
      await tx.subscription.create({ data: { tier: 'FREE', status: 'ACTIVE', companyId: newCompany.id } });  
      return { company: newCompany, user: newUser };  
    });  
    const token = jwt.sign({ userId: result.user.id, companyId: result.company.id, role: result.user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });  
    res.status(201).json({ success: true, data: { company: result.company, user: { id: result.user.id, email: result.user.email, role: result.user.role }, token } });  
  } catch (error) { console.error('Registration error:', error); res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Registration failed' } }); }  
}  
  
async function login(req, res) {  
  try {  
    const { email, password } = req.body;  
    const user = await prisma.user.findUnique({ where: { email }, include: { company: true } });  
    if (!user) { return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } }); }  
    const isValidPassword = await bcrypt.compare(password, user.password);  
    if (!isValidPassword) { return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } }); }  
    const token = jwt.sign({ userId: user.id, companyId: user.companyId, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });  
    res.json({ success: true, data: { user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, companyId: user.companyId }, token } });  
  } catch (error) { console.error('Login error:', error); res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Login failed' } }); }  
}  
  
module.exports = { register, login }; 
