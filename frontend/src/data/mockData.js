export const currentUser = {
  id: 'u0',
  username: 'ayushbuilds',
  name: 'Ayush Sharma',
  avatar:
    'https://images.unsplash.com/photo-1546456073-92b9f0a8d4b8?auto=format&fit=crop&w=120&q=80',
  bio: 'Building startup products at the intersection of social + AI. Open to collabs.',
  coverPhoto:
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
};

const users = [
  currentUser,
  {
    id: 'u1',
    username: 'ninafounder',
    name: 'Nina Roy',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'u2',
    username: 'devrahul',
    name: 'Rahul Verma',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'u3',
    username: 'meerapm',
    name: 'Meera Jain',
    avatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=120&q=80',
  },
];

export const initialPosts = [
  {
    id: 'p1',
    user: users[1],
    createdAt: '2h',
    caption:
      'Launching a micro-SaaS for indie recruiters. Looking for a frontend partner with React + animations experience.',
    imageUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    likes: 120,
    comments: 23,
    shares: 8,
    likedByMe: false,
  },
  {
    id: 'p2',
    user: users[2],
    createdAt: '4h',
    caption:
      'Built a waitlist funnel in one weekend. Conversion jumped 32% with social proof blocks + focused headline.',
    imageUrl:
      'https://images.unsplash.com/photo-1551281044-8b5bd3a9f20d?auto=format&fit=crop&w=900&q=80',
    likes: 95,
    comments: 16,
    shares: 12,
    likedByMe: true,
  },
  {
    id: 'p3',
    user: users[3],
    createdAt: '8h',
    caption:
      'If you are validating an idea, interview pain first and solution second. Feature requests are not demand signals.',
    imageUrl:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
    likes: 180,
    comments: 41,
    shares: 27,
    likedByMe: false,
  },
  {
    id: 'p4',
    user: users[0],
    createdAt: '1d',
    caption:
      'Prototype drop: social feed + startup blueprint layer in one interface. Next step is creator monetization flows.',
    imageUrl:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80',
    likes: 65,
    comments: 9,
    shares: 4,
    likedByMe: false,
  },
  {
    id: 'p5',
    user: users[1],
    createdAt: '2d',
    caption: 'Design sprint snapshots from today. Iterating on onboarding and creator profiles.',
    imageUrl:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80',
    likes: 142,
    comments: 28,
    shares: 17,
    likedByMe: true,
  },
  {
    id: 'p6',
    user: users[2],
    createdAt: '3d',
    caption: 'Who is up for a builders circle this Friday? Growth, product, and monetization teardown session.',
    imageUrl:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
    likes: 78,
    comments: 13,
    shares: 5,
    likedByMe: false,
  },
];

export const exploreTopics = [
  'SaaS',
  'AI tools',
  'Product design',
  'Growth',
  'Fundraising',
  'No-code',
];

export const messages = [
  { id: 'm1', name: 'Nina Roy', snippet: 'Let us collab on the creator onboarding flow?', time: '10m' },
  { id: 'm2', name: 'Rahul Verma', snippet: 'I pushed the feed performance update.', time: '2h' },
  { id: 'm3', name: 'Meera Jain', snippet: 'Can we review the profile redesign today?', time: '5h' },
];
