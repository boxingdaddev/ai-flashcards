// utils/ai.js
import { OPENAI_API_KEY } from '@env';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function generateFlashcardsFromText(inputText) {
  try {
    const prompt = `
Create concise flashcards from the following text.
Return ONLY valid JSON (no code fences, no extra text).
Format: [{"term": "...", "definition": "..."}, ...].

Text:
${inputText}
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an assistant that creates educational flashcards." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    let rawOutput = response.choices[0].message.content || "";

    // **1. Remove code fences if present**
    rawOutput = rawOutput.replace(/```json|```/g, "").trim();

    // **2. Attempt to isolate JSON (handles extra explanation text)**
    const jsonMatch = rawOutput.match(/\[.*\]/s);
    if (jsonMatch) {
      rawOutput = jsonMatch[0]; // only keep JSON array
    }

    // **3. Parse JSON safely**
    let flashcards;
    try {
      flashcards = JSON.parse(rawOutput);
    } catch (err) {
      console.error("Failed to parse AI response as JSON:", rawOutput);
      flashcards = [];
    }

    // **4. Validate format (must be array of objects with term + definition)**
    if (!Array.isArray(flashcards)) {
      flashcards = [];
    } else {
      flashcards = flashcards.filter(card => card.term && card.definition);
    }

    return flashcards;
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return [];
  }
}
