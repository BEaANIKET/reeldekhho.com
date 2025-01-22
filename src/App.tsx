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
  useEffect(() => {
    const getUser = async () => {
      setLoading(true)
      try {
        const response = await api.get('/auth/profile')
        dispatch(setUserProfile(response.data.user))
      } catch (error) {
        // console.log(error);
      } finally {
        setLoading(false)
      }
    }

    getUser();
  }, [])

  if (loading) {
    return <LoadComponents />
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Socketwindow />
      <Router>
        <Suspense fallback={<LoadComponents />}>
          <Routes>
            <Route path='/verify/:token' element={<Verify />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/stories/:username" element={<StoryViewer />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Feed />} />
              <Route path="/reels" element={<ReelsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/editProfile" element={<Editprofile />} />
              <Route path="/seller/:id" element={<SellerProfile />} />
              <Route path="/messages/:id" element={<MessagesPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/page/:id" element={<Page />} />
              <Route path='/reels/:id' element={<SearchReels />} />
              <Route path='/saved' element={<SavedPage />} />
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
