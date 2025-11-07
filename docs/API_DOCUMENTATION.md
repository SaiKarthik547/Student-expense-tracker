# API Documentation

## Overview

The Student Finance Tracker uses Supabase as its backend service, providing a comprehensive API for user management, data storage, and real-time updates.

## Authentication API

### User Registration
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword',
  options: {
    data: {
      full_name: 'User Name'
    }
  }
});
```

### User Login
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword'
});
```

### User Logout
```typescript
const { error } = await supabase.auth.signOut();
```

### Get Current Session
```typescript
const { data: { session }, error } = await supabase.auth.getSession();
```

## Database API

### Profiles Table Operations

#### Get User Profile
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', userId)
  .single();
```

#### Update User Profile
```typescript
const { data, error } = await supabase
  .from('profiles')
  .update({
    full_name: 'Updated Name',
    preferred_currency: 'INR'
  })
  .eq('user_id', userId);
```

### Transactions Table Operations (Future Implementation)

#### Create Transaction
```typescript
const { data, error } = await supabase
  .from('transactions')
  .insert({
    user_id: userId,
    amount: 1000,
    category: 'Food',
    description: 'Lunch expense',
    type: 'expense',
    date: new Date().toISOString()
  });
```

#### Get User Transactions
```typescript
const { data, error } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId)
  .order('date', { ascending: false });
```

#### Update Transaction
```typescript
const { data, error } = await supabase
  .from('transactions')
  .update({
    amount: 1200,
    description: 'Updated description'
  })
  .eq('id', transactionId)
  .eq('user_id', userId);
```

#### Delete Transaction
```typescript
const { data, error } = await supabase
  .from('transactions')
  .delete()
  .eq('id', transactionId)
  .eq('user_id', userId);
```

## Real-time Subscriptions

### Transaction Updates
```typescript
const subscription = supabase
  .channel('transactions')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'transactions',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Transaction change:', payload);
      // Handle real-time updates
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

### Profile Updates
```typescript
const subscription = supabase
  .channel('profiles')
  .on('postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'profiles',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Profile updated:', payload);
      // Handle profile updates
    }
  )
  .subscribe();
```

## Error Handling

### Common Error Types
```typescript
interface SupabaseError {
  message: string;
  details: string;
  hint: string;
  code: string;
}
```

### Error Handling Pattern
```typescript
const handleApiCall = async () => {
  try {
    const { data, error } = await supabase
      .from('table')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    // Handle specific error types
    if (error.code === 'PGRST116') {
      // Handle not found error
    } else if (error.code === '23505') {
      // Handle unique constraint violation
    }
    
    throw error;
  }
};
```

## Security Considerations

### Row Level Security (RLS)
All tables implement RLS policies to ensure users can only access their own data:

```sql
-- Example RLS policy for transactions
CREATE POLICY "Users can view own transactions" 
ON transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" 
ON transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

### API Key Security
- Use anon key for client-side operations
- Service role key only for server-side operations
- Never expose service role key in client code

## Rate Limiting

Supabase implements automatic rate limiting:
- 200 requests per minute for authenticated users
- 60 requests per minute for anonymous users
- WebSocket connections: 200 concurrent per project

## Best Practices

### Query Optimization
```typescript
// Good: Select only needed columns
const { data } = await supabase
  .from('transactions')
  .select('id, amount, category, date')
  .eq('user_id', userId);

// Avoid: Select all columns when not needed
const { data } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId);
```

### Pagination
```typescript
const { data, error } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId)
  .range(0, 9) // Get first 10 records
  .order('date', { ascending: false });
```

### Batch Operations
```typescript
// Insert multiple transactions
const { data, error } = await supabase
  .from('transactions')
  .insert([
    { user_id: userId, amount: 100, category: 'Food' },
    { user_id: userId, amount: 200, category: 'Transport' },
    { user_id: userId, amount: 300, category: 'Books' }
  ]);
```

## Environment Configuration

### Required Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Client Configuration
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
```

## Testing API Endpoints

### Unit Testing with Mock Data
```typescript
import { jest } from '@jest/globals';

// Mock Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: mockData, error: null }))
      }))
    }))
  }
}));
```

### Integration Testing
```typescript
// Test actual API calls in development environment
describe('Transaction API', () => {
  test('should create transaction', async () => {
    const transaction = {
      amount: 100,
      category: 'Test',
      description: 'Test transaction',
      type: 'expense'
    };
    
    const result = await createTransaction(transaction);
    expect(result).toBeDefined();
    expect(result.amount).toBe(100);
  });
});
```

This API documentation provides comprehensive guidance for working with the Student Finance Tracker's backend services.