-- Update categories for Indian students
DELETE FROM categories WHERE name IN ('Groceries', 'Transportation', 'Entertainment', 'Healthcare', 'Utilities');

-- Insert Indian student-specific categories
INSERT INTO categories (name, type, color, icon) VALUES
-- Academic Expenses
('Tuition Fees', 'expense', '#e74c3c', 'GraduationCap'),
('Books & Study Material', 'expense', '#9b59b6', 'Book'),
('Lab Fees', 'expense', '#f39c12', 'FlaskConical'),
('Exam Fees', 'expense', '#e67e22', 'FileText'),
('Course Materials', 'expense', '#8e44ad', 'BookOpen'),

-- Living Expenses
('Hostel/PG Rent', 'expense', '#2ecc71', 'Home'),
('Mess/Food', 'expense', '#f1c40f', 'Utensils'),
('Groceries & Snacks', 'expense', '#27ae60', 'ShoppingCart'),
('Mobile Recharge', 'expense', '#3498db', 'Phone'),
('Internet/WiFi', 'expense', '#9b59b6', 'Wifi'),

-- Transportation
('Bus/Train/Metro', 'expense', '#e74c3c', 'Bus'),
('Auto/Cab (Ola/Uber)', 'expense', '#f39c12', 'Car'),
('Bike Maintenance', 'expense', '#34495e', 'Bike'),

-- Personal & Entertainment
('Movies/Entertainment', 'expense', '#e91e63', 'Film'),
('Shopping/Clothes', 'expense', '#ff9800', 'ShirtIcon'),
('Health/Medical', 'expense', '#4caf50', 'Heart'),
('Festivals/Celebrations', 'expense', '#ff5722', 'Sparkles'),

-- Digital Payments & Others
('UPI/Digital Wallet', 'expense', '#607d8b', 'CreditCard'),
('Stationery', 'expense', '#795548', 'PenTool'),
('Printing/Xerox', 'expense', '#9e9e9e', 'Printer'),

-- Income Sources
('Scholarship', 'income', '#4caf50', 'Award'),
('Family Support', 'income', '#8bc34a', 'Users'),
('Part-time Work', 'income', '#ffeb3b', 'Briefcase'),
('Freelancing', 'income', '#00bcd4', 'Laptop'),
('Tutoring', 'income', '#ffc107', 'GraduationCap'),
('Internship Stipend', 'income', '#ff9800', 'Building')
ON CONFLICT (name) DO NOTHING;