// Authentic Indian test data for comprehensive testing

export interface IndianStudentProfile {
  id: string;
  name: string;
  university: string;
  city: string;
  course: string;
  yearOfStudy: number;
  studentId: string;
  upiId: string;
}

export interface IndianExpenseScenario {
  category: string;
  amount: number;
  description: string;
  merchant: string;
  location: string;
  paymentMethod: string;
  frequency: 'one-time' | 'monthly' | 'weekly';
}

export interface IndianLocation {
  city: string;
  state: string;
  university: string;
  merchants: string[];
  averageRent: number;
  averageMessFee: number;
}

// Indian student profiles from major universities
export const indianStudentProfiles: IndianStudentProfile[] = [
  {
    id: 'std_001',
    name: 'Rahul Sharma',
    university: 'IIT Delhi',
    city: 'New Delhi',
    course: 'Computer Science',
    yearOfStudy: 3,
    studentId: 'IIT2022CS001',
    upiId: 'rahul.sharma@paytm'
  },
  {
    id: 'std_002',
    name: 'Priya Patel',
    university: 'IIT Bombay',
    city: 'Mumbai',
    course: 'Electrical Engineering',
    yearOfStudy: 2,
    studentId: 'IITB2023EE042',
    upiId: 'priya.patel@okaxis'
  },
  {
    id: 'std_003',
    name: 'Amit Kumar',
    university: 'NIT Trichy',
    city: 'Tiruchirappalli',
    course: 'Mechanical Engineering',
    yearOfStudy: 4,
    studentId: 'NIT2021ME089',
    upiId: 'amit.kumar@ybl'
  },
  {
    id: 'std_004',
    name: 'Sneha Reddy',
    university: 'AIIMS Delhi',
    city: 'New Delhi',
    course: 'Medicine',
    yearOfStudy: 5,
    studentId: 'AIIMS2020MD012',
    upiId: 'sneha.reddy@paytm'
  },
  {
    id: 'std_005',
    name: 'Arjun Nair',
    university: 'IIT Madras',
    city: 'Chennai',
    course: 'Data Science',
    yearOfStudy: 1,
    studentId: 'IITM2024DS078',
    upiId: 'arjun.nair@oksbi'
  }
];

// Authentic Indian expense scenarios
export const indianExpenseScenarios: IndianExpenseScenario[] = [
  {
    category: 'Accommodation',
    amount: 12000,
    description: 'Monthly hostel fee',
    merchant: 'IIT Delhi Hostel',
    location: 'Hauz Khas, New Delhi',
    paymentMethod: 'UPI',
    frequency: 'monthly'
  },
  {
    category: 'Food & Dining',
    amount: 4500,
    description: 'Monthly mess charges',
    merchant: 'Campus Mess',
    location: 'IIT Bombay Campus',
    paymentMethod: 'Cash',
    frequency: 'monthly'
  },
  {
    category: 'Transportation',
    amount: 150,
    description: 'Metro travel',
    merchant: 'Delhi Metro',
    location: 'Rajiv Chowk Metro Station',
    paymentMethod: 'Metro Card',
    frequency: 'one-time'
  },
  {
    category: 'Education',
    amount: 1800,
    description: 'Engineering textbooks',
    merchant: 'Oxford Bookstore',
    location: 'Connaught Place, Delhi',
    paymentMethod: 'Debit Card',
    frequency: 'one-time'
  },
  {
    category: 'Healthcare',
    amount: 650,
    description: 'Medical consultation',
    merchant: 'Apollo Clinic',
    location: 'Powai, Mumbai',
    paymentMethod: 'UPI',
    frequency: 'one-time'
  },
  {
    category: 'Entertainment',
    amount: 350,
    description: 'Movie tickets',
    merchant: 'PVR Cinemas',
    location: 'Select Citywalk, Saket',
    paymentMethod: 'Credit Card',
    frequency: 'one-time'
  },
  {
    category: 'Education',
    amount: 2500,
    description: 'Online course subscription',
    merchant: 'Coursera India',
    location: 'Online',
    paymentMethod: 'UPI',
    frequency: 'monthly'
  },
  {
    category: 'Food & Dining',
    amount: 280,
    description: 'Restaurant dinner',
    merchant: 'Saravana Bhavan',
    location: 'T Nagar, Chennai',
    paymentMethod: 'UPI',
    frequency: 'one-time'
  },
  {
    category: 'Transportation',
    amount: 80,
    description: 'Auto rickshaw ride',
    merchant: 'Local Auto',
    location: 'Bangalore',
    paymentMethod: 'Cash',
    frequency: 'one-time'
  },
  {
    category: 'Scholarship',
    amount: 15000,
    description: 'Merit scholarship',
    merchant: 'University Grant',
    location: 'IIT Delhi',
    paymentMethod: 'Bank Transfer',
    frequency: 'monthly'
  }
];

