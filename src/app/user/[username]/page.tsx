// app/user/[username]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { fetchUserById } from '../../utils/api';

const decodeHtml = (html: string) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

type UserProfile = {
  id: string;
  created: number;
  karma: number;
  about?: string;
};

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = params.username;
        const userData = await fetchUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.username]);

  if (loading) return <div className="flex justify-center items-center my-4 h-32">
    <p className="text-lg text-neutral-400">Loading...</p>
  </div>;

  const formatJoinedDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const sanitizeAboutText = (aboutText: string | undefined) => {
    if (!aboutText) return 'Not provided';
    const decodedText = decodeHtml(aboutText);
    return decodedText.replace(/<[^>]+>/g, '');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl text-orange-400  mb-4">{user?.id}&apos;s Profile</h1>
      <p><span className="text-neutral-400"> Joined - </span> {user?.created ? formatJoinedDate(user.created) : 'Unknown'}</p>
      <p><span className="text-neutral-400"> Karma  - </span> {user?.karma || 'N/A'}</p>
      <p><span className="text-neutral-400">vAbout  - </span> {sanitizeAboutText(user?.about)}</p>
    </div>
  );
}
