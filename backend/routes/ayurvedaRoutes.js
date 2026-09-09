const express = require("express");

const router = express.Router();

router.post("/search", async (req, res) => {

  try {

    const {
      medicine,
      language
    } = req.body;

    if (!medicine) {
      return res.status(400).json({
        message: "Medicine name is required"
      });
    }

    const prompt = `
You are an Ayurvedic knowledge assistant.

The user searched for:

"${medicine}"

The user wants the answer in:

${language}

Identify the medicine and explain its
TRADITIONAL AYURVEDIC information.

IMPORTANT:

- Do not invent a medicine if you are uncertain.
- Clearly say when the identity is uncertain.
- Distinguish traditional Ayurvedic uses from
  scientifically established medical evidence.
- Do not diagnose diseases.
- Do not claim that the medicine cures diseases.
- Do not give personalized medical prescriptions.
- Do not recommend unsafe self-medication.
- Mention important precautions and possible
  interactions when known.
- Use simple language.
- Return ONLY valid JSON.

Return:

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

    const response = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          model: "llama3.2",
          prompt: prompt,
          stream: false,
          format: "json"
        })
      }
    );

    const data = await response.json();

    const result = JSON.parse(
      data.response
    );

    res.json(result);

  } catch (error) {

    console.error(
      "AYURVEDA SEARCH ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Unable to get Ayurvedic information"
    });

  }

});

module.exports = router;