const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendEmail } = require('../utils/email');


const sendContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    
    
    
    
    
    
    
    
    
    

    
    try {
      const emailContent = `
        <h2>New Contact Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `;

      await sendEmail(
        process.env.ADMIN_EMAIL || 'admin@homequest.com',
        `New Contact Inquiry: ${subject}`,
        emailContent
      );

      
      const confirmationEmail = `
        <h2>Thank You for Contacting Us</h2>
        <p>Hi ${name},</p>
        <p>We have received your inquiry and will get back to you soon.</p>
        <p><strong>Your Message:</strong></p>
        <p>${message}</p>
      `;

      await sendEmail(
        email,
        'HomeQuest - Contact Confirmation',
        confirmationEmail
      );
    } catch (emailError) {
      console.warn('Email sending failed:', emailError.message);
      
    }

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. We will contact you soon.'
    });
  } catch (error) {
    console.error('Error sending contact message:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to send inquiry',
      details: error.message
    });
  }
};

module.exports = {
  sendContactMessage,
};
