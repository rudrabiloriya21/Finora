import React from 'react';
import { cn } from '../../lib/utils';
import { PieChart } from 'lucide-react';

interface LogoProps {
  className?: string;
  iconClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({ className, iconClassName }) => {
  return (
    <div className={cn("flex items-center tracking-tight font-bold", className)}>
      <span>Fin</span>
      <PieChart className={cn("mx-[1px] text-accent-500", iconClassName || "w-5 h-5 -mt-0.5")} strokeWidth={2.5} />
      <span>ra</span>
    </div>
  );
};
