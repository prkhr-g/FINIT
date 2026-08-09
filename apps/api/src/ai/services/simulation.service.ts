import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PromptBuilderService } from './prompt-builder.service';
import { GeminiProvider } from '../providers/gemini.provider';
import { ScoreService } from '../../score/score.service';
import { SimulationRepository } from '../repositories/simulation.repository';
import { AuditLogRepository } from '../repositories/audit-log.repository';
import { getErrorMessage, getErrorStack } from '../utils/error.util';

export interface SimulationAIResponse {
  impact: string;
  summary: string;
  advantages: string[];
  disadvantages: string[];
  recommendation: string;
}

@Injectable()
export class SimulationService {
  private readonly logger = new Logger(SimulationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly promptBuilder: PromptBuilderService,
    private readonly gemini: GeminiProvider,
    private readonly scoreService: ScoreService,
    private readonly simulationRepo: SimulationRepository,
    private readonly auditLog: AuditLogRepository,
  ) {}

  async generateSimulation(userId: string, scenarioData: any) {
    const start = Date.now();
    try {
      this.logger.log(`Simulation for user ${userId} — Scenario: ${scenarioData.scenarioType}`);

      const currentData = await this.fetchFinancialData(userId);

      const totalIncome = currentData.incomes.reduce((sum, i) => sum + Number(i.amount), 0);
      const totalExpense = currentData.expenses.reduce((sum, e) => sum + Number(e.amount), 0);

      if (totalIncome === 0 && totalExpense === 0) {
        throw new HttpException('Insufficient financial data to simulate', HttpStatus.BAD_REQUEST);
      }

      const clonedData = this.cloneAndApplyScenario(currentData, scenarioData);

      const currentTotals = this.summarize(currentData);
      const newTotals = this.summarize(clonedData);

      const oldScore = this.scoreService.calculate(currentData).score;
      const newScore = this.scoreService.calculate(clonedData).score;

      const changesString = this.buildChangesString(currentTotals, newTotals);
      const prompt = this.promptBuilder.buildSimulationPrompt({ oldScore, newScore, changes: changesString });
      const aiResponse = await this.callAI(prompt);

      await this.prisma.$transaction(async (tx) => {
        await tx.aISimulation.create({
          data: {
            userId,
            scenarioType: scenarioData.scenarioType,
            oldScore,
            newScore,
            scenario: scenarioData,
            summary: aiResponse.summary,
            impact: aiResponse.impact,
          },
        });
        await tx.aIAuditLog.create({
          data: {
            userId,
            action: 'SIMULATION',
            provider: 'gemini',
            status: 'SUCCESS',
            responseTime: (Date.now() - start) / 1000,
            tokenUsage: 0,
          },
        });
      });

      return {
        currentScore: oldScore,
        predictedScore: newScore,
        impact: aiResponse.impact,
        summary: aiResponse.summary,
        advantages: aiResponse.advantages,
        disadvantages: aiResponse.disadvantages,
        recommendation: aiResponse.recommendation,
      };
    } catch (error) {
      await this.auditLog.log({ userId, action: 'SIMULATION', provider: 'gemini', status: 'FAILURE', responseTime: (Date.now() - start) / 1000, tokenUsage: 0 }).catch(() => {});
      this.logger.error(`Simulation failed for ${userId}: ${getErrorMessage(error)}`, getErrorStack(error));
      if (error instanceof HttpException) throw error;
      throw new HttpException('Simulation Service Unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  private async fetchFinancialData(userId: string) {
    const [incomes, expenses, loans, assets, investments, insurances, retirement, goals, accounts] =
      await Promise.all([
        this.prisma.income.findMany({ where: { userId } }),
        this.prisma.expense.findMany({ where: { userId } }),
        this.prisma.loan.findMany({ where: { userId, status: 'ACTIVE' } }),
        this.prisma.asset.findMany({ where: { userId } }),
        this.prisma.investment.findMany({ where: { userId } }),
        this.prisma.insurance.findMany({ where: { userId } }),
        this.prisma.retirement.findUnique({ where: { userId } }),
        this.prisma.financialGoal.findMany({ where: { userId } }),
        this.prisma.financialAccount.findMany({ where: { userId } }),
      ]);

    return { incomes, expenses, loans, assets, investments, insurances, retirement, goals, accounts };
  }

  private cloneAndApplyScenario(current: any, scenario: any) {
    const temp = JSON.parse(JSON.stringify(current));

    if (scenario.salaryIncrease > 0) {
      temp.incomes.push({ amount: scenario.salaryIncrease, category: 'OTHER' });
    }

    if (scenario.expenseReduction > 0) {
      temp.expenses.push({ amount: -scenario.expenseReduction });
    }

    if (scenario.investmentIncrease > 0) {
      temp.investments.push({ currentPrice: scenario.investmentIncrease });
    }

    if (scenario.loanPrepayment > 0 && temp.loans.length > 0) {
      let remainingPrepayment = scenario.loanPrepayment;
      for (const loan of temp.loans) {
        if (remainingPrepayment <= 0) break;
        const currentBalance = Number(loan.remainingBalance);
        const payoff = Math.min(currentBalance, remainingPrepayment);
        const ratio = currentBalance > 0 ? (currentBalance - payoff) / currentBalance : 0;
        loan.remainingBalance = Math.max(0, currentBalance - payoff);
        loan.emiAmount = Number(loan.emiAmount) * ratio;
        remainingPrepayment -= payoff;
      }
    }

    return temp;
  }

  private summarize(data: any) {
    return {
      income: data.incomes.reduce((sum, i) => sum + Number(i.amount), 0),
      expense: data.expenses.reduce((sum, e) => sum + Number(e.amount), 0),
      investment: data.investments.reduce((sum, i) => sum + Number(i.currentPrice), 0),
      loan: data.loans.reduce((sum, l) => sum + Number(l.remainingBalance), 0),
    };
  }

  private buildChangesString(current: any, clone: any) {
    const changes: string[] = [];
    const currentSavings = current.income - current.expense;
    const newSavings = clone.income - clone.expense;

    if (current.income !== clone.income) changes.push(`Monthly Income: ₹${current.income} → ₹${clone.income}`);
    if (current.expense !== clone.expense) changes.push(`Monthly Expense: ₹${current.expense} → ₹${clone.expense}`);
    if (current.investment !== clone.investment) changes.push(`Investment Corpus: ₹${current.investment} → ₹${clone.investment}`);
    if (current.loan !== clone.loan) changes.push(`Total Loan Debt: ₹${current.loan} → ₹${clone.loan}`);
    if (currentSavings !== newSavings) changes.push(`Monthly Savings: ₹${currentSavings} → ₹${newSavings}`);
    return changes.join('\n');
  }

  private async callAI(prompt: string, retries = 3): Promise<SimulationAIResponse> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await this.gemini.generateJSON<SimulationAIResponse>(prompt);
        if (this.validateSimulation(response)) return response;
      } catch (error) {
        this.logger.warn(`AI Simulation attempt ${attempt} failed: ${getErrorMessage(error)}`);
        if (attempt === retries) {
          return { impact: 'Neutral', summary: 'Score calculated, AI analysis unavailable.', advantages: ['Score projected mathematically.'], disadvantages: ['AI analysis unavailable.'], recommendation: 'Review score changes manually.' };
        }
      }
    }
    throw new Error('AI response failed');
  }

  private validateSimulation(r: any): r is SimulationAIResponse {
    return !!(r?.impact && r?.summary && Array.isArray(r?.advantages) && Array.isArray(r?.disadvantages) && r?.recommendation);
  }

  async getSimulationHistory(userId: string, page = 1, limit = 10) {
    return this.simulationRepo.history(userId, page, limit);
  }
}
