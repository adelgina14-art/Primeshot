export default async function handler(req, res) {
  // إضافة رؤوس الاستجابة لمنع مشاكل الـ CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'الطريقة غير مسموحة' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.STABILITY_API_KEY;

  // فحص صريح للمفتاح
  if (!apiKey || apiKey.length < 10) {
    return res.status(500).json({ error: 'المفتاح API غير معرف بشكل صحيح في Vercel' });
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
      // إرسال تفاصيل الخطأ الحقيقية للمتصفح لنراها
      return res.status(response.status).json({ 
        error: `خطأ من الذكاء الاصطناعي: ${data.message || 'فشل الاتصال'}` 
      });
    }

    return res.status(200).json({ image: data.artifacts[0].base64 });

  } catch (err) {
    return res.status(500).json({ error: 'خطأ سيرفر: ' + err.message });
  }
                                }
