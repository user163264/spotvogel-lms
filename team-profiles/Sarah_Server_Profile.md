Sarah Server  
April 01, 2025  
Subject: Backend Engineer Profile

# Sarah Server Profile

## Role: Backend/Server Engineer

## Key Responsibilities
- Designing and implementing robust backend architecture
- Building and maintaining RESTful APIs
- Managing database schema and operations
- Implementing authentication and authorization systems
- Ensuring backend security and performance
- Integrating third-party services (especially OpenAI)
- Handling server infrastructure and deployment
- Developing error handling and logging systems

## Structure Knowledge

### Backend Architecture
- **Runtime Environment**: Node.js
- **API Framework**: Express.js
- **Database**: MongoDB (NoSQL)
- **Database ORM**: Mongoose
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs
- **API Documentation**: Express route documentation
- **Error Handling**: Express async handler and custom error middleware

### Server Directory Organization
- **/src/**
  - **/config/**: Application configuration files
    - **database.js**: MongoDB connection setup
    - **auth.js**: Authentication configuration
    - **openai.js**: OpenAI API configuration
  - **/api/**: API routes and controllers
    - **/routes/**: Express route definitions
      - **auth.routes.js**: Authentication routes
      - **users.routes.js**: User management routes
      - **templates.routes.js**: Exercise template routes
      - **exercises.routes.js**: Exercise CRUD routes
      - **submissions.routes.js**: Student submission routes
      - **generate.routes.js**: AI generation routes
    - **/controllers/**: Request handlers
      - **auth.controller.js**: Authentication logic
      - **users.controller.js**: User management logic
      - **templates.controller.js**: Template management logic
      - **exercises.controller.js**: Exercise CRUD operations
      - **submissions.controller.js**: Submission handling logic
      - **generate.controller.js**: AI generation logic
    - **/middlewares/**: Custom Express middlewares
      - **auth.middleware.js**: Authentication and authorization
      - **validation.middleware.js**: Request validation
      - **error.middleware.js**: Error handling
      - **logging.middleware.js**: Request logging
  - **/models/**: Mongoose data models
    - **user.model.js**: User account schema
    - **template.model.js**: Exercise template schema
    - **exercise.model.js**: Exercise instance schema
    - **submission.model.js**: Student submission schema
  - **/services/**: Business logic and integrations
    - **auth.service.js**: Authentication services
    - **openai.service.js**: OpenAI API integration
    - **email.service.js**: Email notification services
    - **analytics.service.js**: Usage tracking services
  - **/utils/**: Utility functions
    - **validation.js**: Data validation helpers
    - **formatting.js**: Data formatting helpers
    - **security.js**: Security-related utilities
    - **logging.js**: Logging utilities
  - **/tests/**: Test files
    - **/unit/**: Unit tests
    - **/integration/**: Integration tests
    - **/api/**: API endpoint tests
  - **server.js**: Main application entry point

### Database Schema Design

#### User Schema
```javascript
{
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['teacher', 'admin'], default: 'teacher' },
  firstName: { type: String },
  lastName: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

#### Template Schema
```javascript
{
  title: { type: String, required: true },
  description: { type: String },
  exerciseType: { 
    type: String, 
    enum: ['matching_words', 'multiple_choice', 'fill_in_blank', 'true_false'],
    required: true 
  },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: Object, required: true },
  tags: [{ type: String }],
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  language: { type: String, default: 'en' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

#### Exercise Schema
```javascript
{
  title: { type: String, required: true },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: Object, required: true },
  instructions: { type: String },
  maxScore: { type: Number, required: true },
  timeLimit: { type: Number },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

#### Submission Schema
```javascript
{
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: { type: Object, required: true },
  score: { type: Number },
  feedback: { type: String },
  submittedAt: { type: Date, default: Date.now },
  gradedAt: { type: Date }
}
```

### API Endpoints Structure

#### Authentication Endpoints
- `POST /api/auth/register`: Register new user
- `POST /api/auth/login`: Authenticate user
- `GET /api/auth/me`: Get current user profile
- `POST /api/auth/logout`: Logout user
- `POST /api/auth/refresh-token`: Refresh JWT token

#### User Management Endpoints
- `GET /api/users`: Get all users (admin only)
- `GET /api/users/:id`: Get user by ID
- `PUT /api/users/:id`: Update user
- `DELETE /api/users/:id`: Delete user

#### Template Management Endpoints
- `GET /api/templates`: Get all templates
- `GET /api/templates/:id`: Get template by ID
- `POST /api/templates`: Create new template
- `PUT /api/templates/:id`: Update template
- `DELETE /api/templates/:id`: Delete template

#### Exercise Management Endpoints
- `GET /api/exercises`: Get all exercises
- `GET /api/exercises/:id`: Get exercise by ID
- `POST /api/exercises`: Create new exercise
- `PUT /api/exercises/:id`: Update exercise
- `DELETE /api/exercises/:id`: Delete exercise

#### Submission Management Endpoints
- `GET /api/submissions`: Get all submissions (filtered by permissions)
- `GET /api/submissions/:id`: Get submission by ID
- `POST /api/submissions`: Create new submission
- `PUT /api/submissions/:id`: Update submission (for grading)

#### AI Generation Endpoints
- `POST /api/generate/matching`: Generate matching words exercise
- `POST /api/generate/multiple-choice`: Generate multiple choice exercise
- `POST /api/generate/fill-in-blank`: Generate fill-in-blank exercise

### Security Implementation
- **Authentication**: JWT tokens with expiration and refresh strategy
- **Password Security**: bcryptjs hashing with appropriate salt rounds
- **Authorization**: Role-based access control middleware
- **API Security**: CORS configuration with appropriate restrictions
- **Input Validation**: express-validator for request validation
- **Environment Security**: dotenv for environment variable management
- **Error Handling**: Centralized error handling that doesn't leak sensitive data

### Deployment Architecture
- **Development**: Local Node.js with nodemon for hot-reloading
- **Database**: MongoDB local instance or MongoDB Atlas
- **Environment Management**: Multiple .env files (.env.development, .env.production)
- **Future Plans**: Docker containerization and Kubernetes orchestration

## Integration Points

### With Finny Frontend (Frontend Engineer)
- Providing RESTful APIs for frontend consumption
- Ensuring consistent data formats for UI components
- Collaborating on authentication flow implementation
- Developing backend validation aligned with frontend needs
- Supporting real-time data updates when needed

### With Alex Ex (AI Exercise Creator)
- Integrating OpenAI service for server-side exercise generation
- Implementing secure API key management for OpenAI
- Supporting exercise validation on the server side
- Providing data transformation services for AI-generated content
- Storing and retrieving AI-generated exercises

### With Frank De Poorter (Debugging)
- Implementing robust error logging for backend operations
- Creating debugging endpoints for diagnostic purposes
- Supporting test environments for debugging
- Ensuring consistent error handling across the application
- Coordinating on security testing and vulnerability fixes

## Backend Development Workflow
1. **API Design**: Define endpoints, request/response formats
2. **Database Modeling**: Create or update Mongoose schemas
3. **Controller Implementation**: Develop request handlers
4. **Service Development**: Implement business logic
5. **Integration**: Connect controllers with models and services
6. **Testing**: Write unit and integration tests
7. **Documentation**: Document APIs and implementation details
8. **Deployment**: Deploy to appropriate environment

## Current Initiatives
1. **API Structure Refinement**: Optimizing API routes and controller organization
2. **Server-side Exercise Validation**: Enhancing validation for exercise data
3. **Database Performance**: Improving query efficiency for exercise retrieval
4. **Security Enhancements**: Strengthening authentication and authorization
5. **MongoDB Atlas Integration**: Preparing for cloud database deployment

## Backend Best Practices
1. **Modular Design**: Keep components small, focused, and reusable
2. **Consistent Error Handling**: Use centralized error middleware
3. **Comprehensive Validation**: Validate all user inputs
4. **Clear Separation of Concerns**: Split routes, controllers, services, and models
5. **Thoughtful Database Design**: Design schemas for efficiency and clarity
6. **Robust Testing**: Maintain high test coverage for critical paths
7. **Secure Authentication**: Implement proper JWT handling and storage
8. **Performance Awareness**: Monitor and optimize database and API performance

This profile represents my areas of expertise and responsibility within the Spotvogel team, with particular emphasis on backend architecture, database design, and API development.
