// app/story/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { fetchItemById } from '../../utils/api';

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

const CommentComponent = ({ comment }: { comment: Comment }) => {
  const [childComments, setChildComments] = useState<Comment[]>([]);
  const [loadingChildComments, setLoadingChildComments] = useState(true);

  useEffect(() => {
    const fetchChildComments = async () => {
      if (comment.kids) {
        const loadedChildComments = await Promise.all(
          comment.kids.map((kidId: number) => fetchItemById(kidId))
        );
        setChildComments(loadedChildComments);
      }
      setLoadingChildComments(false);
    };

    fetchChildComments();
  }, [comment]);

  const isValidComment = (text: string | undefined) => {
    return text && text.trim() !== '';
  };

  if (!isValidComment(comment.text)) {
    return null; 
  }

  return (
    <li key={comment.id} className="bg-white shadow-md p-4 rounded-lg">
      <p className="text-sm text-gray-600">
        <strong>
          <a href={`/user/${comment.by}`} className="text-blue-600 hover:underline">{comment.by}</a>
        </strong> | {new Date(comment.time * 1000).toLocaleDateString()}
      </p>
      
      <div className="mt-2 text-gray-700" dangerouslySetInnerHTML={{ __html: comment.text }} />

      {loadingChildComments ? (
        <p className="text-black">Loading child comments...</p>  
      ) : (
        childComments.length > 0 && (
          <ul className="mt-4 pl-6 border-l border-gray-300">
            {childComments.map((childComment) => (
              <CommentComponent key={childComment.id} comment={childComment} />
            ))}
          </ul>
        )
      )}
    </li>
  );
};

export default function StoryPage({ params }: { params: { id: string } }) {
  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    const getStory = async () => {
      const storyData = await fetchItemById(Number(params.id));
      setStory(storyData);

      if (storyData.kids) {
        const commentsData = await Promise.all(
          storyData.kids.map((kidId: number) => fetchItemById(kidId))
        );
        setComments(commentsData);
      }
      setLoadingComments(false);
    };

    getStory();
  }, [params.id]);

  if (!story) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">{story.title}</h1>
      <p className="text-sm text-white-800 font-semibold">
        by <a href={`/user/${story.by}`} className="text-blue-600 hover:underline">{story.by}</a> | 
        <span className="text-white-800 font-semibold"> {story.score} points | {new Date(story.time * 1000).toLocaleDateString()}</span>
      </p>
      {story.text && (
        <div className="mt-4" dangerouslySetInnerHTML={{ __html: story.text }} />
      )}
      {story.url && (
        <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-4 block">
          {story.url}
        </a>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Comments</h2>
        {loadingComments ? (
          <p className="text-black">Loading comments...</p>  
        ) : (
          <ul className="space-y-6 mt-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentComponent key={comment.id} comment={comment} />
              ))
            ) : (
              <p>No comments available.</p>  
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
