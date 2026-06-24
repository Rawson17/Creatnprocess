// functions/api/contact.js
// This function handles contact form submissions

export async function onRequest(context) {
  // Only accept POST requests
  if (context.request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Get form data
    const formData = await context.request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Please fill in all fields.'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate email
    if (!email.includes('@') || !email.includes('.')) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Please enter a valid email address.'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get IP address from Cloudflare
    const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';

    // ============================================
    // SEND EMAIL NOTIFICATION
    // ============================================
    
    // Replace with your email address
    const YOUR_EMAIL = 'hello@creatnprocess.com';
    const YOUR_NAME = 'Creatnprocess';

    // Build email content
    const subject = `📩 New Contact Form Submission from ${name}`;
    
    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #060816; color: #f8fafc; padding: 40px; }
          .container { max-width: 600px; margin: 0 auto; background: #0f0f0f; padding: 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.06); }
          h1 { color: #8b5cf6; }
          .field { margin: 16px 0; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border-left: 3px solid #8b5cf6; }
          .label { color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
          .value { color: #f8fafc; font-size: 16px; margin-top: 4px; }
          .footer { margin-top: 30px; color: #94a3b8; font-size: 14px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📩 New Contact Form Submission</h1>
          
          <div class="field">
            <div class="label">Name</div>
            <div class="value">${name}</div>
          </div>
          
          <div class="field">
            <div class="label">Email</div>
            <div class="value">${email}</div>
          </div>
          
          <div class="field">
            <div class="label">Message</div>
            <div class="value">${message}</div>
          </div>
          
          <div class="field">
            <div class="label">IP Address</div>
            <div class="value">${ip}</div>
          </div>
          
          <div class="footer">
            Sent from your Creatnprocess website contact form.
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using Cloudflare's email routing or a third-party service
    // Option 1: Use Cloudflare Email Workers (Recommended - Free)
    // Option 2: Use a third-party service like SendGrid, Mailgun, or Resend
    
    // For this example, we'll use Resend (free tier)
    // First, sign up at https://resend.com and get your API key
    
    // ============================================
    // OPTION 1: Using Resend (Recommended - Free)
    // ============================================
    
    const RESEND_API_KEY = context.env.RESEND_API_KEY; // Add this in Cloudflare Pages Environment Variables
    
    if (RESEND_API_KEY) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Creatnprocess <onboarding@resend.dev>`, // Use Resend's default domain or your verified domain
          to: [YOUR_EMAIL],
          subject: subject,
          html: emailBody,
          reply_to: email,
        }),
      });

      if (!resendResponse.ok) {
        console.error('Failed to send email via Resend:', await resendResponse.text());
      }
    }

    // ============================================
    // OPTION 2: Using Mailgun (Alternative)
    // ============================================
    
    // const MAILGUN_API_KEY = context.env.MAILGUN_API_KEY;
    // const MAILGUN_DOMAIN = context.env.MAILGUN_DOMAIN;
    // 
    // if (MAILGUN_API_KEY && MAILGUN_DOMAIN) {
    //   const formData = new FormData();
    //   formData.append('from', `${YOUR_NAME} <mailgun@${MAILGUN_DOMAIN}>`);
    //   formData.append('to', YOUR_EMAIL);
    //   formData.append('subject', subject);
    //   formData.append('html', emailBody);
    //   formData.append('h:Reply-To', email);
    // 
    //   await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Basic ${btoa('api:' + MAILGUN_API_KEY)}`,
    //     },
    //     body: formData,
    //   });
    // }

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      message: '✅ Thank you! Your message has been sent. We\'ll get back to you soon.'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: '❌ Oops! Something went wrong. Please try again later.'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
