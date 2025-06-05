# backend/endpoints.py
from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List
import pandas as pd
import json
import os
from fastapi.responses import JSONResponse
from orbital_utils import get_satellite_positions_batch, get_realposition

router = APIRouter()

# Load data once
sdf = pd.read_pickle("data/cleaned_space_decay.pkl")

# Pydantic model
class SatellitePosition(BaseModel):
    norad_cat_id: int
    eci_x: float
    eci_y: float
    eci_z: float
    latitude: float
    longitude: float
    altitude_km: float


class SatelliteData(BaseModel):
    comment: str
    creation_date: str
    organization: str
    object_name: str
    country_code: str
    launch_date: str
    site: str
    norad_cat_id: int
    eccentricity: float
    rcs_size: str
    object_type: str
    classification_type: str


# Define the endpoints
    

@router.get("/all_debris_positions", response_model=List[SatellitePosition])
def get_debris_positions(count: int = Query(10, ge=1, le=8431)):
    debris_df = sdf[sdf["OBJECT_TYPE"].str.upper().str.contains("DEBRIS")]
    sample_debris = debris_df.head(count).to_dict(orient="records")
    return get_satellite_positions_batch(sample_debris)

@router.get("/all_payloads_positions", response_model=List[SatellitePosition])
def get_payloads_positions(count: int = Query(10, ge=1, le=4950)):
    payloads_df = sdf[sdf["OBJECT_TYPE"].str.upper().str.contains("PAYLOAD")]
    sample_payloads = payloads_df.head(count).to_dict(orient="records")
    return get_satellite_positions_batch(sample_payloads)

@router.get("/all_roketbodies_positions", response_model=List[SatellitePosition])
def get_rocketbodies_positions(count: int = Query(10, ge=1, le=744)):
    rocketbodies_df = sdf[sdf["OBJECT_TYPE"].str.upper().str.contains("ROCKET BODY")]
    sample_rockets = rocketbodies_df.head(count).to_dict(orient="records")
    # print(type(sample_rockets), type(get_satellite_positions_batch(sample_rockets)))
    return get_satellite_positions_batch(sample_rockets)

@router.get("/precomputed_positions")
def get_precomputed_positions(type: int = Query(1, ge=1, le=3)):
    file_map = {
        1: "data/trajectory_data/debris_24h_trajectories.json",
        2: "data/trajectory_data/payload_24h_trajectories.json",
        3: "data/trajectory_data/rocket_24h_trajectories.json"
    }

    filepath = file_map.get(type)

    if not filepath or not os.path.exists(filepath):
        return JSONResponse(status_code=404, content={"error": "Precomputed trajectory not found"})

    with open(filepath, "r") as f:
        print(f"Loading precomputed positions from {filepath}")
        _24data = json.load(f)
        print(len(_24data))
    return _24data


@router.get("/object_data", response_model=SatelliteData)
def get_object_data(norad_cat_id: int):
    object_data = sdf[sdf["NORAD_CAT_ID"] == norad_cat_id]

    if object_data.empty:
        return JSONResponse(status_code=404, content={"error": "Object not found"})

    data = object_data.iloc[0].to_dict()

    return SatelliteData(
        comment=str(data.get("COMMENT", "")),
        creation_date=str(data.get("CREATION_DATE", "")),
        organization=str(data.get("ORIGINATOR", "")),
        object_name=str(data.get("OBJECT_NAME", "")),
        country_code=str(data.get("COUNTRY_CODE", "")),
        launch_date=str(data.get("LAUNCH_DATE", "")),
        site=str(data.get("SITE", "")),
        norad_cat_id=int(data.get("NORAD_CAT_ID", 0)),
        eccentricity=float(data.get("ECCENTRICITY", 0.0)),
        rcs_size=str(data.get("RCS_SIZE", "UNKNOWN")),
        object_type=str(data.get("OBJECT_TYPE", "")),
        classification_type=str(data.get("CLASSIFICATION_TYPE", ""))
    )


@router.get("/object_realposition", response_model=SatellitePosition)
def get_object_realposition(norad_cat_id: int):
    object_realposition = sdf[sdf["NORAD_CAT_ID"] == norad_cat_id]
    
    if object_realposition.empty:
        return JSONResponse(status_code=404, content={"error": "Object not found"})

    try:
        satellite_position = get_realposition(object_realposition.iloc[0].to_dict())
        return satellite_position
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Calculation failed: {str(e)}"})