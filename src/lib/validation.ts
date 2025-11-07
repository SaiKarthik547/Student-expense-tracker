import { z } from 'zod';

// Transaction validation schema
export const transactionSchema = z.object({
  amount: z.number().positive({ message: "Amount must be greater than 0" }),
  category: z.string().min(1, { message: "Category is required" }).max(50, { message: "Category must be less than 50 characters" }),
  description: z.string().min(1, { message: "Description is required" }).max(200, { message: "Description must be less than 200 characters" }),
  type: z.enum(['income', 'expense'], { message: "Type must be income or expense" }),
  date: z.date({ message: "Valid date is required" }),
});

// Budget validation schema
export const budgetSchema = z.object({
  category: z.string().min(1, { message: "Category is required" }).max(50, { message: "Category must be less than 50 characters" }),
  amount: z.number().positive({ message: "Budget amount must be greater than 0" }),
  period: z.enum(['weekly', 'monthly', 'yearly'], { message: "Period must be weekly, monthly, or yearly" }),
});

// CSV import validation schema
export const csvTransactionSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  description: z.string().min(1, { message: "Description is required" }).max(200, { message: "Description too long" }),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a valid positive number"
  }),
  category: z.string().min(1, { message: "Category is required" }).max(50, { message: "Category too long" }),
  type: z.enum(['income', 'expense'], { message: "Type must be income or expense" }),
});

// Profile validation schema
export const profileSchema = z.object({
  full_name: z.string().min(1, { message: "Full name is required" }).max(100, { message: "Name too long" }),
  college_name: z.string().max(100, { message: "College name too long" }).optional(),
  course: z.string().max(100, { message: "Course name too long" }).optional(),
  year_of_study: z.number().int().min(1).max(10).optional(),
  phone_number: z.string().regex(/^\+?[\d\s-()]+$/, { message: "Invalid phone number format" }).optional(),
  city: z.string().max(50, { message: "City name too long" }).optional(),
  state: z.string().max(50, { message: "State name too long" }).optional(),
  preferred_currency: z.string().length(3, { message: "Currency must be 3 characters" }).optional(),
});

// Input sanitization utility
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>"'&]/g, '');
}

// Validate date string
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// Validate currency amount
export function validateAmount(amount: string | number): { isValid: boolean; value?: number; error?: string } {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Invalid number format' };
  }
  
  if (numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }
  
  if (numAmount > 10000000) {
    return { isValid: false, error: 'Amount is too large' };
  }
  
  return { isValid: true, value: numAmount };
}

// Security utilities
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}