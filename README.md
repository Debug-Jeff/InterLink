# InterLink - Complete Full-Stack Application

InterLink is a comprehensive client management and project collaboration platform built with Next.js, Express.js, and Supabase.

## 🚀 Features

### 🔐 Authentication & Authorization
- Role-based access control (Admin, Company, Client)
- JWT token-based authentication
- OAuth integration (Google, Facebook)
- Password reset functionality

### 👥 User Management
- Complete CRUD operations for users
- Profile management
- Role-based permissions
- Activity tracking

### 🏢 Client Management
- Client registration and profiles
- Company information management
- Project association
- Client-specific dashboards

### 📋 Project Management
- Project creation and tracking
- Status management (pending, in-progress, completed, cancelled)
- File uploads and storage
- Budget and timeline tracking

### 📨 Communication
- Real-time messaging system
- Email notifications
- Inquiry/contact form processing
- Message history and conversations

### 📊 Analytics & Reporting
- Dashboard analytics
- User engagement metrics
- Financial reporting
- Activity statistics

### 🔄 Approval Workflows
- Custom approval processes
- Multi-level approvals
- Status tracking
- Automated notifications

### 📁 File Management
- File upload with Supabase Storage
- Image thumbnail generation
- File type validation
- Project-specific file organization

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **React Hook Form** - Form management
- **Zustand** - State management
- **Recharts** - Data visualization

### Backend
- **Express.js** - Web framework
- **Node.js** - Runtime environment
- **Supabase** - Database and authentication
- **SendGrid** - Email service
- **Multer** - File upload handling
- **Sharp** - Image processing
- **Winston** - Logging
- **JWT** - Authentication tokens

### Database
- **Supabase (PostgreSQL)** - Primary database
- **Supabase Storage** - File storage
- **Redis** - Caching (optional)

### DevOps
- **Docker** - Containerization
- **Nginx** - Reverse proxy
- **PM2** - Process management

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- SendGrid account (for emails)

### 1. Clone the repository
```bash
git clone <repository-url>
cd InterLink
```

### 2. Install dependencies
```bash
npm run install:all
```

### 3. Environment Setup

#### Backend Environment (.env)
```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Environment
NODE_ENV=development
PORT=3001

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Frontend Environment (.env.local)
```bash
cd frontend
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

Run the SQL scripts in `frontend/scripts/` in order:
1. `001-create-users-table.sql`
2. `002-create-clients-table.sql`
3. `003-create-projects-table.sql`
4. ... (continue with all scripts)

### 5. Start Development

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:backend
npm run dev:frontend
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🐳 Docker Deployment

### Development with Docker
```bash
docker-compose up -d
```

### Production Deployment
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/forgot-password` - Password reset

### User Management
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Client Management
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Project Management
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### File Management
- `POST /api/uploads/single` - Upload single file
- `POST /api/uploads/multiple` - Upload multiple files
- `DELETE /api/uploads/:filename` - Delete file
- `GET /api/uploads/project/:projectId` - Get project files

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/engagement` - User engagement metrics
- `GET /api/analytics/financial` - Financial metrics

## 🔧 Configuration

### Email Templates
Email templates are configured in `backend/src/services/emailService.js`:
- Welcome emails
- Password reset emails
- Project status updates
- Message notifications

### File Upload Settings
Configure in `backend/.env`:
```env
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx,ppt,pptx
```

### Rate Limiting
Configure in `backend/.env`:
```env
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100  # 100 requests per window
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Run All Tests
```bash
npm test
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### PM2 Deployment
```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js

# Monitor
pm2 monit
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Configure proper database URLs
- Set up SSL certificates
- Configure CORS origins
- Set up monitoring and logging

## 📊 Monitoring

### Logging
- Application logs are stored in `backend/logs/`
- Error logs: `backend/logs/error.log`
- Combined logs: `backend/logs/combined.log`

### Health Check
- Backend health check: `GET /health`
- Returns server status and uptime

## 🔒 Security

### Features Implemented
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation
- SQL injection protection
- XSS protection
- JWT token validation
- File upload validation

### Security Best Practices
- Use environment variables for secrets
- Implement proper authentication
- Regular security updates
- Monitor for vulnerabilities
- Use HTTPS in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.

## 📈 Roadmap

- [ ] Real-time notifications with Socket.io
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Integration with third-party services
- [ ] API rate limiting improvements
- [ ] Enhanced security features
- [ ] Performance optimizations
- [ ] Multi-language support

---

Built with ❤️ by the InterLink Team