import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Register = () => {
  const { register, error } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'teacher',
      preferredLanguage: 'en',
      institution: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
      role: Yup.string()
        .oneOf(['teacher', 'student'], 'Invalid role')
        .required('Role is required'),
      preferredLanguage: Yup.string()
        .oneOf(['en', 'nl', 'fr'], 'Invalid language')
        .required('Preferred language is required'),
      institution: Yup.string()
        .required('Institution is required')
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setRegisterError('');
      
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = values;
      
      try {
        const result = await register(registerData);
        if (result.success) {
          navigate('/dashboard');
        } else {
          setRegisterError(result.error || 'Registration failed. Please try again.');
        }
      } catch (err) {
        setRegisterError('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div className="container">
      <div className="auth-container">
        <h2 className="auth-title">Create an Account</h2>

        {(registerError || error) && (
          <div className="alert alert-danger">{registerError || error}</div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              id="name"
              type="text"
              className="form-control"
              placeholder="Enter your full name"
              {...formik.getFieldProps('name')}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="form-error">{formik.errors.name}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="Enter your email"
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="form-error">{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Enter your password"
              {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="form-error">{formik.errors.password}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="form-control"
              placeholder="Confirm your password"
              {...formik.getFieldProps('confirmPassword')}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="form-error">{formik.errors.confirmPassword}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">I am a</label>
            <select
              id="role"
              className="form-control"
              {...formik.getFieldProps('role')}
            >
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
            {formik.touched.role && formik.errors.role ? (
              <div className="form-error">{formik.errors.role}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="preferredLanguage" className="form-label">Preferred Language</label>
            <select
              id="preferredLanguage"
              className="form-control"
              {...formik.getFieldProps('preferredLanguage')}
            >
              <option value="en">English</option>
              <option value="nl">Dutch</option>
              <option value="fr">French</option>
            </select>
            {formik.touched.preferredLanguage && formik.errors.preferredLanguage ? (
              <div className="form-error">{formik.errors.preferredLanguage}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="institution" className="form-label">Institution</label>
            <input
              id="institution"
              type="text"
              className="form-control"
              placeholder="Enter your school or institution"
              {...formik.getFieldProps('institution')}
            />
            {formik.touched.institution && formik.errors.institution ? (
              <div className="form-error">{formik.errors.institution}</div>
            ) : null}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
