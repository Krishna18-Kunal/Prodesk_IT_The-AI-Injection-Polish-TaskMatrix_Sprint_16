
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const suggestSubtasks = asyncHandler(async (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new AppError('Gemini API key is missing.', 503);
  }

  const startTime = Date.now();

  try {
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
        maxOutputTokens: 256
      }
    });

    const count = Math.min(
      Math.max(Number(req.body.count) || 5, 1),
      5
    );

    const prompt = `
Generate exactly ${count} short actionable subtasks.

Task: ${req.body.taskTitle}
Description: ${req.body.description || 'None'}

Return JSON only:
{"subtasks":["Action 1","Action 2"]}
Keep each action under 12 words.
`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();
    const parsed = JSON.parse(raw);

    const subtasks = parsed.subtasks
      .filter(item => typeof item === 'string')
      .map(item => item.trim().slice(0, 160))
      .filter(Boolean)
      .slice(0, count);

    if (!subtasks.length) {
      throw new Error('No valid subtasks returned');
    }

    console.log(`Gemini completed in ${Date.now() - startTime}ms`);

    res.json({
      success: true,
      subtasks
    });

  } catch (error) {
    console.error('Gemini error:', error.message);

    throw new AppError(
      'AI generation failed. Please try again.',
      502
    );
  }
});
