import React from 'react';
import { exploreTopics } from '../data/mockData';

export default function ExplorePage({ posts }) {
  return (
    <section className="space-y-5">
      <div className="soft-card p-4">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Explore</p>
        <h1 className="mt-1 text-xl font-semibold">Trending Posts and Topics</h1>
      </div>

      <div className="soft-card p-4">
        <p className="mb-3 text-sm font-semibold">Hot Topics</p>
        <div className="flex flex-wrap gap-2">
          {exploreTopics.map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              #{topic}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {posts.map((post) => (
          <div key={post.id} className="group relative overflow-hidden rounded-2xl">
            <img
              src={post.imageUrl}
              alt={post.caption}
              className="h-44 w-full object-cover transition duration-300 group-hover:scale-105 md:h-52"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-xs text-white">
              <p className="line-clamp-1">{post.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
