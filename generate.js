export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // استخدام الـ JSON بدلاً من FormData لضمان الاستقرار على Vercel
    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
          "Accept": "application/json",
          "Content-Type": "application/json", // أضفنا هذا السطر
        },
        body: JSON.stringify({
          prompt: prompt,
          output_format: "png",
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); 
      console.error("Stability AI Error:", errorData);
      return res.status(response.status).json({ 
        error: errorData.message || "فشل الاتصال بمزود الصور" 
      });
    }

    const result = await response.json();

    // تأكدي أن الـ Frontend يتوقع 'image' بصيغة Base64
    res.status(200).json({
      image: result.image 
    });

  } catch (error) {
    console.error("Runtime Error:", error.message);
    res.status(500).json({ error: "حدث خطأ داخلي في السيرفر" });
  }
}
