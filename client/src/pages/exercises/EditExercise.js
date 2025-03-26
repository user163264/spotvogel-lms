import React from 'react';
import { useParams } from 'react-router-dom';
import { ExerciseCreator } from '../../components/exercises';

const EditExercisePage = () => {
  const { id } = useParams();

  return (
    <div className="page edit-exercise-page">
      <ExerciseCreator id={id} />
    </div>
  );
};

export default EditExercisePage;