import os
import pandas as pd

user_home = os.path.expanduser("~")
kaggle_base = os.path.join(user_home, ".cache", "kagglehub", "datasets")

paths = {
    "Dataset 1 (RTO)": os.path.join(kaggle_base, "aatifahmad123", "indian-vehicle-registration-data-202025", "versions", "1"),
    "Dataset 2 (Specs)": os.path.join(kaggle_base, "adarsh1077", "comprehensive-vehicle-specifications-dataset", "versions", "1"),
    "Dataset 3 (Market)": os.path.join(kaggle_base, "ak0212", "indian-car-market-dataset", "versions", "1"),
    "Dataset 4 (Tyres)": os.path.join(kaggle_base, "devsubhash", "car-tyres-dataset", "versions", "1")
}

print("=== STARTING DEEP CAR DATA INSPECTION ===\n")

for name, folder_path in paths.items():
    print(f"Checking: {name}")
    if not os.path.exists(folder_path):
        print("  -> Folder does not exist!")
        continue
        
    files = os.listdir(folder_path)
    print(f"  -> Files found: {files}")
    
    for f in files:
        full_path = os.path.join(folder_path, f)
        # Skip small system files or directories
        if os.path.isdir(full_path) or f.startswith('.') or os.path.getsize(full_path) < 100:
            continue
            
        try:
            if f.endswith('.csv'):
                df = pd.read_csv(full_path, nrows=2)
                print(f"  -> CSV [{f}] Columns: {list(df.columns)}")
            elif f.endswith('.json'):
                # Try reading line-by-line or standard JSON formats
                try:
                    df = pd.read_json(full_path, lines=True, nrows=2)
                except:
                    df = pd.read_json(full_path, nrows=2)
                print(f"  -> JSON [{f}] Columns: {list(df.columns)}")
        except Exception as e:
            print(f"  -> Could not parse data inside [{f}]: {str(e)}")
    print("-" * 50)