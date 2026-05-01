import React, { useMemo } from 'react';
import { useBudget } from '../../context/BudgetContext';
import { ArrowDownRight, ArrowUpRight, Wallet, Target, Sparkles, TrendingDown, PlusCircle, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#1e3a8a', '#14b8a6', '#c084fc', '#22d3ee', '#f43f5e', '#f59e0b'];

export const Dashboard: React.FC = () => {
  const { balance, totalIncome, totalExpense, transactions, goals } = useBudget();
  const { user } = useAuth();

  const predictions = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysPassed = Math.max(1, now.getDate());
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    const currentMonthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });

    const currentMonthExpenses = currentMonthTransactions.filter(t => t.type === 'expense');
    const totalCurrentMonthExpense = currentMonthExpenses.reduce((sum, t) => sum + t.amount, 0);

    const projectedTotalExpense = (totalCurrentMonthExpense / daysPassed) * totalDays;
    const projectedRemainingExpense = Math.max(0, projectedTotalExpense - totalCurrentMonthExpense);
    
    const projectedEndOfMonthBalance = balance - projectedRemainingExpense;
    
    const categoryTotals = currentMonthExpenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    const projectedCategories = Object.entries(categoryTotals).map(([category, amount]) => {
      return {
        category,
        projectedAmount: (amount / daysPassed) * totalDays,
      };
    }).sort((a, b) => b.projectedAmount - a.projectedAmount);

    return {
      projectedTotalExpense,
      projectedEndOfMonthBalance,
      topProjectedCategory: projectedCategories[0] || null
    };
  }, [transactions, balance]);

  const expensesByCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const expensesByDate = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const dateTotals = expenses.reduce((acc, curr) => {
      acc[curr.date] = (acc[curr.date] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dateTotals)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // last 7 days with expenses
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-primary-50 border border-primary-100 p-6 rounded-[2rem] shadow-sm mb-6">
          <Wallet className="w-10 h-10 text-primary-900" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-primary-900 mb-3">Welcome to Finora, {user?.name}!</h2>
        <p className="text-primary-500 max-w-md mb-10 leading-relaxed">
          You don't have any transactions yet. Add your first income or expense to start gaining smart predictive insights into your financial health.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 opacity-40 pointer-events-none mt-8 w-full max-w-4xl mix-blend-luminosity">
          <div className="bg-white p-6 border border-primary-200/60 rounded-2xl">
            <div className="h-5 bg-primary-100 rounded mb-4 w-1/2"></div>
            <div className="h-8 bg-primary-200 rounded w-3/4"></div>
          </div>
          <div className="bg-white p-6 border border-primary-200/60 rounded-2xl">
            <div className="h-5 bg-primary-100 rounded mb-4 w-1/2"></div>
            <div className="h-8 bg-primary-200 rounded w-3/4"></div>
          </div>
          <div className="bg-white p-6 border border-primary-200/60 rounded-2xl sm:col-span-2 lg:col-span-1">
            <div className="h-5 bg-primary-100 rounded mb-4 w-1/2"></div>
            <div className="h-8 bg-primary-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-primary-900">Overview</h2>
        <p className="text-sm text-primary-500">Your financial snapshot for this month</p>
      </div>

      {balance < 0 && (
        <div className="bg-rose-50 border border-rose-200/50 p-4 rounded-xl flex items-start gap-4">
          <div className="p-2 bg-rose-100/50 rounded-lg text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-rose-800 font-medium font-medium">Debt Alert</h3>
            <p className="text-rose-600/80 text-sm mt-0.5">
              Your current balance is negative ({balance < 0 ? '-' : ''}${Math.abs(balance).toFixed(2)}). Consider reviewing your upcoming expenses.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white border border-primary-200/60 rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
          <div className="flex flex-col gap-4">
            <div className="p-2.5 bg-primary-50 rounded-xl text-primary-800 w-fit">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary-500 mb-1">Current Balance</p>
              <h3 className={cn("text-3xl font-bold tracking-tight", balance < 0 ? "text-rose-600" : "text-primary-900")}>
                {balance < 0 ? '-' : ''}${Math.abs(balance).toFixed(2)}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-primary-200/60 rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
          <div className="flex flex-col gap-4">
            <div className="p-2.5 bg-accent-50 rounded-xl text-accent-600 w-fit">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary-500 mb-1">Total Income</p>
              <h3 className="text-3xl font-bold tracking-tight text-primary-900">${totalIncome.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-primary-200/60 rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all sm:col-span-2 lg:col-span-1">
          <div className="flex flex-col gap-4">
            <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600 w-fit">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary-500 mb-1">Total Expenses</p>
              <h3 className="text-3xl font-bold tracking-tight text-primary-900">${totalExpense.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      {predictions.projectedTotalExpense > 0 && (
        <div className="px-6 py-8 bg-primary-950 rounded-3xl shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 opacity-20 pointer-events-none">
             <div className="w-96 h-96 bg-accent-500 rounded-full blur-[100px] mix-blend-screen" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                <Sparkles className="w-6 h-6 text-accent-200" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-wide">Predictive Insights</h3>
                <p className="text-primary-300 text-sm font-medium">Based on your spending pace this month</p>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1">
                <p className="text-primary-300 text-sm font-medium mb-1">Forecasted EOM Expense</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold tracking-tight">${predictions.projectedTotalExpense.toFixed(0)}</span>
                </div>
              </div>

              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1">
                <p className="text-primary-300 text-sm font-medium mb-1">Forecasted EOM Balance</p>
                <div className="flex items-end gap-2">
                  <span className={cn("text-3xl font-bold tracking-tight", predictions.projectedEndOfMonthBalance < 0 && "text-rose-400")}>
                    {predictions.projectedEndOfMonthBalance < 0 ? '-' : ''}${Math.abs(predictions.projectedEndOfMonthBalance).toFixed(0)}
                  </span>
                </div>
              </div>

              {predictions.topProjectedCategory && (
                 <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1 md:col-span-2 lg:col-span-1 flex flex-col justify-center">
                   <p className="text-primary-300 text-sm font-medium mb-1">Top Spend Projection</p>
                   <p className="text-[15px] font-medium leading-snug mt-1 text-primary-100">
                     At this rate, you'll spend <span className="font-bold text-accent-300 tracking-wide">${predictions.topProjectedCategory.projectedAmount.toFixed(0)}</span> on <span className="font-bold text-white">{predictions.topProjectedCategory.category}</span>.
                   </p>
                 </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white border border-primary-200/60 rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
          <h3 className="mb-4 font-semibold tracking-tight text-primary-900">Expenses by Category</h3>
          <div className="h-72">
            {expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-primary-400 text-sm">No expenses yet</div>
            )}
          </div>
        </div>

        <div className="p-6 bg-white border border-primary-200/60 rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
          <h3 className="mb-4 font-semibold tracking-tight text-primary-900">Recent Expense Trend</h3>
          <div className="h-72">
             {expensesByDate.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={expensesByDate}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                   <XAxis dataKey="date" tickFormatter={(tick) => {
                      const date = new Date(tick);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                   }} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                   <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                   <RechartsTooltip cursor={{ fill: '#f1f5f9' }} formatter={(value: number) => `$${value.toFixed(2)}`} labelFormatter={(label) => new Date(label).toLocaleDateString()} />
                   <Bar dataKey="amount" fill="#334155" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             ) : (
               <div className="flex items-center justify-center h-full text-primary-400 text-sm">No recent expenses</div>
             )}
          </div>
        </div>
      </div>
      
      {goals.length > 0 && (
         <div className="p-6 bg-white border border-primary-200/60 rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
          <h3 className="flex items-center gap-2 mb-6 font-semibold tracking-tight text-primary-900">
            <Target className="w-5 h-5 text-accent-600" /> Goal Progress (Monthly)
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {goals.map(goal => {
               // Calculate spent this month for category
               const spent = transactions
                 .filter(t => t.type === 'expense' && t.category.toLowerCase() === goal.category.toLowerCase())
                 .reduce((sum, t) => sum + t.amount, 0);
               const progress = Math.min(100, Math.max(0, (spent / goal.amount) * 100));
               
               return (
                 <div key={goal.id} className="p-4 border border-primary-100 rounded-xl bg-primary-50">
                    <div className="flex items-center justify-between mb-2">
                       <span className="font-medium text-primary-800">{goal.category}</span>
                       <span className="text-xs font-medium text-primary-500">${spent.toFixed(0)} / ${goal.amount}</span>
                    </div>
                    <div className="h-2 overflow-hidden bg-primary-200 rounded-full">
                       <div 
                         className={cn("h-full rounded-full transition-all duration-500", progress > 90 ? "bg-rose-500" : progress > 70 ? "bg-amber-500" : "bg-accent-500")}
                         style={{ width: `${progress}%` }}
                       />
                    </div>
                 </div>
               )
             })}
          </div>
         </div>
      )}
    </div>
  );
};