// Indian city and university data
export const indianLocations: IndianLocation[] = [
  {
    city: 'New Delhi',
    state: 'Delhi',
    university: 'IIT Delhi',
    merchants: ['Delhi Metro', 'Connaught Place Market', 'Sarojini Nagar', 'Campus Bookstore'],
    averageRent: 12000,
    averageMessFee: 4500
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    university: 'IIT Bombay',
    merchants: ['Local Train', 'Andheri Market', 'Phoenix Mall', 'Powai Shops'],
    averageRent: 15000,
    averageMessFee: 5000
  },
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    university: 'IIT Madras',
    merchants: ['MRTS', 'T Nagar Market', 'Spencer Plaza', 'Campus Store'],
    averageRent: 10000,
    averageMessFee: 4000
  },
  {
    city: 'Bangalore',
    state: 'Karnataka',
    university: 'IISc Bangalore',
    merchants: ['Namma Metro', 'Commercial Street', 'Brigade Road', 'Indiranagar'],
    averageRent: 13000,
    averageMessFee: 4800
  },
  {
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    university: 'NIT Trichy',
    merchants: ['City Bus', 'Main Guard Gate', 'Chinna Kadai', 'Campus Canteen'],
    averageRent: 8000,
    averageMessFee: 3500
  }
];

// Indian payment methods
export const indianPaymentMethods = [
  'UPI (PhonePe)',
  'UPI (Google Pay)',
  'UPI (Paytm)',
  'Debit Card (SBI)',
  'Credit Card (HDFC)',
  'Net Banking',
  'Cash',
  'Wallet (Paytm)',
  'Wallet (PhonePe)',
  'NEFT/RTGS'
];

// Indian UPI IDs format validation regex
export const UPI_ID_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;

// Indian currency formatting
export function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Indian date format (DD/MM/YYYY)
export function formatIndianDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// IST timezone offset
export const IST_OFFSET = '+05:30';

// Academic calendar dates (Indian universities typically July-May)
export const indianAcademicCalendar = {
  semesterStart: '01/07', // 1st July
  semesterEnd: '30/11', // 30th November
  examPeriod: '01/12', // 1st December
  winterBreak: '20/12', // 20th December
  springStart: '01/01', // 1st January
  springEnd: '30/04', // 30th April
  summerBreak: '01/05' // 1st May
};

// Festival expense categories (Indian festivals)
export const indianFestivals = [
  { name: 'Diwali', month: 10, averageSpend: 5000 },
  { name: 'Holi', month: 3, averageSpend: 2000 },
  { name: 'Durga Puja', month: 10, averageSpend: 3000 },
  { name: 'Eid', month: 6, averageSpend: 2500 },
  { name: 'Christmas', month: 12, averageSpend: 2000 },
  { name: 'Pongal', month: 1, averageSpend: 1500 }
];

// Validate UPI ID format
export function validateUpiId(upiId: string): boolean {
  return UPI_ID_REGEX.test(upiId);
}

// Generate random Indian phone number
export function generateIndianPhoneNumber(): string {
  const prefix = ['98', '99', '97', '96', '95', '94', '93', '92', '91', '90'];
  const randomPrefix = prefix[Math.floor(Math.random() * prefix.length)];
  const remaining = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return `+91 ${randomPrefix}${remaining.substring(0, 4)} ${remaining.substring(4)}`;
}

// Common Indian student income sources
export const indianIncomeCategories = [
  { source: 'Scholarship', minAmount: 10000, maxAmount: 50000 },
  { source: 'Part-time Job', minAmount: 8000, maxAmount: 25000 },
  { source: 'Family Support', minAmount: 15000, maxAmount: 40000 },
  { source: 'Internship Stipend', minAmount: 10000, maxAmount: 30000 },
  { source: 'Freelancing', minAmount: 5000, maxAmount: 50000 }
];

// Common expense thresholds for Indian students
export const indianExpenseThresholds = {
  hostelFee: { min: 5000, max: 20000 },
  messFee: { min: 3000, max: 6000 },
  transport: { min: 500, max: 3000 },
  books: { min: 500, max: 5000 },
  entertainment: { min: 1000, max: 5000 },
  healthcare: { min: 500, max: 10000 }
};
