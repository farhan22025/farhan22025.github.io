-- PostgreSQL Fundamentals - basics.sql
-- Student: Farhan Alam | Data Science

-- ─── Create Schema ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS courses;

CREATE TABLE students (
    student_id   SERIAL PRIMARY KEY,
    full_name    VARCHAR(100) NOT NULL,
    email        VARCHAR(150) UNIQUE,
    batch        VARCHAR(20),
    cgpa         NUMERIC(4,2) CHECK (cgpa >= 0 AND cgpa <= 4.0),
    enrolled_on  DATE DEFAULT CURRENT_DATE
);

CREATE TABLE courses (
    course_id    SERIAL PRIMARY KEY,
    course_name  VARCHAR(120) NOT NULL,
    credits      SMALLINT DEFAULT 3,
    department   VARCHAR(80)
);

CREATE TABLE enrollments (
    enrollment_id  SERIAL PRIMARY KEY,
    student_id     INT REFERENCES students(student_id) ON DELETE CASCADE,
    course_id      INT REFERENCES courses(course_id) ON DELETE CASCADE,
    semester       VARCHAR(20),
    grade          CHAR(2)
);

-- ─── Seed Data ────────────────────────────────────────────────────────────────
INSERT INTO students (full_name, email, batch, cgpa) VALUES
('Farhan Alam',   'farhan@uni.edu', 'DS-39', 3.70),
('Ayesha Noor',   'ayesha@uni.edu', 'DS-39', 3.90),
('Bilal Ahmed',   'bilal@uni.edu',  'CS-41', 3.40),
('Fatima Malik',  'fatima@uni.edu', 'DS-39', 3.80),
('Hassan Raza',   'hassan@uni.edu', 'CS-41', 2.95);

INSERT INTO courses (course_name, credits, department) VALUES
('Introduction to Machine Learning', 3, 'Data Science'),
('Database Systems',                 3, 'Computer Science'),
('Statistics for Data Analysis',     3, 'Data Science'),
('Deep Learning',                    4, 'AI'),
('Linear Algebra',                   3, 'Mathematics');

INSERT INTO enrollments (student_id, course_id, semester, grade) VALUES
(1, 1, 'Spring-2024', 'A'),
(1, 2, 'Spring-2024', 'B+'),
(1, 3, 'Fall-2023',   'A'),
(2, 1, 'Spring-2024', 'A+'),
(2, 4, 'Fall-2023',   'A'),
(3, 2, 'Spring-2024', 'B'),
(4, 3, 'Fall-2023',   'A+'),
(5, 2, 'Spring-2024', 'C+');

-- ─── Basic Queries ────────────────────────────────────────────────────────────
-- All students ordered by CGPA
SELECT full_name, batch, cgpa FROM students ORDER BY cgpa DESC;

-- Enrollments with student and course names
SELECT s.full_name, c.course_name, e.semester, e.grade
FROM enrollments e
JOIN students s ON e.student_id = s.student_id
JOIN courses c  ON e.course_id  = c.course_id
ORDER BY s.full_name;

-- Students with CGPA above 3.5
SELECT full_name, cgpa FROM students WHERE cgpa > 3.5;
