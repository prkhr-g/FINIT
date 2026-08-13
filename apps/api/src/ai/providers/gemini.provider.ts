import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { AIProvider } from '../interfaces/ai-provider.interface';
import { OpenAiProvider } from './openai.provider';

// Retry delay helper with exponential backoff
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

@Injectable()
export class GeminiProvider implements AIProvider, OnModuleInit {
  private readonly logger = new Logger(GeminiProvider.name);

  private client: GoogleGenAI;
  private model = 'gemini-2.0-flash';
  private fallbackModel = 'gemini-1.5-flash';
  private readonly maxRetries = 3;

  constructor(
    private readonly config: ConfigService,
    private readonly openai: OpenAiProvider,
  ) {}

  onModuleInit() {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY is not set. AI features will be unavailable.');
      return;
    }
    this.model = this.config.get<string>('GEMINI_MODEL') || this.model;
    this.fallbackModel = this.config.get<string>('GEMINI_FALLBACK_MODEL') || this.fallbackModel;
    this.client = new GoogleGenAI({ apiKey });
    this.logger.log(`GeminiProvider initialized (primary: ${this.model}, fallback: ${this.fallbackModel})`);
  }

  private ensureClient() {
    if (!this.client) {
      throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env file.');
    }
  }

  /**
   * Generate a plain text response.
   * Chain: primary Gemini model -> fallback Gemini model -> OpenAI -> throw.
   */
  async generate(prompt: string): Promise<string> {
    this.ensureClient();

    try {
      return await this.withRetry(() => this.callGenerate(this.model, prompt), this.model);
    } catch (primaryError) {
      this.logger.warn(`Primary model (${this.model}) exhausted, switching to fallback model (${this.fallbackModel})`);
      try {
        return await this.withRetry(() => this.callGenerate(this.fallbackModel, prompt), this.fallbackModel);
      } catch (fallbackError) {
        this.logger.warn('Gemini fallback model also exhausted, switching to OpenAI');
        try {
          return await this.openai.generate(prompt);
        } catch (openaiError) {
          this.logger.error('All providers (Gemini primary, Gemini fallback, OpenAI) failed.');
          throw openaiError;
        }
      }
    }
  }

  /**
   * Generate a structured JSON response.
   * Same 3-tier fallback chain as generate().
   */
  async generateJSON<T>(prompt: string): Promise<T> {
    this.ensureClient();

    try {
      return await this.withRetry(() => this.callGenerateJSON<T>(this.model, prompt), this.model);
    } catch (primaryError) {
      this.logger.warn(`Primary model (${this.model}) exhausted, switching to fallback model (${this.fallbackModel})`);
      try {
        return await this.withRetry(() => this.callGenerateJSON<T>(this.fallbackModel, prompt), this.fallbackModel);
      } catch (fallbackError) {
        this.logger.warn('Gemini fallback model also exhausted, switching to OpenAI');
        try {
          return await this.openai.generateJSON<T>(prompt);
        } catch (openaiError) {
          this.logger.error('All providers (Gemini primary, Gemini fallback, OpenAI) failed.');
          throw openaiError;
        }
      }
    }
  }

  private async callGenerate(model: string, prompt: string): Promise<string> {
    const response = await this.client.models.generateContent({ model, contents: prompt });
    const text = response.text ?? '';
    if (!text) throw new Error('Gemini returned empty text response');
    return text;
  }

  private async callGenerateJSON<T>(model: string, prompt: string): Promise<T> {
    const response = await this.client.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });
    const raw = response.text ?? '';
    if (!raw) throw new Error('Gemini returned empty JSON response');
    const cleaned = this.stripMarkdown(raw);
    return JSON.parse(cleaned) as T;
  }

  /**
   * Retry wrapper with exponential backoff (per model).
   */
  private async withRetry<T>(fn: () => Promise<T>, modelLabel: string): Promise<T> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const start = Date.now();
        const result = await fn();
        this.logger.log(`Gemini (${modelLabel}) response received (attempt ${attempt}, ${Date.now() - start}ms)`);
        return result;
      } catch (error) {
        lastError = error;
        this.logger.warn(`Gemini (${modelLabel}) attempt ${attempt}/${this.maxRetries} failed: ${error instanceof Error ? error.message : String(error)}`);
        if (attempt < this.maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          await sleep(delay);
        }
      }
    }
    throw lastError;
  }

  private stripMarkdown(raw: string): string {
    return raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
  }
}
