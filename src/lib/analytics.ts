import { Transaction } from "@/components/Dashboard";

export interface AnalyticsData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  averageExpense: number;
  averageIncome: number;
  topCategories: CategoryAnalytics[];
  monthlyTrends: MonthlyTrend[];
  spendingPatterns: SpendingPattern[];
}

export interface CategoryAnalytics {
  category: string;
  amount: number;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface SpendingPattern {
  dayOfWeek: string;
  averageSpending: number;
  transactionCount: number;
}

export interface FinancialHealthScore {
  score: number;
  level: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
}

export class AnalyticsService {
  
  static calculateAnalytics(transactions: Transaction[]): AnalyticsData {
    const income = transactions.filter(t => t.type === 'income');
    const expenses = transactions.filter(t => t.type === 'expense');
    
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      transactionCount: transactions.length,
      averageExpense: expenses.length > 0 ? totalExpenses / expenses.length : 0,
      averageIncome: income.length > 0 ? totalIncome / income.length : 0,
      topCategories: this.getTopCategories(expenses),
      monthlyTrends: this.getMonthlyTrends(transactions),
      spendingPatterns: this.getSpendingPatterns(expenses)
    };
  }
  
  static getTopCategories(expenses: Transaction[]): CategoryAnalytics[] {
    const categoryMap = new Map<string, { amount: number; count: number }>();
    
    expenses.forEach(expense => {
      const existing = categoryMap.get(expense.category) || { amount: 0, count: 0 };
      categoryMap.set(expense.category, {
        amount: existing.amount + expense.amount,
        count: existing.count + 1
      });
    });
    
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
        trend: 'stable' as const // Would need historical data for real trend analysis
      }))
      .sort((a, b) => b.amount - a.amount);
  }
  
  static getMonthlyTrends(transactions: Transaction[]): MonthlyTrend[] {
    const monthMap = new Map<string, { income: number; expenses: number }>();
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const existing = monthMap.get(monthKey) || { income: 0, expenses: 0 };
      
      if (transaction.type === 'income') {
        existing.income += transaction.amount;
      } else {
        existing.expenses += transaction.amount;
      }
      
      monthMap.set(monthKey, existing);
    });
    
    return Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
        balance: data.income - data.expenses
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }
  
  static getSpendingPatterns(expenses: Transaction[]): SpendingPattern[] {
    const dayMap = new Map<string, { total: number; count: number }>();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const dayName = dayNames[date.getDay()];
      
      const existing = dayMap.get(dayName) || { total: 0, count: 0 };
      dayMap.set(dayName, {
        total: existing.total + expense.amount,
        count: existing.count + 1
      });
    });
    
    return dayNames.map(day => {
      const data = dayMap.get(day) || { total: 0, count: 0 };
      return {
        dayOfWeek: day,
        averageSpending: data.count > 0 ? data.total / data.count : 0,
        transactionCount: data.count
      };
    });
  }
  
  static calculateFinancialHealth(analytics: AnalyticsData): FinancialHealthScore {
    let score = 0;
    const recommendations: string[] = [];
    
    // Income vs Expenses ratio (40 points)
    const savingsRate = analytics.totalIncome > 0 ? 
      ((analytics.totalIncome - analytics.totalExpenses) / analytics.totalIncome) * 100 : 0;
    
    if (savingsRate >= 20) {
      score += 40;
    } else if (savingsRate >= 10) {
      score += 30;
      recommendations.push("Try to save at least 20% of your income");
    } else if (savingsRate >= 0) {
      score += 15;
      recommendations.push("Increase your savings rate to at least 10%");
    } else {
      recommendations.push("You're spending more than you earn - review your expenses");
    }
    
    // Expense distribution (30 points)
    const topCategory = analytics.topCategories[0];
    if (topCategory && topCategory.percentage < 40) {
      score += 30;
    } else if (topCategory && topCategory.percentage < 60) {
      score += 20;
      recommendations.push("Try to diversify your spending across categories");
    } else {
      score += 10;
      recommendations.push("Too much spending in one category - consider rebalancing");
    }
    
    // Transaction frequency (20 points)
    if (analytics.transactionCount >= 20) {
      score += 20;
    } else if (analytics.transactionCount >= 10) {
      score += 15;
    } else {
      score += 10;
      recommendations.push("Track more transactions for better financial insights");
    }
    
    // Balance stability (10 points)
    if (analytics.balance >= analytics.totalIncome * 0.1) {
      score += 10;
    } else if (analytics.balance >= 0) {
      score += 5;
    }
    
    let level: FinancialHealthScore['level'];
    if (score >= 80) level = 'excellent';
    else if (score >= 60) level = 'good';
    else if (score >= 40) level = 'fair';
    else level = 'poor';
    
    return { score, level, recommendations };
  }
  
  static generateInsights(analytics: AnalyticsData): string[] {
    const insights: string[] = [];
    
    // Spending insights
    if (analytics.topCategories.length > 0) {
      const topCategory = analytics.topCategories[0];
      insights.push(`Your highest spending category is ${topCategory.category} at ₹${topCategory.amount.toFixed(2)}`);
    }
    
    // Savings rate insight
    const savingsRate = analytics.totalIncome > 0 ? 
      ((analytics.totalIncome - analytics.totalExpenses) / analytics.totalIncome) * 100 : 0;
    
    if (savingsRate > 0) {
      insights.push(`You're saving ${savingsRate.toFixed(1)}% of your income`);
    } else {
      insights.push("You're spending more than you earn this period");
    }
    
    // Expense patterns
    if (analytics.averageExpense > 0) {
      insights.push(`Your average expense is ₹${analytics.averageExpense.toFixed(2)}`);
    }
    
    return insights;
  }
}