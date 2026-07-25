import { Injectable, NotFoundException } from '@nestjs/common';
import { FinancialGoalRepository } from './financial-goal.repository';
import { CreateFinancialGoalDto, UpdateFinancialGoalDto, FinancialGoalFilterDto } from './financial-goal.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FinancialGoalService {
  constructor(private readonly repository: FinancialGoalRepository) {}

  async create(userId: string, dto: CreateFinancialGoalDto) {
    const created = await this.repository.create({ ...dto, userId });
    try {
      await this.repository.auditLog(userId, 'CREATE', created.id, null, created);
    } catch { /* audit failure is non-critical */ }
    return created;
  }

  async findAll(userId: string, filter: FinancialGoalFilterDto) {
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.FinancialGoalWhereInput = { userId };
    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } }, { notes: { contains: filter.search, mode: 'insensitive' } }
      ];
    }

    const orderBy: Prisma.FinancialGoalOrderByWithRelationInput = {};
    if (filter.sortBy) {
      orderBy[filter.sortBy] = filter.sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    return this.repository.findAll({ skip, take: limit, where, orderBy });
  }

  async findOne(id: string, userId: string) {
    const record = await this.repository.findById(id);
    if (!record || record.userId !== userId) {
      throw new NotFoundException('FinancialGoal not found');
    }
    return record;
  }

  async update(id: string, userId: string, dto: UpdateFinancialGoalDto) {
    const record = await this.findOne(id, userId);
    const updated = await this.repository.update(id, dto);
    try {
      await this.repository.auditLog(userId, 'UPDATE', id, record, updated);
    } catch { /* audit failure is non-critical */ }
    return updated;
  }

  async remove(id: string, userId: string) {
    const record = await this.findOne(id, userId);
    await this.repository.softDelete(id);
    try {
      await this.repository.auditLog(userId, 'DELETE', id, record, null);
    } catch { /* audit failure is non-critical */ }
    return { message: 'FinancialGoal deleted successfully' };
  }
}
