# backend/main.py
from fastapi import FastAPI
from endpoints import router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Earth Debris Simulator API",
    description="Returns real-time satellite positions for simulation",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or set your frontend URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include the router
app.include_router(router)

# Run with: uvicorn main:app --reload
