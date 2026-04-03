import React, { useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import CreatePostModal from './components/feed/CreatePostModal';
import HomeFeedPage from './pages/HomeFeedPage';
import ExplorePage from './pages/ExplorePage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { initialPosts } from './data/mockData';
import useDarkMode from './hooks/useDarkMode';

function App() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent
          setIsCreateOpen={setIsCreateOpen}
          isCreateOpen={isCreateOpen}
          isDark={isDark}
          toggleDarkMode={toggleDarkMode}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppContent({
  setIsCreateOpen,
  isCreateOpen,
  isDark,
  toggleDarkMode,
}) {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState(initialPosts);
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  const currentUser = useMemo(() => {
    if (!user) {
      return {
        id: 'guest',
        username: 'builder',
        name: 'Builder',
        avatar: 'https://i.pravatar.cc/120?img=12',
        bio: 'Welcome to Idea Marketplace.',
        coverPhoto:
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
      };
    }

    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    return {
      id: user._id || user.id,
      username: user.username,
      name: fullName || user.username,
      avatar: user.avatar || 'https://i.pravatar.cc/120?img=12',
      bio: user.bio || 'Tell builders what you are building.',
      coverPhoto:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
    };
  }, [user]);

  const profilePosts = useMemo(() => {
    return posts.filter((post) => post.user.username === currentUser.username);
  }, [posts, currentUser.username]);

  const handleCreatePost = ({ caption, imageUrl }) => {
    const newPost = {
      id: `p-${Date.now()}`,
      user: currentUser,
      caption,
      imageUrl,
      createdAt: 'Just now',
      likes: 0,
      comments: 0,
      shares: 0,
      likedByMe: false,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <Navbar
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
        onOpenCreatePost={() => setIsCreateOpen(true)}
        currentUser={currentUser}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-24 pt-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:pb-8">
        <Sidebar />

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<HomeFeedPage posts={posts} />} />
          <Route path="/explore" element={<ExplorePage posts={posts} />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/profile" element={<ProfilePage currentUser={currentUser} posts={profilePosts} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>

      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreatePost={handleCreatePost}
      />

      <MobileNav />
    </div>
  );
}

export default App;
