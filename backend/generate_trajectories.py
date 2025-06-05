# backend/generate_trajectories.py

import pandas as pd
import json
from tqdm import tqdm
from skyfield.api import load, EarthSatellite
import numpy as np

# Load all objects
sdf = pd.read_pickle("data/cleaned_space_decay.pkl")

# Map object types to output filenames
object_types = {
    "DEBRIS": "debris_24h_trajectories.json",
    "PAYLOAD": "payload_24h_trajectories.json",
    "ROCKET BODY": "rocket_24h_trajectories.json"
}

# Skyfield setup
ts = load.timescale()
hours = list(range(25))
date = (2025, 5, 28)

for obj_type, filename in object_types.items():
    filtered = sdf[sdf['OBJECT_TYPE'] == obj_type]
    results = {}

    success_count = 0
    fail_count = 0
    nan_count = 0

    print(f"\n🔄 Processing {obj_type} ({len(filtered)} objects)...")

    for _, row in tqdm(filtered.iterrows(), total=len(filtered)):
        try:
            line1 = row['TLE_LINE1']
            line2 = row['TLE_LINE2']
            name = row['OBJECT_NAME']
            norad_id = int(row['NORAD_CAT_ID'])

            if pd.isna(line1) or pd.isna(line2):
                fail_count += 1
                continue

            sat = EarthSatellite(line1, line2, name, ts)
            times = ts.utc(*date, hours)

            trajectory = []
            for t in times:
                pos = sat.at(t).position.km
                if np.isnan(pos).any() or np.isinf(pos).any():
                    raise ValueError("NaN or inf in position")
                trajectory.append([pos[0], pos[1], pos[2]])

            results[norad_id] = trajectory
            success_count += 1

        except ValueError as e:
            if "NaN" in str(e) or "inf" in str(e):
                nan_count += 1
            fail_count += 1
        except Exception as e:
            fail_count += 1

    # Save JSON
    with open(f"data/trajectory_data/{filename}", "w") as f:
        json.dump(results, f)

    print(f"✅ Saved {success_count} valid objects to data/{filename}")
    print(f"❌ Failed: {fail_count} | NaN/Inf issues: {nan_count}")
