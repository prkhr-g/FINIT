import { Injectable, NotFoundException } from '@nestjs/common';
import { InsuranceRepository } from './insurance.repository';
import { CreateInsuranceDto, UpdateInsuranceDto, InsuranceFilterDto } from './insurance.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InsuranceService {
  constructor(private readonly repository: InsuranceRepository) {}

  async create(userId: string, dto: CreateInsuranceDto) {
    const created = await this.repository.create({ ...dto, userId });
    try {
      await this.repository.auditLog(userId, 'CREATE', created.id, null, created);
    } catch { /* audit failure is non-critical */ }
    return created;
  }

  async findAll(userId: string, filter: InsuranceFilterDto) {
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.InsuranceWhereInput = { userId };
    if (filter.search) {
      where.OR = [
        { provider: { contains: filter.search, mode: 'insensitive' } }, { policyNumber: { contains: filter.search, mode: 'insensitive' } }, { notes: { contains: filter.search, mode: 'insensitive' } }
      ];
    }

    const orderBy: Prisma.InsuranceOrderByWithRelationInput = {};
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
      throw new NotFoundException('Insurance not found');
    }
    return record;
  }

  async update(id: string, userId: string, dto: UpdateInsuranceDto) {
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
    return { message: 'Insurance deleted successfully' };
  }
}
