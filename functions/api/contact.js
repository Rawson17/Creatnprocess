// functions/api/contact.js
export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const formData = await context.request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Validate
    if (!name || !email || !message) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Please fill in all fields.'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get Resend API key from environment
    const RESEND_API_KEY = context.env.RESEND_API_KEY;

    // Check if API key exists
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not found in environment');
      return new Response(JSON.stringify({
        success: false,
        message: 'Server configuration error. Please try again later.'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Creatnprocess <onboarding@resend.dev>', // Use Resend's default
        to: ['hello@creatnprocess.com'], // Your email address
        subject: `📩 New Contact Form Submission from ${name}`,
        html: `
          <h1>New Contact Form Submission</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
        reply_to: email,
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
