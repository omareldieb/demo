import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  PlayIcon,
  ClockIcon,
  BookOpenIcon,
  UserGroupIcon,
  StarIcon,
  CheckCircleIcon,
  LockClosedIcon,
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentLesson, setCurrentLesson] = useState(null);

  // Mock data - in a real app, this would come from an API
  const mockCourse = {
    id: parseInt(id),
    title: 'Advanced React Development',
    instructor: 'Dr. Sarah Johnson',
    description: 'Master advanced React concepts including hooks, context, and performance optimization. This comprehensive course covers everything from basic React principles to advanced patterns used in production applications.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    category: 'programming',
    duration: '12 weeks',
    students: 1250,
    rating: 4.8,
    price: 199,
    level: 'Advanced',
    progress: 75,
    isEnrolled: true,
    lessons: 24,
    createdAt: '2024-01-01',
    instructorBio: 'Dr. Sarah Johnson is a senior software engineer with over 10 years of experience in React development. She has worked at major tech companies and is passionate about teaching modern web development.',
    requirements: [
      'Basic knowledge of JavaScript',
      'Understanding of HTML and CSS',
      'Node.js installed on your computer',
      'Code editor (VS Code recommended)',
    ],
    whatYouWillLearn: [
      'Advanced React patterns and best practices',
      'State management with Redux and Context API',
      'Performance optimization techniques',
      'Testing React applications',
      'Building scalable component libraries',
      'Server-side rendering with Next.js',
    ],
    curriculum: [
      {
        id: 1,
        title: 'Introduction to Advanced React',
        duration: '45 min',
        type: 'video',
        isCompleted: true,
        isLocked: false,
        description: 'Overview of advanced React concepts and course structure',
      },
      {
        id: 2,
        title: 'React Hooks Deep Dive',
        duration: '1h 20min',
        type: 'video',
        isCompleted: true,
        isLocked: false,
        description: 'Understanding useState, useEffect, and custom hooks',
      },
      {
        id: 3,
        title: 'Context API and State Management',
        duration: '1h 30min',
        type: 'video',
        isCompleted: true,
        isLocked: false,
        description: 'Managing global state with Context API',
      },
      {
        id: 4,
        title: 'Performance Optimization',
        duration: '1h 15min',
        type: 'video',
        isCompleted: false,
        isLocked: false,
        description: 'React.memo, useMemo, useCallback, and other optimization techniques',
      },
      {
        id: 5,
        title: 'Testing React Components',
        duration: '1h 45min',
        type: 'video',
        isCompleted: false,
        isLocked: false,
        description: 'Unit testing with Jest and React Testing Library',
      },
      {
        id: 6,
        title: 'Assignment: Build a Todo App',
        duration: '2h',
        type: 'assignment',
        isCompleted: false,
        isLocked: false,
        description: 'Apply learned concepts to build a complete todo application',
      },
      {
        id: 7,
        title: 'Advanced Patterns',
        duration: '1h 30min',
        type: 'video',
        isCompleted: false,
        isLocked: true,
        description: 'Higher-order components, render props, and compound components',
      },
    ],
    reviews: [
      {
        id: 1,
        author: 'John Doe',
        rating: 5,
        comment: 'Excellent course! The instructor explains complex concepts in a very clear way.',
        date: '2024-01-10',
      },
      {
        id: 2,
        author: 'Jane Smith',
        rating: 4,
        comment: 'Great content and practical examples. Highly recommended for React developers.',
        date: '2024-01-08',
      },
    ],
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourse(mockCourse);
    }, 1000);
  }, [id]);

  if (!course) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const getLessonIcon = (type, isCompleted, isLocked) => {
    if (isLocked) {
      return <LockClosedIcon className="h-5 w-5 text-gray-400" />;
    }
    
    if (isCompleted) {
      return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
    }

    switch (type) {
      case 'video':
        return <VideoCameraIcon className="h-5 w-5 text-gray-600" />;
      case 'assignment':
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
      default:
        return <BookOpenIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'curriculum', name: 'Curriculum' },
    { id: 'reviews', name: 'Reviews' },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/courses"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Courses
      </Link>

      {/* Course Header */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Course Thumbnail */}
          <div className="lg:w-1/2">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-64 lg:h-80 object-cover rounded-lg"
            />
          </div>

          {/* Course Info */}
          <div className="lg:w-1/2 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600 mt-2">by {course.instructor}</p>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                {course.rating} ({course.students} students)
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-1" />
                {course.duration}
              </div>
              <div className="flex items-center">
                <BookOpenIcon className="h-5 w-5 mr-1" />
                {course.lessons} lessons
              </div>
            </div>

            <p className="text-gray-700">{course.description}</p>

            {/* Progress Bar */}
            {course.isEnrolled && (
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Course Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {course.isEnrolled ? (
                <button
                  onClick={() => setCurrentLesson(course.curriculum.find(l => !l.isCompleted && !l.isLocked))}
                  className="btn-primary flex items-center"
                >
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Continue Learning
                </button>
              ) : (
                <button className="btn-primary">
                  Enroll Now - ${course.price}
                </button>
              )}
              <button className="btn-secondary flex items-center">
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                Ask Question
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* What You'll Learn */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What you'll learn</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {course.whatYouWillLearn.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructor */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor</h3>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xl font-semibold text-gray-600">
                      {course.instructor.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{course.instructor}</h4>
                    <p className="text-gray-600 text-sm mt-1">{course.instructorBio}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Course Curriculum</h3>
              <div className="space-y-2">
                {course.curriculum.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      lesson.isLocked
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {getLessonIcon(lesson.type, lesson.isCompleted, lesson.isLocked)}
                      <div>
                        <h4 className={`font-medium ${
                          lesson.isLocked ? 'text-gray-400' : 'text-gray-900'
                        }`}>
                          {lesson.title}
                        </h4>
                        <p className={`text-sm ${
                          lesson.isLocked ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {lesson.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${
                        lesson.isLocked ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {lesson.duration}
                      </span>
                      {!lesson.isLocked && (
                        <button className="text-primary-600 hover:text-primary-700">
                          <PlayIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Student Reviews</h3>
              <div className="space-y-4">
                {course.reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{review.author}</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-sm text-gray-500 mt-2">{review.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;