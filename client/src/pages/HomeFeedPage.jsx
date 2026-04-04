import React from 'react';
import FeedList from '../components/feed/FeedList';
import useInfinitePosts from '../hooks/useInfinitePosts';

export default function HomeFeedPage({ posts }) {
  const { visiblePosts, hasMore, loadMore, loadMoreRef } = useInfinitePosts(posts, 4);

  return (
    <section className="space-y-6">
      <div className="glass-card p-6 border border-white/10 bg-[#050505]">
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-2">Home Feed /</p>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white focus:outline-none">
          Discover What Builders Are Sharing
        </h1>
      </div>

      <FeedList posts={visiblePosts} />

      {hasMore && (
        <div className="space-y-2 pt-4">
          <div ref={loadMoreRef} className="h-2 w-full" />
          <button
            onClick={loadMore}
            className="w-full border border-white/20 bg-black px-4 py-4 font-mono text-sm uppercase tracking-widest text-gray-400 transition hover:bg-white/5 hover:text-white hover:border-primary"
          >
            Load more posts
          </button>
        </div>
      )}
    </section>
  );
}
