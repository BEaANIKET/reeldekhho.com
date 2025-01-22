export interface Reel {
  id: number;
  username: string;
  avatar: string;
  video: string;
  caption: string;
  likes: number;
  comments: number;
  music: string;
  isFollowing: boolean;
}


import r1 from '/assets/r1.mp4';
import r2 from '/assets/r2.mp4';
import r3 from '/assets/r3.mp4';
import r4 from '/assets/r4.mp4';
import r5 from '/assets/r5.mp4';
import r6 from '/assets/r6.mp4';
import r7 from '/assets/r7.mp4';
import r8 from '/assets/r8.mp4';


const reels: Reel[] = [
  {
    id: 0,
    username: "user_0",
    avatar: "https://images.unsplash.com/photo-1500000000000?w=150&h=150&fit=crop",
    video: r1,
    caption: "Amazing reel! 🎥 #reels #trending 0",
    likes: 8472,
    comments: 234,
    music: "Popular Song 0",
    isFollowing: true,
  },
  {
    id: 1,
    username: "user_1",
    avatar: "https://images.unsplash.com/photo-1500000000001?w=150&h=150&fit=crop",
    video: r2,
    caption: "Amazing reel! 🎥 #reels #trending 1",
    likes: 5923,
    comments: 410,
    music: "Popular Song 1",
    isFollowing: false,
  },
  {
    id: 2,
    username: "user_2",
    avatar: "https://images.unsplash.com/photo-1500000000002?w=150&h=150&fit=crop",
    video: r3,
    caption: "Amazing reel! 🎥 #reels #trending 2",
    likes: 1234,
    comments: 50,
    music: "Popular Song 2",
    isFollowing: true,
  },
  {
    id: 3,
    username: "user_3",
    avatar: "https://images.unsplash.com/photo-1500000000003?w=150&h=150&fit=crop",
    video: r4,
    caption: "Amazing reel! 🎥 #reels #trending 3",
    likes: 9801,
    comments: 345,
    music: "Popular Song 3",
    isFollowing: false,
  },
  {
    id: 4,
    username: "user_4",
    avatar: "https://images.unsplash.com/photo-1500000000004?w=150&h=150&fit=crop",
    video: r5,
    caption: "Amazing reel! 🎥 #reels #trending 4",
    likes: 1120,
    comments: 78,
    music: "Popular Song 4",
    isFollowing: true,
  },
  {
    id: 5,
    username: "user_5",
    avatar: "https://images.unsplash.com/photo-1500000000005?w=150&h=150&fit=crop",
    video: r6,
    caption: "Amazing reel! 🎥 #reels #trending 5",
    likes: 6543,
    comments: 200,
    music: "Popular Song 5",
    isFollowing: false,
  },
  {
    id: 6,
    username: "user_6",
    avatar: "https://images.unsplash.com/photo-1500000000006?w=150&h=150&fit=crop",
    video: r7,
    caption: "Amazing reel! 🎥 #reels #trending 6",
    likes: 7789,
    comments: 100,
    music: "Popular Song 6",
    isFollowing: true,
  },
  {
    id: 7,
    username: "user_7",
    avatar: "https://images.unsplash.com/photo-1500000000007?w=150&h=150&fit=crop",
    video: r8,
    caption: "Amazing reel! 🎥 #reels #trending 7",
    likes: 3490,
    comments: 56,
    music: "Popular Song 7",
    isFollowing: true,
  },
];

export const generateReels = (startIndex: number, count: number): Reel[] => {
  return reels.slice(startIndex, startIndex + count)
};
