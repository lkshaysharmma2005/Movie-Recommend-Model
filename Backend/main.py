from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

df = pickle.load(open("movie_list.pkl", "rb"))
nn = pickle.load(open("knn_model.pkl", "rb"))
vectors = pickle.load(open("vectors.pkl", "rb"))

class Movie(BaseModel):
    movie: str

@app.get("/")
def home():
    return {
        "status": "Backend Running",
        "movies": len(df)
    }

def recommend(movie):
    if movie not in df["title"].values:
        return {
            "success": False,
            "message": "Movie not found",
            "recommendations": []
        }

    movie_index = df[df["title"] == movie].index[0]

    distances, indices = nn.kneighbors(
        vectors[movie_index].reshape(1, -1),
        n_neighbors=6
    )

    recommendations = []

    for i in indices[0][1:]:
        row = df.iloc[i]

        recommendations.append({
            "id": int(row["id"]),
            "title": row["title"]
        })

    return {
        "success": True,
        "recommendations": recommendations
    }

@app.post("/recommend")
def get_recommendation(data: Movie):
    return recommend(data.movie)