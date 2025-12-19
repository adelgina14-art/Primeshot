export const config = {
  runtime: 'edge', // هذا السطر يسمح للدالة بالعمل لفترة أطول من 10 ثوانٍ
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), { status: 400 });
    }

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          output_format: "png",
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: result.errors || "Stability AI Error" }), { status: response.status });
    }

    return new Response(JSON.stringify({ image: result.image }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
