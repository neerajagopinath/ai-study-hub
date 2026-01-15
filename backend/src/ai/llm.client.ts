import { OpenAIProvider } from "./providers/openai.provider.js";
import { GeminiProvider } from "./providers/gemini.provider.js";
import { LLMProvider, LLMError } from "./providers/llm.interface.js";

class LLMClient {
  private providers: LLMProvider[] = [];
  
  constructor() {
    this.initializeProviders();
  }
  
  private initializeProviders() {
    try {
      const openaiProvider = new OpenAIProvider();
      this.providers.push(openaiProvider);
    } catch (error) {
      console.warn("Failed to initialize OpenAI provider:", error);
    }
    
    try {
      const geminiProvider = new GeminiProvider();
      this.providers.push(geminiProvider);
    } catch (error) {
      console.warn("Failed to initialize Gemini provider:", error);
    }
    
    if (this.providers.length === 0) {
      throw new Error("No LLM providers available. Check API keys in backend/.env");
    }
  }
  
  async generateResponse(prompt: string, systemPrompt?: string): Promise<{ content: string; provider: string; model: string }> {
    console.log('🔄 LLMClient: Starting response generation...');
    console.log('📊 Available providers:', this.providers.map(p => p.name));
    console.log('📝 Prompt length:', prompt.length);
    
    const errors: LLMError[] = [];
    
    for (const provider of this.providers) {
      try {
        console.log(`🚀 Attempting to generate response using ${provider.name}...`);
        const response = await provider.generateResponse(prompt, systemPrompt);
        console.log(`✅ Successfully generated response using ${provider.name}`);
        console.log(`📝 Response length: ${response.content.length}`);
        return response;
      } catch (error: any) {
        console.error(`❌ Failed to generate response using ${provider.name}:`, error);
        errors.push(error);
        
        // Continue to next provider for retryable errors
        if (error.type === 'rate_limit' || error.type === 'timeout' || error.type === 'network') {
          console.log(`⏭️  Continuing to next provider for ${error.type} error...`);
          continue;
        }
        
        // For auth errors, don't retry other providers
        if (error.type === 'auth') {
          console.log(`🛑 Auth error with ${provider.name}, stopping retries...`);
          break;
        }
      }
    }
    
    console.error('💥 All providers failed. Errors:', errors.map(e => `${e.provider}: ${e.message}`));
    throw new Error(`All providers failed. Errors: ${errors.map(e => `${e.provider}: ${e.message}`).join(', ')}`);
  }
}

const llmClient = new LLMClient();

export async function generateStudyKit(text: string) {
  const prompt = `
  Generate a study kit in the following JSON format ONLY:
  
  {
    "summary": string,
    "keyTopics": string[],
    "flashcards": { "question": string, "answer": string }[],
    "definitions": { "term": string, "meaning": string }[]
  }
  
  Study material:
  ${text.slice(0, 12000)}
  `;
  
  const systemPrompt = "You are an academic assistant. You MUST respond with valid JSON only. Do not include markdown or extra text.";
  
  const response = await llmClient.generateResponse(prompt, systemPrompt);
  return response.content;
}

export async function generateTopicSummary(
  text: string,
  topics: string[],
  subject?: string
) {
  const prompt = `
Based on the following document content and identified topics, create a comprehensive, student-friendly summary of the main topic.

Main Topics: ${topics.join(", ")}
Subject: ${subject || "General Study"}

Document Content:
${text.slice(0, 12000)}

Generate a detailed summary that explains the main concept in a way that's easy for students to understand and prepare for exams.

REQUIREMENTS:
1. Write in a conversational, student-friendly tone (like a helpful teacher explaining concepts)
2. Use simple, clear language - avoid overly technical jargon
3. Structure with clear headings and visual elements:
   - 📚 **What is [Topic]?** (Simple definition)
   - 🎯 **Why Does It Matter?** (Real-world importance)
   - 🔑 **Key Concepts** (Main principles explained simply)
   - 💡 **Simple Examples** (Everyday analogies and clear examples)
   - 📝 **Quick Tips** (Easy-to-remember points for exams)
   - ⚠️ **Common Mistakes to Avoid** (What students often get wrong)
4. Use emojis and formatting to make it visually appealing and easier to read
5. Keep paragraphs short (2-3 sentences max)
6. Use bullet points and numbered lists for clarity
7. Include practical examples that students can relate to
8. Aim for 400-600 words to be comprehensive but not overwhelming

Return JSON in this format ONLY:
{
  "summary": "Your student-friendly, well-structured summary here with emojis and clear headings"
}
  `;
  
  const systemPrompt = "You are an expert teacher who excels at explaining complex topics to students in simple, engaging ways. Use emojis and clear formatting. You MUST respond with valid JSON only. Do not include markdown or extra text.";
  
  const response = await llmClient.generateResponse(prompt, systemPrompt);
  return JSON.parse(response.content);
}

export async function generateSpeakerNotes(
  text: string,
  options: any,
  quality: any
) {
  const prompt = `
Generate speaker notes based on this presentation.

OPTIONS:
- Mode: ${options.mode}
- Note Style: ${options.noteStyle}
- Include Viva: ${options.includeViva}
- Timing Guide: ${options.timingGuide}
- Tone: ${quality.tone}
- Output Length: ${quality.outputLength}

Return JSON in this format ONLY:

{
  "notes": string,
  "viva": string,
  "tips": string
}

Presentation content:
${text.slice(0, 12000)}
  `;
  
  const systemPrompt = "You are an expert presentation coach. Respond with JSON only.";
  
  const response = await llmClient.generateResponse(prompt, systemPrompt);
  return JSON.parse(response.content);
}
