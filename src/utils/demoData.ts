import { Transaction } from '@/components/Dashboard';

// Demo user profiles
export const demoUsers = {
  cs: {
    email: 'demo.cs@student.com',
    password: 'demo123456',
    profile: {
      name: 'Arjun Kumar',
      course: 'Computer Science Engineering',
      year: 'Final Year',
      college: 'IIT Delhi',
      location: 'New Delhi'
    }
  },
  medical: {
    email: 'demo.medical@student.com', 
    password: 'demo123456',
    profile: {
      name: 'Priya Sharma',
      course: 'MBBS',
      year: '3rd Year',
      college: 'AIIMS Delhi',
      location: 'New Delhi'
    }
  },
  engineering: {
    email: 'demo.engineering@student.com',
    password: 'demo123456',
    profile: {
      name: 'Rahul Patel',
      course: 'Mechanical Engineering',
      year: '2nd Year', 
      college: 'NIT Surat',
      location: 'Gujarat'
    }
  }
};

// Demo transactions for CS student
export const csStudentTransactions: Transaction[] = [
  {
    id: 'demo-cs-1',
    amount: 25000,
    category: 'Scholarship',
    description: 'Merit Scholarship - Semester 8',
    type: 'income',
    date: new Date('2024-01-15')
  },
  {
    id: 'demo-cs-2',
    amount: 15000,
    category: 'Part-time Job',
    description: 'Web Development Freelance',
    type: 'income',
    date: new Date('2024-01-10')
  },
  {
    id: 'demo-cs-3',
    amount: 3500,
    category: 'Textbooks',
    description: 'Algorithm Design & Data Structures Books',
    type: 'expense',
    date: new Date('2024-01-08')
  },
  {
    id: 'demo-cs-4',
    amount: 8000,
    category: 'Food',
    description: 'Hostel Mess & Outside Food',
    type: 'expense',
    date: new Date('2024-01-05')
  },
  {
    id: 'demo-cs-5',
    amount: 2000,
    category: 'Transportation',
    description: 'Metro Card Recharge',
    type: 'expense',
    date: new Date('2024-01-03')
  },
  {
    id: 'demo-cs-6',
    amount: 5000,
    category: 'Technology',
    description: 'Online Course - Machine Learning',
    type: 'expense',
    date: new Date('2024-01-01')
  },
  {
    id: 'demo-cs-7',
    amount: 12000,
    category: 'Internship',
    description: 'Software Development Internship',
    type: 'income',
    date: new Date('2023-12-28')
  },
  {
    id: 'demo-cs-8',
    amount: 1500,
    category: 'Entertainment',
    description: 'Movie & Gaming',
    type: 'expense',
    date: new Date('2023-12-25')
  }
];

// Demo transactions for Medical student
export const medicalStudentTransactions: Transaction[] = [
  {
    id: 'demo-med-1',
    amount: 50000,
    category: 'Scholarship',
    description: 'Government Medical Scholarship',
    type: 'income',
    date: new Date('2024-01-20')
  },
  {
    id: 'demo-med-2',
    amount: 8000,
    category: 'Family Support',
    description: 'Monthly Allowance from Parents',
    type: 'income',
    date: new Date('2024-01-15')
  },
  {
    id: 'demo-med-3',
    amount: 12000,
    category: 'Medical Books',
    description: 'Anatomy & Physiology Reference Books',
    type: 'expense',
    date: new Date('2024-01-12')
  },
  {
    id: 'demo-med-4',
    amount: 5000,
    category: 'Medical Equipment',
    description: 'Stethoscope & Medical Kit',
    type: 'expense',
    date: new Date('2024-01-10')
  },
  {
    id: 'demo-med-5',
    amount: 6000,
    category: 'Food',
    description: 'Hostel Mess & Nutritious Food',
    type: 'expense',
    date: new Date('2024-01-08')
  },
  {
    id: 'demo-med-6',
    amount: 3000,
    category: 'Transportation',
    description: 'Hospital Visit Transportation',
    type: 'expense',
    date: new Date('2024-01-05')
  },
  {
    id: 'demo-med-7',
    amount: 4000,
    category: 'Part-time Job',
    description: 'Medical Tutoring Sessions',
    type: 'income',
    date: new Date('2024-01-03')
  },
  {
    id: 'demo-med-8',
    amount: 2000,
    category: 'Study Materials',
    description: 'Medical Journal Subscription',
    type: 'expense',
    date: new Date('2024-01-01')
  }
];

// Demo transactions for Engineering student
export const engineeringStudentTransactions: Transaction[] = [
  {
    id: 'demo-eng-1',
    amount: 20000,
    category: 'Scholarship',
    description: 'Technical Excellence Scholarship',
    type: 'income',
    date: new Date('2024-01-18')
  },
  {
    id: 'demo-eng-2',
    amount: 10000,
    category: 'Family Support',
    description: 'Monthly Family Support',
    type: 'income',
    date: new Date('2024-01-15')
  },
  {
    id: 'demo-eng-3',
    amount: 6000,
    category: 'Textbooks',
    description: 'Engineering Mathematics & Physics Books',
    type: 'expense',
    date: new Date('2024-01-12')
  },
  {
    id: 'demo-eng-4',
    amount: 8000,
    category: 'Lab Equipment',
    description: 'Engineering Tools & Calculator',
    type: 'expense',
    date: new Date('2024-01-10')
  },
  {
    id: 'demo-eng-5',
    amount: 5500,
    category: 'Food',
    description: 'Mess Bills & Outside Food',
    type: 'expense',
    date: new Date('2024-01-08')
  },
  {
    id: 'demo-eng-6',
    amount: 2500,
    category: 'Transportation',
    description: 'College Bus & Local Travel',
    type: 'expense',
    date: new Date('2024-01-05')
  },
  {
    id: 'demo-eng-7',
    amount: 7000,
    category: 'Internship',
    description: 'Summer Internship Stipend',
    type: 'income',
    date: new Date('2024-01-03')
  },
  {
    id: 'demo-eng-8',
    amount: 3000,
    category: 'Project Work',
    description: 'Final Year Project Materials',
    type: 'expense',
    date: new Date('2024-01-01')
  },
  {
    id: 'demo-eng-9',
    amount: 1800,
    category: 'Entertainment',
    description: 'College Fest & Movies',
    type: 'expense',
    date: new Date('2023-12-28')
  }
];

// Function to get demo transactions based on user type
export const getDemoTransactions = (userType: 'cs' | 'medical' | 'engineering'): Transaction[] => {
  switch (userType) {
    case 'cs':
      return csStudentTransactions;
    case 'medical':
      return medicalStudentTransactions;
    case 'engineering':
      return engineeringStudentTransactions;
    default:
      return csStudentTransactions;
  }
};

// Demo account credentials for easy access
export const demoCredentials = [
  {
    title: 'Computer Science Student',
    email: 'demo.cs@student.com',
    password: 'demo123456',
    description: 'Final year CS student with coding internships and freelance work'
  },
  {
    title: 'Medical Student',
    email: 'demo.medical@student.com', 
    password: 'demo123456',
    description: '3rd year MBBS student with government scholarship'
  },
  {
    title: 'Engineering Student',
    email: 'demo.engineering@student.com',
    password: 'demo123456',
    description: '2nd year Mechanical Engineering student with family support'
  }
];