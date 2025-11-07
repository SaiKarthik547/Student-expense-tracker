import { Transaction } from "@/components/Dashboard";
import { AnalyticsData } from "./analytics";
import { TestResult } from "./testing";

export interface ExportOptions {
  format: 'csv' | 'json' | 'excel';
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: string[];
  includeMetadata?: boolean;
}

export class ExportService {
  
  static exportTransactions(transactions: Transaction[], options: ExportOptions): string | Blob {
    const filteredTransactions = this.filterTransactions(transactions, options);
    
    switch (options.format) {
      case 'csv':
        return this.exportToCSV(filteredTransactions, options.includeMetadata);
      case 'json':
        return this.exportToJSON(filteredTransactions, options.includeMetadata);
      case 'excel':
        return this.exportToExcel(filteredTransactions, options.includeMetadata);
      default:
        throw new Error('Unsupported export format');
    }
  }
  
  static exportAnalytics(analytics: AnalyticsData, format: 'csv' | 'json' = 'csv'): string {
    if (format === 'json') {
      return JSON.stringify(analytics, null, 2);
    }
    
    // Export as CSV
    let csv = 'Metric,Value\n';
    csv += `Total Income,${analytics.totalIncome}\n`;
    csv += `Total Expenses,${analytics.totalExpenses}\n`;
    csv += `Balance,${analytics.balance}\n`;
    csv += `Transaction Count,${analytics.transactionCount}\n`;
    csv += `Average Expense,${analytics.averageExpense}\n`;
    csv += `Average Income,${analytics.averageIncome}\n\n`;
    
    csv += 'Top Categories\n';
    csv += 'Category,Amount,Count,Percentage\n';
    analytics.topCategories.forEach(cat => {
      csv += `${cat.category},${cat.amount},${cat.count},${cat.percentage.toFixed(2)}%\n`;
    });
    
    return csv;
  }
  
  static exportTestResults(testResults: TestResult[], includeDetails: boolean = true): string {
    let csv = 'Test Name,Status,Duration (ms),Coverage (%),Error Message\n';
    
    testResults.forEach(result => {
      const errorMsg = result.error ? result.error.replace(/,/g, ';') : '';
      csv += `${result.name},${result.status},${result.duration || 0},${result.coverage || 0},${errorMsg}\n`;
    });
    
    if (includeDetails && testResults.length > 0) {
      csv += '\nTest Summary\n';
      const passed = testResults.filter(r => r.status === 'passed').length;
      const failed = testResults.filter(r => r.status === 'failed').length;
      const total = testResults.length;
      
      csv += `Total Tests,${total}\n`;
      csv += `Passed,${passed}\n`;
      csv += `Failed,${failed}\n`;
      csv += `Success Rate,${((passed / total) * 100).toFixed(2)}%\n`;
    }
    
    return csv;
  }
  
  private static filterTransactions(transactions: Transaction[], options: ExportOptions): Transaction[] {
    let filtered = [...transactions];
    
    // Filter by date range
    if (options.dateRange) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= options.dateRange!.start && transactionDate <= options.dateRange!.end;
      });
    }
    
    // Filter by categories
    if (options.categories && options.categories.length > 0) {
      filtered = filtered.filter(t => options.categories!.includes(t.category));
    }
    
    return filtered;
  }
  
  private static exportToCSV(transactions: Transaction[], includeMetadata: boolean = false): string {
    let csv = 'Date,Description,Category,Amount,Type';
    
    if (includeMetadata) {
      csv += ',ID,Created At';
    }
    
    csv += '\n';
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date).toLocaleDateString('en-IN');
      const description = `"${transaction.description.replace(/"/g, '""')}"`;
      const amount = transaction.amount.toFixed(2);
      
      csv += `${date},${description},${transaction.category},${amount},${transaction.type}`;
      
      if (includeMetadata) {
        csv += `,${transaction.id},${new Date(transaction.date).toISOString()}`;
      }
      
      csv += '\n';
    });
    
    if (includeMetadata) {
      csv += '\nSummary\n';
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      csv += `Total Income,${totalIncome.toFixed(2)}\n`;
      csv += `Total Expenses,${totalExpenses.toFixed(2)}\n`;
      csv += `Net Balance,${(totalIncome - totalExpenses).toFixed(2)}\n`;
      csv += `Total Transactions,${transactions.length}\n`;
      csv += `Export Date,${new Date().toISOString()}\n`;
    }
    
    return csv;
  }
  
  private static exportToJSON(transactions: Transaction[], includeMetadata: boolean = false): string {
    const data: any = {
      transactions: transactions,
      exportDate: new Date().toISOString(),
      count: transactions.length
    };
    
    if (includeMetadata) {
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      data.summary = {
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
        categories: [...new Set(transactions.map(t => t.category))],
        dateRange: {
          earliest: transactions.reduce((min, t) => t.date < min ? t.date : min, transactions[0]?.date),
          latest: transactions.reduce((max, t) => t.date > max ? t.date : max, transactions[0]?.date)
        }
      };
    }
    
    return JSON.stringify(data, null, 2);
  }
  
  private static exportToExcel(transactions: Transaction[], includeMetadata: boolean = false): Blob {
    // This would require a library like SheetJS for full Excel support
    // For now, return CSV content as a blob that can be saved as .xlsx
    const csvContent = this.exportToCSV(transactions, includeMetadata);
    return new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
  
  static downloadFile(content: string | Blob, filename: string, contentType: string = 'text/csv'): void {
    const blob = typeof content === 'string' 
      ? new Blob([content], { type: contentType })
      : content;
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}