# Source Code Documentation

## Directory Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   ├── Dashboard.tsx   # Main dashboard interface
│   ├── BalanceCard.tsx # Financial balance display
│   ├── TransactionList.tsx # Transaction management
│   ├── CategoryChart.tsx   # Spending visualization
│   ├── AddTransactionModal.tsx # Transaction form
│   ├── Navigation.tsx  # Application navigation
│   ├── UserProfile.tsx # User profile component
│   ├── Layout.tsx      # Application layout
│   └── Auth.tsx        # Authentication component
├── pages/              # Route-based page components
├── integrations/       # External service integrations
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
└── assets/             # Static assets and images
```

## Core Components

### Dashboard.tsx
**Purpose**: Main application interface displaying financial overview

**Key Features**:
- Transaction management
- Balance calculation
- Quick statistics
- Real-time updates

**Props Interface**:
```typescript
interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
  date: Date;
}
```

**State Management**:
- `transactions`: Array of user transactions
- `isModalOpen`: Modal visibility state

**Key Functions**:
- `addTransaction()`: Adds new transaction to state
- Balance calculations for income/expense/total

### BalanceCard.tsx
**Purpose**: Displays financial balance information with visual styling

**Props Interface**:
```typescript
interface BalanceCardProps {
  title: string;
  amount: number;
  type: 'balance' | 'income' | 'expense';
  icon: LucideIcon;
  className?: string;
  style?: React.CSSProperties;
}
```

**Features**:
- Dynamic color coding based on balance type
- Indian currency formatting (₹)
- Smooth animations and hover effects
- Responsive design

### TransactionList.tsx
**Purpose**: Displays list of user transactions with filtering and sorting

**Props Interface**:
```typescript
interface TransactionListProps {
  transactions: Transaction[];
}
```

**Features**:
- Transaction categorization
- Date formatting
- Amount display with proper signs (+/-)
- Responsive grid layout

### CategoryChart.tsx
**Purpose**: Visual breakdown of spending by category

**Features**:
- Progress bar visualization
- Percentage calculations
- Color-coded categories
- Animated rendering

**Data Processing**:
- Groups expenses by category
- Calculates percentages
- Sorts by amount (highest first)

### AddTransactionModal.tsx
**Purpose**: Form interface for adding new transactions

**Form Fields**:
- Amount (number input with ₹ prefix)
- Category (dropdown selection)
- Description (text input)
- Type (income/expense radio)
- Date (date picker)

**Validation**:
- Required field validation
- Amount > 0 validation
- Form submission handling

### Navigation.tsx
**Purpose**: Application navigation and routing

**Features**:
- Route-based navigation
- Active link highlighting
- Responsive mobile menu
- User authentication status

### UserProfile.tsx
**Purpose**: User profile display and management

**Features**:
- User avatar display
- Quick access to profile settings
- Authentication status
- Logout functionality

### Layout.tsx
**Purpose**: Common application layout wrapper

**Features**:
- Consistent page structure
- Background effects and animations
- Navigation integration
- Route outlet for page content

## Page Components

### Index.tsx
**Purpose**: Home page - renders Dashboard component
**Route**: `/`

### Analytics.tsx
**Purpose**: Advanced financial analytics and reports
**Route**: `/analytics`

**Features**:
- Monthly spending trends
- Category-wise analysis
- Income vs expense comparisons
- Financial health indicators

### BankInfo.tsx
**Purpose**: Banking information and account management
**Route**: `/bank-info`

**Features**:
- Indian bank selection
- Account type management
- Banking details form
- Security information

### Profile.tsx
**Purpose**: User profile management
**Route**: `/profile`

### Location.tsx
**Purpose**: User location and academic information
**Route**: `/location`

**Features**:
- Indian state selection
- Course information
- Academic year tracking
- Institute details

## Utility Functions

### lib/utils.ts
**Key Functions**:
- `cn()`: Tailwind class name utility
- Type checking helpers
- Date formatting utilities
- Number formatting for Indian locale

## Custom Hooks

### hooks/use-mobile.tsx
**Purpose**: Detects mobile device screen size
**Returns**: Boolean indicating mobile device

### hooks/use-toast.ts
**Purpose**: Toast notification management
**Features**: Success, error, and info notifications

## Integration Layer

### integrations/supabase/client.ts
**Purpose**: Supabase client configuration and initialization

**Configuration**:
- Database connection
- Authentication setup
- Real-time subscriptions
- Error handling

## Styling System

### index.css
**Design System Features**:
- CSS custom properties for theming
- Animation keyframes
- Glass morphism effects
- Dark theme implementation

**Key CSS Classes**:
- `.glass-card`: Glassmorphism card styling
- `.finance-bg`: Animated background
- `.float`: Floating animation
- `.pulse-glow`: Glow effect animation

### tailwind.config.ts
**Configuration**:
- Custom color palette
- Animation definitions
- Component variants
- Responsive breakpoints

## State Management Patterns

### Local Component State
```typescript
// Using useState for component-level state
const [transactions, setTransactions] = useState<Transaction[]>([]);
const [isLoading, setIsLoading] = useState(false);
```

### Lifted State Pattern
```typescript
// State lifted to parent component for sharing
const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  return (
    <>
      <TransactionList transactions={transactions} />
      <CategoryChart transactions={transactions} />
    </>
  );
};
```

### Form State Management
```typescript
// Using controlled components for forms
const [formData, setFormData] = useState({
  amount: '',
  category: '',
  description: '',
  type: 'expense',
  date: new Date()
});
```

## API Integration Patterns

### Supabase Data Fetching
```typescript
// Example data fetching pattern
const fetchTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data;
};
```

### Real-time Subscriptions
```typescript
// Example real-time subscription
useEffect(() => {
  const subscription = supabase
    .channel('transactions')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'transactions' },
      handleTransactionChange
    )
    .subscribe();
    
  return () => subscription.unsubscribe();
}, []);
```

## Error Handling Patterns

### Component Error Boundaries
```typescript
// Error boundary for component isolation
class ErrorBoundary extends Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Component error:', error, errorInfo);
  }
}
```

### Async Error Handling
```typescript
// Async operation error handling
const handleAsyncOperation = async () => {
  try {
    setIsLoading(true);
    const result = await apiCall();
    setData(result);
  } catch (error) {
    console.error('API Error:', error);
    toast.error('Operation failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

## Performance Optimization Techniques

### Component Memoization
```typescript
// Prevent unnecessary re-renders
const MemoizedComponent = React.memo(({ data }) => {
  return <ExpensiveComponent data={data} />;
});
```

### Callback Optimization
```typescript
// Memoize event handlers
const handleClick = useCallback((id: string) => {
  setSelected(id);
}, []);
```

### Computed Values
```typescript
// Memoize expensive calculations
const sortedTransactions = useMemo(() => {
  return transactions.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}, [transactions]);
```

## Testing Utilities

### Component Testing
```typescript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import { BalanceCard } from './BalanceCard';

test('displays balance amount correctly', () => {
  render(<BalanceCard amount={1000} type="balance" />);
  expect(screen.getByText('₹1,000.00')).toBeInTheDocument();
});
```

### Hook Testing
```typescript
// Example hook test
import { renderHook, act } from '@testing-library/react';
import { useMobile } from './use-mobile';

test('detects mobile screen size', () => {
  const { result } = renderHook(() => useMobile());
  expect(typeof result.current).toBe('boolean');
});
```

## Build and Deployment Configuration

### Vite Configuration
- TypeScript compilation
- CSS processing
- Asset optimization
- Development server setup

### Environment Variables
- Supabase configuration
- API endpoints
- Feature flags
- Build-specific settings

This documentation provides a comprehensive guide to understanding and working with the Student Finance Tracker codebase.