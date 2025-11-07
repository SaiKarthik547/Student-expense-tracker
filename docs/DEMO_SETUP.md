# Demo Setup Guide

## Overview

This guide provides instructions for setting up and using the demo accounts in the Student Finance Tracker application.

## Demo Account Profiles

### 1. Computer Science Student (demo.cs@student.com)
**Profile:**
- **Name:** Arjun Kumar
- **Course:** Computer Science Engineering
- **Year:** Final Year (4th Year)
- **College:** IIT Delhi
- **Location:** New Delhi

**Financial Profile:**
- **Total Income:** ₹52,000
- **Total Expenses:** ₹20,000
- **Net Balance:** ₹32,000

**Income Sources:**
- Merit Scholarship: ₹25,000
- Web Development Freelance: ₹15,000
- Software Development Internship: ₹12,000

**Major Expenses:**
- Technology/Courses: ₹5,000
- Textbooks: ₹3,500
- Food: ₹8,000
- Transportation: ₹2,000
- Entertainment: ₹1,500

### 2. Medical Student (demo.medical@student.com)
**Profile:**
- **Name:** Priya Sharma
- **Course:** MBBS
- **Year:** 3rd Year
- **College:** AIIMS Delhi
- **Location:** New Delhi

**Financial Profile:**
- **Total Income:** ₹62,000
- **Total Expenses:** ₹32,000
- **Net Balance:** ₹30,000

**Income Sources:**
- Government Medical Scholarship: ₹50,000
- Family Support: ₹8,000
- Medical Tutoring: ₹4,000

**Major Expenses:**
- Medical Books: ₹12,000
- Medical Equipment: ₹5,000
- Food: ₹6,000
- Transportation: ₹3,000
- Study Materials: ₹2,000

### 3. Engineering Student (demo.engineering@student.com)
**Profile:**
- **Name:** Rahul Patel
- **Course:** Mechanical Engineering
- **Year:** 2nd Year
- **College:** NIT Surat
- **Location:** Gujarat

**Financial Profile:**
- **Total Income:** ₹37,000
- **Total Expenses:** ₹26,800
- **Net Balance:** ₹10,200

**Income Sources:**
- Technical Excellence Scholarship: ₹20,000
- Family Support: ₹10,000
- Summer Internship: ₹7,000

**Major Expenses:**
- Lab Equipment: ₹8,000
- Textbooks: ₹6,000
- Food: ₹5,500
- Project Work: ₹3,000
- Transportation: ₹2,500
- Entertainment: ₹1,800

## Using Demo Accounts

### Method 1: Load Demo Data (Recommended for Testing)
1. Open the application
2. Click the "Demo Accounts" button in the top-right corner
3. Select any of the three demo profiles
4. Click "Load Data" to populate the dashboard with demo transactions
5. The dashboard will immediately update with realistic student financial data

### Method 2: Authentication Login (For Full Experience)
1. Navigate to the login page
2. Use any of the demo credentials:
   - **CS Student:** demo.cs@student.com / demo123456
   - **Medical Student:** demo.medical@student.com / demo123456
   - **Engineering Student:** demo.engineering@student.com / demo123456
3. Experience the full authentication flow
4. Access personalized dashboard and features

## Demo Data Features

### Realistic Transaction Patterns
- **Income Timing:** Scholarships and family support at month beginning
- **Expense Distribution:** Daily expenses, monthly bills, semester purchases
- **Category Variety:** Academic, living, entertainment, and professional expenses
- **Date Spread:** Transactions spanning multiple weeks for realistic history

### Indian Student Context
- **Currency:** All amounts in Indian Rupees (₹)
- **Categories:** India-specific expense categories
- **Amounts:** Realistic for Indian student budgets
- **Income Sources:** Common for Indian students (scholarships, part-time jobs, family support)

### Analytics Data
- **Spending Patterns:** Different patterns for each student type
- **Category Distribution:** Varied expense categories per profile
- **Income-Expense Ratios:** Realistic financial situations
- **Growth Trends:** Multi-month data for trend analysis

## Testing Scenarios

### Scenario 1: New User Experience
1. Start with a fresh session
2. Load CS Student demo data
3. Explore dashboard features
4. Add new transactions
5. View updated analytics

### Scenario 2: Comparison Testing
1. Load CS Student data, note financial patterns
2. Switch to Medical Student data
3. Compare expense categories and amounts
4. Switch to Engineering Student data
5. Observe different financial behaviors

### Scenario 3: Feature Testing
1. Load any demo profile
2. Test transaction addition with realistic data
3. Verify category charts update correctly
4. Check balance calculations
5. Test responsive design on different devices

## Customization for Demos

### Adding New Demo Profiles
1. Edit `src/utils/demoData.ts`
2. Add new user profile to `demoUsers` object
3. Create transaction array following existing pattern
4. Update `getDemoTransactions` function
5. Add credentials to `demoCredentials` array

### Modifying Existing Data
1. Edit transaction arrays in `demoData.ts`
2. Update amounts, categories, or descriptions
3. Ensure dates span realistic timeframe
4. Maintain balance between income and expenses

### Demo Environment Setup

#### Development Environment
```bash
# Clone repository
git clone <repo-url>
cd student-finance-tracker

# Install dependencies
npm install

# Start development server
npm run dev

# Access demo features immediately
```

#### Production Demo
```bash
# Build for production
npm run build

# Deploy to hosting platform
# Demo accounts work in production environment
```

## Demo Account Security

### Credentials
- **Passwords:** Simple for demo purposes (demo123456)
- **Emails:** Clearly marked as demo accounts
- **Data:** Non-sensitive, fictional information only

### Best Practices
- Use demo accounts only for testing and evaluation
- Do not store real financial information in demo accounts
- Reset demo data periodically for consistent testing
- Separate demo environment from production user data

## Troubleshooting Demo Issues

### Data Not Loading
1. Check browser console for errors
2. Verify demo data imports are working
3. Clear browser cache and reload
4. Check network connectivity

### Authentication Issues
1. Verify demo credentials are typed correctly
2. Check Supabase authentication configuration
3. Ensure demo users exist in authentication system
4. Try different demo account

### Performance Issues
1. Demo data is loaded instantly (no API calls)
2. Large transaction sets may affect rendering
3. Use browser dev tools to monitor performance
4. Consider pagination for large datasets

## Integration with Testing

### Unit Tests
```typescript
import { getDemoTransactions, demoCredentials } from '@/utils/demoData';

describe('Demo Data', () => {
  test('should return CS student transactions', () => {
    const transactions = getDemoTransactions('cs');
    expect(transactions).toHaveLength(8);
    expect(transactions[0].category).toBe('Scholarship');
  });
  
  test('should have valid demo credentials', () => {
    expect(demoCredentials).toHaveLength(3);
    expect(demoCredentials[0].email).toContain('demo');
  });
});
```

### E2E Tests
```typescript
// Cypress test example
describe('Demo Account Flow', () => {
  it('should load demo data correctly', () => {
    cy.visit('/');
    cy.contains('Demo Accounts').click();
    cy.contains('Computer Science Student').parent().find('button').click();
    cy.contains('₹25,000').should('be.visible');
  });
});
```

This demo setup provides a comprehensive testing environment for evaluating the Student Finance Tracker application with realistic Indian student financial data.