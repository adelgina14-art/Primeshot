export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const { prompt } = await req.json();

    // استخدمنا هنا الرابط الخاص بـ v1 لأنه أكثر استقراراً مع طلبات الـ JSON البسيطة
    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          cfg_scale: 7,
          height: 512,
          width: 512,
          steps: 30,
          samples: 1,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      // هذا السطر سيطبع في الـ Logs سبب الرفض (مثلاً: invalid_api_key)
      console.error("STABILITY_ERROR_LOG:", JSON.stringify(result));
      return new Response(JSON.stringify({ error: result.message || "فشل التوليد" }), { status: response.status });
    }

    // ملاحظة: v1 يعيد الصورة داخل مصفوفة artifacts
    const base64Image = result.artifacts[0].base64;
    return new Response(JSON.stringify({ image: base64Image }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  }
