# Database Seeding Scripts

This directory contains scripts for seeding the database with demo data.

## Prerequisites

1. You need to have the Supabase service role key
2. Set the following environment variables:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

## Available Scripts

### Seed Demo Users

Creates three demo user accounts with authentication and profiles:

```bash
npm run seed
```

This will create the following demo accounts:

1. **Computer Science Student**
   - Email: demo.cs@student.com
   - Password: demo123456
   - Profile: Arjun Kumar, IIT Delhi, Computer Science Engineering

2. **Medical Student**
   - Email: demo.medical@student.com
   - Password: demo123456
   - Profile: Priya Sharma, AIIMS Delhi, MBBS

3. **Engineering Student**
   - Email: demo.engineering@student.com
   - Password: demo123456
   - Profile: Rahul Patel, NIT Surat, Mechanical Engineering

## How to Get Service Role Key

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Find the "service_role" key under "Project API keys"
4. Set it as an environment variable:

```bash
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
```

## Security Note

Never commit the service role key to version control. Always use environment variables.