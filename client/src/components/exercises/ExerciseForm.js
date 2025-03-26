import React, { useState, useEffect } from 'react';
import FormField from '../common/FormField';
import { getTemplateCategories } from '../../services/templateService';
import { validateExerciseDetails } from '../../utils/formValidation';

const ExerciseForm = ({ exercise, onChange, onNext }) => {
  const [errors, setErrors] = useState({});
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [gradeOptions, setGradeOptions] = useState([]);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    // Fetch subject and grade options
    const fetchOptions = async () => {
      try {
        const categories = await getTemplateCategories();
        setSubjectOptions(categories.subjects || []);
        setGradeOptions(categories.grades || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update the exercise details
    const updatedExercise = { ...exercise, [name]: value };
    onChange(updatedExercise);
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate the field
    const fieldErrors = validateExerciseDetails(updatedExercise);
    setErrors(fieldErrors);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate the field
    const fieldErrors = validateExerciseDetails(exercise);
    setErrors(fieldErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const fieldErrors = validateExerciseDetails(exercise);
    setErrors(fieldErrors);
    
    // Mark all fields as touched
    const allTouched = Object.keys(exercise).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // If no errors, proceed to next step
    if (Object.keys(fieldErrors).length === 0) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="exercise-form">
      <h2>Exercise Details</h2>
      
      <div className="form-section">
        <h3>Basic Information</h3>
        
        <FormField
          label="Title"
          name="title"
          type="text"
          value={exercise.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.title && errors.title}
          required
        />
        
        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={exercise.description}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.description && errors.description}
          required
        />
        
        <div className="form-row">
          <FormField
            label="Subject Area"
            name="subject"
            type="select"
            value={exercise.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.subject && errors.subject}
            options={subjectOptions.map(subject => ({ value: subject, label: subject }))}
            required
          />
          
          <FormField
            label="Grade Level"
            name="grade"
            type="select"
            value={exercise.grade}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.grade && errors.grade}
            options={gradeOptions.map(grade => ({ value: grade, label: grade }))}
            required
          />
        </div>
      </div>
      
      <div className="form-section">
        <h3>Exercise Settings</h3>
        
        <div className="form-row">
          <FormField
            label="Time Limit (minutes)"
            name="timeLimit"
            type="number"
            value={exercise.timeLimit}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.timeLimit && errors.timeLimit}
            min={1}
            required
          />
          
          <FormField
            label="Difficulty Level"
            name="difficultyLevel"
            type="select"
            value={exercise.difficultyLevel}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.difficultyLevel && errors.difficultyLevel}
            options={[
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' }
            ]}
            required
          />
        </div>
        
        <div className="form-row">
          <FormField
            label="Tags (comma separated)"
            name="tags"
            type="text"
            value={exercise.tags || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.tags && errors.tags}
            placeholder="algebra, equations, problem-solving"
          />
        </div>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="button primary">Next: Add Questions</button>
      </div>
    </form>
  );
};

export default ExerciseForm;