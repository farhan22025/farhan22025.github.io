# Student: Farhan Alam
# Basic Data Analysis Practice
import pandas as pd
import matplotlib.pyplot as plt

def analyze_student_data():
    # Mock dataset for practice
    data = {
        'Student': ['Ali', 'Ayesha', 'Bilal', 'Fatima', 'Usman'],
        'Math_Score': [85, 92, 78, 88, 95],
        'Science_Score': [80, 89, 75, 91, 88],
        'Attendance_Percentage': [90, 95, 80, 98, 85]
    }
    
    df = pd.DataFrame(data)
    print("--- Dataset Overview ---")
    print(df.head())
    
    print("\n--- Summary Statistics ---")
    print(df.describe())
    
    # Calculate average scores
    df['Average_Score'] = (df['Math_Score'] + df['Science_Score']) / 2
    
    # Plotting
    plt.figure(figsize=(8, 5))
    plt.bar(df['Student'], df['Average_Score'], color='skyblue')
    plt.title('Average Scores by Student')
    plt.xlabel('Student Name')
    plt.ylabel('Average Score')
    plt.ylim(0, 100)
    
    # Save plot as image to simulate a student project output
    plt.savefig('student_scores_chart.png')
    print("\nPlot saved as student_scores_chart.png!")

if __name__ == "__main__":
    analyze_student_data()
