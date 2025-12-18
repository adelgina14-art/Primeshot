<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>PrimeShot AI</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap" rel="stylesheet">

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Poppins', sans-serif;
    }

    body {
      background: #000;
      color: #fff;
      overflow-x: hidden;
    }

    /* Video Background */
    .video-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: -2;
      opacity: 0.35;
    }

    .overlay {
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at top, rgba(0,0,0,0.4), #000);
      z-index: -1;
    }

    header {
      padding: 40px 20px;
      text-align: center;
    }

    header h1 {
      font-size: 3rem;
      font-weight: 700;
      background: linear-gradient(90deg, #fff, #aaa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    header p {
      margin-top: 10px;
      opacity: 0.8;
    }

    .container {
      max-width: 900px;
      margin: auto;
      padding: 20px;
    }

    .generator {
      background: rgba(255,255,255,0.06);
      backdrop-filter: blur(15px);
      border-radius: 20px;
      padding: 30px;
      margin-top: 40px;
      box-shadow: 0 0 60px rgba(255,255,255,0.05);
    }

    textarea {
      width: 100%;
      height: 100px;
      border-radius: 12px;
      border: none;
      padding: 15px;
      font-size: 16px;
      outline: none;
      resize: none;
    }

    button {
      width: 100%;
      margin-top: 20px;
      padding: 15px;
      font-size: 18px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      background: linear-gradient(90deg, #fff, #ccc);
      color: #000;
      font-weight: 600;
      transition: 0.3s;
    }

    button:hover {
      transform: scale(1.03);
    }

    .result {
      margin-top: 30px;
      text-align: center;
    }

    .result img {
      max-width: 100%;
      border-radius: 20px;
      box-shadow: 0 0 40px rgba(255,255,255,0.2);
    }

    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px,1fr));
      gap: 20px;
      margin-top: 60px;
    }

    .gallery img {
      width: 100%;
      border-radius: 15px;
      opacity: 0.9;
    }

    iframe {
      width: 100%;
      height: 600px;
      border-radius: 20px;
      border: none;
      margin-top: 60px;
    }

    footer {
      text-align: center;
      padding: 40px 10px;
      opacity: 0.5;
    }
  </style>
</head>

<body>

  <!-- Background Video -->
  <video class="video-bg" autoplay muted loop>
    <source src="https://cdn.coverr.co/videos/coverr-abstract-light-motion-9718/1080p.mp4" type="video/mp4">
  </video>
  <div class="overlay"></div>

  <header>
    <h1>PrimeShot AI</h1>
    <p>Ultra-realistic AI image generation</p>
  </header>

  <div class="container">

    <!-- Generator -->
    <div class="generator">
      <textarea id="prompt" placeholder="Describe your image in detail..."></textarea>
      <button onclick="generateImage()">Generate Image</button>

      <div class="result" id="result"></div>
    </div>

    <!-- Gallery -->
    <div class="gallery">
      <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e" />
      <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9" />
      <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" />
    </div>

    <!-- Google Form -->
    <iframe src="https://docs.google.com/forms/d/1XtnTRvNFJOBGWS3CyuKI5QgpaCqfJKNDIbJIhDFgPdY/viewform"></iframe>

  </div>

  <footer>
    © 2025 PrimeShot AI
  </footer>

  <script>
    async function generateImage() {
      const prompt = document.getElementById("prompt").value;
      const result = document.getElementById("result");

      if (!prompt) {
        alert("Write a prompt first");
        return;
      }

      result.innerHTML = "Generating...";

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt })
        });

        const data = await res.json();

        result.innerHTML = `<img src="${data.image}" />`;

      } catch (e) {
        result.innerHTML = "Error generating image";
      }
    }
  </script>

</body>
</html>
