import os
import kagglehub
import pandas as pd

print("=== STARTING BRIDGESTONE INDIA DATASET DOWNLOADS ===\n")

# 1. Download Indian Vehicle Registration Data (Cars, Trucks, Buses)
print("Downloading Dataset 1/4 (RTO Registration Data)...")
path_rto = kagglehub.dataset_download("aatifahmad123/indian-vehicle-registration-data-202025")
print(f"-> Saved to: {path_rto}\n")

# 2. Download Comprehensive Vehicle Specifications Dataset
print("Downloading Dataset 2/4 (Detailed Specs/Variants)...")
path_specs = kagglehub.dataset_download("adarsh1077/comprehensive-vehicle-specifications-dataset")
print(f"-> Saved to: {path_specs}\n")

# 3. Download Indian Car Market Dataset
print("Downloading Dataset 3/4 (Market Overview)...")
path_market = kagglehub.dataset_download("ak0212/indian-car-market-dataset")
print(f"-> Saved to: {path_market}\n")

# 4. Download Indian Tyre Pricing & Model Catalog
print("Downloading Dataset 4/4 (Indian Tyre Pricing & Model Catalog)...")
path_prices = kagglehub.dataset_download("devsubhash/car-tyres-dataset")
print(f"-> Saved to: {path_prices}\n")

print("=== ALL DOWNLOADS COMPLETE ===")