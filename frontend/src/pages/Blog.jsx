import React from 'react';

export default function Blog() {
  return (
    <div className="min-h-screen py-12 bg-neutral-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
        <h1 className="text-2xl font-semibold mb-4" style={{ color: '#DC143C' }}>Blog</h1>

        <article>
          <h2 className="text-xl font-bold mb-2">The Future of Home Buying</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">HomeQuest aims to simplify discovery and make the home-buying process more transparent.</p>

          <h3 className="font-semibold">Why HomeQuest</h3>
          <ul className="list-disc ml-5 mb-4 text-sm text-gray-700 dark:text-gray-300">
            <li>Curated property data</li>
            <li>Fast search and filters</li>
            <li>Safe contact with agents</li>
          </ul>

          <p className="text-sm text-gray-700 dark:text-gray-300">More articles coming soon. Stay tuned.</p>
        </article>
      </div>
    </div>
  );
}
