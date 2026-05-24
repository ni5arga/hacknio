// app/user/[username]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { fetchUserById } from '../../utils/api';

type UserProfile = {
  id: string;
  created: number;
  karma: number;
  about?: string;
};

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
    </div>
  );
}
