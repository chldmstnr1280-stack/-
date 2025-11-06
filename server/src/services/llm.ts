/**
 * LLM Service
 *
 * Handles AI-powered emotional insights using OpenAI GPT-4o-mini
 */

import OpenAI from 'openai';
import { prisma } from '../index.js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// System prompt with emotional wellness guidelines
const SYSTEM_PROMPT = `You are a compassionate emotional wellness AI assistant for SELLERY, an app that helps users track their emotions and build healthy habits.

Your role:
- Provide empathetic, supportive responses to emotional check-ins
- Suggest evidence-based coping strategies
- Help users recognize patterns in their emotions
- Encourage healthy habits (physical activity, sleep, etc.)
- Maintain a warm, non-judgmental tone

Guidelines:
- Keep responses concise (2-3 sentences max)
- Never provide medical advice or diagnose conditions
- Always suggest professional help for severe distress
- Respect user privacy and confidentiality
- Use simple, accessible language
- Be encouraging but realistic

Context you have access to:
- Recent emotion logs (emotion label, intensity, notes)
- Step tracking data (if available)
- Menstrual cycle phase (if tracking)
- Mascot growth score

Remember: You're a supportive companion, not a therapist.`;

/**
 * Generate an AI response to user message with emotion context
 */
export async function generateAIResponse(
  userId: string,
  userMessage: string
): Promise<{
  response: string;
  tokensUsed: number;
}> {
  // Gather user context from database
  const context = await gatherUserContext(userId);

  // Build messages array
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: buildContextualMessage(userMessage, context) },
  ];

  // Call OpenAI API
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    max_tokens: 200, // Keep responses concise
    temperature: 0.7, // Balanced creativity and consistency
  });

  const response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';
  const tokensUsed = completion.usage?.total_tokens || 0;

  return { response, tokensUsed };
}

/**
 * Generate daily personalized insight
 */
export async function generateDailyInsight(userId: string): Promise<{
  insight: string;
  strategies: string[];
  pattern: string | null;
  tokensUsed: number;
}> {
  const context = await gatherUserContext(userId);

  const prompt = `Based on this user's recent emotional patterns, provide:
1. A brief insight (1-2 sentences) about their emotional state
2. 2-3 specific, actionable coping strategies
3. Any patterns you notice (optional)

Context:
${JSON.stringify(context, null, 2)}

Format your response as JSON:
{
  "insight": "string",
  "strategies": ["strategy1", "strategy2"],
  "pattern": "optional pattern observation"
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    max_tokens: 300,
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  const responseText = completion.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(responseText);

  return {
    insight: parsed.insight || 'Take a moment to check in with yourself today.',
    strategies: parsed.strategies || [],
    pattern: parsed.pattern || null,
    tokensUsed: completion.usage?.total_tokens || 0,
  };
}

/**
 * Gather user context from database
 */
async function gatherUserContext(userId: string): Promise<any> {
  // Get recent emotions (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentEmotions = await prisma.emotionEntry.findMany({
    where: {
      userId,
      timestamp: { gte: sevenDaysAgo },
    },
    orderBy: { timestamp: 'desc' },
    take: 10,
    select: {
      emotionLabel: true,
      intensity: true,
      notes: true,
      timestamp: true,
    },
  });

  // Get today's step count (if available)
  let todaySteps = 0;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stepLog = await prisma.stepLog.findFirst({
      where: {
        userId,
        date: { gte: today },
      },
    });

    todaySteps = stepLog?.stepCount || 0;
  } catch (error) {
    // Step tracking not available
  }

  // Get current cycle phase (if available)
  let cyclePhase: string | null = null;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cycleLog = await prisma.cycleLog.findFirst({
      where: {
        userId,
        date: { gte: today },
      },
      orderBy: { date: 'desc' },
    });

    cyclePhase = cycleLog?.phase || null;
  } catch (error) {
    // Cycle tracking not available
  }

  // Get mascot state
  const mascotState = await prisma.mascotState.findUnique({
    where: { userId },
    select: { stage: true, score: true },
  });

  return {
    recentEmotions,
    todaySteps,
    cyclePhase,
    mascotStage: mascotState?.stage || 'seed',
    mascotScore: mascotState?.score || 0,
  };
}

/**
 * Build contextual message with user data
 */
function buildContextualMessage(userMessage: string, context: any): string {
  const parts = [
    `User message: ${userMessage}`,
    '',
    'Recent context:',
  ];

  // Add emotion summary
  if (context.recentEmotions && context.recentEmotions.length > 0) {
    const emotionSummary = context.recentEmotions
      .slice(0, 5)
      .map((e: any) => `${e.emotionLabel} (${e.intensity}/10)`)
      .join(', ');
    parts.push(`Recent emotions: ${emotionSummary}`);
  }

  // Add step data if available
  if (context.todaySteps > 0) {
    parts.push(`Today's steps: ${context.todaySteps}`);
  }

  // Add cycle phase if available
  if (context.cyclePhase) {
    parts.push(`Current cycle phase: ${context.cyclePhase}`);
  }

  // Add mascot info
  parts.push(`Mascot: ${context.mascotStage} (score: ${context.mascotScore})`);

  return parts.join('\n');
}

/**
 * Save conversation to database
 */
export async function saveConversation(
  userId: string,
  userMessage: string,
  assistantMessage: string,
  tokensUsed: number
): Promise<void> {
  // Create or get today's conversation
  let conversation = await prisma.aIConversation.findFirst({
    where: {
      userId,
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  });

  if (!conversation) {
    conversation = await prisma.aIConversation.create({
      data: { userId },
    });
  }

  // Save both messages
  await prisma.aIMessage.createMany({
    data: [
      {
        conversationId: conversation.id,
        role: 'user',
        content: userMessage,
        tokensUsed: null,
      },
      {
        conversationId: conversation.id,
        role: 'assistant',
        content: assistantMessage,
        tokensUsed,
      },
    ],
  });
}

/**
 * Save daily insight to database
 */
export async function saveDailyInsight(
  userId: string,
  insight: string,
  strategies: string[],
  pattern: string | null
): Promise<void> {
  await prisma.aIInsight.upsert({
    where: {
      userId_date: {
        userId,
        date: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
    create: {
      userId,
      insight,
      strategies: JSON.stringify(strategies),
      pattern,
    },
    update: {
      insight,
      strategies: JSON.stringify(strategies),
      pattern,
    },
  });
}

/**
 * Get conversation history for user
 */
export async function getConversationHistory(
  userId: string,
  limit: number = 10
): Promise<any[]> {
  const conversations = await prisma.aIConversation.findMany({
    where: { userId },
    include: {
      messages: {
        orderBy: { timestamp: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return conversations;
}

/**
 * Get today's insight (if exists)
 */
export async function getTodayInsight(userId: string): Promise<any | null> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const insight = await prisma.aIInsight.findFirst({
    where: {
      userId,
      date: { gte: today },
    },
  });

  if (!insight) return null;

  return {
    ...insight,
    strategies: JSON.parse(insight.strategies),
  };
}
