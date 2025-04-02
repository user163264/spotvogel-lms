/**
 * Form Components Demo Page
 * 
 * This page showcases our new form components built with Tailwind CSS
 * 
 * @author Finny Frontend
 * @date March 31, 2025
 */

import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  Input,
  TextArea,
  Select,
  Checkbox,
  Radio,
  FormGroup,
  Badge
} from '../../components/ui';

const FormComponentsDemo = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    role: '',
    notifications: false,
    preferredContact: 'email',
    interests: []
  });
  
  // Error state
  const [errors, setErrors] = useState({});
  
  // Handle change for text inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear error when field is edited
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };
  
  // Handle change for checkbox
  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    setFormData(prev => ({ ...prev, [id]: checked }));
  };
  
  // Handle change for radio buttons
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle interest selection (multiple checkboxes)
  const handleInterestChange = (interest) => {
    setFormData(prev => {
      const currentInterests = [...prev.interests];
      
      if (currentInterests.includes(interest)) {
        return { ...prev, interests: currentInterests.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...currentInterests, interest] };
      }
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
    
    // Set errors or submit form
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // In a real app, you would submit the form data
      console.log('Form submitted:', formData);
      alert('Form submitted successfully!');
    }
  };
  
  // Reset form
  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      bio: '',
      role: '',
      notifications: false,
      preferredContact: 'email',
      interests: []
    });
    setErrors({});
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-neutral-900 mb-2">Form Components Demo</h1>
      <p className="text-neutral-600 mb-8">
        This page demonstrates our new form components built with Tailwind CSS.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">Registration Form</h2>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormGroup>
                  <Input
                    id="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    error={errors.name}
                    required
                  />
                  
                  <Input
                    id="email"
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    error={errors.email}
                    helper="We'll never share your email with anyone else."
                    required
                  />
                </FormGroup>
                
                <FormGroup title="Profile Information" description="Tell us about yourself">
                  <TextArea
                    id="bio"
                    label="Bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Write a short bio..."
                    rows={4}
                  />
                  
                  <Select
                    id="role"
                    label="Role"
                    value={formData.role}
                    onChange={handleChange}
                    options={[
                      { value: '', label: 'Select a role' },
                      { value: 'student', label: 'Student' },
                      { value: 'teacher', label: 'Teacher' },
                      { value: 'admin', label: 'Administrator' }
                    ]}
                    error={errors.role}
                    required
                  />
                </FormGroup>
                
                <FormGroup title="Preferences">
                  <Checkbox
                    id="notifications"
                    label="Receive email notifications"
                    checked={formData.notifications}
                    onChange={handleCheckboxChange}
                    helper="We'll send you updates about new features."
                  />
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Preferred Contact Method
                    </label>
                    <div className="space-y-2">
                      <Radio
                        id="contact-email"
                        name="preferredContact"
                        value="email"
                        label="Email"
                        checked={formData.preferredContact === 'email'}
                        onChange={handleRadioChange}
                      />
                      <Radio
                        id="contact-phone"
                        name="preferredContact"
                        value="phone"
                        label="Phone"
                        checked={formData.preferredContact === 'phone'}
                        onChange={handleRadioChange}
                      />
                      <Radio
                        id="contact-sms"
                        name="preferredContact"
                        value="sms"
                        label="SMS"
                        checked={formData.preferredContact === 'sms'}
                        onChange={handleRadioChange}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Interests <span className="text-xs text-neutral-500">(select all that apply)</span>
                    </label>
                    <div className="space-y-2">
                      {['Programming', 'Design', 'Education', 'Science', 'Art'].map(interest => (
                        <Checkbox
                          key={interest}
                          id={`interest-${interest.toLowerCase()}`}
                          label={interest}
                          checked={formData.interests.includes(interest)}
                          onChange={() => handleInterestChange(interest)}
                        />
                      ))}
                    </div>
                  </div>
                </FormGroup>
                
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-neutral-200">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Card.Body>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">Form Data</h2>
            </Card.Header>
            <Card.Body>
              <div className="bg-gray-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                <pre>{JSON.stringify(formData, null, 2)}</pre>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Form State</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="mr-2">Validation:</span>
                    {Object.keys(errors).length > 0 ? (
                      <Badge variant="error">Invalid</Badge>
                    ) : (
                      <Badge variant="success">Valid</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <span className="mr-2">Interests Selected:</span>
                    <Badge variant="primary">{formData.interests.length}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Component Documentation</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600">
                  <li>Input: Text fields with validation</li>
                  <li>TextArea: Multi-line text input</li>
                  <li>Select: Dropdown selection</li>
                  <li>Checkbox: Toggle selection</li>
                  <li>Radio: Single selection from multiple options</li>
                  <li>FormGroup: Group related form elements</li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FormComponentsDemo;