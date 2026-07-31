import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AIProvider } from '../interfaces/ai-provider.interface';

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

@Injectable()
export class OpenAiProvider implements AIProvider, OnModuleInit {
  private readonly logger = new Logger(OpenAiProvider.name);
  private client: OpenAI;
  private readonly model = 'gpt-4o-mini';
  private readonly maxRetries = 3;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      this.logger.warn('OPENAI_API_KEY is not set. OpenAI fallback will be unavailable.');
      return;
    }
    this.client = new OpenAI({ apiKey });
    this.logger.log(`OpenAiProvider initialized (model: ${this.model})`);
  }

  private ensureClient() {
    if (!this.client) {
      throw new Error('OPENAI_API_KEY is not configured. Please add it to your .env file.');
    }
  }

  async generate(prompt: string): Promise<string> {
    this.ensureClient();
    return this.withRetry(async () => {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
      });
      const text = response.choices[0]?.message?.content ?? '';
      if (!text) throw new Error('OpenAI returned empty text response');
      return text;
    });
  }

  async generateJSON<T>(prompt: string): Promise<T> {
    this.ensureClient();
    return this.withRetry(async () => {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });
      const raw = response.choices[0]?.message?.content ?? '';
      if (!raw) throw new Error('OpenAI returned empty JSON response');
      const cleaned = this.stripMarkdown(raw);
      return JSON.parse(cleaned) as T;
    });
  }

  private async withRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const start = Date.now();
        const result = await fn();
        this.logger.log(`OpenAI response received (attempt ${attempt}, ${Date.now() - start}ms)`);
        return result;
      } catch (error) {
        lastError = error;
        this.logger.warn(`OpenAI attempt ${attempt}/${this.maxRetries} failed: ${error instanceof Error ? error.message : String(error)}`);
        if (attempt < this.maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          this.logger.log(`Retrying in ${delay}ms...`);
          await sleep(delay);
        }
      }
    }
    this.logger.error(`OpenAI failed after ${this.maxRetries} attempts: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
    throw lastError;
  }

  private stripMarkdown(raw: string): string {
    return raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
  }
}
