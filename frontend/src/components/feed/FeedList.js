import React from 'react';
import PostCard from './PostCard';

export default function FeedList({ posts }) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
