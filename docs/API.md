# API Documentation

This document describes the server actions and API endpoints available in the Interlink application.

## Authentication Actions

### Sign In
\`\`\`typescript
signIn(formData: FormData): Promise<void>
\`\`\`

**Parameters:**
- `email`: User email address
- `password`: User password

**Usage:**
\`\`\`typescript
import { signIn } from '@/app/(auth)/actions'

const handleSignIn = async (formData: FormData) => {
  await signIn(formData)
}
\`\`\`

### Sign Up
\`\`\`typescript
signUp(formData: FormData): Promise<void>
\`\`\`

**Parameters:**
- `email`: User email address
- `password`: User password
- `full_name`: User's full name
- `role`: User role (admin, company, client)

### Sign Out
\`\`\`typescript
signOut(): Promise<void>
\`\`\`

### Reset Password
\`\`\`typescript
resetPassword(formData: FormData): Promise<void>
\`\`\`

**Parameters:**
- `email`: User email address

## Client Management Actions

### Create Client
\`\`\`typescript
createClient(formData: FormData): Promise<{ success: boolean; message: string }>
\`\`\`

**Parameters:**
- `name`: Client company name
- `email`: Client email address
- `phone`: Client phone number
- `address`: Client address
- `status`: Client status (active, inactive, pending)

### Update Client
\`\`\`typescript
updateClient(formData: FormData): Promise<{ success: boolean; message: string }>
\`\`\`

**Parameters:**
- `id`: Client ID
- `name`: Updated client name
- `email`: Updated email
- `phone`: Updated phone
- `address`: Updated address
- `status`: Updated status

### Delete Client
\`\`\`typescript
deleteClient(formData: FormData): Promise<{ success: boolean; message: string }>
\`\`\`

**Parameters:**
- `id`: Client ID to delete

## Project Management Actions

### Create Project
\`\`\`typescript
createProject(formData: FormData): Promise<{ success: boolean; message: string }>
\`\`\`

**Parameters:**
- `name`: Project name
- `description`: Project description
- `client_id`: Associated client ID
- `status`: Project status
- `start_date`: Project start date
- `end_date`: Project end date
- `budget`: Project budget

### Update Project
\`\`\`typescript
updateProject(formData: FormData): Promise<{ success: boolean; message: string }>
\`\`\`

### Delete Project
\`\`\`typescript
deleteProject(formData: FormData): Promise<{ success: boolean; message: string }>
\`\`\`

## User Management Actions (Admin Only)

### Create User
\`\`\`typescript
createUser(formData: FormData): Promise<{ success: boolean; message: string }>
\`\`\`

**Parameters:**
- `email`: User email
- `password`: User password
- `full_name`: User's full name
- `role`: User role

### Update User
\`\`\`typescript
updateUser(formData: FormData): Promise<{ success: boolean; message: string }>
\`\`\`

### Delete User
\`\`\`typescript
deleteUser(formData: FormData): Promise<{ success: boolean; message: string }>
\`\`\`

## Company Profile Actions

### Update Company Profile
\`\`\`typescript
updateCompanyProfile(formData: FormData): Promise<{ success: boolean; message: string }>
\`\`\`

**Parameters:**
- `full_name`: Company name
- `email`: Company email
- `phone_number`: Company phone

## Data Fetching Functions

### Get Dashboard Data
\`\`\`typescript
getDashboardData(): Promise<DashboardData>
\`\`\`

Returns dashboard metrics and statistics.

### Get Clients
\`\`\`typescript
getClients(): Promise<Client[]>
\`\`\`

Returns all clients for the current company.

### Get Client by ID
\`\`\`typescript
getClient(id: string): Promise<Client | null>
\`\`\`

### Get Projects
\`\`\`typescript
getProjects(): Promise<Project[]>
\`\`\`

### Get Project by ID
\`\`\`typescript
getProject(id: string): Promise<Project | null>
\`\`\`

### Get Users (Admin Only)
\`\`\`typescript
getUsers(): Promise<User[]>
\`\`\`

### Get Company Profile
\`\`\`typescript
getCompanyProfile(): Promise<CompanyProfile | null>
\`\`\`

## Error Handling

All server actions return a consistent response format:

\`\`\`typescript
type ActionResponse = {
  success: boolean
  message: string
  data?: any
}
\`\`\`

### Error Types
- **Validation Error**: Invalid input data
- **Authentication Error**: User not authenticated
- **Authorization Error**: User lacks permissions
- **Database Error**: Database operation failed
- **Network Error**: Connection issues

### Example Error Handling
\`\`\`typescript
const result = await createClient(formData)

if (!result.success) {
  toast.error(result.message)
  return
}

toast.success(result.message)
\`\`\`

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Authentication actions: 5 requests per minute
- CRUD operations: 100 requests per minute
- Data fetching: 200 requests per minute

## Security

### Authentication
All actions require valid authentication except public pages.

### Authorization
Role-based access control:
- **Admin**: Full access to all actions
- **Company**: Access to client and project management
- **Client**: Read-only access to assigned projects

### Data Validation
All inputs are validated on both client and server side.

### SQL Injection Protection
All database queries use parameterized statements.

## Response Formats

### Success Response
\`\`\`json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
\`\`\`

### Error Response
\`\`\`json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
\`\`\`

## Testing

### Unit Tests
\`\`\`bash
npm run test:api
\`\`\`

### Integration Tests
\`\`\`bash
npm run test:integration
\`\`\`

### Example Test
\`\`\`typescript
import { createClient } from '@/app/company/client-actions'

describe('createClient', () => {
  it('should create a client successfully', async () => {
    const formData = new FormData()
    formData.append('name', 'Test Client')
    formData.append('email', 'test@example.com')
    
    const result = await createClient(formData)
    
    expect(result.success).toBe(true)
    expect(result.message).toContain('created successfully')
  })
})
