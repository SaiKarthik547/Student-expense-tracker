// Sample data for different types of Indian students

export interface StudentProfile {
  type: 'CS' | 'Medical' | 'Engineering' | 'Commerce' | 'Arts';
  name: string;
  description: string;
}

export const studentProfiles: StudentProfile[] = [
  {
    type: 'CS',
    name: 'Computer Science Student',
    description: 'Tech-focused expenses with software, hardware, and online courses'
  },
  {
    type: 'Medical',
    name: 'Medical Student',
    description: 'Medical supplies, textbooks, clinical equipment, and practicals'
  },
  {
    type: 'Engineering',
    name: 'Engineering Student',
    description: 'Lab equipment, project materials, technical books, and workshops'
  },
  {
    type: 'Commerce',
    name: 'Commerce Student',
    description: 'Business books, internship expenses, and professional courses'
  },
  {
    type: 'Arts',
    name: 'Arts Student',
    description: 'Art supplies, literature, cultural activities, and exhibitions'
  }
];

export const generateSampleTransactions = (profileType: StudentProfile['type'], months: number = 3) => {
  const transactions = [];
  const currentDate = new Date();
  
  const baseCategories = {
    CS: [
      { category: 'Software/Apps', minAmount: 500, maxAmount: 3000 },
      { category: 'Hardware', minAmount: 1000, maxAmount: 15000 },
      { category: 'Online Courses', minAmount: 800, maxAmount: 5000 },
      { category: 'Internet/Data', minAmount: 300, maxAmount: 800 },
      { category: 'Books/Tech Journals', minAmount: 400, maxAmount: 2000 },
      { category: 'Hackathons/Events', minAmount: 200, maxAmount: 1500 },
    ],
    Medical: [
      { category: 'Medical Books', minAmount: 1000, maxAmount: 8000 },
      { category: 'Stethoscope/Equipment', minAmount: 2000, maxAmount: 12000 },
      { category: 'Lab Supplies', minAmount: 500, maxAmount: 3000 },
      { category: 'Hospital Fees', minAmount: 1000, maxAmount: 5000 },
      { category: 'Medical Software', minAmount: 800, maxAmount: 4000 },
      { category: 'Clinical Practicals', minAmount: 300, maxAmount: 2000 },
    ],
    Engineering: [
      { category: 'Engineering Books', minAmount: 800, maxAmount: 4000 },
      { category: 'Lab Equipment', minAmount: 1000, maxAmount: 10000 },
      { category: 'Project Materials', minAmount: 500, maxAmount: 5000 },
      { category: 'Software/CAD', minAmount: 1000, maxAmount: 6000 },
      { category: 'Workshop Fees', minAmount: 300, maxAmount: 2000 },
      { category: 'Technical Events', minAmount: 200, maxAmount: 1500 },
    ],
    Commerce: [
      { category: 'Business Books', minAmount: 500, maxAmount: 3000 },
      { category: 'Internship Travel', minAmount: 200, maxAmount: 2000 },
      { category: 'Professional Courses', minAmount: 2000, maxAmount: 10000 },
      { category: 'Business Events', minAmount: 300, maxAmount: 1500 },
      { category: 'Office Supplies', minAmount: 200, maxAmount: 1000 },
      { category: 'Networking Events', minAmount: 500, maxAmount: 2500 },
    ],
    Arts: [
      { category: 'Art Supplies', minAmount: 300, maxAmount: 2500 },
      { category: 'Literature Books', minAmount: 400, maxAmount: 2000 },
      { category: 'Museum/Gallery', minAmount: 100, maxAmount: 500 },
      { category: 'Art Workshops', minAmount: 500, maxAmount: 3000 },
      { category: 'Cultural Events', minAmount: 200, maxAmount: 1000 },
      { category: 'Art Materials', minAmount: 200, maxAmount: 1500 },
    ]
  };

  const commonCategories = [
    { category: 'Food/Mess', minAmount: 100, maxAmount: 500 },
    { category: 'Transportation', minAmount: 50, maxAmount: 300 },
    { category: 'Hostel/Rent', minAmount: 5000, maxAmount: 15000 },
    { category: 'Entertainment', minAmount: 100, maxAmount: 800 },
    { category: 'Clothing', minAmount: 500, maxAmount: 3000 },
    { category: 'Personal Care', minAmount: 100, maxAmount: 800 },
    { category: 'Phone/Communication', minAmount: 200, maxAmount: 800 },
    { category: 'Medical/Health', minAmount: 200, maxAmount: 2000 },
  ];

  const incomeCategories = [
    { category: 'Part-time Job', minAmount: 5000, maxAmount: 15000 },
    { category: 'Freelancing', minAmount: 2000, maxAmount: 20000 },
    { category: 'Family Support', minAmount: 10000, maxAmount: 50000 },
    { category: 'Scholarship', minAmount: 5000, maxAmount: 25000 },
    { category: 'Tutoring', minAmount: 2000, maxAmount: 8000 },
    { category: 'Internship Stipend', minAmount: 3000, maxAmount: 15000 },
  ];

  const specificCategories = baseCategories[profileType] || [];
  const allExpenseCategories = [...specificCategories, ...commonCategories];

  // Generate transactions for the specified months
  for (let month = 0; month < months; month++) {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - month, 1);
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();

    // Generate 2-3 income transactions per month
    const incomeCount = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < incomeCount; i++) {
      const incomeCategory = incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      const transactionDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);

      transactions.push({
        id: `income_${month}_${i}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: transactionDate,
        description: generateDescription(incomeCategory.category, 'income'),
        category: incomeCategory.category,
        amount: Math.floor(Math.random() * (incomeCategory.maxAmount - incomeCategory.minAmount)) + incomeCategory.minAmount,
        type: 'income' as const
      });
    }

    // Generate 15-25 expense transactions per month
    const expenseCount = Math.floor(Math.random() * 11) + 15;
    for (let i = 0; i < expenseCount; i++) {
      const expenseCategory = allExpenseCategories[Math.floor(Math.random() * allExpenseCategories.length)];
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      const transactionDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);

      transactions.push({
        id: `expense_${month}_${i}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: transactionDate,
        description: generateDescription(expenseCategory.category, 'expense'),
        category: expenseCategory.category,
        amount: Math.floor(Math.random() * (expenseCategory.maxAmount - expenseCategory.minAmount)) + expenseCategory.minAmount,
        type: 'expense' as const
      });
    }
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const generateDescription = (category: string, type: 'income' | 'expense'): string => {
  const descriptions: Record<string, string[]> = {
    // Income descriptions
    'Part-time Job': ['Weekend job payment', 'Monthly salary', 'Extra hours payment', 'Holiday bonus'],
    'Freelancing': ['Web design project', 'Content writing', 'Graphic design work', 'App development'],
    'Family Support': ['Monthly allowance', 'Festival money', 'Emergency support', 'Study allowance'],
    'Scholarship': ['Merit scholarship', 'Need-based aid', 'Research grant', 'Academic excellence award'],
    'Tutoring': ['Mathematics tutoring', 'English coaching', 'Science classes', 'Online tutoring'],
    'Internship Stipend': ['Summer internship', 'Corporate stipend', 'Research internship', 'Training allowance'],

    // Expense descriptions
    'Software/Apps': ['Adobe Creative Suite', 'IDE subscription', 'Cloud storage', 'Development tools'],
    'Hardware': ['Laptop purchase', 'External monitor', 'Keyboard & mouse', 'SSD upgrade'],
    'Online Courses': ['Udemy course', 'Coursera subscription', 'Programming bootcamp', 'Certification exam'],
    'Medical Books': ['Harrison\'s textbook', 'Anatomy atlas', 'Pharmacology guide', 'Clinical manual'],
    'Lab Equipment': ['Lab goggles', 'Glassware set', 'Chemical reagents', 'Microscope slides'],
    'Engineering Books': ['Engineering mechanics', 'Circuit analysis', 'CAD textbook', 'Reference manual'],
    'Food/Mess': ['Mess bill', 'Restaurant meal', 'Grocery shopping', 'Snacks purchase'],
    'Transportation': ['Bus ticket', 'Auto rickshaw', 'Fuel expense', 'Metro card recharge'],
    'Entertainment': ['Movie ticket', 'Gaming purchase', 'Concert ticket', 'Streaming subscription'],

    // Default descriptions for other categories
    default: [`${category} expense`, `${category} purchase`, `${category} payment`, `${category} bill`]
  };

  const categoryDescriptions = descriptions[category] || descriptions.default;
  return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
};

