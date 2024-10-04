// app/page.tsx

"use client";
import { useEffect, useState } from 'react';
import { fetchTopStories, fetchItemById } from '../../utils/api'; 
import Link from 'next/link';

type Story = {
  id: number;
  title: string;
  url?: string;
  by: string;
};

export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const getStories = async () => {
      const storyIds = await fetchTopStories();
      const storiesData = await Promise.all(storyIds.map((id: number) => fetchItemById(id)));
      setStories(storiesData);
    };

    getStories();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Hacker News - Top Stories</h1>
      <ul className="mt-4">
        {stories.map((story) => (
          <li key={story.id} className="mb-4">
            <Link href={`/story/${story.id}`} className="text-blue-600 hover:underline">
              {story.title}
            </Link>
            <p className="text-sm text-gray-600">by {story.by}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
