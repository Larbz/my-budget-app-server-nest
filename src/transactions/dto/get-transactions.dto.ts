import mongoose from 'mongoose';

export interface GetTransactionsFilters {
  userId: string;
  beforeThan?: string;
  afterThan?: string;
  lowerThan?: string;
  greaterThan?: string;
  name?: string;
  categoryId?: string;
  limit?: string;
  page?: string;
}

export const getTransactionsDto = {
  beforeThan: { type: 'string' },
  afterThan: { type: 'string' },
  lowerThan: { type: 'number' },
  greaterThan: { type: 'number' },
  name: { type: 'string' },
  categoryId: { type: 'string' },
  limit: { type: 'number' },
  page: { type: 'number' },
};
