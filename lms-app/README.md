# EduLMS - Learning Management System

A comprehensive Learning Management System built with React, Clerk authentication, and Tailwind CSS.

## Features

### 🎓 Student Features
- **Dashboard**: Overview of courses, assignments, and progress
- **Course Management**: Browse, enroll, and track course progress
- **Assignments**: View and submit assignments, quizzes, and projects
- **Grades**: Track academic performance with detailed analytics
- **Profile**: Manage personal information and learning preferences

### 👨‍🏫 Instructor Features
- **Course Creation**: Create and manage courses with lessons and content
- **Student Management**: Monitor student progress and engagement
- **Grading System**: Grade assignments and provide feedback
- **Analytics**: Track course performance and student outcomes

### 🔧 Admin Features
- **User Management**: Manage students, instructors, and admin accounts
- **Course Oversight**: Monitor all courses and their performance
- **Analytics Dashboard**: Platform-wide statistics and insights
- **Content Moderation**: Review and approve course content

## Tech Stack

- **Frontend**: React 18 with JSX (no TypeScript)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Heroicons
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Clerk account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lms-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Clerk Authentication**
   - Sign up for a free account at [clerk.com](https://clerk.com)
   - Create a new application
   - Copy your publishable key from the dashboard
   - Replace the placeholder in `.env` file:
     ```env
     VITE_CLERK_PUBLISHABLE_KEY=your_actual_clerk_key_here
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout with sidebar navigation
│   └── LoadingSpinner.jsx
├── pages/              # Page components
│   ├── Dashboard.jsx   # Student dashboard
│   ├── Courses.jsx     # Course listing and management
│   ├── CourseDetail.jsx # Individual course view
│   ├── Assignments.jsx # Assignment management
│   ├── Grades.jsx      # Grade tracking and analytics
│   ├── Profile.jsx     # User profile management
│   └── AdminPanel.jsx  # Admin dashboard
├── App.jsx             # Main app component with routing
├── main.jsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## Key Features Implementation

### Authentication
- Secure user authentication with Clerk
- Role-based access control (Student, Instructor, Admin)
- Protected routes and components

### Dashboard
- Real-time statistics and progress tracking
- Recent courses and upcoming assignments
- Performance charts and analytics

### Course Management
- Course browsing with search and filters
- Enrollment system
- Progress tracking
- Video content delivery (ready for integration)

### Assignment System
- Multiple assignment types (assignments, quizzes, projects, exams)
- Due date tracking and notifications
- Submission and grading workflow
- Feedback system

### Analytics
- Student performance tracking
- Course analytics
- Platform-wide statistics
- Interactive charts and graphs

## Customization

### Styling
The app uses Tailwind CSS with a custom color scheme. You can modify colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your primary color palette
      },
      secondary: {
        // Your secondary color palette
      }
    }
  }
}
```

### Adding New Features
1. Create new components in the `components/` directory
2. Add new pages in the `pages/` directory
3. Update routing in `App.jsx`
4. Add navigation items in `Layout.jsx`

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your Clerk environment variables
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports React applications:
- Netlify
- AWS Amplify
- Heroku
- DigitalOcean App Platform

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

## Roadmap

- [ ] Video streaming integration
- [ ] Real-time notifications
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Integration with external tools
- [ ] Multi-language support
- [ ] Advanced assessment types
- [ ] Social learning features

---

Built with ❤️ using React, Clerk, and Tailwind CSS