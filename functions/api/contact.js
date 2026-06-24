// functions/api/contact.js - DEBUG VERSION
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

    // Get Resend API key
    const RESEND_API_KEY = context.env.RESEND_API_KEY;
    
    // Log to see if key exists
    console.log('RESEND_API_KEY exists:', !!RESEND_API_KEY);

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({
        success: false,
        message: 'API key not configured. Please contact support.'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // SIMPLE TEST - No fancy HTML
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Creatnprocess <onboarding@resend.dev>',
        to: ['rawson17@gmail.com'], // ← REPLACE with your actual email
        subject: 'TEST: Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      }),
    });

    const result = await emailResponse.json();

    // Log the result
    console.log('Resend response status:', emailResponse.status);
    console.log('Resend response body:', result);

    if (!emailResponse.ok) {
      return new Response(JSON.stringify({
        success: false,
        message: `Email error: ${result.message || 'Unknown error'}`
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: '✅ Message sent! Check your email.'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error: ' + error.message
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
