-- Database Schema for Matching Words Exercise
-- This schema includes tables for exercises, student responses, and related entities

-- Enable statement logging for debugging
\echo 'Starting database creation script'

-- Users table (teachers and students)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('teacher', 'student', 'admin')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
\echo 'Created users table'

-- Lessons table (container for exercises)
CREATE TABLE lessons (
    lesson_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL, -- The main lesson content/text
    creator_id INTEGER NOT NULL REFERENCES users(user_id),
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
\echo 'Created lessons table'

-- Base Exercises table (common fields for all exercise types)
CREATE TABLE exercises (
    exercise_id SERIAL PRIMARY KEY,
    lesson_id INTEGER NOT NULL REFERENCES lessons(lesson_id),
    exercise_type VARCHAR(50) NOT NULL, -- e.g., 'matching_words', 'multiple_choice', etc.
    question TEXT NOT NULL,
    max_score INTEGER NOT NULL,
    grading_type VARCHAR(20) NOT NULL CHECK (grading_type IN ('auto', 'manual')),
    order_index INTEGER NOT NULL, -- The display order within the lesson
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
\echo 'Created exercises table'

-- Matching Words Exercise table (specific to this exercise type)
CREATE TABLE matching_words_exercises (
    matching_exercise_id SERIAL PRIMARY KEY,
    exercise_id INTEGER NOT NULL REFERENCES exercises(exercise_id) ON DELETE CASCADE,
    CONSTRAINT unique_exercise_id UNIQUE (exercise_id)
);
\echo 'Created matching_words_exercises table'

-- Word Bank Items table (left side items to match)
CREATE TABLE word_bank_items (
    item_id SERIAL PRIMARY KEY,
    matching_exercise_id INTEGER NOT NULL REFERENCES matching_words_exercises(matching_exercise_id) ON DELETE CASCADE,
    content TEXT NOT NULL, -- The text content of the item
    display_order INTEGER NOT NULL -- The display order in the list
);
\echo 'Created word_bank_items table'

-- Match Options table (right side items)
CREATE TABLE match_options (
    option_id SERIAL PRIMARY KEY,
    matching_exercise_id INTEGER NOT NULL REFERENCES matching_words_exercises(matching_exercise_id) ON DELETE CASCADE,
    content TEXT NOT NULL, -- The text content of the match option
    display_order INTEGER NOT NULL -- The display order in the list
);
\echo 'Created match_options table'

-- Correct Answers table (mapping between word bank items and match options)
CREATE TABLE correct_answers (
    answer_id SERIAL PRIMARY KEY,
    matching_exercise_id INTEGER NOT NULL REFERENCES matching_words_exercises(matching_exercise_id) ON DELETE CASCADE,
    word_bank_item_id INTEGER NOT NULL REFERENCES word_bank_items(item_id) ON DELETE CASCADE,
    match_option_id INTEGER NOT NULL REFERENCES match_options(option_id) ON DELETE CASCADE,
    CONSTRAINT unique_word_bank_item UNIQUE (matching_exercise_id, word_bank_item_id),
    CONSTRAINT unique_match_option UNIQUE (matching_exercise_id, match_option_id)
);
\echo 'Created correct_answers table'

-- Student Exercise Attempts table
CREATE TABLE student_attempts (
    attempt_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users(user_id),
    exercise_id INTEGER NOT NULL REFERENCES exercises(exercise_id),
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completion_time TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_student_exercise UNIQUE (student_id, exercise_id)
);
\echo 'Created student_attempts table'

-- Student Matching Answers (student responses for matching exercises)
CREATE TABLE student_matching_answers (
    student_answer_id SERIAL PRIMARY KEY,
    attempt_id INTEGER NOT NULL REFERENCES student_attempts(attempt_id) ON DELETE CASCADE,
    word_bank_item_id INTEGER NOT NULL REFERENCES word_bank_items(item_id),
    selected_match_option_id INTEGER NOT NULL REFERENCES match_options(option_id),
    is_correct BOOLEAN NOT NULL,
    CONSTRAINT unique_student_word_bank_item UNIQUE (attempt_id, word_bank_item_id)
);
\echo 'Created student_matching_answers table'

-- Exercise Feedback table
CREATE TABLE exercise_feedback (
    feedback_id SERIAL PRIMARY KEY,
    attempt_id INTEGER NOT NULL REFERENCES student_attempts(attempt_id) ON DELETE CASCADE,
    feedback_text TEXT,
    is_auto_generated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
\echo 'Created exercise_feedback table'

-- Debug function to log table contents
CREATE OR REPLACE FUNCTION debug_log_table_info()
RETURNS void AS $$
BEGIN
    RAISE NOTICE 'Database schema created successfully';
    RAISE NOTICE 'Table count: %', (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public');
END;
$$ LANGUAGE plpgsql;

-- Call debug function
SELECT debug_log_table_info();

-- Insert test data for debugging

-- Insert a teacher user
INSERT INTO users (username, email, password_hash, role, first_name, last_name)
VALUES (
    'teacher1', 
    'teacher1@example.com', 
    '$2a$10$dDebV8.55AtuTP7pjMOSD.BQbb8k8M2WBXNJuLfbmLfTvdNIPvNte', -- password: 'test123'
    'teacher', 
    'John', 
    'Doe'
);
\echo 'Inserted test teacher user'

-- Insert a student user
INSERT INTO users (username, email, password_hash, role, first_name, last_name)
VALUES (
    'student1', 
    'student1@example.com', 
    '$2a$10$dDebV8.55AtuTP7pjMOSD.BQbb8k8M2WBXNJuLfbmLfTvdNIPvNte', -- password: 'test123'
    'student', 
    'Jane', 
    'Smith'
);
\echo 'Inserted test student user'

-- Insert a test lesson
INSERT INTO lessons (title, description, content, creator_id, is_published)
VALUES (
    'Famous Paintings',
    'Learn about famous paintings and their artists',
    'Beroemde Schilderijen: 14 Kunstwerken die Gen Z Moet Kennen... [truncated content]',
    1, -- teacher_id
    TRUE
);
\echo 'Inserted test lesson'

-- Insert a test exercise
INSERT INTO exercises (lesson_id, exercise_type, question, max_score, grading_type, order_index)
VALUES (
    1, -- lesson_id
    'matching_words',
    'Koppel de schilder aan zijn beroemde werk.',
    3, -- max_score
    'auto',
    1 -- first exercise in the lesson
);
\echo 'Inserted test exercise'

-- Insert the matching words exercise
INSERT INTO matching_words_exercises (exercise_id)
VALUES (1);
\echo 'Inserted test matching_words_exercise'

-- Insert word bank items
INSERT INTO word_bank_items (matching_exercise_id, content, display_order)
VALUES 
    (1, 'Gustav Klimt', 1),
    (1, 'James McNeill Whistler', 2),
    (1, 'Claude Monet', 3);
\echo 'Inserted test word_bank_items'

-- Insert match options
INSERT INTO match_options (matching_exercise_id, content, display_order)
VALUES 
    (1, 'Waterlelies', 1),
    (1, 'De Kus', 2),
    (1, 'Whistler''s Mother', 3);
\echo 'Inserted test match_options'

-- Insert correct answers
INSERT INTO correct_answers (matching_exercise_id, word_bank_item_id, match_option_id)
VALUES 
    (1, 1, 2), -- Gustav Klimt -> De Kus
    (1, 2, 3), -- James McNeill Whistler -> Whistler's Mother
    (1, 3, 1); -- Claude Monet -> Waterlelies
\echo 'Inserted test correct_answers'

-- Print debug info about inserted data
SELECT 'Test data inserted. User count: ' || COUNT(*) FROM users;
SELECT 'Lesson count: ' || COUNT(*) FROM lessons;
SELECT 'Exercise count: ' || COUNT(*) FROM exercises;
SELECT 'Word bank item count: ' || COUNT(*) FROM word_bank_items;
SELECT 'Match option count: ' || COUNT(*) FROM match_options;
SELECT 'Correct answer count: ' || COUNT(*) FROM correct_answers;

\echo 'Database schema creation and test data insertion complete'
