import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  title: string;
  amount: number;
  type: 'balance' | 'income' | 'expense';
  icon: LucideIcon;
  className?: string;
  style?: React.CSSProperties;
}

export const BalanceCard = ({ title, amount, type, icon: Icon, className, style }: BalanceCardProps) => {
  const getAmountColor = () => {
    switch (type) {
      case 'income':
        return 'text-income';
      case 'expense':
        return 'text-expense';
      case 'balance':
        return amount >= 0 ? 'text-income' : 'text-expense';
      default:
        return 'text-foreground';
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'income':
        return 'from-income/20 to-income/5';
      case 'expense':
        return 'from-expense/20 to-expense/5';
      case 'balance':
        return amount >= 0 ? 'from-income/20 to-income/5' : 'from-expense/20 to-expense/5';
      default:
        return 'from-primary/20 to-primary/5';
    }
  };

  return (
    <Card 
      className={cn(
        "glass-card p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300 cursor-pointer",
        className
      )}
      style={style}
    >
      {/* Animated Background Gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-75 transition-opacity duration-300",
        getGradient()
      )} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-3 rounded-xl bg-gradient-to-br",
            type === 'income' ? 'from-income/20 to-income/10' :
            type === 'expense' ? 'from-expense/20 to-expense/10' :
            'from-primary/20 to-primary/10'
          )}>
            <Icon className={cn(
              "w-6 h-6",
              type === 'income' ? 'text-income' :
              type === 'expense' ? 'text-expense' :
              'text-primary'
            )} />
          </div>
          <div className="w-12 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full" />
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className={cn(
            "text-3xl font-bold tracking-tight",
            getAmountColor()
          )}>
            ₹{Math.abs(amount).toLocaleString('en-IN', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </p>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    </Card>
  );
};