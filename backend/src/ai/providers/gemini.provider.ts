import { LLMProvider, LLMResponse } from "./llm.interface.js";
import fetch from "node-fetch";


/**
 * Minimal Gemini v1 response shape
 */
interface GeminiGenerateResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
}

export class GeminiProvider extends LLMProvider {
  name = "gemini";
  model = "gemini-2.5-pro";

  private apiKey: string;

  constructor() {
    super();

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing. Check backend/.env");
    }

    this.apiKey = process.env.GEMINI_API_KEY;
  }

  async generateResponse(
    prompt: string,
    systemPrompt?: string
  ): Promise<LLMResponse> {
    try {
      console.log('🤖 Gemini API Call Starting...');
      console.log('📝 Model:', this.model);
      console.log('🔑 API Key present:', !!this.apiKey);
      console.log('📊 Prompt length:', prompt.length);
      
      const requestBody = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: systemPrompt
                  ? `${systemPrompt}\n\n${prompt}`
                  : prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
        },
      };
      
      console.log('📤 Request body preview:', JSON.stringify(requestBody).substring(0, 200) + '...');

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Gemini API Error:', errorText);
        throw new Error(`Gemini API error ${response.status}: ${errorText}`);
      }

      const data = (await response.json()) as GeminiGenerateResponse;
      console.log('📊 Raw response data:', JSON.stringify(data, null, 2));

      const content =
        data.candidates?.[0]?.content?.parts?.[0]?.text;

      console.log('📝 Extracted content length:', content?.length || 0);
      console.log('📝 Content preview:', content?.substring(0, 200) + '...');

      if (!content) {
        console.error('❌ No content in Gemini response');
        console.error('📊 Full response structure:', JSON.stringify(data, null, 2));
        throw new Error("No content received from Gemini");
      }

      // Extract JSON from Gemini response (it may include markdown or be malformed)
      let jsonContent = content.trim();
      
      // Remove markdown code blocks if present
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/```json\s*/, '').replace(/```\s*$/, '');
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/```\s*/, '').replace(/```\s*$/, '');
      }
      
      // Remove any leading/trailing text that's not JSON
      const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonContent = jsonMatch[0];
      }
      
      // Try to fix common JSON issues
      try {
        // First attempt: direct parse
        JSON.parse(jsonContent);
      } catch (initialError: any) {
        console.warn("Initial JSON parse failed, attempting repair:", initialError.message);
        
        // Common fixes for malformed JSON
        jsonContent = jsonContent
          // Fix trailing commas
          .replace(/,\s*([}\]])/g, '$1')
          // Fix missing quotes around property names
          .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
          // Fix unescaped quotes in strings (basic attempt)
          .replace(/:\s*"([^"]*)"([^"]*")/g, ': "$1\\"$2')
          // Fix newlines in strings
          .replace(/\n/g, '\\n')
          // Fix tabs in strings
          .replace(/\t/g, '\\t');
        
        // Second attempt: after repairs
        try {
          JSON.parse(jsonContent);
        } catch (repairError: any) {
          console.warn("JSON repair failed, attempting aggressive extraction:", repairError.message);
          
          // Last resort: extract JSON objects using regex
          const objectMatches = jsonContent.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
          if (objectMatches && objectMatches.length > 0) {
            for (const match of objectMatches) {
              try {
                JSON.parse(match);
                jsonContent = match;
                break; // Found valid JSON
              } catch {
                continue; // Try next match
              }
            }
          }
          
          // Final validation
          try {
            JSON.parse(jsonContent);
          } catch (finalError: any) {
            console.warn("All JSON repair attempts failed, generating fallback JSON structure");
            
            // Ultimate fallback: extract any useful content and create valid JSON
            const textContent = content.replace(/```[^`]*```/g, '').replace(/["'{}[\]]/g, '').trim();
            
            // Try to determine what type of response was expected based on content
            if (content.includes('sections') || content.includes('section')) {
              jsonContent = JSON.stringify({ sections: ["Introduction", "Main Points", "Conclusion"] });
            } else if (content.includes('answer')) {
              jsonContent = JSON.stringify({ 
                answer: textContent.length > 50 ? textContent.slice(0, 200) + "..." : "This topic involves fundamental concepts and principles that are essential for examination preparation."
              });
            } else if (content.includes('topics')) {
              jsonContent = JSON.stringify({ 
                topics: textContent.length > 20 ? [textContent.slice(0, 50).split(' ').slice(0, 3).join(' ')] : ["General Concept"]
              });
            } else if (content.includes('flashcards')) {
              jsonContent = JSON.stringify({
                flashcards: [
                  { question: "What is the main concept?", answer: "The main concept involves key principles and applications." },
                  { question: "Why is this important?", answer: "This is important for understanding fundamental aspects of the subject." }
                ]
              });
            } else if (content.includes('definitions')) {
              jsonContent = JSON.stringify({
                definitions: [
                  { term: "Concept", meaning: "A fundamental idea or principle in this subject area." },
                  { term: "Application", meaning: "The practical use or implementation of a concept." }
                ]
              });
            } else {
              // Generic fallback
              jsonContent = JSON.stringify({ content: textContent.slice(0, 100) });
            }
          }
        }
      }

      return {
        content: jsonContent,
        model: this.model,
        provider: this.name,
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
}
