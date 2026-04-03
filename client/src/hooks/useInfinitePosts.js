import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

export default function useInfinitePosts(allPosts, pageSize = 4) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const visiblePosts = useMemo(() => {
    return allPosts.slice(0, visibleCount);
  }, [allPosts, visibleCount]);

  const hasMore = visibleCount < allPosts.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + pageSize, allPosts.length));
  }, [allPosts.length, pageSize]);

  useEffect(() => {
    if (!hasMore || !loadMoreRef.current) return undefined;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: '100px',
      }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadMore]);

  return {
    visiblePosts,
    hasMore,
    loadMore,
    loadMoreRef,
  };
}
