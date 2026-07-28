-- PostgreSQL Data Analysis - academic_analysis.sql
-- Student: Farhan Alam | Data Science

-- ─── 1. Average CGPA per batch ───────────────────────────────────────────────
SELECT batch, ROUND(AVG(cgpa), 2) AS avg_cgpa, COUNT(*) AS num_students
FROM students
GROUP BY batch
ORDER BY avg_cgpa DESC;

-- ─── 2. Most popular courses by enrollments ───────────────────────────────────
SELECT c.course_name, c.department, COUNT(e.enrollment_id) AS enrollments
FROM courses c
LEFT JOIN enrollments e ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_name, c.department
ORDER BY enrollments DESC;

-- ─── 3. Grade distribution ────────────────────────────────────────────────────
SELECT grade, COUNT(*) AS frequency
FROM enrollments
GROUP BY grade
ORDER BY grade;

-- ─── 4. Students enrolled in more than 2 courses ─────────────────────────────
SELECT s.full_name, COUNT(e.course_id) AS course_count
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
GROUP BY s.student_id, s.full_name
HAVING COUNT(e.course_id) > 2;

-- ─── 5. Students NOT enrolled in Deep Learning ───────────────────────────────
SELECT full_name FROM students
WHERE student_id NOT IN (
    SELECT e.student_id FROM enrollments e
    JOIN courses c ON e.course_id = c.course_id
    WHERE c.course_name = 'Deep Learning'
);
