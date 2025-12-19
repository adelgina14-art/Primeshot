export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { prompt } = req.body;
  const apiKey = process.env.STABILITY_API_KEY;

  try {
    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${apiKey.trim()}`,
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
      return res.status(response.status).json({ error: result.message });
    }

    res.status(200).json({ image: result.artifacts[0].base64 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
