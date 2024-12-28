
export async function GET(request) {
    return new Response(JSON.stringify({ message: 'Hello from Next.js 13!' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  