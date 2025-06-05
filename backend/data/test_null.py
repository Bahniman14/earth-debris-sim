import json
import os
import numpy as np

# Path to trajectory data
folder_path = "trajectory_data/"
filenames = [
    "debris_24h_trajectories.json",
    "payload_24h_trajectories.json",
    "rocket_24h_trajectories.json"
]

def check_for_nan_or_inf(trajectory):
    for coords in trajectory:
        if any(np.isnan(val) or np.isinf(val) for val in coords):
            return True
    return False

for file in filenames:
    full_path = os.path.join(folder_path, file)

    if not os.path.exists(full_path):
        print(f"❌ File not found: {file}")
        continue

    with open(full_path, "r") as f:
        data = json.load(f)

    nan_count = 0
    for norad_id, trajectory in data.items():
        if check_for_nan_or_inf(trajectory):
            nan_count += 1

    if nan_count == 0:
        print(f"✅ {file}: No NaN or inf values found.")
    else:
        print(f"⚠️  {file}: Found {nan_count} objects with NaN or inf values.")
