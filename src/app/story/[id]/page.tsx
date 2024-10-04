// app/story/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { fetchItemById } from '../../../../utils/api';
import { useRouter } from 'next/router';

type Story = {
  id: number;
  title: string;
  by: string;
  url?: string;
  kids?: number[];
  text?: string;
};

export default function StoryPage({ params }: { params: { id: string } }) {
  const [story, setStory] = useState<Story | null>(null);
  const { id } = params;

  useEffect(() => {
    const getStory = async () => {
      const storyData = await fetchItemById(Number(id));
      setStory(storyData);
    };

    getStory();
  }, [id]);

  if (!story) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{story.title}</h1>
      <p className="text-sm text-gray-600">by {story.by}</p>
      {story.text && <p className="mt-4" dangerouslySetInnerHTML={{ __html: story.text }} />}
      {story.url && (
        <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-4 block">
          Read more
        </a>
      )}
    </div>
  );
}
