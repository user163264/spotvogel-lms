/**
 * MatchingWordsAdapter Component
 * 
 * This component serves as an adapter for accessing the MatchingWordsOptimized
 * component. It normalizes the props and handles any necessary conversions.
 * 
 * Created by: Alex Ex
 * Date: March 28, 2025
 */

import React from 'react';
import PropTypes from 'prop-types';
import MatchingWordsOptimized from './MatchingWordsOptimized';

/**
 * MatchingWordsAdapter Component
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
const MatchingWordsAdapter = ({
  exercise,
  studentAnswers = {},
  onAnswerChange = () => {},
  readOnly = false,
  showAnswers = false
}) => {
  // Destructure exercise data with defaults
  const {
    word_bank = [],
    match_options = [],
    correct_answer = {},
  } = exercise || {};
  
  return (
    <MatchingWordsOptimized
      wordBank={word_bank}
      matchOptions={match_options}
      correctAnswer={correct_answer}
      studentAnswers={studentAnswers}
      onAnswerChange={onAnswerChange}
      readOnly={readOnly}
      showAnswers={showAnswers}
    />
  );
};

MatchingWordsAdapter.propTypes = {
  exercise: PropTypes.shape({
    word_bank: PropTypes.arrayOf(PropTypes.string).isRequired,
    match_options: PropTypes.arrayOf(PropTypes.string).isRequired,
    correct_answer: PropTypes.object.isRequired
  }).isRequired,
  studentAnswers: PropTypes.object,
  onAnswerChange: PropTypes.func,
  readOnly: PropTypes.bool,
  showAnswers: PropTypes.bool
};

export default MatchingWordsAdapter;
