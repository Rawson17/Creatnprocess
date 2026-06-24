// functions/api/contact.js
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

    // Get Resend API key from environment
    const RESEND_API_KEY = context.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not found in environment');
      return new Response(JSON.stringify({
        success: false,
        message: 'Server configuration error. Please try again later.'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ✅ IMPORTANT: Use Resend's default sender
    // No custom domain needed! This works with any domain.
    const YOUR_EMAIL = 'hello@creatnprocess.com'; // ← Your email for receiving messages

    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // ✅ This works with .pages.dev domain - NO DNS needed!
        from: 'Creatnprocess <onboarding@resend.dev>',
        to: [YOUR_EMAIL],
        reply_to: email,
        subject: `📩 New Contact Form Submission from ${name}`,
        html: `
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
              <div class="footer">
                Sent from your Creatnprocess website contact form.
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error('Resend error:', emailResult);
      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to send email. Please try again later.'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Success
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
      message: 'Something went wrong. Please try again later.'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
