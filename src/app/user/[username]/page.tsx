// app/user/[username]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchUserById, fetchItemById } from '../../utils/api';
import { relativeTime } from '../../utils/time';

type UserProfile = {
  id: string;
  created: number;
  karma: number;
  about?: string;
  submitted?: number[];
};

type Submission = {
  id: number;
  type: 'story' | 'comment' | 'job' | 'poll' | 'pollopt';
  title?: string;
  text?: string;
  url?: string;
  time: number;
  score?: number;
  parent?: number;
  kids?: number[];
  deleted?: boolean;
  dead?: boolean;
};

const PAGE_SIZE = 15;

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await fetchUserById(params.username);
        if (!userData) {
          setError(true);
        } else {
          setUser(userData);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.username]);

  useEffect(() => {
    if (!user?.submitted?.length) return;
    loadMore(user.submitted, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadMore = async (ids: number[], from: number) => {
    setLoadingMore(true);
    const slice = ids.slice(from, from + PAGE_SIZE);
    const items = await Promise.all(slice.map((id) => fetchItemById(id)));
    const valid = items.filter((it): it is Submission => it && !it.deleted && !it.dead);
    setSubmissions((prev) => [...prev, ...valid]);
    setLoadedCount(from + slice.length);
    setLoadingMore(false);
  };

  if (loading) return (
    <div className="flex justify-center items-center my-4 h-32">
      <p className="text-lg text-neutral-400">Loading...</p>
    </div>
  );

  if (error || !user) return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl text-orange-400 mb-2">User not found</h1>
      <p className="text-neutral-400">
        No Hacker News user with id <span className="text-neutral-200">{params.username}</span> exists.
      </p>
    </div>
  );

  const formatJoinedDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const totalSubmissions = user.submitted?.length || 0;
  const hasMore = loadedCount < totalSubmissions;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl text-orange-400 mb-4">{user.id}&apos;s Profile</h1>
      <p><span className="text-neutral-400"> Joined - </span> {user.created ? formatJoinedDate(user.created) : 'Unknown'}</p>
      <p><span className="text-neutral-400"> Karma  - </span> {typeof user.karma === 'number' ? user.karma : 'N/A'}</p>
      <div className="mt-2">
        <span className="text-neutral-400"> About  - </span>
        {user.about ? (
          <div
            className="mt-2 text-neutral-200 COMMENT [&_p]:mt-3 [&_p:first-child]:mt-0"
            dangerouslySetInnerHTML={{ __html: user.about }}
          />
        ) : (
          <span> Not provided</span>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg text-orange-400 mb-3">
          Submissions{totalSubmissions ? ` (${totalSubmissions})` : ''}
        </h2>
        {totalSubmissions === 0 ? (
          <p className="text-neutral-400">No submissions yet.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {submissions.map((item) => (
                <li key={item.id} className="p-3 hover:bg-neutral-900 transition rounded-md">
                  {item.type === 'comment' ? (
                    <>
                      <p className="text-xs text-neutral-500 mb-1">
                        comment on{' '}
                        {item.parent ? (
                          <Link href={`/story/${item.parent}`} className="text-orange-400 hover:underline">
                            #{item.parent}
                          </Link>
                        ) : (
                          'thread'
                        )}{' '}
                        | {relativeTime(item.time)}
                      </p>
                      {item.text && (
                        <div
                          className="text-sm text-neutral-300 COMMENT line-clamp-4"
                          dangerouslySetInnerHTML={{ __html: item.text }}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <Link
                        href={item.url || `/story/${item.id}`}
                        target={item.url ? '_blank' : undefined}
                        className="text-white hover:text-orange-400 hover:underline transition"
                      >
                        {item.title || '(untitled)'}
                      </Link>
                      <p className="text-xs text-neutral-500 mt-1">
                        {typeof item.score === 'number' ? `${item.score} points | ` : ''}
                        {relativeTime(item.time)} |{' '}
                        <Link href={`/story/${item.id}`} className="text-orange-400 hover:underline">
                          {item.kids?.length || 0} comments
                        </Link>
                      </p>
                    </>
                  )}
                </li>
              ))}
            </ul>

            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => user.submitted && loadMore(user.submitted, loadedCount)}
                  disabled={loadingMore}
                  className="px-4 py-2 rounded-md bg-neutral-900 text-neutral-200 hover:bg-neutral-800 transition disabled:opacity-50"
                >
                  {loadingMore ? 'Loading...' : `Load more (${totalSubmissions - loadedCount} left)`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
