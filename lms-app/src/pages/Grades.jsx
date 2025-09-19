import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  AcademicCapIcon,
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  BookOpenIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [stats, setStats] = useState({
    overallAverage: 0,
    totalAssignments: 0,
    completedAssignments: 0,
    averageTrend: 0,
  });

  const courses = [
    { id: 'all', name: 'All Courses' },
    { id: 1, name: 'Advanced React Development' },
    { id: 2, name: 'Database Design Principles' },
    { id: 3, name: 'UI/UX Design Masterclass' },
    { id: 4, name: 'Machine Learning Fundamentals' },
    { id: 5, name: 'Digital Marketing Strategy' },
  ];

  // Mock data - in a real app, this would come from an API
  const mockGrades = [
    {
      id: 1,
      title: 'React Hooks Assignment',
      course: 'Advanced React Development',
      courseId: 1,
      type: 'assignment',
      points: 100,
      earned: 92,
      percentage: 92,
      grade: 'A',
      submittedAt: '2024-01-15',
      gradedAt: '2024-01-16',
      feedback: 'Excellent implementation of custom hooks. Great use of TypeScript and proper error handling.',
    },
    {
      id: 2,
      title: 'Database Design Quiz',
      course: 'Database Design Principles',
      courseId: 2,
      type: 'quiz',
      points: 50,
      earned: 45,
      percentage: 90,
      grade: 'A-',
      submittedAt: '2024-01-17',
      gradedAt: '2024-01-18',
      feedback: 'Good understanding of normalization concepts. Review indexing strategies.',
    },
    {
      id: 3,
      title: 'UI Design Critique',
      course: 'UI/UX Design Masterclass',
      courseId: 3,
      type: 'assignment',
      points: 75,
      earned: 66,
      percentage: 88,
      grade: 'B+',
      submittedAt: '2024-01-19',
      gradedAt: '2024-01-20',
      feedback: 'Well-structured critique with good insights. Consider more specific examples.',
    },
    {
      id: 4,
      title: 'ML Model Implementation',
      course: 'Machine Learning Fundamentals',
      courseId: 4,
      type: 'project',
      points: 200,
      earned: 180,
      percentage: 90,
      grade: 'A-',
      submittedAt: '2024-01-22',
      gradedAt: '2024-01-24',
      feedback: 'Impressive model performance. Documentation could be more detailed.',
    },
    {
      id: 5,
      title: 'Marketing Strategy Quiz',
      course: 'Digital Marketing Strategy',
      courseId: 5,
      type: 'quiz',
      points: 30,
      earned: 27,
      percentage: 90,
      grade: 'A-',
      submittedAt: '2024-01-25',
      gradedAt: '2024-01-26',
      feedback: 'Good grasp of digital marketing concepts.',
    },
    {
      id: 6,
      title: 'React Performance Optimization',
      course: 'Advanced React Development',
      courseId: 1,
      type: 'assignment',
      points: 100,
      earned: 88,
      percentage: 88,
      grade: 'B+',
      submittedAt: '2024-01-28',
      gradedAt: '2024-01-29',
      feedback: 'Good optimization techniques. Consider memoization for better performance.',
    },
  ];

  const gradeDistribution = [
    { grade: 'A', count: 2, color: '#10b981' },
    { grade: 'A-', count: 2, color: '#34d399' },
    { grade: 'B+', count: 2, color: '#fbbf24' },
    { grade: 'B', count: 0, color: '#f59e0b' },
    { grade: 'B-', count: 0, color: '#f59e0b' },
    { grade: 'C+', count: 0, color: '#ef4444' },
    { grade: 'C', count: 0, color: '#dc2626' },
    { grade: 'C-', count: 0, color: '#b91c1c' },
    { grade: 'D', count: 0, color: '#991b1b' },
    { grade: 'F', count: 0, color: '#7f1d1d' },
  ];

  const performanceOverTime = [
    { month: 'Jan', average: 85 },
    { month: 'Feb', average: 88 },
    { month: 'Mar', average: 90 },
    { month: 'Apr', average: 89 },
    { month: 'May', average: 92 },
    { month: 'Jun', average: 90 },
  ];

  const courseAverages = [
    { course: 'Advanced React Development', average: 90, assignments: 2 },
    { course: 'Database Design Principles', average: 90, assignments: 1 },
    { course: 'UI/UX Design Masterclass', average: 88, assignments: 1 },
    { course: 'Machine Learning Fundamentals', average: 90, assignments: 1 },
    { course: 'Digital Marketing Strategy', average: 90, assignments: 1 },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setGrades(mockGrades);
      setFilteredGrades(mockGrades);
      
      // Calculate stats
      const totalPoints = mockGrades.reduce((sum, grade) => sum + grade.points, 0);
      const earnedPoints = mockGrades.reduce((sum, grade) => sum + grade.earned, 0);
      const overallAverage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
      
      setStats({
        overallAverage: Math.round(overallAverage),
        totalAssignments: mockGrades.length,
        completedAssignments: mockGrades.length,
        averageTrend: 5, // Mock trend
      });
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = grades;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(grade =>
        grade.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by course
    if (selectedCourse !== 'all') {
      filtered = filtered.filter(grade => grade.courseId === parseInt(selectedCourse));
    }

    // Sort by graded date (newest first)
    filtered.sort((a, b) => new Date(b.gradedAt) - new Date(a.gradedAt));

    setFilteredGrades(filtered);
  }, [grades, searchTerm, selectedCourse]);

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
    if (grade.startsWith('B')) return 'text-yellow-600 bg-yellow-100';
    if (grade.startsWith('C')) return 'text-orange-600 bg-orange-100';
    if (grade.startsWith('D')) return 'text-red-600 bg-red-100';
    return 'text-red-600 bg-red-100';
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    if (percentage >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Grades</h1>
        <p className="text-gray-600 mt-2">Track your academic performance and progress</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AcademicCapIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Overall Average</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.overallAverage}%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpenIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.completedAssignments}/{stats.totalAssignments}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Trend</p>
              <div className="flex items-center">
                {stats.averageTrend > 0 ? (
                  <TrendingUpIcon className="h-5 w-5 text-green-600 mr-1" />
                ) : (
                  <TrendingDownIcon className="h-5 w-5 text-red-600 mr-1" />
                )}
                <span className={`text-lg font-semibold ${
                  stats.averageTrend > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(stats.averageTrend)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">6</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Over Time */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="average" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Course Averages */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Averages</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={courseAverages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="course" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="average" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search grades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="lg:w-48">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="input-field"
            >
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grades List */}
      <div className="space-y-4">
        {filteredGrades.map((grade) => (
          <div key={grade.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {grade.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(grade.grade)}`}>
                    {grade.grade}
                  </span>
                </div>

                <p className="text-gray-600 mb-2">{grade.course}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-4 w-4 mr-1" />
                    {grade.earned}/{grade.points} points
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Graded: {formatDate(grade.gradedAt)}
                  </div>
                </div>

                {grade.feedback && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Feedback:</span> {grade.feedback}
                    </p>
                  </div>
                )}
              </div>

              <div className="ml-4 text-right">
                <div className={`text-3xl font-bold ${getPercentageColor(grade.percentage)}`}>
                  {grade.percentage}%
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {grade.type.charAt(0).toUpperCase() + grade.type.slice(1)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredGrades.length === 0 && (
        <div className="text-center py-12">
          <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No grades found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Grades;