/**
 * Mock AI Matching Words Test Page
 * 
 * This is a simplified version of the AI Matching Words Test Page
 * that doesn't rely on external API calls. It uses static mock data
 * to demonstrate the functionality.
 * 
 * Created by: Alex Ex
 * Date: March 28, 2025
 */

import React, { useState, useCallback } from 'react';
import './AiMatchingWordsTestPage.css';

/**
 * Mock test page for AI-generated matching words exercises
 */
const MockAiMatchingWordsTestPage = () => {
  // Static mock data for different topics
  const mockExercises = {
    'art': {
      question: "Match each art movement with its characteristic artist.",
      word_bank: ["Cubism", "Impressionism", "Surrealism", "Pop Art", "Renaissance"],
      match_options: ["Pablo Picasso", "Claude Monet", "Salvador Dalí", "Andy Warhol", "Leonardo da Vinci"],
      correct_answer: {
        "Cubism": "Pablo Picasso",
        "Impressionism": "Claude Monet",
        "Surrealism": "Salvador Dalí",
        "Pop Art": "Andy Warhol",
        "Renaissance": "Leonardo da Vinci"
      }
    },
    'geography': {
      question: "Match each country with its capital city.",
      word_bank: ["France", "Japan", "Brazil", "Egypt", "Australia"],
      match_options: ["Paris", "Tokyo", "Brasília", "Cairo", "Canberra"],
      correct_answer: {
        "France": "Paris",
        "Japan": "Tokyo",
        "Brazil": "Brasília",
        "Egypt": "Cairo",
        "Australia": "Canberra"
      }
    },
    'science': {
      question: "Match each scientific discovery with the scientist who made it.",
      word_bank: ["Theory of Relativity", "Theory of Evolution", "Gravity", "Radioactivity", "Penicillin"],
      match_options: ["Albert Einstein", "Charles Darwin", "Isaac Newton", "Marie Curie", "Alexander Fleming"],
      correct_answer: {
        "Theory of Relativity": "Albert Einstein",
        "Theory of Evolution": "Charles Darwin",
        "Gravity": "Isaac Newton",
        "Radioactivity": "Marie Curie",
        "Penicillin": "Alexander Fleming"
      }
    }
  };
  
  // State for the current topic
  const [topic, setTopic] = useState('art');
  
  // State for student answers
  const [studentAnswers, setStudentAnswers]