import api from './api';

export interface ScoreFactor {
  pillar: string;
  weight: number;
  score: number;
  remarks?: string;
}

export interface ScoreHistory {
  id: string;
  score: number;
  grade: string;
  risk: string;
  calculatedAt: string;
  factors: ScoreFactor[];
}

export interface ScoreResult {
  id: string;
  score: number;
  grade: string;
  risk: string;
  calculatedAt: string;
  factors: ScoreFactor[];
  recommendations?: string[];
}

export const scoreService = {
  // GET /score — latest score
  getCurrent: (): Promise<ScoreResult> => api.get('/score'),

  // POST /score/calculate — calculate and save new score
  calculate: (): Promise<ScoreResult> => api.post('/score/calculate'),

  // POST /score/recalculate — force recalculate
  recalculate: (): Promise<ScoreResult> => api.post('/score/recalculate'),

  // GET /score/history — all past scores
  getHistory: (): Promise<ScoreHistory[]> => api.get('/score/history'),
};