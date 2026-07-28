-- PostgreSQL Advanced - advanced_queries.sql
-- Student: Farhan Alam | Data Science

-- ─── 1. Window: Rank students per batch by CGPA ──────────────────────────────
SELECT
    full_name,
    batch,
    cgpa,
    RANK() OVER (PARTITION BY batch ORDER BY cgpa DESC) AS rank_in_batch,
    ROUND(AVG(cgpa) OVER (PARTITION BY batch), 2)       AS batch_avg_cgpa
FROM students;

-- ─── 2. CTE: Students with above-average CGPA in their batch ─────────────────
WITH BatchAvg AS (
    SELECT batch, AVG(cgpa) AS avg_cgpa
    FROM students
    GROUP BY batch
)
SELECT s.full_name, s.batch, s.cgpa, ROUND(b.avg_cgpa, 2) AS batch_avg
FROM students s
JOIN BatchAvg b ON s.batch = b.batch
WHERE s.cgpa > b.avg_cgpa
ORDER BY s.batch, s.cgpa DESC;

-- ─── 3. ARRAY_AGG: List all courses per student ──────────────────────────────
SELECT
    s.full_name,
    ARRAY_AGG(c.course_name ORDER BY c.course_name) AS courses_enrolled
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
JOIN courses c ON e.course_id = c.course_id
GROUP BY s.student_id, s.full_name;

-- ─── 4. CASE WHEN: Classify students by CGPA ─────────────────────────────────
SELECT
    full_name,
    cgpa,
    CASE
        WHEN cgpa >= 3.7 THEN 'Dean''s List'
        WHEN cgpa >= 3.0 THEN 'Good Standing'
        WHEN cgpa >= 2.0 THEN 'Satisfactory'
        ELSE 'Academic Probation'
    END AS standing
FROM students
ORDER BY cgpa DESC;

-- ─── 5. Recursive CTE: Number sequence (foundation concept) ──────────────────
WITH RECURSIVE counter(n) AS (
    SELECT 1
    UNION ALL
    SELECT n + 1 FROM counter WHERE n < 10
)
SELECT n, n * n AS square, POWER(2, n) AS power_of_2
FROM counter;
