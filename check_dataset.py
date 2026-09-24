import pandas as pd

# Load the dataset
df = pd.read_csv("dataset/credit_card_fraud_10k.csv")

# Display column names
print("\n===== COLUMN NAMES =====")
print(df.columns.tolist())

# Display first 5 rows
print("\n===== FIRST 5 ROWS =====")
print(df.head())

# Display number of rows and columns
print("\n===== DATASET SHAPE =====")
print(df.shape)

# Display data types
print("\n===== DATA TYPES =====")
print(df.dtypes)

# Display missing values
print("\n===== MISSING VALUES =====")
print(df.isnull().sum())

# Display basic statistics
print("\n===== BASIC STATISTICS =====")
print(df.describe())