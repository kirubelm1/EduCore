# EduCore - School Management System

A comprehensive, modern school management system built with Next.js 16, Firebase, and TypeScript. EduCore provides role-based dashboards for administrators, teachers, students, and parents to streamline educational workflows and communication.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-12.6-orange?style=flat-square&logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## Features

### Role-Based Access Control
- **Admin Dashboard**: Complete system management with CRUD operations for students, teachers, classes, and announcements
- **Teacher Dashboard**: Class management, assignment creation, and student tracking
- **Student Dashboard**: View assignments, classes, grades, and school announcements
- **Parent Dashboard**: Monitor children's academic progress, assignments, and school updates

### Core Functionality
- Firebase Authentication (Email/Password)
- Cloud Firestore for real-time data management
- Firebase Storage for file uploads (assignments, profile pictures, study materials)
- Responsive design optimized for mobile and desktop
- Dark mode support
- Real-time updates across all dashboards

### Admin Features
- Manage student records (add, edit, delete, search)
- Manage teacher profiles and assignments
- Create and organize classes
- Post announcements with priority levels and target audiences
- View system statistics and overview

### Teacher Features
- View assigned classes and student rosters
- Create assignments with due dates and point values
- Track assignment submissions
- Access student information

### Student Features
- View all assignments with due dates and status
- Track enrolled classes and grades
- Read school and class announcements
- Upload assignment submissions

### Parent Features
- Monitor multiple children's profiles
- View children's assignments and due dates
- Track academic progress
- Receive school and class announcements

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ or higher
- npm, yarn, or pnpm
- Firebase account and project

## Installation

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/yourusername/educore.git
cd educore
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 3. Firebase Setup

#### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable the following services:
   - **Authentication**: Enable Email/Password sign-in method
   - **Firestore Database**: Create in production mode
   - **Storage**: Enable Firebase Storage

#### Configure Firebase
1. Navigate to Project Settings → General
2. Scroll down to "Your apps" and create a Web app
3. Copy your Firebase configuration

#### Update Firebase Config
Open `lib/firebase/config.ts` and replace the configuration with your project's credentials:

\`\`\`typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
\`\`\`

#### Firestore Security Rules
Set up the following security rules in Firestore:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Students collection
    match /students/{studentId} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Teachers collection
    match /teachers/{teacherId} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Classes collection
    match /classes/{classId} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'teacher'];
    }
    
    // Assignments collection
    match /assignments/{assignmentId} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'teacher'];
    }
    
    // Announcements collection
    match /announcements/{announcementId} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'teacher'];
    }
  }
}
\`\`\`

#### Storage Security Rules
Set up the following security rules in Storage:

\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /assignments/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /profile-pictures/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /materials/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
\`\`\`

### 4. Run the development server

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
educore/
├── app/
│   ├── admin/              # Admin dashboard pages
│   │   ├── announcements/  # Announcement management
│   │   ├── classes/        # Class management
│   │   ├── students/       # Student management
│   │   ├── teachers/       # Teacher management
│   │   └── page.tsx        # Admin dashboard home
│   ├── teacher/            # Teacher dashboard pages
│   │   ├── assignments/    # Assignment management
│   │   ├── classes/        # Teacher's classes
│   │   ├── students/       # Student roster
│   │   └── page.tsx        # Teacher dashboard home
│   ├── student/            # Student dashboard pages
│   │   ├── announcements/  # View announcements
│   │   ├── assignments/    # View assignments
│   │   ├── classes/        # View enrolled classes
│   │   └── page.tsx        # Student dashboard home
│   ├── parent/             # Parent dashboard pages
│   │   ├── announcements/  # View announcements
│   │   ├── assignments/    # View children's assignments
│   │   ├── children/       # View children profiles
│   │   └── page.tsx        # Parent dashboard home
│   ├── login/              # Login page
│   ├── signup/             # Registration page
│   ├── forgot-password/    # Password reset page
│   ├── layout.tsx          # Root layout with AuthProvider
│   ├── page.tsx            # Landing/home page
│   └── globals.css         # Global styles with theme tokens
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── auth-guard.tsx      # Route protection component
│   ├── dashboard-nav.tsx   # Navigation component
│   └── file-upload.tsx     # File upload component
├── hooks/
│   └── use-auth.tsx        # Authentication hook
├── lib/
│   ├── firebase/
│   │   ├── config.ts       # Firebase initialization
│   │   ├── auth.ts         # Auth functions
│   │   ├── firestore.ts    # Firestore helpers
│   │   └── storage.ts      # Storage helpers
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
\`\`\`

## Usage

### Creating an Admin Account
The first user you create should be an admin. To create an admin account:

1. Sign up with an email and password
2. Select "Admin" as the role during registration
3. After registration, you'll be redirected to the admin dashboard

### User Roles
- **Admin**: Full system access, can manage all users, classes, and content
- **Teacher**: Can create assignments, manage classes, and view students
- **Student**: Can view assignments, classes, and submit work
- **Parent**: Can monitor children's progress and view announcements

### Workflow Examples

#### Admin Workflow
1. Log in with admin credentials
2. Add teachers via the Teachers page
3. Add students via the Students page
4. Create classes and assign teachers
5. Post announcements for different audiences

#### Teacher Workflow
1. Log in with teacher credentials
2. View assigned classes
3. Create assignments with due dates
4. View student rosters
5. Post class-specific announcements

#### Student Workflow
1. Log in with student credentials
2. View assignments and due dates
3. Upload assignment submissions
4. Track grades and progress
5. Read announcements

#### Parent Workflow
1. Log in with parent credentials
2. View children's profiles
3. Monitor assignment completion
4. Check grades and attendance
5. Stay updated with school announcements

## Development

### Environment Variables
If you add environment variables, create a `.env.local` file:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

### Building for Production

\`\`\`bash
npm run build
npm run start
\`\`\`

### Code Quality

\`\`\`bash
npm run lint
\`\`\`

## Deployment

### Deploy to Vercel

The easiest way to deploy EduCore is using the [Vercel Platform](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Vercel will automatically detect Next.js and configure the build
4. Add your Firebase configuration as environment variables
5. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Environment Variables on Vercel
Add the following environment variables in your Vercel project settings:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

## Security Considerations

- Never commit Firebase configuration files with sensitive credentials to public repositories
- Use environment variables for sensitive data in production
- Implement proper Firestore and Storage security rules
- Validate all user inputs on the client and server
- Regularly update dependencies for security patches
- Consider implementing rate limiting for authentication endpoints
- Enable Firebase App Check for additional security

## Troubleshooting

### Firebase Connection Issues
- Verify your Firebase configuration in `lib/firebase/config.ts`
- Ensure Firebase services are enabled in your Firebase Console
- Check Firebase security rules allow your operations

### Authentication Issues
- Confirm Email/Password authentication is enabled in Firebase Console
- Clear browser cache and cookies
- Check browser console for specific error messages

### Build Errors
- Delete `node_modules` and `.next` folders, then reinstall dependencies
- Ensure you're using Node.js 18 or higher
- Check for TypeScript errors with `npm run build`

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Backend powered by [Firebase](https://firebase.google.com/)
- Icons by [Lucide](https://lucide.dev/)

## Support

Made with ❤️ for better education management
