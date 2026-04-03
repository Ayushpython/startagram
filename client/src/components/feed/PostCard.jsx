import React, { useState } from 'react';

function ActionButton({ label, value, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
        active
          ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300'
          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
      ].join(' ')}
    >
      <span>{label}</span>
      <span className="text-xs">{value}</span>
    </button>
  );
}

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(post.likedByMe);
  const [likes, setLikes] = useState(post.likes);
  const [shareCount, setShareCount] = useState(post.shares);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentsList, setCommentsList] = useState([
    `${post.user.username}: Great progress on this.`,
    'community_member: Interested in this build. Keep updates coming!',
  ]);

  const onToggleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const onToggleComments = () => {
    setIsCommentsOpen((prev) => !prev);
  };

  const onShare = () => {
    setShareCount((prev) => prev + 1);
  };

  const onAddComment = (event) => {
    event.preventDefault();
    if (!newComment.trim()) return;
    setCommentsList((prev) => [...prev, `you: ${newComment.trim()}`]);
    setCommentCount((prev) => prev + 1);
    setNewComment('');
  };

  return (
    <article className="soft-card overflow-hidden">
      <header className="flex items-center gap-3 px-4 py-3">
        <img src={post.user.avatar} alt={post.user.name} className="h-10 w-10 rounded-full object-cover" />
        <div>
          <p className="text-sm font-semibold">{post.user.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">@{post.user.username} • {post.createdAt}</p>
        </div>
      </header>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post media"
          className="max-h-[480px] w-full object-cover transition duration-300 hover:scale-[1.01]"
        />
      )}

      <div className="space-y-3 p-4">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{post.caption}</p>

        <div className="flex gap-2 border-t border-slate-200 pt-2 dark:border-slate-800">
          <ActionButton label="Like" value={likes} active={liked} onClick={onToggleLike} />
          <ActionButton label="Comment" value={commentCount} onClick={onToggleComments} />
          <ActionButton label="Share" value={shareCount} onClick={onShare} />
        </div>

        {isCommentsOpen && (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/40">
            <form onSubmit={onAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
                placeholder="Write a comment"
                className="w-full rounded-lg border-slate-300 bg-white text-sm dark:border-slate-700 dark:bg-slate-900"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
              >
                Post
              </button>
            </form>

            <div className="max-h-36 space-y-2 overflow-auto pr-1">
              {commentsList.map((comment, index) => (
                <p key={`${post.id}-comment-${index}`} className="text-xs text-slate-600 dark:text-slate-300">
                  {comment}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
