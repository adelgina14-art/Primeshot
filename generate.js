export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "application/json"
        },
        body: new FormData(
          Object.entries({
            prompt,
            output_format: "png"
          })
        )
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: result });
    }

    res.status(200).json({ image: result.image });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
