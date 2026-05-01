import React from 'react';
import { LayoutDashboard, Receipt, Target, PlusCircle, LogOut, User, BarChart2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../ui/Logo';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'goals', label: 'Budget Goals', icon: Target },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileOpen(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 flex flex-col",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-center p-6 shrink-0">
          <Logo className="text-2xl text-primary-900" iconClassName="w-6 h-6 -mt-1 text-accent-600" />
        </div>
        <nav className="px-4 space-y-1 text-sm font-medium flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsMobileOpen(false);
                }}
                className={cn(
                  "flex items-center w-full gap-3 px-3 py-2.5 rounded-lg transition-all",
                  isActive
                    ? "bg-primary-900 text-white shadow-sm"
                    : "text-primary-500 hover:bg-primary-50 hover:text-primary-900"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-primary-100" : "text-primary-400")} />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 shrink-0">
          <div className="bg-white border border-primary-100 rounded-xl p-3 shadow-xs">
            <div className="flex items-center gap-3 mb-3 overflow-hidden">
              <div className="bg-primary-50 text-primary-600 p-2 rounded-full shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="truncate text-left flex-1">
                <p className="text-sm font-semibold text-primary-900 truncate">{user?.name}</p>
                <p className="text-xs text-primary-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center justify-center w-full gap-2 px-3 py-2 border text-xs font-medium text-primary-600 transition-colors bg-white border-primary-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:bg-primary-50 hover:text-rose-600"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
