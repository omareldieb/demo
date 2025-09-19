import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const statusOptions = [
    { id: 'all', name: 'All Status' },
    { id: 'pending', name: 'Pending' },
    { id: 'submitted', name: 'Submitted' },
    { id: 'graded', name: 'Graded' },
    { id: 'overdue', name: 'Overdue' },
  ];

  const typeOptions = [
    { id: 'all', name: 'All Types' },
    { id: 'assignment', name: 'Assignment' },
    { id: 'quiz', name: 'Quiz' },
    { id: 'project', name: 'Project' },
    { id: 'exam', name: 'Exam' },
  ];

  // Mock data - in a real app, this would come from an API
  const mockAssignments = [
    {
      id: 1,
      title: 'React Hooks Assignment',
      course: 'Advanced React Development',
      courseId: 1,
      type: 'assignment',
      description: 'Create a custom hook for managing form state and implement it in a contact form component.',
      dueDate: '2024-01-15',
      status: 'pending',
      points: 100,
      grade: null,
      submittedAt: null,
      instructions: 'Build a reusable custom hook that handles form validation, error states, and submission. The hook should work with any form structure.',
      attachments: [
        { name: 'assignment-rubric.pdf', size: '2.3 MB' },
        { name: 'example-code.js', size: '1.1 MB' },
      ],
    },
    {
      id: 2,
      title: 'Database Design Quiz',
      course: 'Database Design Principles',
      courseId: 2,
      type: 'quiz',
      description: 'Multiple choice quiz covering normalization, relationships, and indexing.',
      dueDate: '2024-01-18',
      status: 'submitted',
      points: 50,
      grade: null,
      submittedAt: '2024-01-17T14:30:00Z',
      instructions: 'Answer all 25 questions within the 30-minute time limit. Each question is worth 2 points.',
      attachments: [],
    },
    {
      id: 3,
      title: 'ML Model Implementation',
      course: 'Machine Learning Fundamentals',
      courseId: 4,
      type: 'project',
      description: 'Implement a machine learning model to predict house prices using the provided dataset.',
      dueDate: '2024-01-10',
      status: 'overdue',
      points: 200,
      grade: null,
      submittedAt: null,
      instructions: 'Use any ML algorithm of your choice. Include data preprocessing, model training, evaluation, and a brief report explaining your approach.',
      attachments: [
        { name: 'housing-dataset.csv', size: '5.2 MB' },
        { name: 'project-guidelines.pdf', size: '1.8 MB' },
      ],
    },
    {
      id: 4,
      title: 'UI Design Critique',
      course: 'UI/UX Design Masterclass',
      courseId: 3,
      type: 'assignment',
      description: 'Analyze and critique the user interface of a popular mobile app.',
      dueDate: '2024-01-20',
      status: 'graded',
      points: 75,
      grade: 88,
      submittedAt: '2024-01-19T16:45:00Z',
      instructions: 'Choose any mobile app and write a 1000-word critique covering usability, visual design, and user experience.',
      attachments: [
        { name: 'critique-template.docx', size: '0.8 MB' },
      ],
    },
    {
      id: 5,
      title: 'Midterm Exam',
      course: 'Digital Marketing Strategy',
      courseId: 5,
      type: 'exam',
      description: 'Comprehensive exam covering all topics from weeks 1-6.',
      dueDate: '2024-01-25',
      status: 'pending',
      points: 150,
      grade: null,
      submittedAt: null,
      instructions: 'This is a 2-hour exam with multiple choice, short answer, and essay questions. You have one attempt.',
      attachments: [
        { name: 'exam-guidelines.pdf', size: '1.2 MB' },
        { name: 'study-guide.pdf', size: '3.1 MB' },
      ],
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAssignments(mockAssignments);
      setFilteredAssignments(mockAssignments);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = assignments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(assignment => assignment.status === selectedStatus);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(assignment => assignment.type === selectedType);
    }

    // Sort by due date
    filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    setFilteredAssignments(filtered);
  }, [assignments, searchTerm, selectedStatus, selectedType]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'quiz':
        return <AcademicCapIcon className="h-5 w-5" />;
      case 'project':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'exam':
        return <AcademicCapIcon className="h-5 w-5" />;
      default:
        return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'submitted' || status === 'graded') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
        <p className="text-gray-600 mt-2">Manage your assignments, quizzes, and projects</p>
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
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              {statusOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="lg:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input-field"
            >
              {typeOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <div key={assignment.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="text-gray-600">
                    {getTypeIcon(assignment.type)}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {assignment.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                  {isOverdue(assignment.dueDate, assignment.status) && (
                    <span className="flex items-center text-red-600 text-sm">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      Overdue
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-2">{assignment.course}</p>
                <p className="text-gray-700 mb-4">{assignment.description}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Due: {formatDate(assignment.dueDate)}
                  </div>
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-4 w-4 mr-1" />
                    {assignment.points} points
                  </div>
                  {assignment.grade && (
                    <div className="flex items-center text-green-600">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Grade: {assignment.grade}%
                    </div>
                  )}
                  {assignment.submittedAt && (
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      Submitted: {formatDate(assignment.submittedAt)}
                    </div>
                  )}
                </div>

                {/* Attachments */}
                {assignment.attachments.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                    <div className="flex flex-wrap gap-2">
                      {assignment.attachments.map((attachment, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs"
                        >
                          <DocumentTextIcon className="h-3 w-3 mr-1" />
                          {attachment.name} ({attachment.size})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="ml-4 flex flex-col space-y-2">
                {assignment.status === 'pending' && (
                  <button className="btn-primary">
                    Start Assignment
                  </button>
                )}
                {assignment.status === 'submitted' && (
                  <button className="btn-secondary" disabled>
                    Submitted
                  </button>
                )}
                {assignment.status === 'graded' && (
                  <button className="btn-secondary">
                    View Feedback
                  </button>
                )}
                {assignment.status === 'overdue' && (
                  <button className="btn-primary bg-red-600 hover:bg-red-700">
                    Submit Late
                  </button>
                )}
                <Link
                  to={`/courses/${assignment.courseId}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View Course
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Assignments;