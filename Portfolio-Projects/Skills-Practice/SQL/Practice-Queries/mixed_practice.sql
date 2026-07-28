-- SQL Practice Queries - mixed_practice.sql
-- Student: Farhan Alam | Various SQL exercises

-- ─── Exercise 1: CASE WHEN ────────────────────────────────────────────────────
-- Classify employees by salary range
-- (Standalone query, works on any DB with a salaries table)
/*
SELECT
    employee_name,
    salary,
    CASE
        WHEN salary >= 100000 THEN 'Senior'
        WHEN salary >= 60000  THEN 'Mid-Level'
        WHEN salary >= 30000  THEN 'Junior'
        ELSE 'Intern'
    END AS level
FROM employees
ORDER BY salary DESC;
*/

-- ─── Exercise 2: SELF JOIN ────────────────────────────────────────────────────
-- Find employees and their managers
/*
SELECT
    e.employee_name AS employee,
    m.employee_name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id;
*/

-- ─── Exercise 3: EXISTS ───────────────────────────────────────────────────────
-- Find customers who have placed at least one order
/*
SELECT c.name
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);
*/

-- ─── Exercise 4: PIVOT-style with CASE ────────────────────────────────────────
-- Aggregate scores by subject in a pivot format
/*
SELECT
    student_name,
    SUM(CASE WHEN subject = 'Math'    THEN score ELSE 0 END) AS Math,
    SUM(CASE WHEN subject = 'Science' THEN score ELSE 0 END) AS Science,
    SUM(CASE WHEN subject = 'English' THEN score ELSE 0 END) AS English
FROM scores
GROUP BY student_name;
*/

-- ─── Exercise 5: HAVING vs WHERE difference ───────────────────────────────────
-- WHERE filters before grouping, HAVING filters after grouping
/*
-- This is WRONG (you can't use aggregate in WHERE):
-- SELECT dept, AVG(salary) FROM employees WHERE AVG(salary) > 50000 GROUP BY dept;

-- This is CORRECT:
SELECT dept, AVG(salary) AS avg_salary
FROM employees
GROUP BY dept
HAVING AVG(salary) > 50000
ORDER BY avg_salary DESC;
*/

SELECT 'SQL Practice Exercises - see comments above for query templates' AS note;
