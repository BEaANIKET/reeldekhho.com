import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import Layout from './components/layout/Layout';
import { Suspense, lazy, useEffect, useState } from 'react';
import MessagesPage from './pages/MessagePage';
import AddProduct from './pages/AddProduct';
import Faq from './components/Faq/Faq';
import Saved from './components/Faq/Saved';
import Page from './components/Faq/Page';
import SearchReels from './components/SearchReels';
import Socketwindow from './components/socket';
import api from './services/api/axiosConfig';
import { setUserProfile } from './store/slices/authSlice';
import applogo from '/assets/applogo.png'
import Verify from './pages/verify';
import useChat from './hooks/useChat';
import { Toaster } from 'react-hot-toast';

import Followers from './components/Follow/Followers';
import Following from './components/Follow/Followings';
import { setReviews } from './store/slices/reviewSlice';
import ChangePassword from './pages/Changepassword';
import SellerPost from './components/profile/SellerPost';
import PasswordReset from './pages/resetPassword';

const Feed = lazy(() => import('./components/Feed'));
const ReelsPage = lazy(() => import('./pages/ReelsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const Profile = lazy(() => import('./pages/Profile'));
const SellerProfile = lazy(() => import('./components/profile/SellerProfile'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const StoryViewer = lazy(() => import('./components/story/StoryViewer'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const Editprofile = lazy(() => import('./pages/Editprofile'));
const SavedPage = lazy(() => import('./pages/SavedPage'));
const UserPosts = lazy(() => import('./pages/UsersPosts'));

const LoadComponents = () => {
  return (
    <div className=' w-full h-screen dark:bg-gray-900 bg-white flex justify-center items-center ' >
      <img className=' h-12  w-22' src={applogo} alt="" />
    </div >
  )
}

function AppContent() {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  const [homeClick, setHomeClick] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      setLoading(true)
      try {
        const response = await api.get('/auth/profile')
        dispatch(setUserProfile(response.data.user))

        localStorage.removeItem('city');
        //(response.data.user);
      } catch (error) {
        localStorage.removeItem('city');
        // //(error);
      } finally {
        setLoading(false)
      }
    }

    getUser();
  }, [])

  useEffect(() => {
    const getReviewedId = async () => {
      try {
        const resposne = await api.get('/user/userReview');
        const reviewArray = (resposne.data.reviewedId);
        dispatch(setReviews(reviewArray));
      } catch (error) {
        //(error);
      }
    }

    getReviewedId();
  }, []);

  useChat();

  useEffect(() => {
    function pauseVideosOnTabChange() {
      if (document.hidden) {
        document.querySelectorAll("video").forEach((video) => {
          if (!video.paused) {
            video.pause();
          }
        });
      }
    }

    document.addEventListener("visibilitychange", pauseVideosOnTabChange);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === "VIDEO") {
            node.addEventListener("play", () => {
              document.querySelectorAll("video").forEach((vid) => {
                if (vid !== node) vid.pause();
              });
            });
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.querySelectorAll("video").forEach((video) => {
      video.addEventListener("play", () => {
        document.querySelectorAll("video").forEach((vid) => {
          if (vid !== video) vid.pause();
        });
      });
    });

    return () => {
      document.removeEventListener("visibilitychange", pauseVideosOnTabChange);
      observer.disconnect();
    };
  }, []);


  if (loading) {
    return <LoadComponents />
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Socketwindow />
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Suspense fallback={<LoadComponents />}>
          <Routes>
            <Route path='/verify/:token' element={<Verify />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/stories/:username" element={<StoryViewer />} />
            <Route path='/forget' element={<PasswordReset />} />
            <Route path="/" element={<Layout setHomeClick={setHomeClick} />}>
              <Route index element={<Feed homeClick={homeClick} />} />
              <Route path="/reels" element={<ReelsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/profile" element={<Profile />} />
              {/* <Route path="/followers/:id" element={<Followers />} />
              <Route path="/following/:id" element={<Following />} /> */}
              <Route path="/editProfile" element={<Editprofile />} />
              <Route path="/seller/:id" element={<SellerProfile />} />
              <Route path='/sellerPost' element={<SellerPost />} />
              <Route path="/messages/:id" element={<MessagesPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/page/:id" element={<Page />} />
              <Route path='/reels/:id' element={<SearchReels />} />
              <Route path='/saved' element={<SavedPage />} />
              <Route path='/posts' element={<UserPosts />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </div >
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
