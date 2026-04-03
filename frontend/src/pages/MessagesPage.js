import React, { useEffect, useMemo, useState } from 'react';
import { chatAPI, usersAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function MessagesPage() {
  const { token, user: authUser } = useAuth();
  const [me, setMe] = useState(authUser || null);
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [conversationId, setConversationId] = useState('');
  const [activePeer, setActivePeer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const canSend = useMemo(() => Boolean(conversationId && text.trim()), [conversationId, text]);

  const loadMessages = async (activeConversationId) => {
    if (!activeConversationId) return;
    try {
      const res = await chatAPI.getMessages(activeConversationId);
      setMessages(res.data.messages || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load messages');
    }
  };

  const loadConversations = async () => {
    try {
      const res = await chatAPI.getMyConversations();
      setConversations(res.data.conversations || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load conversations');
    }
  };

  useEffect(() => {
    if (!token) return;

    const bootstrap = async () => {
      try {
        if (!authUser?.id) {
          const profile = await usersAPI.getProfile();
          setMe(profile.data);
        }
        await loadConversations();
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to load user data');
      }
    };

    bootstrap();
  }, [token, authUser?.id]);

  useEffect(() => {
    if (!conversationId) return undefined;

    loadMessages(conversationId);
    const interval = setInterval(() => {
      loadMessages(conversationId);
    }, 2000);

    return () => clearInterval(interval);
  }, [conversationId]);

  const handleSearchUsers = async () => {
    setError('');
    setInfo('');

    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await usersAPI.searchUsers(search.trim());
      setSearchResults(res.data.users || []);
    } catch (err) {
      setError(err.response?.data?.error || 'User search failed');
    }
  };

  const handleStartChat = async (recipient) => {
    setError('');
    setInfo('');

    try {
      const res = await chatAPI.createOrGetConversation({ recipientId: recipient._id });
      const conv = res.data.conversation;

      setConversationId(conv._id);
      setActivePeer(recipient);
      setInfo('Chat room ready. You can start sending messages.');

      await loadMessages(conv._id);
      await loadConversations();
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to create or join chat');
    }
  };

  const openConversation = async (conversation) => {
    const meId = me?._id || me?.id || authUser?.id;
    const peer = (conversation.participants || []).find((p) => p._id !== meId);
    setActivePeer(peer || null);
    setConversationId(conversation._id);
    await loadMessages(conversation._id);
  };

  const handleSend = async () => {
    if (!canSend) return;

    try {
      await chatAPI.sendMessage(conversationId, { content: text.trim() });
      setText('');
      await loadMessages(conversationId);
      await loadConversations();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message');
    }
  };

  if (!token) {
    return (
      <section className="soft-card p-4">
        <p className="text-sm text-rose-500">Please login to use chat.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="soft-card p-4">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Messages</p>
        <h1 className="mt-1 text-xl font-semibold">Direct Chat</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="soft-card space-y-3 p-4">
          <div className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or username"
              className="w-full rounded-xl border-slate-300 bg-white text-sm dark:border-slate-700 dark:bg-slate-900"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearchUsers();
                }
              }}
            />
            <button
              onClick={handleSearchUsers}
              className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
            >
              Find
            </button>
          </div>

          <div className="space-y-2">
            {searchResults.map((u) => (
              <button
                key={u._id}
                onClick={() => handleStartChat(u)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <div>
                  <p className="text-sm font-semibold">{u.firstName} {u.lastName}</p>
                  <p className="text-xs text-slate-500">@{u.username}</p>
                </div>
                <span className="text-xs text-blue-500">Chat</span>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Conversations</p>
            <div className="space-y-2">
              {conversations.map((conv) => {
                const meId = me?._id || me?.id || authUser?.id;
                const peer = (conv.participants || []).find((p) => p._id !== meId);
                if (!peer) return null;
                return (
                  <button
                    key={conv._id}
                    onClick={() => openConversation(conv)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <p className="text-sm font-semibold">{peer.firstName} {peer.lastName}</p>
                    <p className="line-clamp-1 text-xs text-slate-500">{conv.lastMessagePreview || 'No messages yet'}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="soft-card space-y-4 p-4">
          <div className="border-b border-slate-200 pb-3 dark:border-slate-700">
            <p className="text-sm font-semibold">
              {activePeer ? `Chat with ${activePeer.firstName} ${activePeer.lastName}` : 'Select a user to start chatting'}
            </p>
            {activePeer && <p className="text-xs text-slate-500">@{activePeer.username}</p>}
          </div>

          {error && <p className="text-sm text-rose-500">{error}</p>}
          {info && <p className="text-sm text-emerald-500">{info}</p>}

          <div className="max-h-96 space-y-3 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
            {messages.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No messages yet.</p>
            ) : (
              messages.map((message) => {
                const meId = me?._id || me?.id || authUser?.id;
                const mine = message.sender?._id === meId || message.sender === meId;
                return (
                  <div key={message._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={[
                        'max-w-[80%] rounded-2xl px-3 py-2 text-sm',
                        mine
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200',
                      ].join(' ')}
                    >
                      <p>{message.content}</p>
                      <span className="mt-1 block text-[10px] opacity-70">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message"
              className="w-full rounded-xl border-slate-300 bg-white text-sm dark:border-slate-700 dark:bg-slate-900"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              disabled={!canSend}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
