import { supabase } from "@/integrations/supabase/client";

export const debugTransactions = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("No user logged in");
      return;
    }

    console.log("Debugging transactions for user:", user.id);

    // Fetch all transactions without any filters
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select(`
        *,
        categories!transactions_category_id_fkey(name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (transactionsError) {
      console.error("Error fetching transactions:", transactionsError);
      return;
    }

    console.log("Found", transactions?.length, "transactions");
    console.log("Transactions:", transactions);

    // Check if we have any categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id);

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
      return;
    }

    console.log("Found", categories?.length, "categories");
    console.log("Categories:", categories);

    // Try to add a test transaction
    if (categories && categories.length > 0) {
      const testCategory = categories[0];
      console.log("Using category:", testCategory);

      const testTransaction = {
        user_id: user.id,
        amount: 500.75,
        description: "Debug test transaction",
        category_id: testCategory.id,
        type: "expense",
        date: new Date().toISOString().split('T')[0]
      };

      console.log("Inserting test transaction:", testTransaction);

      const { data: insertedTransaction, error: insertError } = await supabase
        .from('transactions')
        .insert(testTransaction)
        .select();

      if (insertError) {
        console.error("Error inserting transaction:", insertError);
      } else {
        console.log("Successfully inserted transaction:", insertedTransaction);
      }
    } else {
      console.log("No categories found, creating a test category");

      const { data: newCategory, error: categoryError } = await supabase
        .from('categories')
        .insert({
          name: "Debug Test",
          type: "expense",
          user_id: user.id
        })
        .select();

      if (categoryError) {
        console.error("Error creating category:", categoryError);
      } else if (newCategory && newCategory.length > 0) {
        console.log("Created category:", newCategory[0]);

        const testTransaction = {
          user_id: user.id,
          amount: 500.75,
          description: "Debug test transaction",
          category_id: newCategory[0].id,
          type: "expense",
          date: new Date().toISOString().split('T')[0]
        };

        console.log("Inserting test transaction:", testTransaction);

        const { data: insertedTransaction, error: insertError } = await supabase
          .from('transactions')
          .insert(testTransaction)
          .select();

        if (insertError) {
          console.error("Error inserting transaction:", insertError);
        } else {
          console.log("Successfully inserted transaction:", insertedTransaction);
        }
      }
    }
  } catch (error) {
    console.error("Debug error:", error);
  }
};