export const generateSampleBudgets = (profileType: StudentProfile['type']) => {
  const budgetTemplates: Record<StudentProfile['type'], Array<{category: string, amount: number, period: 'monthly' | 'weekly'}>> = {
    CS: [
      { category: 'Food/Mess', amount: 8000, period: 'monthly' },
      { category: 'Software/Apps', amount: 2000, period: 'monthly' },
      { category: 'Books/Tech Journals', amount: 1500, period: 'monthly' },
      { category: 'Transportation', amount: 1000, period: 'monthly' },
      { category: 'Entertainment', amount: 2000, period: 'monthly' },
    ],
    Medical: [
      { category: 'Food/Mess', amount: 8000, period: 'monthly' },
      { category: 'Medical Books', amount: 3000, period: 'monthly' },
      { category: 'Lab Supplies', amount: 2000, period: 'monthly' },
      { category: 'Transportation', amount: 1200, period: 'monthly' },
      { category: 'Entertainment', amount: 1500, period: 'monthly' },
    ],
    Engineering: [
      { category: 'Food/Mess', amount: 8000, period: 'monthly' },
      { category: 'Engineering Books', amount: 2500, period: 'monthly' },
      { category: 'Lab Equipment', amount: 3000, period: 'monthly' },
      { category: 'Transportation', amount: 1000, period: 'monthly' },
      { category: 'Entertainment', amount: 2000, period: 'monthly' },
    ],
    Commerce: [
      { category: 'Food/Mess', amount: 7000, period: 'monthly' },
      { category: 'Business Books', amount: 1500, period: 'monthly' },
      { category: 'Professional Courses', amount: 4000, period: 'monthly' },
      { category: 'Transportation', amount: 1500, period: 'monthly' },
      { category: 'Entertainment', amount: 2500, period: 'monthly' },
    ],
    Arts: [
      { category: 'Food/Mess', amount: 7000, period: 'monthly' },
      { category: 'Art Supplies', amount: 2000, period: 'monthly' },
      { category: 'Literature Books', amount: 1000, period: 'monthly' },
      { category: 'Transportation', amount: 800, period: 'monthly' },
      { category: 'Entertainment', amount: 2200, period: 'monthly' },
    ]
  };

  return budgetTemplates[profileType].map((template, index) => ({
    id: `budget_${profileType}_${index}`,
    category: template.category,
    amount: template.amount,
    spent: Math.floor(Math.random() * template.amount * 0.9), // Random spent amount up to 90% of budget
    period: template.period,
    created_at: new Date().toISOString()
  }));
};