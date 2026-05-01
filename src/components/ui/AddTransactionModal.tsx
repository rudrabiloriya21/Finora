import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction } = useBudget();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) return;

    await addTransaction({
      type,
      amount: parseFloat(amount),
      category,
      date,
      note
    });
    
    // Reset form
    setAmount('');
    setCategory('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/40 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl border border-primary-100/50">
        <div className="flex items-center justify-between p-6 border-b border-primary-100">
          <h2 className="text-xl font-bold text-primary-900 tracking-tight">Add Transaction</h2>
          <button onClick={onClose} className="p-2 text-primary-400 transition-colors rounded-full hover:bg-primary-50 hover:text-primary-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex p-1 bg-primary-50 rounded-xl border border-primary-100/50">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={cn(
                "flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all",
                type === 'expense' ? "bg-white text-primary-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-primary-200/50" : "text-primary-500 hover:text-primary-700"
              )}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={cn(
                "flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all",
                type === 'income' ? "bg-white text-primary-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-primary-200/50" : "text-primary-500 hover:text-primary-700"
              )}
            >
              Income
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-primary-700">Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-primary-400 font-medium">$</span>
                </div>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 text-lg font-medium border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-900/10 focus:border-primary-900 placeholder:text-primary-300 placeholder:font-normal bg-primary-50/30"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-primary-700">Category</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-900/10 focus:border-primary-900 bg-primary-50/30 placeholder:text-primary-300"
                placeholder={type === 'expense' ? 'e.g. Groceries, Rent' : 'e.g. Salary, Freelance'}
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-primary-700">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-900/10 focus:border-primary-900 bg-primary-50/30 text-primary-800"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-primary-700">Note <span className="text-primary-400 font-normal">(Optional)</span></label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-900/10 focus:border-primary-900 bg-primary-50/30 placeholder:text-primary-300"
                placeholder="Brief description..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-2 font-medium tracking-wide text-white transition-all bg-primary-900 rounded-xl hover:bg-primary-800 focus:ring-2 focus:ring-offset-2 focus:ring-primary-900 shadow-sm"
          >
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
};
