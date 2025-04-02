import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ModernExerciseCard from './ModernExerciseCard';

/**
 * ModernDashboard Component
 * 
 * A clean, minimalist dashboard layout for the LMS system,
 * featuring daily agenda, upcoming exercises, and progress stats.
 */
const ModernDashboard = ({
  userName,
  exercises = [],
  agenda = [],
  stats = {},
  className = '',
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Format the current date in a readable format
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Get time of day for personalized greeting
  const getGreeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className={`bg-slate-50 min-h-screen ${className}`}>
      {/* Top Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-medium text-slate-900">LMS Dashboard</h1>
          
          <div className="flex items-center space-x-4">
            <button 
              type="button"
              className="p-1.5 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100"
              aria-label="Notifications"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </button>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                {userName.charAt(0)}
              </div>
              <span className="ml-2 text-sm font-medium text-slate-700 hidden sm:inline-block">
                {userName}
              </span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <h2 className="text-2xl font-medium text-slate-900 mb-1">{getGreeting()}, {userName}</h2>
            <p className="text-slate-500">{formattedDate}</p>
            
            <div className="mt-4 flex items-center">
              <div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{stats.completedExercises || 0} exercises completed</span>
              </div>
              
              <div className="ml-4 text-sm text-slate-500">
                Current streak: <span className="font-medium text-slate-700">{stats.currentStreak || 0} days</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Cards */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-500">In Progress</h3>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 text-amber-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 11-6 6 6 6 0 016-6zm0 5a1 1 0 00-1 1v2a1 1 0 002 0V8a1 1 0 00-1-1z" />
                  </svg>
                </span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.inProgressExercises || 0}</p>
              <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${stats.inProgressPercentage || 0}%` }}></div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-500">Completed This Week</h3>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.weeklyCompletedExercises || 0}</p>
              <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${stats.weeklyCompletionPercentage || 0}%` }}></div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-500">Learning Time</h3>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.totalLearningHours || 0} hrs</p>
              <p className="mt-1 text-sm text-slate-500">
                <span className={stats.learningTrendPercentage > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                  {stats.learningTrendPercentage > 0 ? '↑' : '↓'} {Math.abs(stats.learningTrendPercentage || 0)}%
                </span>
                <span className="ml-1">vs last week</span>
              </p>
            </div>
          </div>
        </section>
        
        {/* Today's Agenda */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Today's Agenda</h2>
          
          {agenda.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 text-center">
              <p className="text-slate-500">No agenda items for today</p>
              <button 
                type="button"
                className="mt-4 inline-flex items-center px-3 py-1.5 border border-slate-300 text-sm leading-4 font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Item
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <ul className="divide-y divide-slate-100">
                {agenda.map((item, index) => (
                  <li key={index} className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        item.type === 'exercise' ? 'bg-blue-400' : 
                        item.type === 'deadline' ? 'bg-rose-400' : 'bg-slate-400'
                      }`} />
                      
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                      </div>
                      
                      <div className="ml-4 flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
        
        {/* Recent Exercises */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-slate-900">Recent Exercises</h2>
            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all
            </a>
          </div>
          
          {exercises.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 text-center">
              <p className="text-slate-500">No exercises available</p>
              <button 
                type="button"
                className="mt-4 inline-flex items-center px-3 py-1.5 border border-slate-300 text-sm leading-4 font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Browse Exercises
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.slice(0, 3).map((exercise, index) => (
                <ModernExerciseCard
                  key={index}
                  {...exercise}
                  onClick={() => console.log(`Exercise ${exercise.id} clicked`)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

ModernDashboard.propTypes = {
  userName: PropTypes.string.isRequired,
  exercises: PropTypes.array,
  agenda: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      time: PropTypes.string,
      type: PropTypes.oneOf(['exercise', 'deadline', 'other']),
    })
  ),
  stats: PropTypes.shape({
    completedExercises: PropTypes.number,
    inProgressExercises: PropTypes.number,
    inProgressPercentage: PropTypes.number,
    weeklyCompletedExercises: PropTypes.number,
    weeklyCompletionPercentage: PropTypes.number,
    totalLearningHours: PropTypes.number,
    learningTrendPercentage: PropTypes.number,
    currentStreak: PropTypes.number,
  }),
  className: PropTypes.string,
};

export default ModernDashboard;
