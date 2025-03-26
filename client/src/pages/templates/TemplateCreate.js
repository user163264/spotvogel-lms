import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../../components/common/FormField';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import Alert from '../../components/common/Alert';

const TemplateCreate = () => {
  const navigate = useNavigate();
  const [template, setTemplate] = useState({
    title: '',
    description: '',
    subject: '',
    grade: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // This would be an actual API call in a complete implementation
      console.log('Creating template:', template);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoading(false);
      
      // Navigate to templates list on success
      navigate('/templates');
    } catch (err) {
      setError('Failed to create template. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="container mt-4">
      <h1>Create New Template</h1>
      
      {error && <Alert type="error" message={error} />}
      
      <form onSubmit={handleSubmit}>
        <FormField
          label="Title"
          name="title"
          type="text"
          value={template.title}
          onChange={handleChange}
          required
        />
        
        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={template.description}
          onChange={handleChange}
          required
        />
        
        <FormField
          label="Subject"
          name="subject"
          type="text"
          value={template.subject}
          onChange={handleChange}
          required
        />
        
        <FormField
          label="Grade Level"
          name="grade"
          type="text"
          value={template.grade}
          onChange={handleChange}
          required
        />
        
        <div className="form-group mt-4">
          <button type="submit" className="btn btn-primary">
            Create Template
          </button>
          <button 
            type="button" 
            className="btn btn-secondary ms-2" 
            onClick={() => navigate('/templates')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemplateCreate;
