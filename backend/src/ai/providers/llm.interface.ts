export interface LLMResponse {
  content: string;
  model: string;
  provider: string;
}

export interface LLMError {
  message: string;
  code?: string;
  type: 'rate_limit' | 'timeout' | 'network' | 'auth' | 'unknown';
  provider?: string;
}

export abstract class LLMProvider {
  abstract name: string;
  abstract model: string;
  
  abstract generateResponse(prompt: string, systemPrompt?: string): Promise<LLMResponse>;
  
  protected handleError(error: any): LLMError {
    const baseError = {
      message: error.message || 'Unknown error',
      code: error.code
    };

    if (error.status === 429) {
      return {
        ...baseError,
        type: 'rate_limit',
        provider: this.name
      };
    }
    
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      return {
        ...baseError,
        type: 'network',
        provider: this.name
      };
    }
    
    if (error.type === 'timeout') {
      return {
        ...baseError,
        type: 'timeout',
        provider: this.name
      };
    }
    
    if (error.status === 401 || error.status === 403) {
      return {
        ...baseError,
        type: 'auth',
        provider: this.name
      };
    }
    
    return {
      ...baseError,
      type: 'unknown',
      provider: this.name
    };
  }
}
