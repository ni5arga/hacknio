"use client";

import { useEffect, useState } from 'react';
import { fetchTopStories, fetchItemById } from './utils/api';
import Link from 'next/link';
import { Triangle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

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

  const handleFirstPage = () => {
    setCurrentPage(1);
  }

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  }

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
          <p className="text-lg text-neutral-400">Loading...</p>
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
                        className="text-neutral-400 inline-flex items-center gap-[2px] cursor-pointer"
                      >  <Triangle size={13} />
                        <p> {story.score} points </p>
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
                className={`p-2 mr-2 transition flex justify-center items-center w-12 h-12 rounded-md bg-black text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-800'
                  }`}
                onClick={handleFirstPage}
                disabled={currentPage === 1}
              >
                <ChevronsLeft size={20} />
              </button>
              <button
                className={`p-2 mr-8 transition flex justify-center items-center w-12 h-12 rounded-md bg-black text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-800'
                  }`}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-lg font-semibold">
                {currentPage} / {totalPages}
              </span>
              <button
                className={`ml-8 transition p-2 w-12 h-12 flex justify-center items-center rounded-md bg-black text-white ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-800'

                  }`}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={20} />
              </button>

              <button
                className={`ml-2 transition p-2 w-12 h-12 flex justify-center items-center rounded-md bg-black text-white ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-800'

                  }`}
                onClick={handleLastPage}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
