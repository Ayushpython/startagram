import React, { useState } from 'react';

function ActionButton({ label, value, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex flex-1 items-center justify-center gap-2 px-3 py-3 text-xs font-mono uppercase tracking-widest transition-all duration-300 border',
        active
          ? 'bg-primary/10 border-primary text-primary'
          : 'border-transparent text-gray-500 hover:border-white/20 hover:text-white',
      ].join(' ')}
    >
      <span>{label}</span>
      <span>{value}</span>
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
    <article className="glass-card bg-[#050505] border border-white/10 flex flex-col">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-white/10">
        <img src={post.user.avatar} alt={post.user.name} className="h-10 w-10 border border-white/20 object-cover" />
        <div>
          <p className="text-sm font-bold uppercase text-white tracking-widest">{post.user.name}</p>
          <p className="font-mono text-xs text-gray-500">@{post.user.username} • {post.createdAt}</p>
        </div>
      </header>

      {post.imageUrl && (
        <div className="border-b border-white/10">
          <img
            src={post.imageUrl}
            alt="Post media"
            className="max-h-[480px] w-full object-cover transition duration-300 hover:opacity-90"
          />
        </div>
      )}

      <div className="space-y-4 p-6">
        <p className="text-base leading-relaxed text-gray-300">{post.caption}</p>

        <div className="flex gap-2 border-t border-white/10 pt-4">
          <ActionButton label="Like" value={likes} active={liked} onClick={onToggleLike} />
          <ActionButton label="Comment" value={commentCount} onClick={onToggleComments} />
          <ActionButton label="Share" value={shareCount} onClick={onShare} />
        </div>

        {isCommentsOpen && (
          <div className="space-y-4 pt-4 border-t border-white/10 mt-4">
            <form onSubmit={onAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
                placeholder="Write a comment..."
                className="w-full border border-white/20 bg-black px-4 py-3 text-sm text-white focus:border-primary focus:outline-none font-mono placeholder-gray-600"
              />
              <button
                type="submit"
                className="bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-gray-300"
              >
                Post
              </button>
            </form>

            <div className="max-h-36 space-y-3 overflow-auto pr-2">
              {commentsList.map((comment, index) => {
                const [user, text] = comment.split(': ');
                return (
                  <p key={`${post.id}-comment-${index}`} className="text-sm">
                    <strong className="font-mono text-primary text-xs uppercase tracking-widest mr-2">{user}</strong>
                    <span className="text-gray-400">{text}</span>
                  </p>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
