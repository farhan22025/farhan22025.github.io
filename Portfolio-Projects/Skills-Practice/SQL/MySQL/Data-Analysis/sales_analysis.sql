-- MySQL Data Analysis - sales_analysis.sql
-- Student: Farhan Alam | Data Science

USE farhan_practice;

-- ─── 1. Total Revenue Per Customer ───────────────────────────────────────────
SELECT
    c.name,
    c.city,
    COUNT(o.order_id)                   AS total_orders,
    SUM(o.quantity * p.price)           AS total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN products p ON o.product_id = p.product_id
GROUP BY c.customer_id, c.name, c.city
ORDER BY total_spent DESC;

-- ─── 2. Best-Selling Products ─────────────────────────────────────────────────
SELECT
    p.product_name,
    p.category,
    SUM(o.quantity)                     AS units_sold,
    SUM(o.quantity * p.price)           AS revenue_generated
FROM products p
JOIN orders o ON p.product_id = o.product_id
GROUP BY p.product_id, p.product_name, p.category
ORDER BY units_sold DESC;

-- ─── 3. Monthly Sales Trend ───────────────────────────────────────────────────
SELECT
    DATE_FORMAT(o.order_date, '%Y-%m')  AS month,
    COUNT(o.order_id)                   AS num_orders,
    SUM(o.quantity * p.price)           AS monthly_revenue
FROM orders o
JOIN products p ON o.product_id = p.product_id
GROUP BY month
ORDER BY month;

-- ─── 4. Category Revenue Breakdown ───────────────────────────────────────────
SELECT
    p.category,
    SUM(o.quantity * p.price)           AS category_revenue,
    ROUND(
        SUM(o.quantity * p.price) /
        (SELECT SUM(o2.quantity * p2.price) FROM orders o2 JOIN products p2 ON o2.product_id = p2.product_id) * 100
    , 1)                                AS revenue_pct
FROM products p
JOIN orders o ON p.product_id = o.product_id
GROUP BY p.category
ORDER BY category_revenue DESC;

-- ─── 5. Customers with No Orders (LEFT JOIN pattern) ─────────────────────────
SELECT c.name, c.email
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
