import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, AlertCircle, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ImportedTransaction {
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'success' | 'error' | 'warning';
  error?: string;
}

export default function Import() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importedData, setImportedData] = useState<ImportedTransaction[]>([]);
  const [importSummary, setImportSummary] = useState<{
    total: number;
    success: number;
    errors: number;
    warnings: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setImportedData([]);
    setImportSummary(null);

    try {
      // Simulate file processing
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error("CSV file must have a header row and at least one data row");
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredHeaders = ['date', 'description', 'amount', 'category', 'type'];
      
      const missingHeaders = requiredHeaders.filter(header => 
        !headers.some(h => h.includes(header))
      );

      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      // Process data rows
      const processedData: ImportedTransaction[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        setUploadProgress((i / (lines.length - 1)) * 100);
        
        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length < headers.length) continue;

        try {
          const transaction: ImportedTransaction = {
            date: values[headers.findIndex(h => h.includes('date'))] || '',
            description: values[headers.findIndex(h => h.includes('description'))] || '',
            category: values[headers.findIndex(h => h.includes('category'))] || 'Other',
            amount: parseFloat(values[headers.findIndex(h => h.includes('amount'))] || '0'),
            type: (values[headers.findIndex(h => h.includes('type'))] || 'expense').toLowerCase() as 'income' | 'expense',
            status: 'success'
          };

          // Validation
          // More robust date validation
          const isValidDate = (dateString: string) => {
            // Try multiple date formats
            const formats = [
              dateString, // Try as-is
              dateString.replace(/-/g, '/'), // YYYY/MM/DD format
              dateString.replace(/\//g, '-') // YYYY-MM-DD format
            ];
            
            return formats.some(format => {
              const date = new Date(format);
              return date instanceof Date && !isNaN(date.getTime());
            });
          };
          
          if (!transaction.date || !isValidDate(transaction.date)) {
            transaction.status = 'error';
            transaction.error = 'Invalid date format. Use YYYY-MM-DD or DD/MM/YYYY';
          } else if (!transaction.description) {
            transaction.status = 'warning';
            transaction.error = 'Missing description';
          } else if (isNaN(transaction.amount) || transaction.amount <= 0) {
            transaction.status = 'error';
            transaction.error = 'Invalid amount';
          } else if (!['income', 'expense'].includes(transaction.type)) {
            transaction.status = 'warning';
            transaction.error = 'Invalid type, defaulting to expense';
            transaction.type = 'expense';
          }

          processedData.push(transaction);
        } catch (error) {
          processedData.push({
            date: values[0] || '',
            description: values[1] || '',
            category: 'Other',
            amount: 0,
            type: 'expense',
            status: 'error',
            error: 'Failed to process row'
          });
        }

        // Add delay to show progress
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      setImportedData(processedData);
      
      const summary = {
        total: processedData.length,
        success: processedData.filter(t => t.status === 'success').length,
        errors: processedData.filter(t => t.status === 'error').length,
        warnings: processedData.filter(t => t.status === 'warning').length
      };
      
      setImportSummary(summary);
      
      if (summary.success > 0) {
        toast.success(`Successfully processed ${summary.success} transactions`);
      }
      if (summary.errors > 0) {
        toast.error(`${summary.errors} transactions had errors`);
      }
      if (summary.warnings > 0) {
        toast.warning(`${summary.warnings} transactions had warnings`);
      }

    } catch (error: any) {
      toast.error(error.message || "Error processing file");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleImportConfirm = async () => {
    const validTransactions = importedData.filter(t => t.status !== 'error');
    
    if (validTransactions.length === 0) {
      toast.error("No valid transactions to import");
      return;
    }

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to import transactions");
        return;
      }

      console.log("Importing transactions for user:", user.id);
      console.log("Valid transactions to import:", validTransactions);

      // Process each valid transaction
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < validTransactions.length; i++) {
        const transaction = validTransactions[i];
        
        try {
          console.log("Processing transaction:", transaction);
          
          // First, check if category exists or create it
          let categoryId = null;
          
          // Look for existing category
          const { data: existingCategory, error: categoryError } = await supabase
            .from('categories')
            .select('id')
            .eq('name', transaction.category)
            .eq('user_id', user.id)
            .single();

          console.log("Existing category lookup result:", { existingCategory, categoryError });

          if (existingCategory) {
            categoryId = existingCategory.id;
          } else {
            // Create new category
            const { data: newCategory, error: createError } = await supabase
              .from('categories')
              .insert({
                name: transaction.category,
                type: transaction.type,
                user_id: user.id
              })
              .select()
              .single();

            console.log("New category creation result:", { newCategory, createError });

            if (newCategory) {
              categoryId = newCategory.id;
            }
          }

          console.log("Using category ID:", categoryId);

          // Insert transaction into Supabase with category_id
          // Ensure date is in correct format
          let formattedDate = transaction.date;
          if (transaction.date.includes('/')) {
            // Convert DD/MM/YYYY to YYYY-MM-DD
            const parts = transaction.date.split('/');
            if (parts.length === 3) {
              formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
          }
          
          const { error } = await supabase
            .from('transactions')
            .insert({
              user_id: user.id,
              amount: transaction.amount,
              description: transaction.description,
              category_id: categoryId,
              type: transaction.type,
              date: formattedDate
            });

          console.log("Transaction insert result:", error);

          if (error) {
            console.error("Error inserting transaction:", error);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (error) {
          console.error("Error inserting transaction:", error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} transactions!`);
      }
      if (errorCount > 0) {
        toast.warning(`${errorCount} transactions failed to import`);
      }
      
      // Clear the data
      setImportedData([]);
      setImportSummary(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      toast.error("Error importing transactions: " + error.message);
    }
  };

  const clearImport = () => {
    setImportedData([]);
    setImportSummary(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    // Use more recent dates for the template
    const today = new Date();
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(today.getDate() - 5);
    
    const csvContent = `date,description,amount,category,type
${fiveDaysAgo.toISOString().split('T')[0]},Coffee Shop,45.00,Food,expense
${today.toISOString().split('T')[0]},Part-time Job,2000.00,Part-time Job,income`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transaction_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:ml-64 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Import Transactions
            </h1>
            <p className="text-muted-foreground mt-1">
              Upload CSV files to bulk import your transaction data
            </p>
          </div>
          
          <Button 
            variant="outline"
            onClick={downloadTemplate}
            className="border-primary/20 hover:border-primary/50 hover:bg-primary/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </div>

        {/* Upload Section */}
        <Card className="glass-card p-8 text-center animate-scale-in">
          <div className="space-y-6">
            <div className="p-6 rounded-full bg-primary/20 w-20 h-20 mx-auto flex items-center justify-center">
              <Upload className="w-10 h-10 text-primary" />
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-2">Upload CSV File</h3>
              <p className="text-muted-foreground mb-6">
                Import your transactions from a CSV file. Make sure your file includes date, description, amount, category, and type columns.
              </p>
            </div>

            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300"
                size="lg"
              >
                {uploading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Choose CSV File
                  </>
                )}
              </Button>

              {uploading && (
                <div className="max-w-md mx-auto space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Processing file... {uploadProgress.toFixed(0)}%
                  </p>
                </div>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Supported format: CSV files with headers</p>
              <p>Required columns: date, description, amount, category, type</p>
            </div>
          </div>
        </Card>

        {/* Import Summary */}
        {importSummary && (
          <Card className="glass-card p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold">Import Summary</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={clearImport}
                  className="border-expense/20 hover:border-expense/50 hover:bg-expense/10 text-expense"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <Button
                  onClick={handleImportConfirm}
                  disabled={importSummary.success === 0}
                  className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Import Valid Transactions
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 rounded-xl bg-muted/20">
                <p className="text-2xl font-bold text-primary">{importSummary.total}</p>
                <p className="text-muted-foreground text-sm">Total</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-income/20">
                <p className="text-2xl font-bold text-income">{importSummary.success}</p>
                <p className="text-muted-foreground text-sm">Success</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-warning/20">
                <p className="text-2xl font-bold text-warning">{importSummary.warnings}</p>
                <p className="text-muted-foreground text-sm">Warnings</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-expense/20">
                <p className="text-2xl font-bold text-expense">{importSummary.errors}</p>
                <p className="text-muted-foreground text-sm">Errors</p>
              </div>
            </div>
          </Card>
        )}

        {/* Transaction Preview */}
        {importedData.length > 0 && (
          <Card className="glass-card p-6 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Transaction Preview</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {importedData.map((transaction, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                    transaction.status === 'success' ? 'border-income/30 bg-income/5' :
                    transaction.status === 'warning' ? 'border-warning/30 bg-warning/5' :
                    'border-expense/30 bg-expense/5'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.status === 'success' ? 'bg-income/20' :
                      transaction.status === 'warning' ? 'bg-warning/20' :
                      'bg-expense/20'
                    }`}>
                      {transaction.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-income" />
                      ) : transaction.status === 'warning' ? (
                        <AlertCircle className="w-4 h-4 text-warning" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-expense" />
                      )}
                    </div>
                    
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{transaction.date}</span>
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                        <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'} className="text-xs">
                          {transaction.type}
                        </Badge>
                      </div>
                      {transaction.error && (
                        <p className="text-sm text-expense mt-1">{transaction.error}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      transaction.type === 'income' ? 'text-income' : 'text-expense'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₹
                      {transaction.amount.toLocaleString('en-IN', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="glass-card p-6 animate-fade-in">
          <div className="flex items-start space-x-4">
            <FileText className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">CSV Format Instructions</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Required columns:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>date:</strong> Transaction date (YYYY-MM-DD format recommended)</li>
                  <li><strong>description:</strong> Transaction description</li>
                  <li><strong>amount:</strong> Transaction amount (positive number)</li>
                  <li><strong>category:</strong> Expense/income category</li>
                  <li><strong>type:</strong> "income" or "expense"</li>
                </ul>
                <p className="mt-4">
                  <strong>Tips:</strong> Make sure your CSV has headers in the first row. 
                  Download the template above for a properly formatted example.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}