const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/search", async (req, res) => {
  try {
    const { medicine, language } = req.body;

    if (!medicine || !medicine.trim()) {
      return res.status(400).json({
        message: "Medicine name is required",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing");

      return res.status(500).json({
        message: "Gemini API key is not configured",
      });
    }

    const prompt = `
You are an Ayurvedic knowledge assistant.

Medicine searched: "${medicine}"
Answer language: ${language || "English"}

Explain traditional Ayurvedic information only.
Do not invent information if the medicine is uncertain.
Distinguish traditional uses from scientifically established evidence.
Do not diagnose diseases or claim cures.
Do not give personalized prescriptions.
Mention precautions and interactions when known.
Use simple language.
Return ONLY valid JSON in this structure:

{
  "name": "",
  "sanskritName": "",
  "description": "",
  "ingredients": [],
  "uses": [],
  "benefits": [],
  "forms": [],
  "precautions": [],
  "interactions": "",
  "traditionalUsage": ""
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text);

    return res.json(result);
  } catch (error) {
    console.error("AYURVEDA SEARCH ERROR:", error);

    return res.status(500).json({
      message: "Unable to get Ayurvedic information",
    });
  }
});

module.exports = router;
