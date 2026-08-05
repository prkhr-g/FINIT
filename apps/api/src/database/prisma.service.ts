import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    // Limit connections to avoid Supabase free-tier pool exhaustion
    super({
      datasources: {
        db: {
          url: (process.env.DATABASE_URL ?? '') + (process.env.DATABASE_URL?.includes('?') ? '&' : '?') + 'connection_limit=3',
        },
      },
    });
  }

  async onModuleInit() {
    const maxRetries = 5;
    for (let i = 1; i <= maxRetries; i++) {
      try {
        await this.$connect();
        this.logger.log('Database connected successfully');
        return;
      } catch (err: any) {
        this.logger.warn(`DB connect attempt ${i}/${maxRetries} failed: ${err?.message}`);
        if (i === maxRetries) throw err;
        await new Promise((r) => setTimeout(r, 3000 * i));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
