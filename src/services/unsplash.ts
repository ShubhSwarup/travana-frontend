// src/services/unsplash.ts
import axios from "axios";

const UNSPLASH_ACCESS_KEY = "AHAks-q-mg9qSJ_2qQul9DO7jo69hbe7GsSM_y72RLY"; // ⬅️ Replace with your real access key

const unsplashClient = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
  },
});

export const fetchCityImage = async (query: string): Promise<string | null> => {
  try {
    const res = await unsplashClient.get("/search/photos", {
      params: {
        query,
        per_page: 1,
        orientation: "landscape",
        content_filter: "high",
      },
    });

    const photo = res.data?.results?.[0];
    return photo?.urls?.regular || null;
  } catch (error) {
    console.error("Failed to fetch image from Unsplash:", error);
    return null;
  }
};
