// functions/api/subscribe.js
export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const formData = await context.request.formData();
    const email = formData.get('email');

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Please enter a valid email address.'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Your database logic will go here
    return new Response(JSON.stringify({
      success: true,
      message: '🎉 Thank you for subscribing!'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Something went wrong.'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
