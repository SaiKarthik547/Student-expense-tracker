import { Transaction } from "@/components/Dashboard";

// Service Pattern: Centralized business logic for transaction operations
export class TransactionService {
  
  // Strategy Pattern: Different calculation strategies
  static calculateBalance(transactions: Transaction[]): number {
    const income = this.calculateTotalIncome(transactions);
    const expenses = this.calculateTotalExpenses(transactions);
    return income - expenses;
  }
  
  static calculateTotalIncome(transactions: Transaction[]): number {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }
  
  static calculateTotalExpenses(transactions: Transaction[]): number {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }
  
  // Template Method Pattern: Common transaction validation
  static validateTransaction(transaction: Partial<Transaction>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!transaction.amount || transaction.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }
    
    if (!transaction.category || transaction.category.trim() === '') {
      errors.push('Category is required');
    }
    
    if (!transaction.description || transaction.description.trim() === '') {
      errors.push('Description is required');
    }
    
    if (!transaction.type || !['income', 'expense'].includes(transaction.type)) {
      errors.push('Type must be income or expense');
    }
    
    if (!transaction.date) {
      errors.push('Date is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // Factory Method Pattern: Create transaction with proper formatting
  static createTransaction(data: Omit<Transaction, 'id'>): Transaction {
    return {
      ...data,
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: Number(data.amount),
      date: new Date(data.date),
      category: data.category.trim(),
      description: data.description.trim()
    };
  }
  
  // Decorator Pattern: Format currency with Indian locale
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  // Command Pattern: Transaction operations
  static getTransactionsByCategory(transactions: Transaction[]): Record<string, Transaction[]> {
    return transactions.reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);
  }
  
  // Observer Pattern: Get statistics for dashboard
  static getTransactionStats(transactions: Transaction[]) {
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');
    
    return {
      totalTransactions: transactions.length,
      totalIncome: this.calculateTotalIncome(transactions),
      totalExpenses: this.calculateTotalExpenses(transactions),
      balance: this.calculateBalance(transactions),
      averageExpense: expenses.length > 0 ? this.calculateTotalExpenses(transactions) / expenses.length : 0,
      largestExpense: expenses.length > 0 ? Math.max(...expenses.map(t => t.amount)) : 0,
      largestIncome: income.length > 0 ? Math.max(...income.map(t => t.amount)) : 0,
      categoryCount: new Set(transactions.map(t => t.category)).size
    };
  }
}