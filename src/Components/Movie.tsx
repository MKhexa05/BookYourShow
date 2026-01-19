import { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPaths";
import MovieCard from "./MovieCard";

type Movie = {
  id: string;
  name: string;
  description: string;
  duration: number;
  image: string;
  category: string[];
  languages: string[];
  createdAt: string;
  updatedAt: string;
};

const Movie = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchMovies() {
      setLoading(true);
      try {
        const response = await axiosInstance.get(API_PATH.MOVIE.GET_MOVIES);
        if (mounted) setMovies(response.data);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10">
      {movies && movies.length > 0 && !loading ? (
        movies.map((movie) => {
          return (
            <MovieCard
              id={movie.id}
              key={movie.id}
              name={movie.name}
              image={movie.image}
            />
          );
        })
      ) : (
        <div className="col-span-full flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-86 rounded-xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Movie;
