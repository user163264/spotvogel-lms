# Teacher-Focused Learning Management System

A teacher-centric learning management system designed to reduce workload and address teacher shortages in Belgium through automation, streamlined lesson creation, and minimal administrative burden.

## Project Overview

This Learning Management System (LMS) is specifically designed with teachers in mind, focusing on:

- **Reducing Workload**: Automate repetitive tasks and streamline lesson creation
- **AI-Generated Exercises**: Leverage ChatGPT to create customized exercises for students
- **Template-Based Workflow**: Allow teachers to create their own teaching templates
- **Minimized Administration**: Track student progress with minimal data entry
- **Multi-Language Support**: Built for Dutch, French, and English courses

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: OpenAI API (ChatGPT)

## Features

### Phase 1 (Current)
1. **Lesson Template System**: Create standardized workflows for lessons
2. **AI-Generated Exercises**: Automatically generate various exercise types
3. **Student Submissions & Tracking**: Simple interface for submitting and tracking work
4. **Minimal Administrative Tasks**: Auto-track student progress
5. **Multi-Language Support**: Dutch, French, and English

### Phase 2 (Implemented)
- Auto-Grading & Feedback with AI
- Collaboration & Lesson Sharing
- Analytics & Teacher Dashboard
- Offline Functionality
- Integration with School Systems

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (local or Atlas)
- [OpenAI API Key](https://platform.openai.com/) (for AI exercise generation)

### Installation

#### 1. Clone the repository
```
git clone <repository-url>
cd lms-system
```

#### 2. Set up the backend
```
cd server
npm install
```

Create a `.env` file in the server directory with the following variables:
```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/teacher-lms
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-3.5-turbo
NODE_ENV=development
```

> **Note on Port Configuration**: This application uses port 8080 for the backend API instead of the more common port 5000. This is because port 5000 is used by macOS Control Center for AirPlay services in newer versions of macOS. If you're not using macOS, you can change this to another port if needed, but make sure to update all references to the port in both the server and client configurations.

#### 3. Set up the frontend
```
cd ../client
npm install
```

#### 4. Start the development servers

In the server directory:
```
npm run dev
```

In the client directory:
```
npm start
```

The frontend will be available at http://localhost:3000 and the backend API at http://localhost:8080.

## Project Structure

```
lms-system/
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/                # Source code
│       ├── assets/         # Images, fonts, etc.
│       ├── components/     # Reusable UI components
│       ├── context/        # React context for state management
│       └── pages/          # Main application pages
│
└── server/                 # Node.js backend
    ├── config/             # Configuration files
    ├── controllers/        # Request handlers
    ├── middleware/         # Custom middleware
    ├── models/             # Database models
    └── routes/             # API routes
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user (admin only)
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user (admin only)

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/my` - Get current user's templates
- `GET /api/templates/:id` - Get template by ID
- `POST /api/templates` - Create a new template
- `PUT /api/templates/:id` - Update a template
- `DELETE /api/templates/:id` - Delete a template

### Exercises
- `GET /api/exercises` - Get all exercises
- `GET /api/exercises/my` - Get current user's exercises
- `GET /api/exercises/:id` - Get exercise by ID
- `POST /api/exercises` - Create a new exercise
- `PUT /api/exercises/:id` - Update an exercise
- `DELETE /api/exercises/:id` - Delete an exercise

### AI Exercise Generation
- `POST /api/generate/exercises` - Generate exercises using AI
- `POST /api/generate/save` - Save AI-generated exercises to database
- `POST /api/generate/create-template` - Create template from existing exercise
- `POST /api/generate/grade/:submissionId` - Grade a submission using AI

### Submissions
- `GET /api/submissions` - Get all submissions
- `GET /api/submissions/my` - Get current user's submissions
- `GET /api/submissions/exercise/:exerciseId` - Get submissions for an exercise
- `GET /api/submissions/:id` - Get submission by ID
- `POST /api/submissions` - Create a new submission
- `PUT /api/submissions/:id` - Update a submission

## User Roles

The system supports three user roles:

1. **Teacher**
   - Create and manage lesson templates
   - Create and generate exercises
   - View and grade student submissions

2. **Student**
   - View and complete exercises
   - View their own submissions and grades

3. **Admin**
   - Manage all users, templates, exercises, and submissions
   - System configuration and monitoring

## Development Roadmap

### Immediate Next Steps
1. ✓ Implement exercise submission and auto-grading with AI
2. ✓ Enhance AI exercise generation with more options
3. Add template sharing between teachers
4. Improve user interface and experience
5. Test and refine AI-generated content quality

### Long-term Goals
1. Develop analytics dashboard for teacher workload
2. Create a mobile app for offline access
3. Implement integration with existing school administrative systems
4. Support more languages and subject areas

## Troubleshooting

### Port Conflicts

#### macOS Port 5000 Conflict
On newer versions of macOS, port 5000 is used by AirPlay Receiver in Control Center. This can cause 403 Forbidden errors if you try to run your server on this port. Options to resolve this issue:

1. **Use a different port** (recommended, already implemented with port 8080)

2. **Disable AirPlay Receiver**:
   - Go to System Preferences > Sharing
   - Uncheck AirPlay Receiver
   - Note: This is not recommended as it disables a macOS feature

3. **Check for port conflicts**:
   Run `sudo lsof -i :<port>` to see what process is using a specific port

#### Checking for Available Ports
To check if a port is free before starting your server:
```bash
lsof -i :<port>
```

If this command returns nothing, the port is available.

### MongoDB Connection Issues

If you experience problems connecting to MongoDB:

1. Ensure MongoDB is running with `mongod --version`
2. Check the MongoDB connection string in your `.env` file
3. If using a local MongoDB, make sure the service is started

### 403 Forbidden Errors

If you encounter 403 Forbidden errors when trying to access API endpoints:

1. Check for port conflicts as described above
2. Verify CORS settings in the server configuration
3. Check authentication middleware (if applicable to that route)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Setting Up OpenAI Integration

The LMS uses OpenAI's API for AI-based exercise generation and auto-grading. To set up:

### 1. Get an OpenAI API Key

1. Visit [OpenAI's platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API keys section in your account
4. Create a new secret key
5. Copy the key (note: it will only be shown once)

### 2. Configure Your Environment

1. Open the `.env` file in the server directory
2. Replace the placeholder `OPENAI_API_KEY=your_openai_api_key` with your actual key:
   ```
   OPENAI_API_KEY=sk-your-actual-openai-key-goes-here
   ```
3. Optionally modify the model used (default is gpt-3.5-turbo):
   ```
   OPENAI_MODEL=gpt-3.5-turbo
   ```

### 3. Usage Considerations

- **Costs**: Using the OpenAI API incurs charges based on token usage. Monitor your usage in the OpenAI dashboard.
- **Rate Limits**: Be aware of OpenAI's rate limits, especially in a classroom setting with many simultaneous requests.
- **Fallback**: The system is designed to work without AI features if the API is unavailable, though functionality will be limited.

## Contributing

We welcome contributions to this project! Please feel free to submit issues and pull requests.

## Acknowledgments

- This project was developed as a solution to address teacher shortages and reduce burnout.
- Special thanks to all the educators who provided input on features and usability.
