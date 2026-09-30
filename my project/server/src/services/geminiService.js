const { GoogleGenAI } = require('@google/genai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

function checkApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    throw new Error(
      'Gemini API key is missing or not configured. Please set GEMINI_API_KEY in your server/.env file.'
    );
  }
  return apiKey;
}

/**
 * Call Gemini AI using @google/genai or @google/generative-ai with model fallback
 */
async function callGemini(prompt) {
  const apiKey = checkApiKey();
  const configuredModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const modelsToTry = Array.from(
    new Set([configuredModel, 'gemini-3.5-flash', 'gemini-flash-latest', 'gemini-2.5-flash-lite'])
  );

  let lastError = null;

  for (const modelName of modelsToTry) {
    // 1. Try using @google/genai SDK
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err1) {
      console.warn(`@google/genai [${modelName}] failed (${err1.message}).`);
      lastError = err1;
    }

    // 2. Try using @google/generative-ai SDK
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      if (text) return text;
    } catch (err2) {
      console.warn(`@google/generative-ai [${modelName}] failed (${err2.message}).`);
      lastError = err2;
    }
  }

  throw new Error(`Gemini AI service error: ${lastError?.message || 'All model fallbacks failed'}`);
}

/**
 * Safely parse JSON from AI output
 */
function parseJSONFromResponse(rawText) {
  let cleaned = rawText.trim();
  // Remove markdown code fences if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Attempt regex extraction of first json array or object
    const match = cleaned.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (err) {
        throw new Error('Failed to parse AI response as valid JSON.');
      }
    }
    throw new Error('AI output did not contain valid JSON format.');
  }
}

/**
 * 1. Generate Summary
 */
async function generateSummary(content, title = '', subject = '') {
  const prompt = `You are an expert tutor. Create a clear, concise, and structured educational summary of the following study material.
Title: ${title}
Subject: ${subject}

Study Material:
${content.substring(0, 15000)}

Requirements:
- Make it examination-ready.
- Use key takeaways, bullet points, and main concepts.
- Highlight important definitions.`;

  const rawText = await callGemini(prompt);
  if (!rawText || rawText.trim().length === 0) {
    throw new Error('Received empty summary response from Gemini AI.');
  }
  return rawText.trim();
}

/**
 * 2. Generate Flashcards
 */
async function generateFlashcards(content, title = '', subject = '') {
  const prompt = `You are an expert tutor. Create 5 to 10 revision flashcards from the following study material.
Title: ${title}
Subject: ${subject}

Study Material:
${content.substring(0, 15000)}

CRITICAL INSTRUCTION: Return ONLY a raw valid JSON array of objects. Do not include markdown around it unless necessary.
Each object in the array MUST have this exact structure:
[
  {
    "question": "Clear, concise question?",
    "answer": "Accurate, clear answer."
  }
]`;

  const rawText = await callGemini(prompt);
  const data = parseJSONFromResponse(rawText);

  if (!Array.isArray(data)) {
    throw new Error('AI flashcard response is not a valid array.');
  }

  const validCards = data
    .filter((card) => card && typeof card.question === 'string' && typeof card.answer === 'string')
    .map((card) => ({
      question: card.question.trim(),
      answer: card.answer.trim(),
    }));

  if (validCards.length === 0) {
    throw new Error('AI generated no valid flashcard pairs.');
  }

  return validCards;
}

/**
 * 3. Generate Quiz
 */
async function generateQuiz(content, title = '', subject = '') {
  const prompt = `You are an expert examiner. Generate 5 multiple-choice questions (MCQs) from the following study material.
Title: ${title}
Subject: ${subject}

Study Material:
${content.substring(0, 15000)}

CRITICAL INSTRUCTION: Return ONLY a raw valid JSON array of question objects.
Each object MUST have this exact structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Exact text matching one of the options",
    "explanation": "Brief explanation of why this answer is correct"
  }
]`;

  const rawText = await callGemini(prompt);
  const data = parseJSONFromResponse(rawText);

  if (!Array.isArray(data)) {
    throw new Error('AI quiz response is not a valid array of questions.');
  }

  const validQuestions = data
    .filter(
      (q) =>
        q &&
        typeof q.question === 'string' &&
        Array.isArray(q.options) &&
        q.options.length >= 2 &&
        typeof q.correctAnswer === 'string'
    )
    .map((q) => {
      let corr = q.correctAnswer.trim();
      if (!q.options.includes(corr)) {
        const matched = q.options.find((opt) => opt.toLowerCase().includes(corr.toLowerCase()));
        if (matched) {
          corr = matched;
        } else {
          corr = q.options[0];
        }
      }
      return {
        question: q.question.trim(),
        options: q.options.map((opt) => String(opt).trim()),
        correctAnswer: corr,
        explanation: q.explanation ? String(q.explanation).trim() : 'Correct answer based on study material.',
      };
    });

  if (validQuestions.length === 0) {
    throw new Error('AI generated no valid quiz questions.');
  }

  return validQuestions;
}

/**
 * 4. Generate Study Plan
 */
async function generateStudyPlan(subject, examDate, availableTime, learningGoal, content = '') {
  const prompt = `You are a professional study strategist. Create a detailed, actionable, personalized study plan.
Subject: ${subject}
Target Exam Date: ${examDate}
Available Daily Study Time: ${availableTime}
Learning Goal: ${learningGoal}
Study Content Summary: ${content.substring(0, 5000)}

CRITICAL INSTRUCTION: Return a JSON object with structured study plan details.
Format:
{
  "summary": "Overall strategy overview",
  "totalDays": 7,
  "dailySchedule": [
    {
      "day": "Day 1",
      "topic": "Topic or module name",
      "tasks": ["Task 1", "Task 2"],
      "focusArea": "Key focus area"
    }
  ],
  "examDayTips": ["Tip 1", "Tip 2"]
}`;

  const rawText = await callGemini(prompt);
  let planData;
  try {
    planData = parseJSONFromResponse(rawText);
  } catch (err) {
    planData = {
      summary: rawText,
      dailySchedule: [],
      examDayTips: [],
    };
  }

  return planData;
}

module.exports = {
  generateSummary,
  generateFlashcards,
  generateQuiz,
  generateStudyPlan,
};
