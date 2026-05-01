import React, { useState } from 'react';
import { useBudget } from '../../context/BudgetContext';
import { Trash2, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

export const Transactions: React.FC = () => {
  const { transactions, deleteTransaction } = useBudget();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.note.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-primary-900">Transactions</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-9 pr-4 text-sm bg-white border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/10 focus:border-primary-900"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="py-2 pl-3 pr-8 text-sm bg-white border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/10 focus:border-primary-900"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden bg-white border border-primary-200/60 shadow-sm rounded-2xl">
        {filteredTransactions.length > 0 ? (
          <ul className="divide-y divide-primary-100">
            {filteredTransactions.map((transaction) => {
              const isIncome = transaction.type === 'income';
              const Icon = isIncome ? ArrowUpRight : ArrowDownRight;

              return (
                <li key={transaction.id} className="flex items-center justify-between p-4 transition-colors hover:bg-primary-50/50 flex-wrap gap-4 sm:gap-2">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-xl shrink-0",
                      isIncome ? "bg-accent-50 text-accent-600" : "bg-rose-50 text-rose-600"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-primary-900">{transaction.category}</p>
                      <div className="flex items-center gap-2 text-sm text-primary-500">
                        <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
                        {transaction.note && (
                          <>
                            <span>·</span>
                            <span className="truncate max-w-[150px] sm:max-w-[300px]">{transaction.note}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-auto sm:ml-0">
                    <span className={cn(
                      "font-semibold tracking-tight",
                      isIncome ? "text-primary-900" : "text-primary-900"
                    )}>
                      {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="p-2 text-primary-400 transition-colors rounded-lg hover:text-rose-600 hover:bg-rose-50"
                      title="Delete transaction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-12 text-center text-primary-500 text-sm">
            No transactions found.
          </div>
        )}
      </div>
    </div>
  );
};
