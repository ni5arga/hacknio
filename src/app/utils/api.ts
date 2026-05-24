// utils/api.ts

export type StoryType = 'top' | 'new' | 'show' | 'ask' | 'job';

const STORY_ENDPOINTS: Record<StoryType, string> = {
  top: 'topstories',
  new: 'newstories',
  show: 'showstories',
  ask: 'askstories',
  job: 'jobstories',
};

export const fetchStoryIds = async (type: StoryType = 'top'): Promise<number[]> => {
  const endpoint = STORY_ENDPOINTS[type];
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/${endpoint}.json?print=pretty`);
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const fetchTopStories = async (): Promise<number[]> => fetchStoryIds('top');

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
