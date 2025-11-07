import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/integrations/supabase/types';

interface DemoUser {
  email: string;
  password: string;
  profile: {
    full_name: string;
    course: string;
    year_of_study: number;
    university: string;
    student_id: string;
  };
}

interface Category {
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

interface Transaction {
  amount: number;
  description: string;
  type: 'income' | 'expense';
  category: string;
  date: string;
  location: string;
}

// Supabase service role key (has full admin access)
// IMPORTANT: This key should NEVER be exposed in client-side code
// The service role key can be found in your Supabase project dashboard under Settings > API
const SUPABASE_URL = process.env.SUPABASE_URL || "https://gvgxsiptmymvwgsnseae.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "key";

// Create admin client with service role key
// Note: This requires the service role key which has full admin access
const supabaseAdmin = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Demo user data
const demoUsers = [
  {
    email: 'demo.cs@student.com',
    password: 'demo123456',
    profile: {
      full_name: 'Arjun Kumar',
      course: 'Computer Science Engineering',
      year_of_study: 4,
      university: 'IIT Delhi',
      student_id: 'CS2024001'
    }
  },
  {
    email: 'demo.medical@student.com',
    password: 'demo123456',
    profile: {
      full_name: 'Priya Sharma',
      course: 'MBBS',
      year_of_study: 3,
      university: 'AIIMS Delhi',
      student_id: 'MD2024001'
    }
  },
  {
    email: 'demo.engineering@student.com',
    password: 'demo123456',
    profile: {
      full_name: 'Rahul Patel',
      course: 'Mechanical Engineering',
      year_of_study: 2,
      university: 'NIT Surat',
      student_id: 'ME2024001'
    }
  }
];

// Default categories for all users
const defaultCategories: Category[] = [
  { name: 'Food & Dining', type: 'expense', color: '#EF4444', icon: 'utensils' },
  { name: 'Transportation', type: 'expense', color: '#F97316', icon: 'car' },
  { name: 'Education/Textbooks', type: 'expense', color: '#3B82F6', icon: 'graduation-cap' },
  { name: 'Healthcare', type: 'expense', color: '#10B981', icon: 'heart-pulse' },
  { name: 'Accommodation/Hostel', type: 'expense', color: '#6366F1', icon: 'home' },
  { name: 'Entertainment', type: 'expense', color: '#8B5CF6', icon: 'gamepad-2' },
  { name: 'Scholarship', type: 'income', color: '#DC2626', icon: 'award' },
  { name: 'Part-time Job', type: 'income', color: '#059669', icon: 'briefcase' },
  { name: 'Family Support', type: 'income', color: '#7C3AED', icon: 'users' }
];

// Sample transactions for CS student (Arjun Kumar)
const csStudentTransactions: Transaction[] = [
  { amount: 25000, description: 'Merit Scholarship', type: 'income', category: 'Scholarship', date: '2024-01-15', location: 'IIT Delhi' },
  { amount: 15000, description: 'Web Development Freelance', type: 'income', category: 'Part-time Job', date: '2024-01-10', location: 'IIT Delhi' },
  { amount: 12000, description: 'ML Internship', type: 'income', category: 'Part-time Job', date: '2024-01-05', location: 'IIT Delhi' },
  { amount: 3500, description: 'Algorithm Books', type: 'expense', category: 'Education/Textbooks', date: '2024-01-08', location: 'Oxford Bookstore, Delhi' },
  { amount: 5000, description: 'Online ML Course', type: 'expense', category: 'Education/Textbooks', date: '2024-01-01', location: 'Coursera' },
  { amount: 8000, description: 'Hostel Mess', type: 'expense', category: 'Accommodation/Hostel', date: '2024-01-05', location: 'IIT Delhi Hostel' },
  { amount: 2000, description: 'Metro Card', type: 'expense', category: 'Transportation', date: '2024-01-03', location: 'Delhi Metro' },
  { amount: 10000, description: 'Hackathon Prize', type: 'income', category: 'Part-time Job', date: '2023-12-28', location: 'IIT Delhi' },
  { amount: 4500, description: 'Laptop Accessories', type: 'expense', category: 'Education/Textbooks', date: '2023-12-25', location: 'Electronics Store' },
  { amount: 1500, description: 'Movie & Gaming', type: 'expense', category: 'Entertainment', date: '2023-12-20', location: 'PVR Cinemas' },
  { amount: 3000, description: 'Software Subscription', type: 'expense', category: 'Education/Textbooks', date: '2023-12-15', location: 'Online' },
  { amount: 2500, description: 'Internet Data', type: 'expense', category: 'Education/Textbooks', date: '2023-12-10', location: 'Online' },
  { amount: 2000, description: 'Food Delivery', type: 'expense', category: 'Food & Dining', date: '2023-12-05', location: 'Swiggy' },
  { amount: 5000, description: 'Conference Registration', type: 'expense', category: 'Education/Textbooks', date: '2023-11-28', location: 'Tech Conference' },
  { amount: 1800, description: 'Mobile Recharge', type: 'expense', category: 'Entertainment', date: '2023-11-25', location: 'Online' },
  { amount: 3200, description: 'Hostel Mess', type: 'expense', category: 'Accommodation/Hostel', date: '2023-11-20', location: 'IIT Delhi Hostel' }
];

// Sample transactions for Medical student (Priya Sharma)
const medicalStudentTransactions: Transaction[] = [
  { amount: 50000, description: 'Government Medical Scholarship', type: 'income', category: 'Scholarship', date: '2024-01-20', location: 'AIIMS Delhi' },
  { amount: 8000, description: 'Family Support', type: 'income', category: 'Family Support', date: '2024-01-15', location: 'New Delhi' },
  { amount: 4000, description: 'Medical Tutoring', type: 'income', category: 'Part-time Job', date: '2024-01-10', location: 'AIIMS Delhi' },
  { amount: 12000, description: 'Anatomy Books', type: 'expense', category: 'Education/Textbooks', date: '2024-01-12', location: 'Medical Bookstore' },
  { amount: 5000, description: 'Stethoscope & Kit', type: 'expense', category: 'Healthcare', date: '2024-01-10', location: 'Medical Equipment Store' },
  { amount: 3000, description: 'Hospital Transport', type: 'expense', category: 'Transportation', date: '2024-01-05', location: 'Delhi' },
  { amount: 6000, description: 'Nutritious Food', type: 'expense', category: 'Food & Dining', date: '2024-01-08', location: 'AIIMS Canteen' },
  { amount: 2000, description: 'Medical Journal Subscription', type: 'expense', category: 'Education/Textbooks', date: '2024-01-01', location: 'Online' },
  { amount: 2500, description: 'Lab Coat & Supplies', type: 'expense', category: 'Education/Textbooks', date: '2023-12-28', location: 'Medical Store' },
  { amount: 1800, description: 'Study Group Materials', type: 'expense', category: 'Education/Textbooks', date: '2023-12-25', location: 'Online' },
  { amount: 3500, description: 'Hostel Mess', type: 'expense', category: 'Accommodation/Hostel', date: '2023-12-20', location: 'AIIMS Hostel' },
  { amount: 4500, description: 'Medical Conference', type: 'expense', category: 'Education/Textbooks', date: '2023-12-15', location: 'Delhi' },
  { amount: 2200, description: 'Medicine', type: 'expense', category: 'Healthcare', date: '2023-12-10', location: 'Pharmacy' },
  { amount: 1500, description: 'Online Course', type: 'expense', category: 'Education/Textbooks', date: '2023-12-05', location: 'Coursera' },
  { amount: 3000, description: 'Lab Fees', type: 'expense', category: 'Education/Textbooks', date: '2023-11-30', location: 'AIIMS Delhi' },
  { amount: 2800, description: 'Food Delivery', type: 'expense', category: 'Food & Dining', date: '2023-11-25', location: 'Zomato' }
];

// Sample transactions for Engineering student (Rahul Patel)
const engineeringStudentTransactions: Transaction[] = [
  { amount: 20000, description: 'Technical Excellence Scholarship', type: 'income', category: 'Scholarship', date: '2024-01-18', location: 'NIT Surat' },
  { amount: 10000, description: 'Family Support', type: 'income', category: 'Family Support', date: '2024-01-15', location: 'Gujarat' },
  { amount: 7000, description: 'Summer Internship', type: 'income', category: 'Part-time Job', date: '2024-01-10', location: 'NIT Surat' },
  { amount: 6000, description: 'Engineering Books', type: 'expense', category: 'Education/Textbooks', date: '2024-01-12', location: 'Technical Bookstore' },
  { amount: 8000, description: 'Engineering Tools & Calculator', type: 'expense', category: 'Education/Textbooks', date: '2024-01-10', location: 'Engineering Store' },
  { amount: 4500, description: 'Lab Equipment', type: 'expense', category: 'Education/Textbooks', date: '2024-01-05', location: 'NIT Surat Lab' },
  { amount: 5500, description: 'Mess Bills', type: 'expense', category: 'Accommodation/Hostel', date: '2024-01-08', location: 'NIT Surat Mess' },
  { amount: 2500, description: 'College Bus Pass', type: 'expense', category: 'Transportation', date: '2024-01-03', location: 'NIT Surat' },
  { amount: 3000, description: 'Project Materials', type: 'expense', category: 'Education/Textbooks', date: '2023-12-28', location: 'Hardware Store' },
  { amount: 1800, description: 'College Fest', type: 'expense', category: 'Entertainment', date: '2023-12-25', location: 'NIT Surat' },
  { amount: 4000, description: 'Software License', type: 'expense', category: 'Education/Textbooks', date: '2023-12-20', location: 'Online' },
  { amount: 2200, description: 'Internet Data', type: 'expense', category: 'Education/Textbooks', date: '2023-12-15', location: 'Online' },
  { amount: 3500, description: 'Hostel Rent', type: 'expense', category: 'Accommodation/Hostel', date: '2023-12-10', location: 'NIT Surat Hostel' },
  { amount: 1500, description: 'Food Delivery', type: 'expense', category: 'Food & Dining', date: '2023-12-05', location: 'Swiggy' },
  { amount: 2800, description: 'Workshop Registration', type: 'expense', category: 'Education/Textbooks', date: '2023-11-30', location: 'Technical Workshop' },
  { amount: 2000, description: 'Mobile Recharge', type: 'expense', category: 'Entertainment', date: '2023-11-25', location: 'Online' }
];

async function createDemoUsers() {
  console.log('Creating demo users...');
  
  for (const [index, user] of demoUsers.entries()) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Skip email confirmation
        user_metadata: {
          full_name: user.profile.full_name
        }
      });
      
      if (authError) {
        console.error(`Error creating user ${user.email}:`, authError.message);
        continue;
      }
      
      const userId = authData.user.id;
      console.log(`Created user ${user.email} with ID: ${userId}`);
      
      // Create profile
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: userId,
          full_name: user.profile.full_name,
          course: user.profile.course,
          year_of_study: user.profile.year_of_study,
          university: user.profile.university,
          student_id: user.profile.student_id
        });
      
      if (profileError) {
        console.error(`Error creating profile for ${user.email}:`, profileError.message);
      } else {
        console.log(`Created profile for ${user.email}`);
      }
      
      // Create default categories
      const categoriesToInsert = defaultCategories.map(category => ({
        user_id: userId,
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon
      }));
      
      const { error: categoriesError } = await supabaseAdmin
        .from('categories')
        .insert(categoriesToInsert);
      
      if (categoriesError) {
        console.error(`Error creating categories for ${user.email}:`, categoriesError.message);
      } else {
        console.log(`Created ${defaultCategories.length} categories for ${user.email}`);
      }
      
      // Get the created categories for this user
      const { data: categories, error: getCategoriesError } = await supabaseAdmin
        .from('categories')
        .select('id, name')
        .eq('user_id', userId);
      
      if (getCategoriesError) {
        console.error(`Error fetching categories for ${user.email}:`, getCategoriesError.message);
        continue;
      }
      
      // Create transactions based on user type
      let transactionsToCreate: Transaction[] = [];
      if (index === 0) {
        // CS Student
        transactionsToCreate = csStudentTransactions;
      } else if (index === 1) {
        // Medical Student
        transactionsToCreate = medicalStudentTransactions;
      } else {
        // Engineering Student
        transactionsToCreate = engineeringStudentTransactions;
      }
      
      // Map category names to category IDs
      const categoryMap = new Map(categories.map(cat => [cat.name, cat.id]));
      
      // Create transaction objects with proper category IDs
      const transactionsToInsert = transactionsToCreate.map(transaction => ({
        user_id: userId,
        category_id: categoryMap.get(transaction.category) || null,
        amount: transaction.amount,
        description: transaction.description,
        type: transaction.type,
        date: transaction.date,
        location: transaction.location
      }));
      
      // Insert transactions
      const { error: transactionsError } = await supabaseAdmin
        .from('transactions')
        .insert(transactionsToInsert);
      
      if (transactionsError) {
        console.error(`Error creating transactions for ${user.email}:`, transactionsError.message);
      } else {
        console.log(`Created ${transactionsToInsert.length} transactions for ${user.email}`);
      }
      
    } catch (error) {
      console.error(`Unexpected error creating user ${user.email}:`, error);
    }
  }
  
  console.log('Demo user creation completed.');
}

// Run the seeding function
createDemoUsers().catch(console.error);