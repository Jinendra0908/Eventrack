# Eventrack - MVC Architecture Documentation

## 📁 Project Structure

```
eventrack/
├── app/                          # Next.js App Router (View Layer)
│   ├── api/                     # API Routes (thin wrappers)
│   ├── components/              # UI Components
│   └── pages/                   # Page Components
├── server/                      # MVC Backend Architecture
│   ├── config/                  # Configuration Files
│   │   ├── index.js            # Main config (JWT, DB, etc.)
│   │   └── constants.js        # Application constants
│   ├── controllers/            # Controller Layer (HTTP Request Handling)
│   │   ├── AuthController.js   # Authentication endpoints
│   │   ├── EventController.js  # Event management endpoints
│   │   └── UserController.js   # User management endpoints
│   ├── services/               # Service Layer (Business Logic)
│   │   ├── AuthService.js      # Authentication logic
│   │   ├── EventService.js     # Event business logic
│   │   └── UserService.js      # User business logic
│   ├── middleware/             # Middleware Layer
│   │   ├── auth.js             # Authentication & authorization
│   │   └── validation.js       # Request validation
│   └── utils/                  # Utility Functions
│       ├── apiResponse.js      # Standardized API responses
│       └── helpers.js          # Helper functions
├── models/                     # Model Layer (Data Layer)
│   ├── User.js                 # User schema
│   ├── Event.js                # Event schema
│   └── Notification.js         # Notification schema
├── lib/                        # Libraries
│   └── mongodb.js              # Database connection
└── contexts/                   # React Context (Client State)
    └── AuthContext.js          # Auth state management
```

## 🏗️ MVC Architecture Layers

### 1. **Model Layer** (`models/`)
- Defines data structure and schema
- MongoDB/Mongoose models
- Data validation rules
- Database interactions

**Files:**
- `User.js` - User schema with roles (participant/host)
- `Event.js` - Event schema with visibility, tickets, co-hosts
- `Notification.js` - Notification schema

### 2. **View Layer** (`app/`)
- Next.js pages and components
- UI/UX layer
- Client-side routing
- Thin API route handlers

**Structure:**
- `app/` - Page components (public pages, authenticated pages)
- `components/` - Reusable UI components
- `app/api/` - API route handlers (delegate to controllers)

### 3. **Controller Layer** (`server/controllers/`)
- Handles HTTP requests/responses
- Input validation
- Calls service layer
- Returns formatted responses

**Controllers:**
- `AuthController.js`
  - `register()` - User registration
  - `login()` - User login
  - `getCurrentUser()` - Get authenticated user
  - `logout()` - User logout

- `EventController.js`
  - `getEvents()` - List all events
  - `createEvent()` - Create new event
  - `getEventById()` - Get event details
  - `updateEvent()` - Update event
  - `deleteEvent()` - Delete event
  - `getHostEvents()` - Get host's events

- `UserController.js`
  - `searchUsers()` - Search users
  - `getSavedEvents()` - Get user's saved events
  - `getUsers()` - Get user profile

### 4. **Service Layer** (`server/services/`)
- Business logic implementation
- Data processing
- Interactions with models
- Reusable functions

**Services:**
- `AuthService.js`
  - User registration logic
  - Login authentication
  - Token generation
  - Profile updates

- `EventService.js`
  - Event CRUD operations
  - Permission checks
  - Event filtering/search
  - Host event management

- `UserService.js`
  - User search
  - Profile management
  - Saved events handling

### 5. **Middleware Layer** (`server/middleware/`)
- Request processing
- Authentication/Authorization
- Validation
- Error handling

**Middleware:**
- `auth.js`
  - `authenticate()` - JWT verification
  - `authorize()` - Role-based access
  - `getAuthenticatedUser()` - Get current user

- `validation.js`
  - `validateLogin()` - Login request validation
  - `validateRegistration()` - Registration validation
  - `validateEventCreation()` - Event creation validation

## 🔄 Request Flow

```
Client Request
    ↓
API Route (app/api/)
    ↓
Controller (server/controllers/)
    ↓
Middleware (auth, validation)
    ↓
Service (server/services/)
    ↓
Model (models/)
    ↓
Database (MongoDB)
    ↓
Response back through layers
```

## 📝 Example: Create Event Flow

1. **Client** → POST `/api/events`
2. **API Route** → `app/api/events/route.js`
   ```javascript
   export async function POST(request) {
     return await EventController.createEvent(request)
   }
   ```

3. **Controller** → `EventController.createEvent()`
   - Validates authentication
   - Validates request body
   - Calls service layer

4. **Service** → `EventService.createEvent()`
   - Checks user permissions (must be host)
   - Prepares event data
   - Creates event in database
   - Updates user's createdEvents

5. **Model** → `Event.create()`
   - Mongoose validates schema
   - Saves to MongoDB

6. **Response** → Returns through layers
   - Service returns event object
   - Controller formats response
   - API route sends JSON

## 🛡️ Authentication Flow

```
Request with JWT
    ↓
authenticate() middleware
    ↓
Verify token
    ↓
Extract user ID
    ↓
authorize() (optional - role check)
    ↓
Controller proceeds
```

## 📦 Key Features

### Configuration Management
- Centralized config in `server/config/`
- Environment-based settings
- Application constants

### Standardized API Responses
```javascript
// Success
{
  success: true,
  message: "Operation successful",
  data: {...},
  statusCode: 200
}

// Error
{
  success: false,
  message: "Error message",
  details: {...},
  statusCode: 400
}
```

### Error Handling
- Consistent error responses
- Validation error formatting
- Authentication errors
- Authorization errors

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- Request validation
- Protected routes

## 🚀 Usage Examples

### Using Controllers in API Routes

**Before (Inline Logic):**
```javascript
export async function POST(request) {
  // 50+ lines of logic here
  const body = await request.json()
  // validation, db calls, error handling...
}
```

**After (MVC):**
```javascript
import EventController from '../../../server/controllers/EventController'

export async function POST(request) {
  return await EventController.createEvent(request)
}
```

### Using Services in Controllers

```javascript
// In Controller
const result = await EventService.createEvent(userId, eventData)

// In Service
async createEvent(userId, eventData) {
  // Business logic
  const user = await User.findById(userId)
  if (user.role !== 'host') throw new Error('Only hosts can create events')
  // ...
}
```

## 📋 Benefits of MVC Structure

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Reusability**: Services can be used by multiple controllers
3. **Testability**: Easy to unit test each layer independently
4. **Maintainability**: Clear structure, easy to locate and fix bugs
5. **Scalability**: Easy to add new features following the pattern
6. **Code Organization**: Logical grouping of related functionality

## 🔧 Migration Notes

The old routes in `app/api/` have been refactored to use the new MVC structure. The new route files (`*_new.js`) are the recommended versions. Once verified, the old files can be removed.

## 📚 Next Steps

1. ✅ MVC structure created
2. ✅ Controllers, Services, Middleware implemented
3. ✅ API routes refactored
4. 🔄 Test all endpoints
5. 📝 Remove legacy code
6. 🧪 Add unit tests for services
7. 📊 Add logging and monitoring
