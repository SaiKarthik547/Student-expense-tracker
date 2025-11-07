import { supabase } from "@/integrations/supabase/client";

export const comprehensiveTest = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("No user logged in");
      return { success: false, error: "Not logged in" };
    }

    console.log("Running comprehensive test for user:", user.id);

    // Step 1: Ensure we have a test category
    let categoryId = null;
    
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('name', 'Comprehensive Test')
      .eq('user_id', user.id)
      .single();

    if (existingCategory) {
      categoryId = existingCategory.id;
    } else {
      const { data: newCategory } = await supabase
        .from('categories')
        .insert({
          name: 'Comprehensive Test',
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
      return { success: false, error: "Failed to create or find category" };
    }

    // Step 2: Insert a test transaction with today's date
    const today = new Date().toISOString().split('T')[0];
    console.log("Inserting test transaction with date:", today);

    const { error: insertError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        amount: 250.75,
        description: 'Comprehensive test transaction',
        category_id: categoryId,
        type: 'expense',
        date: today
      });

    if (insertError) {
      console.error("Error inserting transaction:", insertError);
      return { success: false, error: insertError.message };
    }

    console.log("Test transaction inserted successfully");

    // Step 3: Verify the transaction appears in queries
    // First, try to fetch all transactions
    const { data: allTransactions, error: allError } = await supabase
      .from('transactions')
      .select(`
        *,
        categories!transactions_category_id_fkey(name)
      `)
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (allError) {
      console.error("Error fetching all transactions:", allError);
      return { success: false, error: allError.message };
    }

    console.log("Total transactions after insert:", allTransactions?.length);
    
    // Check if our test transaction is in the list
    const testTransaction = allTransactions?.find(t => 
      t.description === 'Comprehensive test transaction' && 
      t.amount === 250.75
    );
    
    if (testTransaction) {
      console.log("Test transaction found in all transactions:", testTransaction);
    } else {
      console.log("Test transaction NOT found in all transactions");
      console.log("Sample transactions:", allTransactions?.slice(0, 3));
    }

    // Step 4: Test date filtering
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoString = thirtyDaysAgo.toISOString().split('T')[0];
    
    console.log("Testing date filter with date:", thirtyDaysAgoString);

    const { data: filteredTransactions, error: filterError } = await supabase
      .from('transactions')
      .select(`
        *,
        categories!transactions_category_id_fkey(name)
      `)
      .eq('user_id', user.id)
      .gte('date', thirtyDaysAgoString)
      .order('date', { ascending: false });

    if (filterError) {
      console.error("Error filtering transactions:", filterError);
      return { success: false, error: filterError.message };
    }

    console.log("Filtered transactions count:", filteredTransactions?.length);
    
    // Check if our test transaction is in the filtered list
    const filteredTestTransaction = filteredTransactions?.find(t => 
      t.description === 'Comprehensive test transaction' && 
      t.amount === 250.75
    );
    
    if (filteredTestTransaction) {
      console.log("Test transaction found in filtered transactions:", filteredTestTransaction);
    } else {
      console.log("Test transaction NOT found in filtered transactions");
      console.log("Sample filtered transactions:", filteredTransactions?.slice(0, 3));
    }

    // Step 5: Test "all time" query
    const { data: allTimeTransactions, error: allTimeError } = await supabase
      .from('transactions')
      .select(`
        *,
        categories!transactions_category_id_fkey(name)
      `)
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (allTimeError) {
      console.error("Error fetching all time transactions:", allTimeError);
      return { success: false, error: allTimeError.message };
    }

    console.log("All time transactions count:", allTimeTransactions?.length);
    
    // Check if our test transaction is in the all time list
    const allTimeTestTransaction = allTimeTransactions?.find(t => 
      t.description === 'Comprehensive test transaction' && 
      t.amount === 250.75
    );
    
    if (allTimeTestTransaction) {
      console.log("Test transaction found in all time transactions:", allTimeTestTransaction);
    } else {
      console.log("Test transaction NOT found in all time transactions");
      console.log("Sample all time transactions:", allTimeTransactions?.slice(0, 3));
    }

    return { 
      success: true, 
      error: null,
      details: {
        totalTransactions: allTransactions?.length,
        testTransactionFound: !!testTransaction,
        filteredTransactionFound: !!filteredTestTransaction,
        allTimeTransactionFound: !!allTimeTestTransaction
      }
    };
  } catch (error: any) {
    console.error("Comprehensive test error:", error);
    return { success: false, error: error.message };
  }
};