import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export default defineEventHandler(async (event) => {
  const { query } = await readBody(event);

  try {
    const data = await generateText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content:
            "You are a movie expert. Based on the user's description, return only the most likely movie title. Return just the movie title, nothing else.",
        },
        {
          role: "user",
          content: query,
        },
      ],
    });

    const movieTitle = data.text;

    const tmdbResponse = await $fetch(
      `https://api.themoviedb.org/3/search/movie`,
      {
        method: "GET",
        params: {
          api_key: process.env.MOVIES_API_KEY,
          query: movieTitle,
        },
      }
    );

    return tmdbResponse;
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      message: "Error processing search request",
    });
  }
});
