import OpenAI from "openai";
import { LLMProvider, LLMResponse, LLMError } from "./llm.interface.js";

export class OpenAIProvider extends LLMProvider {
  name = "openai";
  model = "gpt-4o-mini";
  
  private client: OpenAI;
  
  constructor() {
    super();
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is missing. Check backend/.env");
    }
    
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  
  async generateResponse(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    try {
      const messages: any[] = [];
      
      if (systemPrompt) {
        messages.push({
          role: "system",
          content: systemPrompt
        });
      }
      
      messages.push({
        role: "user",
        content: prompt
      });
      
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 4000
      });
      
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No content received from OpenAI");
      }
      
      return {
        content,
        model: this.model,
        provider: this.name
      };
      
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
}
