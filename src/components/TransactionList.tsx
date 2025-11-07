import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react";
import { Transaction } from "./Dashboard";

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No transactions yet</p>
        </div>
      ) : (
        transactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-card/50 to-card/30 border border-border/50 hover:border-primary/30 transition-all duration-300 group hover:scale-[1.02] animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center space-x-4">
              {/* Transaction Icon */}
              <div className={cn(
                "p-2 rounded-lg transition-all duration-300 group-hover:scale-110",
                transaction.type === 'income' 
                  ? "bg-income/20 group-hover:bg-income/30" 
                  : "bg-expense/20 group-hover:bg-expense/30"
              )}>
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="w-4 h-4 text-income" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-expense" />
                )}
              </div>

              {/* Transaction Details */}
              <div className="space-y-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                  {transaction.description}
                </p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(transaction.date)}</span>
                  <Badge variant="outline" className="text-xs">
                    {transaction.category}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="text-right">
              <p className={cn(
                "text-lg font-bold transition-all duration-300 group-hover:scale-110",
                transaction.type === 'income' ? "text-income" : "text-expense"
              )}>
                {transaction.type === 'income' ? '+' : '-'}₹
                {transaction.amount.toLocaleString('en-IN', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};