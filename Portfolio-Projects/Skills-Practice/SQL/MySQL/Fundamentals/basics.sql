-- MySQL Fundamentals - basics.sql
-- Student: Farhan Alam | Data Science

-- ─── Database & Table Setup ───────────────────────────────────────────────────
CREATE DATABASE IF NOT EXISTS farhan_practice;
USE farhan_practice;

-- Drop if exists for clean re-runs
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS products;

-- ─── Customers Table ──────────────────────────────────────────────────────────
CREATE TABLE customers (
    customer_id   INT PRIMARY KEY AUTO_INCREMENT,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) UNIQUE,
    city          VARCHAR(80),
    registered_on DATE
);

-- ─── Products Table ───────────────────────────────────────────────────────────
CREATE TABLE products (
    product_id    INT PRIMARY KEY AUTO_INCREMENT,
    product_name  VARCHAR(100) NOT NULL,
    category      VARCHAR(60),
    price         DECIMAL(8,2),
    stock_qty     INT DEFAULT 0
);

-- ─── Orders Table ─────────────────────────────────────────────────────────────
CREATE TABLE orders (
    order_id    INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    product_id  INT,
    quantity    INT,
    order_date  DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (product_id)  REFERENCES products(product_id)
);

-- ─── Seed Data ────────────────────────────────────────────────────────────────
INSERT INTO customers (name, email, city, registered_on) VALUES
('Ali Khan',      'ali@email.com',    'Karachi',    '2023-01-15'),
('Ayesha Noor',   'ayesha@email.com', 'Lahore',     '2023-03-22'),
('Bilal Ahmed',   'bilal@email.com',  'Islamabad',  '2022-11-05'),
('Fatima Malik',  'fatima@email.com', 'Karachi',    '2024-01-01'),
('Usman Tariq',   'usman@email.com',  'Lahore',     '2023-07-18');

INSERT INTO products (product_name, category, price, stock_qty) VALUES
('Laptop',        'Electronics', 75000.00, 50),
('Mouse',         'Electronics',  1200.00, 200),
('Python Book',   'Books',        3500.00, 100),
('Desk Chair',    'Furniture',   18000.00, 30),
('Notebook',      'Stationery',    250.00, 500);

INSERT INTO orders (customer_id, product_id, quantity, order_date) VALUES
(1, 1, 1, '2024-02-10'),
(1, 3, 2, '2024-03-01'),
(2, 2, 3, '2024-02-15'),
(3, 4, 1, '2024-03-05'),
(4, 5, 5, '2024-03-10'),
(5, 1, 1, '2024-03-12'),
(2, 3, 1, '2024-04-01');

-- ─── Basic SELECT Queries ─────────────────────────────────────────────────────
-- All customers
SELECT * FROM customers;

-- Products under 5000
SELECT product_name, price FROM products WHERE price < 5000 ORDER BY price;

-- Orders placed in 2024
SELECT * FROM orders WHERE YEAR(order_date) = 2024;

-- Customers from Karachi
SELECT name, email FROM customers WHERE city = 'Karachi';
