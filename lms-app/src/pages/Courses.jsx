import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  BookOpenIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'programming', name: 'Programming' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' },
    { id: 'science', name: 'Science' },
    { id: 'language', name: 'Language' },
  ];

  // Mock data - in a real app, this would come from an API
  const mockCourses = [
    {
      id: 1,
      title: 'Advanced React Development',
      instructor: 'Dr. Sarah Johnson',
      description: 'Master advanced React concepts including hooks, context, and performance optimization.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
      category: 'programming',
      duration: '12 weeks',
      students: 1250,
      rating: 4.8,
      price: 199,
      level: 'Advanced',
      progress: 0,
      isEnrolled: false,
      lessons: 24,
      createdAt: '2024-01-01',
    },
    {
      id: 2,
      title: 'Database Design Principles',
      instructor: 'Prof. Michael Chen',
      description: 'Learn database design, normalization, and optimization techniques.',
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop',
      category: 'programming',
      duration: '8 weeks',
      students: 890,
      rating: 4.6,
      price: 149,
      level: 'Intermediate',
      progress: 45,
      isEnrolled: true,
      lessons: 16,
      createdAt: '2024-01-05',
    },
    {
      id: 3,
      title: 'UI/UX Design Masterclass',
      instructor: 'Emily Rodriguez',
      description: 'Complete guide to modern UI/UX design principles and tools.',
      thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=250&fit=crop',
      category: 'design',
      duration: '10 weeks',
      students: 2100,
      rating: 4.9,
      price: 179,
      level: 'Beginner',
      progress: 0,
      isEnrolled: false,
      lessons: 20,
      createdAt: '2024-01-10',
    },
    {
      id: 4,
      title: 'Machine Learning Fundamentals',
      instructor: 'Dr. Alex Thompson',
      description: 'Introduction to machine learning algorithms and applications.',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop',
      category: 'science',
      duration: '14 weeks',
      students: 1680,
      rating: 4.7,
      price: 249,
      level: 'Intermediate',
      progress: 90,
      isEnrolled: true,
      lessons: 28,
      createdAt: '2024-01-15',
    },
    {
      id: 5,
      title: 'Digital Marketing Strategy',
      instructor: 'Lisa Wang',
      description: 'Comprehensive digital marketing course covering all major platforms.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
      category: 'business',
      duration: '6 weeks',
      students: 950,
      rating: 4.5,
      price: 129,
      level: 'Beginner',
      progress: 0,
      isEnrolled: false,
      lessons: 12,
      createdAt: '2024-01-20',
    },
    {
      id: 6,
      title: 'Spanish for Beginners',
      instructor: 'Maria Garcia',
      description: 'Learn Spanish from scratch with practical conversation skills.',
      thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop',
      category: 'language',
      duration: '16 weeks',
      students: 750,
      rating: 4.6,
      price: 99,
      level: 'Beginner',
      progress: 0,
      isEnrolled: false,
      lessons: 32,
      createdAt: '2024-01-25',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = courses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'duration':
          return a.duration.localeCompare(b.duration);
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedCategory, sortBy]);

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEnroll = (courseId) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, isEnrolled: true, progress: 0 }
        : course
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
        <p className="text-gray-600 mt-2">Discover and enroll in courses to advance your skills</p>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="card hover:shadow-lg transition-shadow duration-200">
            {/* Course Thumbnail */}
            <div className="relative mb-4">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="bg-white bg-opacity-90 px-2 py-1 rounded-full text-sm font-medium text-gray-900">
                  ${course.price}
                </span>
              </div>
              {course.isEnrolled && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <Link
                    to={`/courses/${course.id}`}
                    className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    <PlayIcon className="h-5 w-5 inline mr-2" />
                    Continue Learning
                  </Link>
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{course.instructor}</p>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <BookOpenIcon className="h-4 w-4 mr-1" />
                    {course.lessons} lessons
                  </div>
                </div>
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                  {course.rating}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  {course.students.toLocaleString()} students
                </div>
              </div>

              {/* Progress Bar (if enrolled) */}
              {course.isEnrolled && course.progress > 0 && (
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                {course.isEnrolled ? (
                  <Link
                    to={`/courses/${course.id}`}
                    className="btn-primary w-full text-center block"
                  >
                    Continue Course
                  </Link>
                ) : (
                  <button
                    onClick={() => handleEnroll(course.id)}
                    className="btn-primary w-full"
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Courses;