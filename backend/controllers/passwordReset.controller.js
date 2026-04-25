const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email is required' }
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        data: { message: 'If an account exists with that email, a reset link has been sent.' }
      });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Invalidate any existing reset tokens for this email
    await prisma.passwordReset.updateMany({
      where: { email, used: false },
      data: { used: true }
    });

    // Create new reset token
    await prisma.passwordReset.create({
      data: { token, email, expiresAt }
    });

    // In production, send email with reset link
    // For now, log the token (replace with email service integration)
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Password reset requested for ${email}. Reset URL: ${resetUrl}`);
    }

    // TODO: Integrate with email service (SendGrid, SES, etc.)
    // await sendEmail({ to: email, subject: 'Password Reset', html: `<a href="${resetUrl}">Reset Password</a>` });

    res.json({
      success: true,
      data: {
        message: 'If an account exists with that email, a reset link has been sent.',
        // Include token in development mode for testing
        ...(process.env.NODE_ENV !== 'production' && { resetToken: token, resetUrl })
      }
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to process password reset request' }
    });
  }
}

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Token and new password are required' }
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: { message: 'Password must be at least 8 characters' }
      });
    }

    // Find valid reset token
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token }
    });

    if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid or expired reset token' }
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { email: resetRecord.email },
        data: { password: hashedPassword }
      }),
      prisma.passwordReset.update({
        where: { id: resetRecord.id },
        data: { used: true }
      })
    ]);

    res.json({
      success: true,
      data: { message: 'Password has been reset successfully' }
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to reset password' }
    });
  }
}

module.exports = { forgotPassword, resetPassword };
