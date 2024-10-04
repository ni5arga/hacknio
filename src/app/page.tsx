// app/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { fetchTopStories, fetchItemById } from '../../utils/api';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'; 

type Story = {
  id: number;
  title: string;
  url?: string;
  by: string;
  score: number;
  time: number;
};

export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const storiesPerPage = 10; // Number of stories per page

  useEffect(() => {
    const getStories = async () => {
      const storyIds = await fetchTopStories();
      setTotalPages(Math.ceil(storyIds.length / storiesPerPage));

      const paginatedStoryIds = storyIds.slice(
        (currentPage - 1) * storiesPerPage,
        currentPage * storiesPerPage
      );

      const storiesData = await Promise.all(paginatedStoryIds.map((id: number) => fetchItemById(id)));
      setStories(storiesData);
    };

    getStories();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Hacker News - Top Stories</h1>
      <ul className="space-y-6">
        {stories.map((story) => (
          <li key={story.id} className="bg-white shadow-md p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/story/${story.id}`} className="text-lg font-semibold text-blue-600 hover:underline">
                  {story.title}
                </Link>
                <p className="text-sm text-gray-600">by {story.by}</p>
              </div>
              <p className="text-gray-500 text-sm">
                {story.score} points | {new Date(story.time * 1000).toLocaleDateString()}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6">
        <button
          className={`mr-2 p-2 rounded-md bg-gray-200 ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
          }`}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <span className="text-lg font-semibold">
          {currentPage} / {totalPages}
        </span>
        <button
          className={`ml-2 p-2 rounded-md bg-gray-200 ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
          }`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
