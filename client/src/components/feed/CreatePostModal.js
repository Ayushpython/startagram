import React, { useEffect, useMemo, useState } from 'react';

export default function CreatePostModal({ isOpen, onClose, onCreatePost }) {
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setCaption('');
      setImageUrl('');
    }
  }, [isOpen]);

  const isDisabled = useMemo(() => !caption.trim(), [caption]);

  if (!isOpen) {
    return null;
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isDisabled) return;

    onCreatePost({
      caption: caption.trim(),
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create Post</h2>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            placeholder="Share what you are building..."
            className="w-full rounded-xl border-slate-300 bg-slate-50 text-sm dark:border-slate-700 dark:bg-slate-950"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Upload image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm" />
          </div>

          {imageUrl && (
            <img src={imageUrl} alt="Preview" className="h-48 w-full rounded-xl object-cover" />
          )}

          <button
            type="submit"
            disabled={isDisabled}
            className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Publish Post
          </button>
        </form>
      </div>
    </div>
  );
}
