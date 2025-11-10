const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'gemini';
    
    if (this.provider === 'gemini') {
      // Check if API key is available
      if (!process.env.GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY not found in environment variables');
        this.model = null;
      } else {
        try {
          this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
          // Use gemini-2.0-flash which is available in v1 API
          this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        } catch (error) {
          console.error('Failed to initialize Gemini AI:', error);
          this.model = null;
        }
      }
    } else if (this.provider === 'openai') {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }
  }

  /**
   * Generate AI response using the configured provider
   */
  async generateResponse(prompt) {
    try {
      if (this.provider === 'gemini') {
        if (!this.model) {
          throw new Error('Gemini AI model not initialized. Please check your GEMINI_API_KEY.');
        }
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } else if (this.provider === 'openai') {
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1000
        });
        return completion.choices[0].message.content;
      }
    } catch (error) {
      console.error('AI Service Error:', error.message);
      console.error('Error details:', error);
      throw new Error(`Failed to generate AI response: ${error.message}`);
    }
  }

  /**
   * Summarize team productivity data
   */
  async summarizeProductivity(productivityData) {
    const prompt = `You are analyzing productivity data from a software development team.

Data:
${JSON.stringify(productivityData, null, 2)}

Now do the following:
1. Summarize the team's overall progress in the last 24 hours.
2. Identify any anomalies or members who are underperforming.
3. Mention the completion rate and open task ratio.
4. Suggest one improvement to boost productivity.
5. Format the answer in 3 short paragraphs (Insight Summary, Team Health, Recommendation).

Always respond in an insightful, analytical, and human-friendly tone.`;

    return await this.generateResponse(prompt);
  }

  /**
   * Answer conversational queries about team data
   */
  async answerQuery(userQuery, teamData) {
    const prompt = `You are an AI chatbot inside a productivity dashboard.
Answer this user query naturally based on the data below.

User Query: "${userQuery}"

Data:
${JSON.stringify(teamData, null, 2)}

Always respond in an insightful, analytical, and human-friendly tone.`;

    return await this.generateResponse(prompt);
  }

  /**
   * Predict sprint completion and workload
   */
  async predictSprintProgress(historicalData) {
    const prompt = `Analyze the past 4 weeks of productivity data and forecast the next sprint completion rate.

Data (Weekly Summary):
${JSON.stringify(historicalData, null, 2)}

Include:
- Projected completion percentage
- Expected workload level (High/Medium/Low)
- Risk assessment
- One short prediction insight

Always respond in an insightful, analytical, and human-friendly tone.`;

    return await this.generateResponse(prompt);
  }

  /**
   * Analyze sentiment from commit messages and comments
   */
  async analyzeSentiment(commentsText) {
    const prompt = `Analyze the tone of the following commit messages and comments:

${commentsText}

Return:
- Positive %
- Negative %
- Neutral %
- One-line morale summary

Format as:
Positive: X% | Neutral: Y% | Negative: Z%
[Morale summary]

Always respond in an insightful, analytical, and human-friendly tone.`;

    return await this.generateResponse(prompt);
  }

  /**
   * Identify workload bottlenecks and anomalies
   */
  async identifyBottlenecks(taskData) {
    const prompt = `You are analyzing task distribution and workload across a development team.

Task Data:
${JSON.stringify(taskData, null, 2)}

Identify:
1. Team members with excessive workload (overloaded)
2. Blocked or stalled tasks
3. Any unusual patterns or anomalies
4. Specific recommendations for workload redistribution

Provide actionable insights in 2-3 short paragraphs. Always respond in an insightful, analytical, and human-friendly tone.`;

    return await this.generateResponse(prompt);
  }

  /**
   * Generate daily performance summary
   */
  async generateDailySummary(dailyMetrics) {
    const prompt = `Generate a concise daily performance summary for a development team.

Today's Metrics:
${JSON.stringify(dailyMetrics, null, 2)}

Include:
- Tasks completed vs created
- Team velocity trend
- Top performers
- Any blockers or concerns
- One motivational insight

Keep it brief and engaging (3-4 sentences). Always respond in an insightful, analytical, and human-friendly tone.`;

    return await this.generateResponse(prompt);
  }

  /**
   * Analyze hourly performance metrics
   */
  async analyzeHourlyMetrics(hourlyData) {
    const prompt = `Analyze hourly performance metrics for a software development team.

Hourly Data (Last 24 hours):
${JSON.stringify(hourlyData, null, 2)}

Provide:
1. Peak productivity hours
2. Low activity periods
3. Task completion patterns throughout the day
4. Recommendations for optimal work scheduling

Always respond in an insightful, analytical, and human-friendly tone.`;

    return await this.generateResponse(prompt);
  }

  /**
   * Analyze team collaboration health
   */
  async analyzeCollaboration(collaborationData) {
    const prompt = `Analyze team collaboration patterns based on task assignments, comments, and interactions.

Collaboration Data:
${JSON.stringify(collaborationData, null, 2)}

Assess:
- Communication frequency and quality
- Collaboration bottlenecks
- Team dynamics (siloed vs collaborative)
- Recommendations to improve team synergy

Provide insights in 2-3 paragraphs.`;

    return await this.generateResponse(prompt);
  }
}

module.exports = new AIService();
