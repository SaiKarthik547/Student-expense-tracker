import { supabase } from "@/integrations/supabase/client";

export const testTransactionInsert = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("No user logged in");
      return { success: false, error: "Not logged in" };
    }

    console.log("Testing transaction insert for user:", user.id);

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
      return { success: false, error: "Failed to create or find category" };
    }

    // Test different date formats
    const testDates = [
      new Date().toISOString().split('T')[0], // YYYY-MM-DD
      "2023-12-25", // YYYY-MM-DD
      "25/12/2023"  // DD/MM/YYYY (will be converted)
    ];

    for (const testDate of testDates) {
      console.log("Testing with date:", testDate);
      
      // Format date for database insertion
      let formattedDate = testDate;
      if (testDate.includes('/')) {
        // Convert DD/MM/YYYY to YYYY-MM-DD
        const parts = testDate.split('/');
        if (parts.length === 3) {
          formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
      
      console.log("Formatted date for DB:", formattedDate);

      // Insert test transaction
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: 100.50,
          description: `Test transaction with date ${testDate}`,
          category_id: categoryId,
          type: 'expense',
          date: formattedDate
        });

      if (error) {
        console.error("Error inserting transaction with date", testDate, ":", error);
        return { success: false, error: error.message };
      } else {
        console.log("Successfully inserted transaction with date", testDate);
      }
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Test error:", error);
    return { success: false, error: error.message };
  }
};