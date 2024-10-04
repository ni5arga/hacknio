// app/story/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { fetchItemById } from '../../utils/api';
import { useRouter } from 'next/router';

type Comment = {
  id: number;
  by: string;
  text: string;
  time: number;
  kids?: number[];
};

type Story = {
  id: number;
  title: string;
  by: string;
  url?: string;
  text?: string;
  score: number;
  time: number;
  kids?: number[];
};

export default function StoryPage({ params }: { params: { id: string } }) {
  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const { id } = params;

  useEffect(() => {
    const getStory = async () => {
      const storyData = await fetchItemById(Number(id));
      setStory(storyData);

      // Fetch comments
      if (storyData.kids) {
        const commentsData = await Promise.all(storyData.kids.map((kidId: number) => fetchItemById(kidId)));
        setComments(commentsData);
      }
    };

    getStory();
  }, [id]);

  if (!story) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">{story.title}</h1>
      <p className="text-sm text-gray-600">by {story.by} | {story.score} points | {new Date(story.time * 1000).toLocaleDateString()}</p>
      {story.text && (
        <div className="mt-4" dangerouslySetInnerHTML={{ __html: story.text }} />
      )}
      {story.url && (
        <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-4 block">
          Read more
        </a>
      )}

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Comments</h2>
        <ul className="space-y-6 mt-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <li key={comment.id} className="bg-white shadow-md p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>{comment.by}</strong> | {new Date(comment.time * 1000).toLocaleDateString()}
                </p>
                <div className="mt-2 text-gray-700" dangerouslySetInnerHTML={{ __html: comment.text }} />
              </li>
            ))
          ) : (
            <p>No comments available.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
