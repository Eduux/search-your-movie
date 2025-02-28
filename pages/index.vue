<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
      Search our movie by text or description with ai
    </h1>
    <div class="mb-6">
      <form @submit.prevent="performSearch" class="space-y-2">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="
            searchType === 'TITLE'
              ? 'Search movie by name...'
              : 'Search movie with ai...'
          "
          class="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          :disabled="isLoading"
        />
        <div class="flex gap-2 mt-2">
          <button
            type="button"
            :class="{
              'bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer':
                searchType === 'TITLE',
              'bg-gray-200 text-gray-600 px-4 py-2 rounded-md cursor-pointer':
                searchType === 'AI',
            }"
            @click="handleSelectTypeSearch('TITLE')"
          >
            Title
          </button>
          <button
            type="button"
            :class="{
              'bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer':
                searchType === 'AI',
              'bg-gray-200 text-gray-600 px-4 py-2 rounded-md cursor-pointer':
                searchType === 'TITLE',
            }"
            :disabled="searchType === 'AI' && remainingRequests <= 0"
            @click="handleSelectTypeSearch('AI')"
          >
            AI ({{ remainingRequests }} searches left)
          </button>
          <button
            type="submit"
            class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="
              isLoading || (searchType === 'AI' && remainingRequests <= 0)
            "
          >
            Search
          </button>
        </div>
      </form>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
      ></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useMovies, type Movie } from "~/composables/useMovies";
import { useHead } from "nuxt/app";

useHead({
  title: "Search your movies",
});

const {
  fetchPopularMovies,
  searchMovies: searchMoviesApi,
  getRemainingRequests,
} = useMovies();

const movies = ref<Movie[]>([]);
const searchQuery = ref("");
const searchType = ref<"AI" | "TITLE">("TITLE");
const isLoading = ref(false);
const remainingRequests = ref(getRemainingRequests());

onMounted(async () => {
  movies.value = await fetchPopularMovies();
});

const handleSelectTypeSearch = (type: "AI" | "TITLE") => {
  searchQuery.value = "";
  searchType.value = type;
};

const performSearch = async () => {
  try {
    isLoading.value = true;
    if (searchQuery.value) {
      movies.value = await searchMoviesApi(searchQuery.value, searchType.value);
      remainingRequests.value = getRemainingRequests();
    } else {
      movies.value = await fetchPopularMovies();
    }
    searchQuery.value = "";
  } finally {
    isLoading.value = false;
  }
};
</script>
