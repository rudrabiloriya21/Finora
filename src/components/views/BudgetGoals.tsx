import React, { useState } from 'react';
import { useBudget } from '../../context/BudgetContext';
import { Target, Plus, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const BudgetGoals: React.FC = () => {
  const { goals, addGoal, deleteGoal, transactions } = useBudget();
  const [isAdding, setIsAdding] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) return;

    await addGoal({
      category,
      amount: parseFloat(amount),
    });

    setCategory('');
    setAmount('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-primary-900">Budget Goals <span className="font-normal text-primary-400 text-lg ml-1">(Monthly)</span></h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-primary-900 rounded-full hover:bg-primary-800 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="p-6 bg-white border border-primary-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl">
          <h3 className="mb-4 text-lg font-medium text-primary-900">New Budget Goal</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-primary-700">Category</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Groceries"
                className="w-full px-4 py-2 bg-primary-50/50 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-900/10 focus:border-primary-900 max-w-sm"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-primary-700">Monthly Limit ($)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2 bg-primary-50/50 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-900/10 focus:border-primary-900 max-w-sm"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="px-4 py-2.5 text-sm font-medium text-white bg-primary-900 rounded-xl hover:bg-primary-800 shadow-sm"
            >
              Save Goal
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2.5 text-sm font-medium text-primary-700 bg-primary-50 rounded-xl hover:bg-primary-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map(goal => {
          const spent = transactions
            .filter(t => t.type === 'expense' && t.category.toLowerCase() === goal.category.toLowerCase())
            .reduce((sum, t) => sum + t.amount, 0);
          const progress = Math.min(100, Math.max(0, (spent / goal.amount) * 100));
          const isOverBudget = progress > 100;
          
          return (
            <div key={goal.id} className="relative p-6 bg-white border border-primary-200/60 shadow-sm rounded-2xl group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
              <button
                onClick={() => deleteGoal(goal.id)}
                className="absolute p-2 text-primary-400 transition-opacity opacity-0 top-2 right-2 hover:text-rose-600 group-hover:opacity-100 bg-primary-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 text-accent-600 bg-accent-50 rounded-lg">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-semibold tracking-tight text-primary-900">{goal.category}</h3>
              </div>
              
              <div className="mb-3">
                <div className="flex items-end justify-between font-medium">
                  <span className={cn("text-3xl tracking-tight leading-none", isOverBudget ? "text-rose-600" : "text-primary-900")}>
                    ${spent.toFixed(0)}
                  </span>
                  <span className="text-primary-400 mb-0.5">/ ${goal.amount}</span>
                </div>
              </div>
              
              <div className="h-2 overflow-hidden bg-primary-100 rounded-full">
                 <div 
                   className={cn(
                     "h-full rounded-full transition-all duration-500", 
                     progress > 90 ? "bg-rose-500" : progress > 70 ? "bg-amber-500" : "bg-accent-500"
                   )}
                   style={{ width: `${Math.min(100, progress)}%` }}
                 />
              </div>
              {isOverBudget && (
                <p className="mt-3 text-sm font-medium text-rose-600 bg-rose-50 p-2 rounded-lg inline-block">Over budget by ${(spent - goal.amount).toFixed(2)}</p>
              )}
            </div>
          );
        })}
        {goals.length === 0 && !isAdding && (
          <div className="p-12 text-center text-primary-500 border-2 border-dashed border-primary-200 rounded-[2rem] md:col-span-2 lg:col-span-3">
             <Target className="w-10 h-10 mx-auto mb-4 text-primary-300" strokeWidth={1.5} />
             <p className="text-lg font-medium text-primary-900">No budget goals yet</p>
             <p className="mt-1 text-primary-500">Add a goal to start tracking your spending limit per category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
