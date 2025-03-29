/**
 * Mock AI Service
 * 
 * This service simulates AI-generated responses for testing purposes.
 * It returns predefined exercises based on topic and occasionally introduces
 * errors to test error handling.
 */

// Sample exercise templates categorized by topic
const exerciseTemplates = {
  art: {
    en: {
      word_bank: ['Cubism', 'Impressionism', 'Surrealism', 'Renaissance', 'Pop Art'],
      match_options: ['Salvador Dalí', 'Claude Monet', 'Pablo Picasso', 'Leonardo da Vinci', 'Andy Warhol'],
      correct_answer: {
        'Cubism': 'Pablo Picasso',
        'Impressionism': 'Claude Monet',
        'Surrealism': 'Salvador Dalí',
        'Renaissance': 'Leonardo da Vinci',
        'Pop Art': 'Andy Warhol'
      }
    },
    nl: {
      word_bank: ['Kubisme', 'Impressionisme', 'Surrealisme', 'Renaissance', 'Pop Art'],
      match_options: ['Salvador Dalí', 'Claude Monet', 'Pablo Picasso', 'Leonardo da Vinci', 'Andy Warhol'],
      correct_answer: {
        'Kubisme': 'Pablo Picasso',
        'Impressionisme': 'Claude Monet',
        'Surrealisme': 'Salvador Dalí',
        'Renaissance': 'Leonardo da Vinci',
        'Pop Art': 'Andy Warhol'
      }
    },
    fr: {
      word_bank: ['Cubisme', 'Impressionnisme', 'Surréalisme', 'Renaissance', 'Pop Art'],
      match_options: ['Salvador Dalí', 'Claude Monet', 'Pablo Picasso', 'Leonardo da Vinci', 'Andy Warhol'],
      correct_answer: {
        'Cubisme': 'Pablo Picasso',
        'Impressionnisme': 'Claude Monet',
        'Surréalisme': 'Salvador Dalí',
        'Renaissance': 'Leonardo da Vinci',
        'Pop Art': 'Andy Warhol'
      }
    }
  },
  
  geography: {
    en: {
      word_bank: ['France', 'Japan', 'Egypt', 'Brazil', 'Australia'],
      match_options: ['Tokyo', 'Cairo', 'Paris', 'Brasília', 'Canberra'],
      correct_answer: {
        'France': 'Paris',
        'Japan': 'Tokyo',
        'Egypt': 'Cairo',
        'Brazil': 'Brasília',
        'Australia': 'Canberra'
      }
    },
    nl: {
      word_bank: ['Frankrijk', 'Japan', 'Egypte', 'Brazilië', 'Australië'],
      match_options: ['Tokio', 'Caïro', 'Parijs', 'Brasília', 'Canberra'],
      correct_answer: {
        'Frankrijk': 'Parijs',
        'Japan': 'Tokio',
        'Egypte': 'Caïro',
        'Brazilië': 'Brasília',