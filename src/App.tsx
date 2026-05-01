/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BudgetProvider } from './context/BudgetContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/views/Dashboard';
import { Transactions } from './components/views/Transactions';
import { BudgetGoals } from './components/views/BudgetGoals';
import { Analytics } from './components/views/Analytics';
import { AddTransactionModal } from './components/ui/AddTransactionModal';
import { Login } from './components/views/Login';
import { AnimatePresence, motion } from 'motion/react';

function AppContent() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'transactions':
        return <Transactions />;
      case 'goals':
        return <BudgetGoals />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafa] text-primary-900 font-sans">
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={setCurrentTab}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />
      
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onAddClick={() => setIsAddModalOpen(true)}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <AddTransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BudgetProvider>
        <AppContent />
      </BudgetProvider>
    </AuthProvider>
  );
}
