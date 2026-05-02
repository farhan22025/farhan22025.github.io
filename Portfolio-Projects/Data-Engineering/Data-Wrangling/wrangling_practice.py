# Data Engineering - Data Wrangling with Pandas
# Student: Farhan Alam | Data Science

import pandas as pd
import numpy as np

# ─── Multi-source Merge (simulating joining two data sources) ─────────────────
orders = pd.DataFrame({
    'order_id':    [101, 102, 103, 104, 105],
    'customer_id': [1, 2, 1, 3, 2],
    'product':     ['Laptop', 'Mouse', 'Notebook', 'Chair', 'Laptop'],
    'quantity':    [1, 3, 2, 1, 1],
    'price':       [75000, 1200, 250, 18000, 75000],
    'order_date':  pd.to_datetime(['2024-01-10','2024-01-12','2024-02-01','2024-02-14','2024-03-05'])
})

customers = pd.DataFrame({
    'customer_id': [1, 2, 3],
    'name':        ['Farhan', 'Ayesha', 'Bilal'],
    'city':        ['Karachi', 'Lahore', 'Islamabad']
})

# ─── Merge ────────────────────────────────────────────────────────────────────
df = orders.merge(customers, on='customer_id', how='left')
df['total_amount'] = df['quantity'] * df['price']

print("=== Merged Orders ===")
print(df.to_string(index=False))

# ─── Reshaping: Pivot Table ───────────────────────────────────────────────────
pivot = df.pivot_table(
    values='total_amount',
    index='name',
    columns='product',
    aggfunc='sum',
    fill_value=0
)
print("\n=== Pivot: Revenue per Customer per Product ===")
print(pivot)

# ─── Melt (Wide to Long) ──────────────────────────────────────────────────────
wide = pd.DataFrame({
    'student': ['Ali', 'Ayesha', 'Bilal'],
    'Math':    [85, 92, 78],
    'Science': [80, 89, 75],
    'English': [74, 85, 90]
})
long = wide.melt(id_vars='student', var_name='subject', value_name='score')
print("\n=== Melt: Wide to Long ===")
print(long)

# ─── GroupBy + Agg ────────────────────────────────────────────────────────────
agg = df.groupby('city').agg(
    total_orders   = ('order_id', 'count'),
    total_revenue  = ('total_amount', 'sum'),
    avg_order_val  = ('total_amount', 'mean')
).round(2)
print("\n=== Revenue by City ===")
print(agg)

# ─── Time Series Resampling ───────────────────────────────────────────────────
df.set_index('order_date', inplace=True)
monthly = df['total_amount'].resample('ME').sum()
print("\n=== Monthly Revenue ===")
print(monthly)
