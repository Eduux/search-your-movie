type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
};

export interface MovieResponse {
  results: Movie[];
}

export function useMovies() {
  const API_KEY = useRuntimeConfig().public.MOVIES_API_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  const fetchPopularMovies = async () => {
    const response = await $fetch<MovieResponse>(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US`
    );
    return response.results;
  };

  const searchMovies = async (
    query: string,
    type: "TITLE" | "AI" = "TITLE"
  ) => {
    try {
      if (type === "AI") {
        const response = await $fetch<MovieResponse>("/api/movies/search", {
          method: "POST",
          body: { query },
        });
        return response.results;
      } else {
        const response = await $fetch<MovieResponse>(
          `https://api.themoviedb.org/3/search/movie`,
          {
            params: {
              api_key: API_KEY,
              query,
            },
          }
        );
        return response.results;
      }
    } catch (error) {
      console.error("Error searching movies:", error);
      return [];
    }
  };

  return {
    fetchPopularMovies,
    searchMovies,
  };
}
