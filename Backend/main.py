from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

df = pickle.load(open("movie_list.pkl", "rb"))
nn = pickle.load(open("knn_model.pkl", "rb"))
vectors = pickle.load(open("vectors.pkl", "rb"))

API_KEY = "61dccdfb"


def fetch_poster(title):
    url = f"https://www.omdbapi.com/?t={requests.utils.quote(title)}&apikey={API_KEY}"

    try:
        response = requests.get(url, timeout=5)
        data = response.json()

        if data.get("Response") == "True" and data.get("Poster") != "N/A":
            return data["Poster"]

        url = f"https://www.omdbapi.com/?s={requests.utils.quote(title)}&apikey={API_KEY}"
        response = requests.get(url, timeout=5)
        data = response.json()

        if data.get("Response") == "True":
            poster = data["Search"][0].get("Poster")
            if poster != "N/A":
                return poster

    except Exception:
        pass

    return None


class Movie(BaseModel):
    movie: str


@app.get("/")
def home():
    return {
        "status": "Backend Running",
        "movies": len(df)
    }


def recommend(movie):
    if movie not in df["original_title"].values:
        return {
            "success": False,
            "message": "Movie not found",
            "recommendations": []
        }

    movie_index = df[df["original_title"] == movie].index[0]

    distances, indices = nn.kneighbors(
        vectors[movie_index].reshape(1, -1),
        n_neighbors=6
    )

    recommendations = []

    for i in indices[0][1:]:
        row = df.iloc[i]

        recommendations.append({
            "id": int(row["movie_id"]),
            "title": row["original_title"],
            "poster": fetch_poster(row["original_title"])
        })

    return {
        "success": True,
        "recommendations": recommendations
    }


@app.post("/recommend")
def get_recommendation(data: Movie):
    return recommend(data.movie)