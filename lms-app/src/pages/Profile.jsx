import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  CogIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    interests: [],
    education: '',
    experience: '',
  });
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    certificates: 0,
    currentStreak: 0,
    longestStreak: 0,
  });

  // Mock data - in a real app, this would come from an API
  const mockStats = {
    totalCourses: 8,
    completedCourses: 3,
    totalHours: 156,
    certificates: 2,
    currentStreak: 7,
    longestStreak: 21,
  };

  const mockInterests = [
    'Programming',
    'Web Development',
    'Data Science',
    'UI/UX Design',
    'Machine Learning',
    'Mobile Development',
  ];

  const mockAchievements = [
    {
      id: 1,
      title: 'React Master',
      description: 'Completed Advanced React Development course',
      date: '2024-01-15',
      icon: '🎓',
    },
    {
      id: 2,
      title: 'Database Expert',
      description: 'Scored 90%+ in Database Design Principles',
      date: '2024-01-18',
      icon: '🏆',
    },
    {
      id: 3,
      title: 'Learning Streak',
      description: '7 days of continuous learning',
      date: '2024-01-20',
      icon: '🔥',
    },
  ];

  const mockRecentActivity = [
    {
      id: 1,
      action: 'Completed lesson',
      course: 'Advanced React Development',
      lesson: 'React Hooks Deep Dive',
      time: '2 hours ago',
    },
    {
      id: 2,
      action: 'Submitted assignment',
      course: 'Database Design Principles',
      assignment: 'Database Design Quiz',
      time: '1 day ago',
    },
    {
      id: 3,
      action: 'Earned certificate',
      course: 'UI/UX Design Masterclass',
      certificate: 'UI Design Certificate',
      time: '3 days ago',
    },
  ];

  useEffect(() => {
    // Initialize profile data from user
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.emailAddresses[0]?.emailAddress || '',
        bio: user.publicMetadata?.bio || '',
        location: user.publicMetadata?.location || '',
        website: user.publicMetadata?.website || '',
        interests: user.publicMetadata?.interests || [],
        education: user.publicMetadata?.education || '',
        experience: user.publicMetadata?.experience || '',
      });
    }

    // Simulate API call for stats
    setTimeout(() => {
      setStats(mockStats);
    }, 1000);
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInterestToggle = (interest) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original data
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.emailAddresses[0]?.emailAddress || '',
        bio: user.publicMetadata?.bio || '',
        location: user.publicMetadata?.location || '',
        website: user.publicMetadata?.website || '',
        interests: user.publicMetadata?.interests || [],
        education: user.publicMetadata?.education || '',
        experience: user.publicMetadata?.experience || '',
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your profile information and track your progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary flex items-center"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="btn-primary flex items-center"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn-secondary flex items-center"
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Profile Picture and Basic Info */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-10 w-10 text-primary-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {profileData.firstName} {profileData.lastName}
                  </h3>
                  <p className="text-gray-600">{profileData.email}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  className="input-field disabled:bg-gray-50"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-50"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-50"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education
                </label>
                <input
                  type="text"
                  value={profileData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  disabled={!isEditing}
                  className="input-field disabled:bg-gray-50"
                  placeholder="Your educational background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <textarea
                  value={profileData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  className="input-field disabled:bg-gray-50"
                  placeholder="Your professional experience"
                />
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {mockInterests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => isEditing && handleInterestToggle(interest)}
                      disabled={!isEditing}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        profileData.interests.includes(interest)
                          ? 'bg-primary-100 text-primary-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}</span> in{' '}
                      <span className="text-primary-600">{activity.course}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.lesson || activity.assignment || activity.certificate}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpenIcon className="h-5 w-5 text-primary-600 mr-2" />
                  <span className="text-sm text-gray-600">Total Courses</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.totalCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.completedCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">Total Hours</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.totalHours}h</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">Certificates</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.certificates}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-orange-600 mr-2" />
                  <span className="text-sm text-gray-600">Current Streak</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.currentStreak} days</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h2>
            <div className="space-y-3">
              {mockAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                    <p className="text-xs text-gray-500">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center">
                <CogIcon className="h-4 w-4 mr-2" />
                Account Settings
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                Notification Preferences
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center">
                <AcademicCapIcon className="h-4 w-4 mr-2" />
                Learning Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;