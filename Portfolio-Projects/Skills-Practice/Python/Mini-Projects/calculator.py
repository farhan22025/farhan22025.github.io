# Python Mini-Project - calculator.py
# Student: Farhan Alam | Data Science

def add(x, y):        return x + y
def subtract(x, y):   return x - y
def multiply(x, y):   return x * y
def divide(x, y):
    if y == 0:        return "Error: Cannot divide by zero!"
    return round(x / y, 4)
def power(x, y):      return x ** y
def modulo(x, y):     return x % y

OPERATIONS = {
    '1': ('Add',      add),
    '2': ('Subtract', subtract),
    '3': ('Multiply', multiply),
    '4': ('Divide',   divide),
    '5': ('Power',    power),
    '6': ('Modulo',   modulo),
}

def show_menu():
    print("\n============================")
    print("   Farhan's CLI Calculator  ")
    print("============================")
    for key, (label, _) in OPERATIONS.items():
        print(f"  {key}. {label}")
    print("  0. Exit")

def run_calculator():
    history = []
    while True:
        show_menu()
        choice = input("\nSelect operation (0-6): ").strip()
        if choice == '0':
            print("Goodbye! Calculation history:")
            for h in history:
                print(f"  {h}")
            break
        if choice not in OPERATIONS:
            print("Invalid choice. Try again.")
            continue
        try:
            a = float(input("Enter first number: "))
            b = float(input("Enter second number: "))
        except ValueError:
            print("Please enter valid numbers.")
            continue
        label, func = OPERATIONS[choice]
        result = func(a, b)
        entry = f"{a} {label} {b} = {result}"
        print(f"\n>>> {entry}")
        history.append(entry)

if __name__ == "__main__":
    run_calculator()
