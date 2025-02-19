<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <img :src="posterUrl" :alt="movie.title" class="w-full h-64 object-cover" />
    <div class="p-4">
      <h2 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
        {{ movie.title }}
      </h2>
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        {{ movie.release_date }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["toggleFavorite"]);

const posterUrl = computed(() => {
  return `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`;
});
</script>
