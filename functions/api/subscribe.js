// functions/api/subscribe.js
// Cloudflare Pages Function for email subscriptions

export async function onRequest(context) {
  // Only accept POST requests
  if (context.request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const formData = await context.request.formData();
    const email = formData.get('email');

    // Validate email
    if (!email || !email.includes('@') || !email.includes('.')) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Please enter a valid email address.'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = context.env.DB;

    // Check if email already exists
    const existing = await db.prepare(
      'SELECT id, status FROM subscribers WHERE email = ?'
    ).bind(email.toLowerCase().trim()).first();

    if (existing) {
      if (existing.status === 'active') {
        return new Response(JSON.stringify({
          success: false,
          message: 'This email is already subscribed! 🎉'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        await db.prepare(
          'UPDATE subscribers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?'
        ).bind('active', email.toLowerCase().trim()).run();

        return new Response(JSON.stringify({
          success: true,
          message: 'Welcome back! You have been resubscribed. 🎉'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';

    await db.prepare(
      'INSERT INTO subscribers (email, ip_address, status) VALUES (?, ?, ?)'
    ).bind(email.toLowerCase().trim(), ip, 'active').run();

    return new Response(JSON.stringify({
      success: true,
      message: '🎉 Thank you for subscribing! You\'ll receive our latest tutorials and resources.'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Subscription error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Something went wrong. Please try again later.'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
