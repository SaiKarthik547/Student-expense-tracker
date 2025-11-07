import { supabase } from "@/integrations/supabase/client";

export const verifyDateFormats = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("No user logged in");
      return;
    }

    console.log("Verifying date formats for user:", user.id);

    // Fetch all transactions to check date formats
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .limit(20);

    if (error) {
      console.error("Error fetching transactions:", error);
      return;
    }

    console.log("Total transactions found:", transactions?.length);
    console.log("Sample transactions:", transactions);

    if (!transactions || transactions.length === 0) {
      console.log("No transactions found for user");
      return;
    }

    // Check date formats
    const dateFormats: Record<string, number> = {};
    const invalidDates: any[] = [];
    
    transactions.forEach(transaction => {
      const dateStr = transaction.date;
      if (dateStr) {
        // Check if it matches YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          dateFormats['YYYY-MM-DD'] = (dateFormats['YYYY-MM-DD'] || 0) + 1;
        } 
        // Check if it matches DD/MM/YYYY format
        else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
          dateFormats['DD/MM/YYYY'] = (dateFormats['DD/MM/YYYY'] || 0) + 1;
        }
        // Other formats
        else {
          const format = dateStr.length > 20 ? dateStr.substring(0, 20) + '...' : dateStr;
          dateFormats[format] = (dateFormats[format] || 0) + 1;
        }
        
        // Try to parse the date
        try {
          const parsed = new Date(dateStr);
          if (isNaN(parsed.getTime())) {
            invalidDates.push({ id: transaction.id, date: dateStr });
          }
        } catch (e) {
          invalidDates.push({ id: transaction.id, date: dateStr });
        }
      }
    });

    console.log("Date format distribution:", dateFormats);
    console.log("Invalid dates:", invalidDates);
    
    // Try to parse a few dates
    console.log("Date parsing examples:");
    transactions.slice(0, 5).forEach(transaction => {
      const dateStr = transaction.date;
      console.log(`  ${dateStr}:`, new Date(dateStr));
    });
    
    // Test date comparison
    const testDate = new Date();
    testDate.setDate(testDate.getDate() - 30);
    const testDateString = testDate.toISOString().split('T')[0];
    console.log("Test date for comparison (30 days ago):", testDateString);
    
    // Try to filter transactions by date
    const { data: filteredTransactions, error: filterError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', testDateString)
      .limit(5);
      
    if (filterError) {
      console.error("Error filtering by date:", filterError);
    } else {
      console.log("Transactions from last 30 days:", filteredTransactions?.length);
      console.log("Sample filtered transactions:", filteredTransactions);
    }
  } catch (error) {
    console.error("Verification error:", error);
  }
};