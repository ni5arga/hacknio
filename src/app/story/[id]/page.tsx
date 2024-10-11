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
    <li key={comment.id} className=" transition hover:bg-neutral-900 shadow-md p-4 rounded-lg">
      <p className="text-sm text-neutral-400">
        <strong>
          <a href={`/user/${comment.by}`} className="text-orange-400 transition hover:text-orange-300 hover:underline">{comment.by}</a>
        </strong> | {new Date(comment.time * 1000).toLocaleDateString()}
      </p>

      <div className="mt-2 text-neutral-300 COMMENT" dangerouslySetInnerHTML={{ __html: comment.text }} />

      {loadingChildComments ? (
        <p className="text-neutral-400 mt-4">Loading child comments...</p>
      ) : (
        childComments.length > 0 && (
          <ul className="mt-4 pl-6 border-l border-neutral-800">
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

  if (!story) return <div className="flex justify-center items-center my-4 h-32">
    <p className="text-lg text-neutral-400">Loading...</p>
  </div>
    ;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl mb-4">{story.title}</h1>
      <p className="text-sm text-neutral-400">
        by <a href={`/user/${story.by}`} className="text-orange-400 transition hover:text-orange-300 hover:underline">{story.by}</a> |
        <span className="text-neutral-400"> {story.score} points | {new Date(story.time * 1000).toLocaleDateString()}</span>
      </p>
      {story.text && (
        <div className="mt-4 text-neutral-300 leading-8" dangerouslySetInnerHTML={{ __html: story.text }} />
      )}
      {story.url && (
        <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-orange-400 transition hover:text-orange-300 underline mt-4 block">
          {story.url}
        </a>
      )}

      <div className="mt-8">
        <h2 className="text-xl ">Comments</h2>
        {loadingComments ? (
          <p className="text-black">Loading comments...</p>
        ) : (
          <ul className="space-y-6 mt-4">
            {comments.length > 0 ? (
              comments.map((comment, j) => {
                return <div key={comment.id} >
                  <CommentComponent comment={comment} />
                  {j - 1 != comments.length && <div className="my-4 px-2 py-[1px] bg-neutral-900"> </div>}
                </div>
              })
            ) : (
              <p>No comments available.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
