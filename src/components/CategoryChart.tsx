import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Transaction } from "./Dashboard";

interface CategoryChartProps {
  transactions: Transaction[];
}

export const CategoryChart = ({ transactions }: CategoryChartProps) => {
  // Calculate category totals
  const categoryTotals = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
  
  const categories = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  const categoryColors = [
    'hsl(0 84% 60%)',     // Red
    'hsl(45 93% 58%)',    // Yellow
    'hsl(220 91% 60%)',   // Blue
    'hsl(280 91% 60%)',   // Purple
    'hsl(180 91% 60%)',   // Cyan
    'hsl(120 91% 60%)',   // Light Green
  ];

  return (
    <div className="space-y-4">
      {categories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No expense categories yet</p>
        </div>
      ) : (
        categories.map((item, index) => (
          <div
            key={item.category}
            className="space-y-2 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
                />
                <span className="text-sm font-medium">{item.category}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-expense">
                  ₹{item.amount.toLocaleString('en-IN', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="relative">
              <Progress 
                value={item.percentage} 
                className="h-2 bg-muted/50"
              />
              <div 
                className="absolute top-0 left-0 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${item.percentage}%`,
                  backgroundColor: categoryColors[index % categoryColors.length],
                  animationDelay: `${index * 0.2}s`
                }}
              />
            </div>
          </div>
        ))
      )}
      
      {categories.length > 0 && (
        <div className="pt-4 mt-4 border-t border-border/50">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total Expenses:</span>
            <span className="font-bold text-expense">
              ₹{totalExpenses.toLocaleString('en-IN', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};