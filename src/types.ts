export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // ISO 8601 YYYY-MM-DD
  note: string;
}

export interface BudgetGoal {
  id: string;
  category: string;
  amount: number;
}
