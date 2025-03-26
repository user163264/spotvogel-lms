import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="container">
      <div className="text-center mb-5">
        <h1 className="mb-3">Teacher-Focused Learning Management System</h1>
        <p className="mb-4">
          A teacher-centric platform designed to reduce workload through automation, 
          streamlined lesson creation, and minimal administrative burden.
        </p>
        {!isAuthenticated ? (
          <div className="d-flex justify-center gap-3">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/register" className="btn btn-outline-primary">
              Register
            </Link>
          </div>
        ) : (
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="card p-3">
          <h3>Lesson Template System</h3>
          <p>Create your own personalized teaching workflow to standardize your lessons.</p>
        </div>
        <div className="card p-3">
          <h3>AI-Generated Exercises</h3>
          <p>Use ChatGPT to automatically generate exercises and assessments for your students.</p>
        </div>
        <div className="card p-3">
          <h3>Minimal Administration</h3>
          <p>Track student progress without heavy data entry or administrative burden.</p>
        </div>
      </div>

      <div className="bg-light p-4 mb-5 card">
        <h2 className="mb-3">Why Choose Our LMS?</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <h4>For Teachers</h4>
            <ul>
              <li>Reduce workload with automated exercise generation</li>
              <li>Create reusable lesson templates</li>
              <li>Focus on teaching, not paperwork</li>
              <li>Multi-language support for diverse classrooms</li>
            </ul>
          </div>
          <div>
            <h4>For Institutions</h4>
            <ul>
              <li>Address teacher shortage and burnout</li>
              <li>Improve teacher retention and satisfaction</li>
              <li>Easy integration with existing systems</li>
              <li>Scalable solution that grows with your needs</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="mb-3">Get Started Today</h2>
        <p className="mb-4">
          Join our growing community of educators who are using our LMS to streamline their teaching process.
        </p>
        {!isAuthenticated ? (
          <Link to="/register" className="btn btn-primary btn-lg">
            Sign Up Now
          </Link>
        ) : (
          <Link to="/dashboard" className="btn btn-primary btn-lg">
            Access Your Dashboard
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
