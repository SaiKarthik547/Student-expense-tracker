import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { debugTransactions } from "@/lib/debugTransactions";
import { testTransactionInsert } from "@/lib/testTransactionInsert";
import { verifyDateFormats } from "@/lib/verifyDateFormats";
import { comprehensiveTest } from "@/lib/comprehensiveTest";

export default function TestTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const fetchAllTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Not logged in");
        return;
      }

      console.log("Fetching all transactions for user:", user.id);

      // Fetch all transactions without any filters
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories!transactions_category_id_fkey(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log("All transactions:", data);
      setTransactions(data || []);
      
      if (data && data.length > 0) {
        toast.success(`Found ${data.length} transactions in database`);
      } else {
        toast.info("No transactions found in database");
      }
    } catch (error: any) {
      toast.error("Error fetching transactions: " + error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTestTransaction = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Not logged in");
        return;
      }

      // First, ensure we have a category
      let categoryId = null;
      
      // Look for existing "Test" category
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('name', 'Test')
        .eq('user_id', user.id)
        .single();

      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        // Create new "Test" category
        const { data: newCategory } = await supabase
          .from('categories')
          .insert({
            name: 'Test',
            type: 'expense',
            user_id: user.id
          })
          .select()
          .single();

        if (newCategory) {
          categoryId = newCategory.id;
        }
      }

      if (!categoryId) {
        toast.error("Failed to create or find category");
        return;
      }

      // Insert test transaction with today's date
      const today = new Date().toISOString().split('T')[0];
      console.log("Inserting transaction with date:", today);

      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: 100.50,
          description: 'Test transaction',
          category_id: categoryId,
          type: 'expense',
          date: today
        });

      if (error) throw error;
      
      toast.success("Test transaction added successfully!");
      fetchAllTransactions(); // Refresh the list
    } catch (error: any) {
      toast.error("Error adding test transaction: " + error.message);
      console.error("Error:", error);
    }
  };

  const runDebug = async () => {
    toast.info("Running debug...");
    await debugTransactions();
    fetchAllTransactions(); // Refresh the list
  };

  const runInsertTest = async () => {
    toast.info("Running transaction insert test...");
    const result = await testTransactionInsert();
    if (result.success) {
      toast.success("Transaction insert test passed!");
    } else {
      toast.error("Transaction insert test failed: " + result.error);
    }
    fetchAllTransactions(); // Refresh the list
  };

  const runDateVerification = async () => {
    toast.info("Verifying date formats...");
    await verifyDateFormats();
    toast.success("Date format verification complete. Check console for details.");
  };

  const runComprehensiveTest = async () => {
    toast.info("Running comprehensive test...");
    const result = await comprehensiveTest();
    if (result.success) {
      toast.success("Comprehensive test passed!");
      console.log("Test details:", result.details);
    } else {
      toast.error("Comprehensive test failed: " + result.error);
    }
    fetchAllTransactions(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="p-6 md:ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="h-32 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:ml-64">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Transaction Test Page
            </h1>
            <p className="text-muted-foreground mt-1">
              Debugging transactions in the database
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={runComprehensiveTest}
              variant="outline"
              className="border-primary/20 hover:border-primary/50 hover:bg-primary/10"
            >
              Comprehensive Test
            </Button>
            <Button 
              onClick={runDateVerification}
              variant="outline"
              className="border-primary/20 hover:border-primary/50 hover:bg-primary/10"
            >
              Verify Dates
            </Button>
            <Button 
              onClick={runInsertTest}
              variant="outline"
              className="border-primary/20 hover:border-primary/50 hover:bg-primary/10"
            >
              Test Insert
            </Button>
            <Button 
              onClick={runDebug}
              variant="outline"
              className="border-primary/20 hover:border-primary/50 hover:bg-primary/10"
            >
              Run Debug
            </Button>
            <Button 
              onClick={addTestTransaction}
              className="bg-gradient-to-r from-primary to-accent"
            >
              Add Test Transaction
            </Button>
          </div>
        </div>

        <Card className="glass-card p-6">
          <h2 className="text-2xl font-semibold mb-4">Database Transactions ({transactions.length})</h2>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No transactions found in database</p>
              <p className="text-muted-foreground text-sm mt-2">Click "Add Test Transaction" to create one</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{transaction.description}</h3>
                      <p className="text-sm text-muted-foreground">
                        {transaction.date} | {transaction.categories?.name || 'No Category'} | {transaction.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-income' : 'text-expense'}`}>
                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: {transaction.id}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}