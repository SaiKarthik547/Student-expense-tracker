import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, TrendingUp, TrendingDown, PieChart, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
  created_at: string;
  date: string;
}

export default function Analytics() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    fetchTransactions();
  }, [timeRange]);

  const fetchTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log("Fetching transactions for user:", user.id);

      // Fetch all transactions first to debug
      const { data: allData, error: allError } = await supabase
        .from('transactions')
        .select(`
          *,
          categories!transactions_category_id_fkey(name)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (allError) {
        console.error("Error fetching all transactions:", allError);
      } else {
        console.log("All transactions count:", allData?.length);
        if (allData && allData.length > 0) {
          console.log("Sample transaction dates:", allData.slice(0, 3).map(t => t.date));
        }
      }

      let query = supabase
        .from('transactions')
        .select(`
          *,
          categories!transactions_category_id_fkey(name)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      // Only apply date filter if not "all"
      if (timeRange !== "all") {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));
        const dateString = daysAgo.toISOString().split('T')[0];
        console.log("Applying date filter:", dateString);
        
        // Use a more robust date comparison
        query = query.gte('date', dateString);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      console.log("Filtered transactions count:", data?.length);
      console.log("Filtered transactions:", data);
      
      // Transform data to match expected format
      const transformedData = (data || []).map(item => ({
        id: item.id,
        amount: item.amount,
        category: item.categories?.name || 'Uncategorized',
        description: item.description,
        type: item.type as 'income' | 'expense',
        created_at: item.created_at,
        date: item.date
      }));
      
      console.log("Transformed data:", transformedData);
      
      setTransactions(transformedData);
    } catch (error: any) {
      toast.error("Error fetching transactions: " + error.message);
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  console.log("Transaction calculations:", { totalIncome, totalExpenses, balance, transactionCount: transactions.length });

  const categoryTotals = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  console.log("Top categories:", topCategories);

  // Calculate average daily spending correctly
  const calculateAverageDailySpending = () => {
    if (transactions.length === 0) return 0;
    
    if (timeRange === "all") {
      // For "all time", calculate based on actual date range
      const dates = transactions.map(t => new Date(t.date));
      if (dates.length === 0) return 0;
      
      const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
      const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
      const daysDiff = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
      
      return totalExpenses / daysDiff;
    } else {
      // For specific time ranges
      const days = parseInt(timeRange);
      return totalExpenses / days;
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:ml-64 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Detailed insights into your spending patterns
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={async () => {
                // Debug: Fetch all transactions without filters
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                
                const { data, error } = await supabase
                  .from('transactions')
                  .select(`
                    *,
                    categories!transactions_category_id_fkey(name)
                  `)
                  .eq('user_id', user.id)
                  .order('date', { ascending: false });
                  
                console.log("Debug - All transactions:", data);
                console.log("Debug - Error:", error);
                
                if (data) {
                  toast.info(`Found ${data.length} total transactions`);
                }
              }}
              variant="outline" 
              size="sm"
              className="border-primary/20 hover:border-primary/50 hover:bg-primary/10"
            >
              Debug
            </Button>
            <Button 
              onClick={fetchTransactions} 
              variant="outline" 
              size="sm"
              className="border-primary/20 hover:border-primary/50 hover:bg-primary/10"
            >
              Refresh Data
            </Button>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 glass-card border-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-primary/20">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Empty State */}
        {transactions.length === 0 && (
          <Card className="glass-card p-12 text-center animate-scale-in">
            <div className="max-w-md mx-auto space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">No Transaction Data</h2>
              <p className="text-muted-foreground">
                You don't have any transactions in the selected time period. Start tracking your expenses to see detailed analytics here.
              </p>
              <div className="pt-4">
                <Button onClick={() => window.location.href = '/'} className="bg-gradient-to-r from-primary to-accent">
                  Add Your First Transaction
                </Button>
              </div>
            </div>
          </Card>
        )}

        {transactions.length > 0 && (
          <>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card p-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Balance</p>
                <p className={`text-3xl font-bold ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
                  ₹{Math.abs(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-primary/20">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Income</p>
                <p className="text-3xl font-bold text-income">
                  ₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-income/20">
                <TrendingUp className="w-6 h-6 text-income" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Expenses</p>
                <p className="text-3xl font-bold text-expense">
                  ₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-expense/20">
                <TrendingDown className="w-6 h-6 text-expense" />
              </div>
            </div>
          </Card>
        </div>

        {/* Top Categories */}
        <Card className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <PieChart className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Top Spending Categories</h2>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {timeRange === "all" ? "All Time" : `Last ${timeRange} days`}
            </Badge>
          </div>

          {topCategories.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No expense data available</p>
              <p className="text-muted-foreground text-sm">Add some transactions to see analytics</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topCategories.map((item, index) => {
                const percentage = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;
                return (
                  <div key={item.category} className="space-y-2 animate-slide-up" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.category}</span>
                      <div className="text-right">
                        <span className="font-bold text-expense">
                          ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-muted-foreground text-sm ml-2">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${percentage}%`,
                          animationDelay: `${0.6 + index * 0.1}s`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <h3 className="text-xl font-semibold mb-4">Spending Insights</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Daily Spending</span>
                 <span className="font-medium">
                   ₹{calculateAverageDailySpending().toFixed(2)}
                 </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Largest Single Expense</span>
                <span className="font-medium text-expense">
                  ₹{Math.max(...transactions.filter(t => t.type === 'expense').map(t => t.amount), 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Transactions</span>
                <span className="font-medium">{transactions.length}</span>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <h3 className="text-xl font-semibold mb-4">Income Sources</h3>
            <div className="space-y-4">
              {transactions.filter(t => t.type === 'income').length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No income recorded</p>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Number of Income Sources</span>
                    <span className="font-medium">
                      {new Set(transactions.filter(t => t.type === 'income').map(t => t.category)).size}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Largest Income</span>
                    <span className="font-medium text-income">
                      ₹{Math.max(...transactions.filter(t => t.type === 'income').map(t => t.amount), 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Income vs Expenses</span>
                    <span className={`font-medium ${totalIncome >= totalExpenses ? 'text-income' : 'text-expense'}`}>
                      {totalIncome >= totalExpenses ? '+' : '-'}₹{Math.abs(balance).toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
        </>
        )}
      </div>
    </div>
  );
}