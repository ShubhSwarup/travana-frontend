// src/services/pexels.ts
import axios from "axios";

const PEXELS_API_KEY =
  "uFQxhSSshdwyvk3Stgttidgzy2sHr6ag9j1Dm7KmVlbPZHRdbsKA9jvX";

const pexelsClient = axios.create({
  baseURL: "https://api.pexels.com/v1",
  headers: {
    Authorization: PEXELS_API_KEY,
  },
});

export const fetchCityImage = async (query: string): Promise<string | null> => {
  try {
    const res = await pexelsClient.get("/search", {
      params: {
        query,
        per_page: 1,
      },
    });

    const photo = res.data?.photos?.[0];
    return photo?.src?.large || null;
  } catch (error) {
    console.error("Failed to fetch image from Pexels:", error);
    return null;
  }
};
