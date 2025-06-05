from skyfield.api import load, EarthSatellite
from typing import Dict, List
import numpy as np

ts = load.timescale()

def get_satellite_positions_batch(objects: List[Dict]) -> List[Dict]:
    now = ts.now()
    results = []

    for obj in objects:
        try:
            line1 = obj['TLE_LINE1']
            line2 = obj['TLE_LINE2']
            name = obj['OBJECT_NAME']
            norad_id = obj.get('NORAD_CAT_ID', 0)

            satellite = EarthSatellite(line1, line2, name, ts)
            geocentric = satellite.at(now)
            subpoint = geocentric.subpoint()
            position = geocentric.position.km

            # Validation: reject NaN or inf
            if np.isnan(position).any() or np.isinf(position).any():
                raise ValueError("Invalid position: NaN or inf")

            results.append({
                'norad_cat_id': norad_id,
                'eci_x': position[0],
                'eci_y': position[1],
                'eci_z': position[2],
                'latitude': subpoint.latitude.degrees,
                'longitude': subpoint.longitude.degrees,
                'altitude_km': subpoint.elevation.km
            })

        except Exception as e:
            # Optional: log or count failures
            continue

    return results



def get_realposition(sample_object): 
    line1 = sample_object['TLE_LINE1']
    line2 = sample_object['TLE_LINE2']
    name = sample_object['OBJECT_NAME']
    norad_id = sample_object['NORAD_CAT_ID']

    ts = load.timescale()
    satellite = EarthSatellite(line1, line2, name, ts)
    time_now = ts.now()
    
    geocentric = satellite.at(time_now)
    subpoint = geocentric.subpoint()

    return {
        'norad_cat_id': norad_id,
        'eci_x': geocentric.position.km[0],
        'eci_y': geocentric.position.km[1],
        'eci_z': geocentric.position.km[2],
        'latitude': subpoint.latitude.degrees,
        'longitude': subpoint.longitude.degrees,
        'altitude_km': subpoint.elevation.km
    }

