// functions/api/youtube.js
// This function fetches your YouTube channel statistics

export async function onRequest(context) {
    // ⚠️ IMPORTANT: Replace these with YOUR actual values
    const API_KEY = 'AIzaSyC43jJ28OfGWk8dw2h3oI2RhPfkRK9Iqzs';      // ← Paste your API key
    const CHANNEL_ID = 'UC9jcqrmogdYp7BsUpMVl09w'; // ← Paste your Channel ID

    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Check if we got valid data
        if (data.items && data.items.length > 0) {
            const stats = data.items[0].statistics;
            
            // Return the stats as JSON with caching
            return new Response(JSON.stringify({
                subscriberCount: stats.subscriberCount,
                viewCount: stats.viewCount,
                videoCount: stats.videoCount,
                updatedAt: new Date().toISOString()
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
                }
            });
        } else {
            return new Response(JSON.stringify({ 
                error: 'Channel not found. Please check your Channel ID.' 
            }), { status: 404 });
        }
    } catch (error) {
        console.error('YouTube API Error:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to fetch YouTube stats. Please try again later.' 
        }), { status: 500 });
    }
}
