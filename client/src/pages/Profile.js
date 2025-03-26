import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      preferredLanguage: user?.preferredLanguage || 'en',
      institution: user?.institution || '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      preferredLanguage: Yup.string()
        .oneOf(['en', 'nl', 'fr'], 'Invalid language')
        .required('Preferred language is required'),
      institution: Yup.string().required('Institution is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .nullable(), // Not required for updates
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .when('password', {
          is: val => val && val.length > 0,
          then: Yup.string().required('Confirm password is required')
        })
    }),
    onSubmit: async values => {
      setLoading(true);
      setSuccess(false);
      setError('');

      // Only include password if provided
      const profileData = {...values};
      if (!profileData.password) {
        delete profileData.password;
      }
      delete profileData.confirmPassword; // Don't send this to API

      try {
        const result = await updateProfile(profileData);
        if (result.success) {
          setSuccess(true);
        } else {
          setError(result.error || 'Failed to update profile');
        }
      } catch (err) {
        setError('An error occurred while updating your profile');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div className="container">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account settings</p>
        </div>

        {success && (
          <div className="alert alert-success">
            Your profile has been updated successfully.
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card">
          <div className="card-body">
            <form onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="form-control"
                  {...formik.getFieldProps('name')}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="form-error">{formik.errors.name}</div>
                ) : null}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="form-error">{formik.errors.email}</div>
                ) : null}
              </div>

              <div className="form-group">
                <label htmlFor="preferredLanguage" className="form-label">
                  Preferred Language
                </label>
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
                <label htmlFor="institution" className="form-label">
                  Institution
                </label>
                <input
                  id="institution"
                  type="text"
                  className="form-control"
                  {...formik.getFieldProps('institution')}
                />
                {formik.touched.institution && formik.errors.institution ? (
                  <div className="form-error">{formik.errors.institution}</div>
                ) : null}
              </div>

              <h3 className="mt-4 mb-3">Change Password</h3>
              <p className="mb-3">Leave blank if you don't want to change your password</p>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  {...formik.getFieldProps('password')}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="form-error">{formik.errors.password}</div>
                ) : null}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="form-control"
                  {...formik.getFieldProps('confirmPassword')}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                  <div className="form-error">{formik.errors.confirmPassword}</div>
                ) : null}
              </div>

              <div className="profile-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
