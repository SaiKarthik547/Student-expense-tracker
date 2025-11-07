import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BalanceCard } from "./BalanceCard";
import { TransactionList } from "./TransactionList";
import { CategoryChart } from "./CategoryChart";
import { AddTransactionModal } from "./AddTransactionModal";
import { DemoAccountSelector } from "./DemoAccountSelector";
import { getDemoTransactions } from "@/utils/demoData";
import { TransactionService } from "@/services/TransactionService";
import { Plus, TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
  date: Date;
}

export const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch real transactions from Supabase
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // If no user, load demo data
        const defaultProfile = 'cs';
        const demoTransactions = getDemoTransactions(defaultProfile);
        setTransactions(demoTransactions);
        setLoading(false);
        return;
      }

      // Fetch real transactions from Supabase with category information
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories!transactions_category_id_fkey(name)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      // Transform data to match expected format
      const transformedData = (data || []).map(item => ({
        id: item.id,
        amount: item.amount,
        category: item.categories?.name || 'Uncategorized',
        description: item.description,
        type: item.type as 'income' | 'expense',
        date: new Date(item.date)
      }));

      setTransactions(transformedData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Fallback to demo data on error
      const defaultProfile = 'cs';
      const demoTransactions = getDemoTransactions(defaultProfile);
      setTransactions(demoTransactions);
      toast.error("Error loading transactions, showing demo data instead");
    } finally {
      setLoading(false);
    }
  };

  // Command Pattern: Execute demo data loading command
  const loadDemoData = (userType: 'cs' | 'medical' | 'engineering') => {
    try {
      const demoTransactions = getDemoTransactions(userType); // Factory Pattern
      setTransactions(demoTransactions); // State Management Pattern
      setShowDemoAccounts(false);
      
      // Observer Pattern: Notify about successful data load
      console.log(`Demo data loaded for ${userType} profile`);
    } catch (error) {
      console.error('Error loading demo data:', error);
    }
  };

  // Service Pattern: Use centralized business logic
  const totalIncome = TransactionService.calculateTotalIncome(transactions);
  const totalExpenses = TransactionService.calculateTotalExpenses(transactions);
  const balance = TransactionService.calculateBalance(transactions);
  const stats = TransactionService.getTransactionStats(transactions);

  // Strategy Pattern: Add transaction with validation and proper construction
  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    try {
      // Template Method Pattern: Validate before processing
      const validation = TransactionService.validateTransaction(transactionData);
      
      if (!validation.isValid) {
        console.error('Transaction validation failed:', validation.errors);
        return;
      }
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // For demo purposes, just add to local state
        const newTransaction = TransactionService.createTransaction(transactionData);
        setTransactions(prev => [newTransaction, ...prev]);
        return;
      }

      // First, check if category exists or create it
      let categoryId = null;
      
      // Look for existing category
      const { data: existingCategory, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', transactionData.category)
        .eq('user_id', user.id)
        .single();

      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        // Create new category
        const { data: newCategory, error: createError } = await supabase
          .from('categories')
          .insert({
            name: transactionData.category,
            type: transactionData.type,
            user_id: user.id
          })
          .select()
          .single();

        if (newCategory) {
          categoryId = newCategory.id;
        }
      }

      // Save to Supabase with category_id
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: transactionData.amount,
          description: transactionData.description,
          category_id: categoryId,
          type: transactionData.type,
          date: transactionData.date.toISOString().split('T')[0]
        });

      if (error) throw error;

      // Refresh transactions
      fetchTransactions();
      
      console.log('Transaction added successfully');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error("Error adding transaction");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded-xl"></div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              💰 Student Finance Tracker
            </h1>
            <p className="text-muted-foreground mt-1">Manage your student finances simply</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              variant="outline"
              className="simple-hover"
            >
              <Users className="w-4 h-4 mr-2" />
              Demo Accounts
            </Button>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90 simple-hover"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>
      </div>

      {/* Demo Accounts Panel */}
      {showDemoAccounts && (
        <div className="mb-8 animate-slide-in">
          <DemoAccountSelector 
            onSelectDemo={loadDemoData}
            onClose={() => setShowDemoAccounts(false)}
          />
        </div>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <BalanceCard
          title="Total Balance"
          amount={balance}
          type="balance"
          icon={DollarSign}
          className="simple-shadow simple-hover"
        />
        <BalanceCard
          title="Total Income"
          amount={totalIncome}
          type="income"
          icon={TrendingUp}
          className="simple-shadow simple-hover"
        />
        <BalanceCard
          title="Total Expenses"
          amount={totalExpenses}
          type="expense"
          icon={TrendingDown}
          className="simple-shadow simple-hover"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions */}
        <div className="lg:col-span-2">
          <Card className="simple-shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Recent Transactions</h2>
              <Badge variant="secondary" className="px-3 py-1">
                {transactions.length} transactions
              </Badge>
            </div>
            <TransactionList transactions={transactions} />
          </Card>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-6">
          <Card className="simple-shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Spending Categories</h2>
            <CategoryChart transactions={transactions} />
          </Card>

          {/* Quick Stats */}
          <Card className="simple-shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg. Transaction</span>
                <span className="font-medium">
                  {TransactionService.formatCurrency(stats.averageExpense)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Largest Expense</span>
                <span className="font-medium text-expense">
                  {TransactionService.formatCurrency(stats.largestExpense)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Largest Income</span>
                <span className="font-medium text-income">
                  {TransactionService.formatCurrency(stats.largestIncome)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Categories</span>
                <span className="font-medium text-primary">
                  {stats.categoryCount}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTransaction}
      />
    </div>
  );
};