import React, { createContext, useContext, useEffect, useState } from 'react';
import { Transaction, BudgetGoal } from '../types';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

interface BudgetContextType {
  transactions: Transaction[];
  goals: BudgetGoal[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addGoal: (goal: Omit<BudgetGoal, 'id'>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<BudgetGoal[]>([]);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setGoals([]);
      return;
    }

    const transactionsRef = collection(db, 'users', user.uid, 'transactions');
    const q = query(transactionsRef, orderBy('date', 'desc'));
    
    const unsubscribeTransactions = onSnapshot(q, (snapshot) => {
      const transData: Transaction[] = [];
      snapshot.forEach((doc) => {
        transData.push({ id: doc.id, ...doc.data() } as Transaction);
      });
      setTransactions(transData);
    }, (error) => {
      console.error("Error fetching transactions:", error);
    });

    const goalsRef = collection(db, 'users', user.uid, 'goals');
    const unsubscribeGoals = onSnapshot(goalsRef, (snapshot) => {
      const goalsData: BudgetGoal[] = [];
      snapshot.forEach((doc) => {
        goalsData.push({ id: doc.id, ...doc.data() } as BudgetGoal);
      });
      setGoals(goalsData);
    }, (error) => {
        console.error("Error fetching goals:", error);
    });

    return () => {
      unsubscribeTransactions();
      unsubscribeGoals();
    };
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;
    const newDocRef = doc(collection(db, 'users', user.uid, 'transactions'));
    await setDoc(newDocRef, transaction);
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));
  };

  const addGoal = async (goal: Omit<BudgetGoal, 'id'>) => {
    if (!user) return;
    const newDocRef = doc(collection(db, 'users', user.uid, 'goals'));
    await setDoc(newDocRef, goal);
  };

  const deleteGoal = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'goals', id));
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <BudgetContext.Provider value={{
      transactions,
      goals,
      addTransaction,
      deleteTransaction,
      addGoal,
      deleteGoal,
      balance,
      totalIncome,
      totalExpense
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
