# Interlink - Modern Business Management Platform

A comprehensive business management platform built with Next.js 15, featuring role-based dashboards, client management, project tracking, and modern UI/UX design.

![Interlink Dashboard](https://via.placeholder.com/800x400/6366f1/ffffff?text=Interlink+Dashboard)

## 🚀 Features

### Multi-Role Dashboard System
- **Admin Dashboard**: Complete system oversight and user management
- **Company Dashboard**: Client and project management with analytics
- **Client Dashboard**: Project tracking and communication tools

### Core Functionality
- **User Authentication**: Secure sign-up, sign-in, and password recovery
- **Role-Based Access Control**: Admin, Company, and Client user types
- **Client Management**: Complete CRUD operations for client data
- **Project Management**: Project creation, tracking, and status updates
- **Real-time Analytics**: Dashboard metrics and engagement tracking
- **Responsive Design**: Mobile-first approach with glass morphism UI
- **Dark/Light Mode**: System-wide theme switching
- **Toast Notifications**: User feedback for all actions

### Modern UI/UX
- **Glass Morphism Design**: Modern frosted glass effects
- **Gradient Backgrounds**: Beautiful animated gradient overlays
- **Smooth Animations**: Framer Motion powered interactions
- **Responsive Layout**: Works perfectly on all devices
- **Accessibility**: WCAG compliant with proper ARIA labels

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icons

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Primary database
- **Server Actions** - Next.js server-side functions
- **Row Level Security** - Database-level security

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/your-username/interlink.git
cd interlink
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Setup
Create a `.env.local` file in the root directory:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database URLs (automatically provided by Supabase)
POSTGRES_URL=your_postgres_connection_string
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
POSTGRES_USER=your_postgres_user
POSTGRES_HOST=your_postgres_host
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database

# Next.js Configuration
NEXT_PUBLIC_VERCEL_URL=http://localhost:3000
\`\`\`

### 4. Database Setup
Run the SQL scripts in order to set up your database:

\`\`\`bash
# Execute scripts in the scripts/ folder in numerical order
# 001-create-users-table.sql
# 002-create-clients-table.sql
# 003-create-projects-table.sql
# ... and so on
\`\`\`

### 5. Run the Development Server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
interlink/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── signin/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── admin/                    # Admin dashboard
│   │   ├── users/
│   │   ├── content/
│   │   └── settings/
│   ├── company/                  # Company dashboard
│   │   ├── clients/
│   │   ├── projects/
│   │   ├── reports/
│   │   └── settings/
│   ├── client/                   # Client dashboard
│   │   ├── projects/
│   │   ├── support/
│   │   └── settings/
│   ├── about/                    # Public pages
│   ├── services/
│   ├── contact/
│   └── globals.css
├── components/                   # Reusable components
│   ├── ui/                       # Shadcn/ui components
│   ├── admin/                    # Admin-specific components
│   ├── company/                  # Company-specific components
│   ├── client/                   # Client-specific components
│   ├── header.tsx
│   ├── footer.tsx
│   └── theme-provider.tsx
├── lib/                          # Utility functions
│   ├── supabase/                 # Supabase configuration
│   ├── data.ts                   # Data fetching functions
│   └── utils.ts
├── scripts/                      # Database scripts
│   ├── 001-create-users-table.sql
│   ├── 002-create-clients-table.sql
│   └── ...
├── hooks/                        # Custom React hooks
├── middleware.ts                 # Next.js middleware
└── tailwind.config.ts           # Tailwind configuration
\`\`\`

## 🔐 Authentication & Authorization

### User Roles
- **Admin**: Full system access, user management, content management
- **Company**: Client and project management, analytics, settings
- **Client**: Project viewing, support tickets, profile management

### Route Protection
Routes are protected using Next.js middleware and Supabase RLS:

\`\`\`typescript
// Protected routes by role
/admin/*     - Admin only
/company/*   - Company only  
/client/*    - Client only
\`\`\`

### Database Security
- Row Level Security (RLS) enabled on all tables
- Role-based policies for data access
- Secure server actions for data mutations

## 🎨 UI/UX Design System

### Color Palette
- **Primary**: Purple gradients (#8B5CF6 to #A855F7)
- **Secondary**: Blue accents (#3B82F6)
- **Background**: Dynamic gradients with glass effects
- **Text**: High contrast for accessibility

### Components
- Glass morphism cards with backdrop blur
- Animated gradients and floating elements
- Consistent spacing using Tailwind's scale
- Responsive breakpoints for all devices

### Animations
- Framer Motion for smooth transitions
- Staggered animations for lists
- Hover effects and micro-interactions
- Loading states and skeleton screens

## 📊 Database Schema

### Core Tables
- **users**: User authentication and profiles
- **clients**: Client information and relationships
- **projects**: Project data and status tracking
- **inquiries**: Contact form submissions
- **content**: CMS content management
- **messages**: Internal messaging system

### Analytics Tables
- **company_activities**: Company action tracking
- **client_activities**: Client engagement metrics
- **engagement_metrics**: Dashboard analytics

### Settings Tables
- **app_settings**: Global application settings
- **user_preferences**: Individual user preferences

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 API Documentation

### Server Actions

#### Authentication
- `signIn(formData)` - User sign in
- `signUp(formData)` - User registration
- `signOut()` - User sign out
- `resetPassword(formData)` - Password reset

#### Client Management
- `createClient(formData)` - Create new client
- `updateClient(id, formData)` - Update client
- `deleteClient(id)` - Delete client

#### Project Management
- `createProject(formData)` - Create new project
- `updateProject(id, formData)` - Update project
- `deleteProject(id)` - Delete project

#### User Management (Admin)
- `createUser(formData)` - Create new user
- `updateUser(id, formData)` - Update user
- `deleteUser(id)` - Delete user

## 🔧 Configuration

### Tailwind CSS
Custom configuration with:
- Extended color palette
- Glass morphism utilities
- Animation classes
- Responsive breakpoints

### Next.js
- App Router configuration
- Middleware for authentication
- Server Actions enabled
- TypeScript strict mode

## 📈 Performance

### Optimization Features
- Server-side rendering (SSR)
- Static generation where possible
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Efficient database queries with proper indexing

### Monitoring
- Built-in analytics tracking
- Error boundary components
- Performance metrics collection
- User engagement tracking

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**
\`\`\`bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
\`\`\`

**Authentication Problems**
- Verify Supabase configuration
- Check RLS policies
- Ensure proper role assignments

**Build Errors**
\`\`\`bash
# Clear Next.js cache
rm -rf .next
npm run build
\`\`\`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - Component library
- [Framer Motion](https://www.framer.com/motion/) - Animation library

## 📞 Support

For support, email support@interlink.com or join our Slack channel.

---

**Built with ❤️ by the Interlink Team**
