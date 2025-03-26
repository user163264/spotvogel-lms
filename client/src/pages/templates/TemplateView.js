import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import Alert from '../../components/common/Alert';

const TemplateView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      try {
        // This would be an actual API call in a complete implementation
        // Simulate API response
        setTimeout(() => {
          const mockTemplate = {
            id,
            title: 'Sample Template',
            description: 'This is a sample template for demonstration purposes.',
            subject: 'Sample Subject',
            grade: '10th Grade',
            createdAt: new Date().toISOString()
          };
          
          setTemplate(mockTemplate);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load template. Please try again.');
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  const handleUseTemplate = () => {
    navigate(`/exercises/create?templateId=${id}`);
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error || !template) {
    return <Alert type="error" message={error || 'Template not found'} />;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{template.title}</h1>
        <div>
          <button className="btn btn-primary me-2" onClick={handleUseTemplate}>
            Use Template
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/templates')}>
            Back to Templates
          </button>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Description</h5>
          <p className="card-text">{template.description}</p>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Details</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Subject:</strong> {template.subject}
                </li>
                <li className="list-group-item">
                  <strong>Grade Level:</strong> {template.grade}
                </li>
                <li className="list-group-item">
                  <strong>Created:</strong> {new Date(template.createdAt).toLocaleDateString()}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateView;
