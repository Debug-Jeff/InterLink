# Setup Guide

This guide will walk you through setting up the Interlink project from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18 or higher
- npm or yarn package manager
- Git
- A Supabase account

## Step 1: Project Setup

### Clone the Repository
\`\`\`bash
git clone https://github.com/Debug-Jeff/interlink.git
cd interlink
\`\`\`

### Install Dependencies
\`\`\`bash
npm install
\`\`\`

## Step 2: Supabase Configuration

### Create a New Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be created

### Get Your Project Credentials
1. Go to Settings > API
2. Copy your Project URL and anon public key
3. Copy your service role key (keep this secret!)

## Step 3: Environment Variables

Create a `.env.local` file in your project root:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database (auto-generated by Supabase)
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
POSTGRES_USER=postgres
POSTGRES_HOST=your_host
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=postgres

# App
NEXT_PUBLIC_VERCEL_URL=http://localhost:3000
\`\`\`

## Step 4: Database Setup

### Run SQL Scripts
Execute the SQL scripts in the `scripts/` folder in numerical order:

1. Open Supabase SQL Editor
2. Run each script starting with `001-create-users-table.sql`
3. Continue through all scripts in order

### Enable Row Level Security
Ensure RLS is enabled on all tables for security.

## Step 5: Authentication Setup

### Configure Supabase Auth
1. Go to Authentication > Settings
2. Configure your site URL: `http://localhost:3000`
3. Add redirect URLs for production later
4. Enable email confirmations if desired

## Step 6: Run the Application

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see your application running.

## Step 7: Create Your First Admin User

1. Go to `/signup`
2. Create an account
3. In Supabase, manually update the user's role to 'admin' in the users table
4. Sign in with your admin account

## Troubleshooting

### Common Issues

**Environment Variables Not Loading**
- Restart your development server after adding `.env.local`
- Check for typos in variable names

**Database Connection Errors**
- Verify your Supabase credentials
- Check that your project is active
- Ensure RLS policies are correctly configured

**Authentication Issues**
- Check Supabase Auth settings
- Verify redirect URLs
- Check browser console for errors

### Getting Help

If you encounter issues:
1. Check the troubleshooting section in the main README
2. Review Supabase documentation
3. Check the project's GitHub issues
4. Contact support

## Next Steps

After setup:
1. Customize the branding and colors
2. Configure email templates in Supabase
3. Set up your production environment
4. Deploy to Vercel or your preferred platform
