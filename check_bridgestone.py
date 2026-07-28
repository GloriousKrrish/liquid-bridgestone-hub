import os
import pandas as pd

# Path to the newly downloaded dataset 4
user_home = os.path.expanduser("~")
prices_dir = os.path.join(user_home, ".cache", "kagglehub", "datasets", "devsubhash", "car-tyres-dataset", "versions", "1")

# Locate the CSV file dynamically
csv_file = [f for f in os.listdir(prices_dir) if f.endswith('.csv')][0]
csv_path = os.path.join(prices_dir, csv_file)

# Read the data
df = pd.read_csv(csv_path)

# Filter for Bridgestone-only data
bridgestone_df = df[df['Tyre Brand'].str.upper() == 'BRIDGESTONE']

# Print the breakdown metrics
print("=== BRIDGESTONE DATASET INTEGRITY CHECK ===")
print(f"Total rows in raw dataset: {len(df)}")
print(f"Total rows belonging to Bridgestone: {len(bridgestone_df)}")
print("\n--- SAMPLE OF BRIDGESTONE DATA FOUND ---")
print(bridgestone_df[['Model', 'Submodel', 'Serial No.', 'Size', 'Selling Price', 'Rating']].head(10))