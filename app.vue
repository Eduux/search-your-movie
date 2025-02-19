<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <header class="bg-white dark:bg-gray-800 shadow">
      <nav
        class="container mx-auto px-4 py-6 flex justify-between items-center"
      >
        <NuxtLink
          to="/"
          class="text-2xl font-bold text-gray-800 dark:text-white"
          >Movies explorer</NuxtLink
        >
        <div class="flex space-x-4">
          <NuxtLink
            to="/"
            class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >Home</NuxtLink
          >
        </div>
      </nav>
    </header>
    <main class="container mx-auto px-4 py-8">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts"></script>
