import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TemplateList = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'my', 'public'

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // For now, let's use mock data - replace with actual API call later
        setTimeout(() => {
          const mockTemplates = [
            {
              _id: '1',
              title: 'Basic Language Lesson',
              description: 'A standard template for language lessons with vocabulary, grammar, and practice',
              creator: { _id: user?._id, name: 'Current User' },
              subject: 'Languages',
              gradeLevel: 'Secondary',
              language: 'en',
              isPublic: true,
              createdAt: '2023-01-15T12:00:00Z',
              components: [
                {
                  type: 'introduction',
                  title: 'Warm-up',
                  description: 'Start with a short activity to engage students',
                  duration: 10,
                  order: 1
                },
                {
                  type: 'content',
                  title: 'Vocabulary Introduction',
                  description: 'Present new vocabulary words',
                  duration: 15,
                  order: 2
                },
                {
                  type: 'exercise',
                  title: 'Practice Activity',
                  description: 'Students practice using new vocabulary',
                  duration: 20,
                  exerciseType: 'fill-in-blanks',
                  order: 3
                }
              ]
            },
            {
              _id: '2',
              title: 'Math Problem Solving',
              description: 'Template for teaching mathematical problem-solving strategies',
              creator: { _id: '123', name: 'Another Teacher' },
              subject: 'Mathematics',
              gradeLevel: 'Primary',
              language: 'en',
              isPublic: true,
              createdAt: '2023-02-20T14:30:00Z',
              components: [
                {
                  type: 'introduction',
                  title: 'Problem of the Day',
                  description: 'Start with an engaging problem',
                  duration: 10,
                  order: 1
                },
                {
                  type: 'content',
                  title: 'Strategy Explanation',
                  description: 'Teach a problem-solving strategy',
                  duration: 15,
                  order: 2
                },
                {
                  type: 'exercise',
                  title: 'Guided Practice',
                  description: 'Students try similar problems with guidance',
                  duration: 20,
                  exerciseType: 'multiple-choice',
                  order: 3
                }
              ]
            },
            {
              _id: '3',
              title: 'Reading Comprehension',
              description: 'Template for reading and analyzing texts',
              creator: { _id: user?._id, name: 'Current User' },
              subject: 'Literature',
              gradeLevel: 'Secondary',
              language: 'en',
              isPublic: false,
              createdAt: '2023-03-10T09:15:00Z',
              components: [
                {
                  type: 'introduction',
                  title: 'Pre-reading Discussion',
                  description: 'Activate prior knowledge on the topic',
                  duration: 10,
                  order: 1
                },
                {
                  type: 'content',
                  title: 'Reading',
                  description: 'Students read the selected text',
                  duration: 25,
                  order: 2
                },
                {
                  type: 'exercise',
                  title: 'Comprehension Questions',
                  description: 'Questions to check understanding',
                  duration: 15,
                  exerciseType: 'short-answer',
                  order: 3
                }
              ]
            }
          ];
          
          setTemplates(mockTemplates);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        setError('Failed to fetch templates');
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [user?._id]);

  // Filter templates based on the selected filter
  const filteredTemplates = templates.filter(template => {
    if (filter === 'all') return true;
    if (filter === 'my') return template.creator._id === user?._id;
    if (filter === 'public') return template.isPublic;
    return true;
  });

  return (
    <div className="container">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h1>Lesson Templates</h1>
          <p>Browse and manage your lesson templates</p>
        </div>
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <Link to="/templates/create" className="btn btn-primary">
            Create New Template
          </Link>
        )}
      </div>

      <div className="mb-4">
        <div className="d-flex gap-3">
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('all')}
          >
            All Templates
          </button>
          <button
            className={`btn ${filter === 'my' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('my')}
          >
            My Templates
          </button>
          <button
            className={`btn ${filter === 'public' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('public')}
          >
            Public Templates
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center p-5 bg-light">
          <h3>No templates found</h3>
          <p>
            {filter === 'my'
              ? "You haven't created any templates yet."
              : filter === 'public'
              ? "There are no public templates available."
              : "No templates match your criteria."}
          </p>
          {(user?.role === 'teacher' || user?.role === 'admin') && (
            <Link to="/templates/create" className="btn btn-primary mt-3">
              Create Your First Template
            </Link>
          )}
        </div>
      ) : (
        <div className="template-grid">
          {filteredTemplates.map(template => (
            <div key={template._id} className="card template-card">
              <div className="card-body template-card-body">
                <h3 className="card-title">{template.title}</h3>
                <p className="mb-3">{template.description}</p>
                <div className="mb-3">
                  <span className="badge bg-primary mr-2">{template.subject}</span>
                  <span className="badge bg-secondary mr-2">{template.gradeLevel}</span>
                  <span className="badge bg-info">
                    {template.language === 'en' ? 'English' : 
                     template.language === 'nl' ? 'Dutch' : 
                     template.language === 'fr' ? 'French' : template.language}
                  </span>
                  {template.isPublic ? (
                    <span className="badge bg-success ml-2">Public</span>
                  ) : (
                    <span className="badge bg-secondary ml-2">Private</span>
                  )}
                </div>
                <p className="text-secondary mb-3">
                  {template.components?.length || 0} components
                </p>
              </div>
              <div className="card-footer template-card-footer">
                <small className="text-secondary">
                  By {template.creator.name} on{' '}
                  {new Date(template.createdAt).toLocaleDateString()}
                </small>
                <Link to={`/templates/${template._id}`} className="btn btn-sm btn-outline-primary">
                  View Template
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateList;
