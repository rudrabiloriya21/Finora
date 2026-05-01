import React from 'react';
import { Menu, Plus } from 'lucide-react';
import { Logo } from '../ui/Logo';

interface HeaderProps {
  onMenuClick: () => void;
  onAddClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onAddClick }) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-[#fafafa]/80 backdrop-blur-md border-b border-primary-200/50 sm:px-6 lg:px-10">
      <button
        onClick={onMenuClick}
        className="p-2 text-primary-500 rounded-md lg:hidden hover:bg-primary-100 focus:outline-none"
      >
        <Menu className="w-5 h-5" />
      </button>
      
      <div className="flex-1 lg:hidden flex justify-center text-primary-900">
        <Logo className="text-xl" />
      </div>

      <div className="flex items-center justify-end flex-1 lg:flex-none ml-auto">
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-primary-900 rounded-full shadow-sm hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-900"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Transaction</span>
        </button>
      </div>
    </header>
  );
};
