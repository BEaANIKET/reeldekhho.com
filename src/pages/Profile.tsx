import ProfileHeader from '../components/profile/ProfileHeader';
import PostGrid from '../components/profile/ProfileGrid';
import useAuth from '../hooks/useAuth';
import useGetPost from '../hooks/profile/useGetPost';
import { useSelector } from 'react-redux';
import { ProfilePostSkeloton } from '../components/profile/ProfilePostSkeloton';
import useFollow from '../hooks/useFollow';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Profile() {
  const user = useSelector((state) => state?.auth?.user)
  console.log(user);

  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [])



  const { followError, followLoading, following, followers } = useFollow()
  const { loading, error } = useGetPost();
  const posts = useSelector((state: any) => state.auth.posts || []);


  if (loading || followLoading) {
    return <ProfilePostSkeloton />;
  }


  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ProfileHeader value={posts.length || 0} following={following.length} followers={followers.length} /> {/* Handle undefined posts */}
      <PostGrid posts={posts} />
    </div>
  );
}
