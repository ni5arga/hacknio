// utils/api.ts
import axios from 'axios';

const API_BASE = 'https://hacker-news.firebaseio.com/v0';

export const fetchTopStories = async () => {
  const { data } = await axios.get(`${API_BASE}/topstories.json`);
  return data.slice(0, 30); // Fetch top 30 stories
};

export const fetchItemById = async (id: number) => {
  const { data } = await axios.get(`${API_BASE}/item/${id}.json`);
  return data;
};
