"use client";

import { useEffect, useState } from 'react';
import { fetchTopStories, fetchItemById } from './utils/api';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'; 
import { Spinner } from 'flowbite-react';

type Story = {
  id: number;
  title: string;
  url?: string;
  by: string;
  score: number;
  time: number;
  kids?: number[];
};

export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const storiesPerPage = 10; 

  useEffect(() => {
    const getStories = async () => {
      setLoading(true); 
      const storyIds = await fetchTopStories();
      setTotalPages(Math.ceil(storyIds.length / storiesPerPage));

      const paginatedStoryIds = storyIds.slice(
        (currentPage - 1) * storiesPerPage,
        currentPage * storiesPerPage
      );

      const storiesData = await Promise.all(paginatedStoryIds.map((id: number) => fetchItemById(id)));
      setStories(storiesData);
      setLoading(false); 
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

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      handleNextPage();
    } else if (event.key === 'ArrowLeft') {
      handlePrevPage();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl text-left mb-6">hacknio</h1>

      {loading ? ( // Show spinner when loading
        <div className="flex justify-center">
          <Spinner aria-label="Loading" />
        </div>
      ) : (
        <ul className="space-y-6">
          {stories.map((story) => (
            <li key={story.id} className="bg-white shadow-md p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <Link 
                    href={story.url || `/story/${story.id}`} 
                    target="_blank"
                    className="text-lg font-semibold text-blue-600 hover:underline"
                  >
                    {story.title}
                  </Link>
                  <p className="text-sm text-gray-600">
                    by{' '}
                    <Link href={`/user/${story.by}`} className="text-blue-500 hover:underline">
                      {story.by}
                    </Link>
                  </p>
                  <p className="text-gray-500 text-sm">
                    <Link 
                      href={`/story/${story.id}`} 
                      className="font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      {story.kids?.length || 0} comments
                    </Link> | {story.score} points | {new Date(story.time * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

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
