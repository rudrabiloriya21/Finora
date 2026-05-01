import React, { useMemo } from 'react';
import { useBudget } from '../../context/BudgetContext';
import { BarChart2, TrendingUp, TrendingDown, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const Analytics: React.FC = () => {
  const { transactions } = useBudget();

  const analyticsData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Calculate previous month
    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear -= 1;
    }

    const currentMonthExpenses = transactions.filter(t => {
      const d = new Date(t.date);
      return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const prevMonthExpenses = transactions.filter(t => {
      const d = new Date(t.date);
      return t.type === 'expense' && d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    });

    const totalCurrent = currentMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
    const totalPrev = prevMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
    
    const percentageChange = totalPrev === 0 
      ? (totalCurrent > 0 ? 100 : 0) 
      : ((totalCurrent - totalPrev) / totalPrev) * 100;

    // Category Growth/Decline
    const catCurrent = currentMonthExpenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const catPrev = prevMonthExpenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const allCategories = Array.from(new Set([...Object.keys(catCurrent), ...Object.keys(catPrev)]));
    const categoryComparison = allCategories.map(cat => {
      const curr = catCurrent[cat] || 0;
      const prev = catPrev[cat] || 0;
      const diff = curr - prev;
      const pct = prev === 0 ? (curr > 0 ? 100 : 0) : (diff / prev) * 100;
      return { category: cat, current: curr, prev: prev, change: pct, diff };
    }).sort((a, b) => b.diff - a.diff); // sort by largest raw increase

    // Spending Heatmap (Day of Week)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayTotals = new Array(7).fill(0);
    
    // We'll analyze the last 90 days for a better heatmap/day-of-week average
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const recentExpenses = transactions.filter(t => t.type === 'expense' && new Date(t.date) >= ninetyDaysAgo);
    recentExpenses.forEach(t => {
      const dayIndex = new Date(t.date).getDay();
      dayTotals[dayIndex] += t.amount;
    });

    const heatmapData = days.map((day, ix) => ({
      name: day,
      amount: dayTotals[ix]
    }));

    return {
      totalCurrent,
      totalPrev,
      percentageChange,
      categoryComparison,
      heatmapData
    };
  }, [transactions]);

  if (transactions.filter(t => t.type === 'expense').length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-primary-50 border border-primary-100 p-6 rounded-[2rem] shadow-sm mb-6">
          <BarChart2 className="w-10 h-10 text-primary-900" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-primary-900 mb-2">Not enough data</h2>
        <p className="text-primary-500 max-w-md">
          Add some expenses to see deep analytics, month-over-month comparisons, and your spending heatmap.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-2xl font-bold tracking-tight text-primary-900">Deep Analytics</h2>
      </div>

      {/* Month vs Month Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white border border-primary-200/60 rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
          <p className="text-sm font-medium text-primary-500 mb-4">Month vs Last Month</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-4xl tracking-tight leading-none font-bold text-primary-900">${analyticsData.totalCurrent.toFixed(0)}</p>
              <p className="text-sm text-primary-400 mt-2 font-medium">This month entirely</p>
            </div>
            <div className={cn(
              "flex items-center gap-1 font-semibold px-2.5 py-1.5 rounded-lg text-sm transition-colors",
              analyticsData.percentageChange > 0 ? "text-rose-700 bg-rose-50 border border-rose-100" : "text-emerald-700 bg-emerald-50 border border-emerald-100",
              analyticsData.percentageChange === 0 && "text-primary-600 bg-primary-100 border border-primary-200"
            )}>
              {analyticsData.percentageChange > 0 ? <TrendingUp className="w-4 h-4" /> : analyticsData.percentageChange < 0 ? <TrendingDown className="w-4 h-4" /> : null}
              {Math.abs(analyticsData.percentageChange).toFixed(1)}%
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-primary-100 flex items-center justify-between text-sm text-primary-500 font-medium">
            <span>Last month: ${analyticsData.totalPrev.toFixed(0)}</span>
          </div>
        </div>

        {/* Heatmap summary */}
        <div className="p-6 bg-white border border-primary-200/60 rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all sm:col-span-1 lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-accent-600" />
            <h3 className="font-semibold tracking-tight text-primary-900">Spending by Day <span className="font-normal text-primary-400 ml-1">(Last 90 Days)</span></h3>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.heatmapData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(val) => `$${val}`} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {analyticsData.heatmapData.map((entry, index) => {
                    // Highlight the highest spending day
                    const isMax = entry.amount === Math.max(...analyticsData.heatmapData.map(d => d.amount));
                    return <Cell key={`cell-${index}`} fill={isMax ? '#334155' : '#94a3b8'} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white border border-primary-200/60 shadow-sm rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
        <div className="p-6 border-b border-primary-100">
          <h3 className="text-lg font-semibold tracking-tight text-primary-900">Category Changes <span className="font-normal text-primary-400 text-base ml-1">(MoM)</span></h3>
          <p className="text-sm text-primary-500 mt-1">See where your money is going compared to last month.</p>
        </div>
        <div className="divide-y divide-primary-100">
          {analyticsData.categoryComparison.length > 0 ? (
            analyticsData.categoryComparison.map((cat, ix) => (
              <div key={ix} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-primary-50/50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-semibold text-primary-900">{cat.category}</h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm font-medium">
                    <span className="text-primary-500">Current: <span className="text-primary-900">${cat.current.toFixed(0)}</span></span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary-300" />
                    <span className="text-primary-500">Previous: <span className="text-primary-900">${cat.prev.toFixed(0)}</span></span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 justify-end shrink-0">
                  <div className={cn(
                    "px-3 py-1.5 rounded-xl font-semibold text-sm flex items-center gap-1.5 transition-colors border",
                    cat.change > 0 ? "bg-rose-50 text-rose-700 border-rose-100" : cat.change < 0 ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-primary-50 text-primary-700 border-primary-200"
                  )}>
                    {cat.change > 0 ? <TrendingUp className="w-4 h-4" /> : cat.change < 0 ? <TrendingDown className="w-4 h-4" /> : null}
                    {Math.abs(cat.change).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-primary-500 font-medium">No category data to compare yet.</div>
          )}
        </div>
      </div>

    </div>
  );
};
