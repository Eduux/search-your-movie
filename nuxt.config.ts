import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["./global.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    public: {
      MOVIES_API_KEY: process.env.MOVIES_API_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
  },
});
