import nodemailer from "nodemailer"

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your email
    pass: process.env.SMTP_PASSWORD, // Your email password or app password
  },
}

// Create transporter - Fix: changed from createTransporter to createTransport
const transporter = nodemailer.createTransport(emailConfig)

// Verify email configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify()
    console.log("Email server is ready to send messages")
    return true
  } catch (error) {
    console.error("Email configuration error:", error)
    return false
  }
}

// Send MFA email
export async function sendMFAEmail(to: string, code: string, userName?: string): Promise<boolean> {
  try {
    console.log("Attempting to send MFA email to:", to)
    console.log("SMTP configuration:", {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER ? "configured" : "missing",
    })

    const mailOptions = {
      from: {
        name: "AI Credit Risk Analysis",
        address: process.env.SMTP_USER || "noreply@creditrisk.com",
      },
      to,
      subject: "Your Verification Code - AI Credit Risk Analysis",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .code-container {
              background: white;
              border: 2px solid #667eea;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 20px 0;
            }
            .verification-code {
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #667eea;
              font-family: 'Courier New', monospace;
            }
            .warning {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 5px;
              padding: 15px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 14px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔐 Verification Code</h1>
            <p>AI Credit Risk Analysis System</p>
          </div>
          
          <div class="content">
            <h2>Hello ${userName || "User"}!</h2>
            
            <p>You've requested to sign in to your AI Credit Risk Analysis account. Please use the verification code below to complete your login:</p>
            
            <div class="code-container">
              <div class="verification-code">${code}</div>
              <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Enter this code in your browser</p>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>This code will expire in <strong>10 minutes</strong></li>
                <li>Never share this code with anyone</li>
                <li>If you didn't request this code, please ignore this email</li>
              </ul>
            </div>
            
            <p>If you're having trouble signing in, you can:</p>
            <ul>
              <li>Request a new verification code</li>
              <li>Use one of your backup codes</li>
              <li>Contact our support team</li>
            </ul>
            
            <p>Best regards,<br>
            <strong>AI Credit Risk Analysis Team</strong></p>
          </div>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} AI Credit Risk Analysis System. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        AI Credit Risk Analysis - Verification Code
        
        Hello ${userName || "User"}!
        
        Your verification code is: ${code}
        
        This code will expire in 10 minutes.
        
        If you didn't request this code, please ignore this email.
        
        Best regards,
        AI Credit Risk Analysis Team
      `,
    }

    console.log("Sending email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    })

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", info.messageId)
    return true
  } catch (error) {
    console.error("Detailed email error:", error)
    return false
  }
}

// Send welcome email
export async function sendWelcomeEmail(to: string, userName: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: {
        name: "AI Credit Risk Analysis",
        address: process.env.SMTP_USER || "noreply@creditrisk.com",
      },
      to,
      subject: "Welcome to AI Credit Risk Analysis System",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .feature {
              background: white;
              border-left: 4px solid #667eea;
              padding: 15px;
              margin: 15px 0;
              border-radius: 0 5px 5px 0;
            }
            .cta-button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Welcome to AI Credit Risk Analysis!</h1>
            <p>Your account has been created successfully</p>
          </div>
          
          <div class="content">
            <h2>Hello ${userName}!</h2>
            
            <p>Welcome to the AI Credit Risk Analysis System! We're excited to have you on board.</p>
            
            <h3>What you can do with your account:</h3>
            
            <div class="feature">
              <strong>🤖 AI-Powered Credit Scoring</strong><br>
              Get instant credit risk assessments using advanced machine learning algorithms.
            </div>
            
            <div class="feature">
              <strong>📊 Interactive Dashboard</strong><br>
              View real-time analytics and comprehensive reports on credit applications.
            </div>
            
            <div class="feature">
              <strong>🔒 Secure Multi-Factor Authentication</strong><br>
              Your account is protected with enterprise-level security features.
            </div>
            
            <div class="feature">
              <strong>📱 Responsive Design</strong><br>
              Access your dashboard from any device, anywhere, anytime.
            </div>
            
            <p>Ready to get started?</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login" class="cta-button">
              Sign In to Your Account
            </a>
            
            <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
            
            <p>Best regards,<br>
            <strong>AI Credit Risk Analysis Team</strong></p>
          </div>
        </body>
        </html>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Welcome email sent successfully:", info.messageId)
    return true
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return false
  }
}
