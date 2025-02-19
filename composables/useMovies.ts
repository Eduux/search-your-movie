export type Movie = {
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
  const MAX_REQUESTS = 5;
  const REQUEST_RESET_HOURS = 24;

  const checkAndUpdateRequestLimit = () => {
    if (process.server) return true; // Skip on server-side

    const now = new Date().getTime();
    const requestData = localStorage.getItem("aiSearchRequests");

    if (!requestData) {
      localStorage.setItem(
        "aiSearchRequests",
        JSON.stringify({
          count: 1,
          timestamp: now,
        })
      );
      return true;
    }

    const { count, timestamp } = JSON.parse(requestData);
    const hoursSinceLastReset = (now - timestamp) / (1000 * 60 * 60);

    if (hoursSinceLastReset >= REQUEST_RESET_HOURS) {
      // Reset if 24 hours have passed
      localStorage.setItem(
        "aiSearchRequests",
        JSON.stringify({
          count: 1,
          timestamp: now,
        })
      );
      return true;
    }

    if (count >= MAX_REQUESTS) {
      return false;
    }

    // Increment count
    localStorage.setItem(
      "aiSearchRequests",
      JSON.stringify({
        count: count + 1,
        timestamp,
      })
    );
    return true;
  };

  const getRemainingRequests = () => {
    if (process.server) return MAX_REQUESTS;

    const requestData = localStorage.getItem("aiSearchRequests");
    if (!requestData) return MAX_REQUESTS;

    const { count, timestamp } = JSON.parse(requestData);
    const now = new Date().getTime();
    const hoursSinceLastReset = (now - timestamp) / (1000 * 60 * 60);

    if (hoursSinceLastReset >= REQUEST_RESET_HOURS) {
      return MAX_REQUESTS;
    }

    return MAX_REQUESTS - count;
  };

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
        if (!checkAndUpdateRequestLimit()) {
          throw new Error(
            `Limit exceeded. Try again in ${REQUEST_RESET_HOURS} hours`
          );
        }
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
    getRemainingRequests,
  };
}
