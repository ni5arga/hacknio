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

    if (loading) return <div>Loading...</div>;

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
            <h1 className="text-3xl font-bold mb-4">{user?.id}&apos;s Profile</h1>
            <p>Joined: {user?.created ? formatJoinedDate(user.created) : 'Unknown'}</p>
            <p>Karma: {user?.karma || 'N/A'}</p>
            <p>About: {sanitizeAboutText(user?.about)}</p>
        </div>
    );
}
