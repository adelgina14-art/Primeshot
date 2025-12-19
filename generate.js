export default async function handler(req, res) {
  // 1. السماح فقط بطلبات POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. استخراج البيانات (البرومبت)
  let { prompt } = req.body;

  // إذا كان البرومبت فارغاً، نحاول استخراجه يدوياً (لحل مشكلة الـ 500)
  if (!prompt && typeof req.body === 'string') {
    try {
      const parsedBody = JSON.parse(req.body);
      prompt = parsedBody.prompt;
    } catch (e) {
      console.error("Parsing error");
    }
  }

  const apiKey = process.env.STABILITY_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'مفتاح الـ API غير موجود في إعدادات Vercel' });
  }

  if (!prompt) {
    return res.status(400).json({ error: 'لم يصل الوصف للسيرفر بشكل صحيح' });
  }

  try {
    const response = await fetch(
      'https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`,
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

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'خطأ من Stability AI' });
    }

    // النجاح وإرسال الصورة
    res.status(200).json({ image: data.artifacts[0].base64 });

  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ داخلي: ' + error.message });
  }
}
