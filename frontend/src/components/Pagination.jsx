import React from 'react';

const Pagination = ({ page, setPage, total, pageSize }) => {
  const totalPages = Math.ceil((total || 0) / (pageSize || 12));
  if (totalPages <= 1) return null;

  const prev = () => setPage(Math.max(1, page - 1));
  const next = () => setPage(Math.min(totalPages, page + 1));

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <button 
        onClick={prev} 
        disabled={page === 1} 
        className={`px-4 py-2 border rounded-md font-medium transition-all duration-200 ${
          page === 1 
            ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400' 
            : 'hover:bg-hm-red hover:text-white hover:border-hm-red dark:border-gray-600 dark:text-gray-300'
        }`}
      >
        Prev
      </button>
      {pages.map(p => (
        <button 
          key={p} 
          onClick={() => setPage(p)} 
          className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
            p === page 
              ? 'bg-hm-red text-white shadow-md' 
              : 'border hover:bg-hm-red/10 hover:border-hm-red dark:border-gray-600 dark:text-gray-300'
          }`}
        >
          {p}
        </button>
      ))}
      <button 
        onClick={next} 
        disabled={page === totalPages} 
        className={`px-4 py-2 border rounded-md font-medium transition-all duration-200 ${
          page === totalPages 
            ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400' 
            : 'hover:bg-hm-red hover:text-white hover:border-hm-red dark:border-gray-600 dark:text-gray-300'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
