// utils/api.ts

export const fetchTopStories = async (): Promise<number[]> => {
  const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty');
  const data = await response.json();
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchItemById = async (id: number): Promise<any> => {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
  const data = await response.json();
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchUserById = async (username: string): Promise<any> => {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/user/${username}.json?print=pretty`);
  const data = await response.json();
  return data;
}
