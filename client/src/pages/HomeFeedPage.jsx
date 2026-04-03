import React from 'react';
import FeedList from '../components/feed/FeedList';
import useInfinitePosts from '../hooks/useInfinitePosts';

export default function HomeFeedPage({ posts }) {
  const { visiblePosts, hasMore, loadMore, loadMoreRef } = useInfinitePosts(posts, 4);

  return (
    <section className="space-y-4">
      <div className="soft-card p-4">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Home Feed</p>
        <h1 className="mt-1 text-xl font-semibold">Discover What Builders Are Sharing</h1>
      </div>

      <FeedList posts={visiblePosts} />

      {hasMore && (
        <div className="space-y-2">
          <div ref={loadMoreRef} className="h-2 w-full" />
          <button
            onClick={loadMore}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            Load more posts
          </button>
        </div>
      )}
    </section>
  );
}
