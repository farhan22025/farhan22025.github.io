# Data Engineering - Data Modeling
# Student: Farhan Alam | Data Science
# Demonstrates star schema design concept and normalization

"""
Star Schema Design:
-------------------
This module explains and simulates a star schema design for
a simple e-commerce analytical data warehouse.

FACT TABLE: fact_sales
DIMENSION TABLES: dim_customer, dim_product, dim_date

       dim_date
          |
dim_customer — fact_sales — dim_product
"""

import pandas as pd
from datetime import date, timedelta
import random

random.seed(42)

# ─── Dimension: Customers ─────────────────────────────────────────────────────
dim_customer = pd.DataFrame({
    'customer_key': range(1, 6),
    'customer_id':  ['C001','C002','C003','C004','C005'],
    'name':         ['Farhan','Ayesha','Bilal','Fatima','Usman'],
    'city':         ['Karachi','Lahore','Islamabad','Karachi','Lahore'],
    'segment':      ['Premium','Standard','Standard','Premium','Budget']
})

# ─── Dimension: Products ──────────────────────────────────────────────────────
dim_product = pd.DataFrame({
    'product_key':  range(1, 5),
    'product_id':   ['P001','P002','P003','P004'],
    'product_name': ['Laptop','Mouse','Chair','Monitor'],
    'category':     ['Electronics','Electronics','Furniture','Electronics'],
    'unit_price':   [75000, 1200, 18000, 35000]
})

# ─── Dimension: Date ──────────────────────────────────────────────────────────
start = date(2024, 1, 1)
dates = [start + timedelta(days=i*10) for i in range(10)]
dim_date = pd.DataFrame({
    'date_key':   range(1, 11),
    'full_date':  dates,
    'month':      [d.month for d in dates],
    'quarter':    [(d.month - 1) // 3 + 1 for d in dates],
    'year':       [d.year for d in dates]
})

# ─── Fact Table: Sales ────────────────────────────────────────────────────────
fact_sales = pd.DataFrame({
    'sale_id':       range(1, 16),
    'customer_key':  [random.randint(1,5)  for _ in range(15)],
    'product_key':   [random.randint(1,4)  for _ in range(15)],
    'date_key':      [random.randint(1,10) for _ in range(15)],
    'quantity':      [random.randint(1,3)  for _ in range(15)],
})

# Join to compute revenue
fact_sales = fact_sales.merge(dim_product[['product_key','unit_price']], on='product_key')
fact_sales['revenue'] = fact_sales['quantity'] * fact_sales['unit_price']
fact_sales.drop(columns=['unit_price'], inplace=True)

print("=== dim_customer ===")
print(dim_customer.to_string(index=False))

print("\n=== dim_product ===")
print(dim_product.to_string(index=False))

print("\n=== fact_sales (sample) ===")
print(fact_sales.head(8).to_string(index=False))

# ─── Analytical Queries on the Star Schema ────────────────────────────────────
# Revenue per customer segment
result = (fact_sales
    .merge(dim_customer[['customer_key','segment']], on='customer_key')
    .groupby('segment')['revenue']
    .agg(['sum','count'])
    .rename(columns={'sum':'total_revenue','count':'num_orders'})
    .sort_values('total_revenue', ascending=False))

print("\n=== Revenue by Segment ===")
print(result)
