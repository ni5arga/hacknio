"use client";

import { useEffect, useState } from 'react';
import { fetchTopStories, fetchItemById } from './utils/api';
import Link from 'next/link';

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
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' || event.key === 'L') {
      handleNextPage();
    } else if (event.key === 'ArrowLeft' || event.key === 'H') {
      handlePrevPage();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage]);

  useEffect(() => {
    const handleInitialKeyDown = (event: KeyboardEvent) => {
      if (loading) return;
      handleKeyDown(event);
    };

    window.addEventListener('keydown', handleInitialKeyDown);
    return () => {
      window.removeEventListener('keydown', handleInitialKeyDown);
    };
  }, [loading]);

  return (
    <div className="container mx-auto">
      {loading ? (
        <div className="flex justify-center items-center my-4 h-32">
          <p className="text-lg">Loading...</p>
        </div>
      ) : (
        <>
          <ul className="space-y-6">
            {stories.map((story) => (
              <li key={story.id} className="hover:bg-neutral-900 shadow-md p-4 transition">
                <div className="flex flex-col items-start justify-between">

                  <Link
                    href={story.url || `/story/${story.id}`}
                    target="_blank"
                    className="text-lg font-semibold text-white hover:text-orange-400 transition hover:underline"
                  >
                    {story.title}
                  </Link>
                  <p className="text-sm mt-[5px] mb-3 text-neutral-400">
                    by{' '}
                    <Link href={`/user/${story.by}`} className="text-orange-400 transition hover:text-orange-300 underline">
                      {story.by}
                    </Link>
                  </p>
                  <div>
                    <p className="text-neutral-400 text-sm">
                      <Link
                        href={`/story/${story.id}`}
                        className="text-orange-400 hover:underline cursor-pointer"
                      >
                        {story.kids?.length || 0} comments
                      </Link> <span className="text-neutral-600">|</span>{' '}
                      <Link
                        href={`/story/${story.id}`}
                        className="text-neutral-400 cursor-pointer"
                      >
                        {story.score} points
                      </Link> <span className="text-neutral-600">|</span> {new Date(story.time * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {!loading && (
            <div className="flex justify-center items-center mt-6">
              <button
                className={`mr-2 p-2 w-12 h-12 rounded-md bg-black text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                  }`}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                {'<'}
              </button>
              <span className="text-lg font-semibold">
                {currentPage} / {totalPages}
              </span>
              <button
                className={`ml-2 p-2 w-12 h-12 rounded-md bg-black text-white ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                  }`}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                {'>'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
