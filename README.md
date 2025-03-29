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

### Phase 2 (Planned)
- Auto-Grading & Feedback
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
git clone https://github.com/spotvogel-team/lms-system.git
cd lms-system
```

#### 2. Set up the backend
```
cd server
npm install
```

Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/teacher-lms
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=development
```

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

The frontend will be available at http://localhost:3000 and the backend API at http://localhost:5000.

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
└── work-updates/           # Team work updates
    ├── frontend/           # Finny's frontend updates
    ├── backend/            # Sarah's backend updates
    ├── exercise-generation/# Alex's exercise updates
    └── debugging/          # Frank's debugging logs
```

## Development Workflow

### Branch Structure
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Individual feature branches
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Contribution Guidelines
See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## Team

- **Finny Frontend** - Frontend Engineer
- **Sarah Server** - Backend Engineer
- **Alex Ex** - AI Exercise Creator
- **Frank De Poorter** - Project Overseer & Debugging

## License

This project is licensed under the MIT License - see the LICENSE file for details.
