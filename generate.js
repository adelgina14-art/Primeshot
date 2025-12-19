export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "الرجاء كتابة وصف للصورة" }), { status: 400 });
    }

    // إعداد البيانات بصيغة FormData لأنها الأكثر توافقاً مع v2beta/core
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("output_format", "webp"); // الـ webp أسرع وأخف في التوليد للتجربة

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
          "Accept": "application/json",
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // طباعة الخطأ في الـ Logs لنعرف السبب (رصيد، مفتاح، أو وصف ممنوع)
      console.error("Stability Error:", data);
      return new Response(JSON.stringify({ 
        error: data.errors ? data.errors[0] : "فشل التوليد من المصدر" 
      }), { status: response.status });
    }

    return new Response(JSON.stringify({ image: data.image }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "خطأ في الاتصال: " + error.message }), { status: 500 });
  }
                                        }
