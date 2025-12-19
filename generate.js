export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          cfg_scale: 7,
          height: 512,
          width: 512,
          samples: 1,
          steps: 30
        })
      }
    );

    const data = await response.json();

    if (!data.artifacts || !data.artifacts[0]) {
      return res.status(500).json({ error: "No image returned" });
    }

    res.status(200).json({
      image: `data:image/png;base64,${data.artifacts[0].base64}`
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
      }
