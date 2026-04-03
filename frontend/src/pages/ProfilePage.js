import React from 'react';

export default function ProfilePage({ currentUser, posts }) {
  return (
    <section className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="h-44 w-full md:h-52">
          <img src={currentUser.coverPhoto} alt="Cover" className="h-full w-full object-cover" />
        </div>

        <div className="px-4 pb-5">
          <div className="-mt-12 flex flex-wrap items-end gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-24 w-24 rounded-2xl border-4 border-white object-cover dark:border-slate-900"
            />
            <div className="pb-2">
              <h1 className="text-xl font-semibold">{currentUser.name}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">@{currentUser.username}</p>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm text-slate-700 dark:text-slate-300">{currentUser.bio}</p>
        </div>
      </div>

      <div className="soft-card p-4">
        <h2 className="text-base font-semibold">Posts</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {posts.map((post) => (
          <div key={post.id} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
            <img src={post.imageUrl} alt={post.caption} className="h-44 w-full object-cover md:h-56" />
          </div>
        ))}
      </div>
    </section>
  );
}
