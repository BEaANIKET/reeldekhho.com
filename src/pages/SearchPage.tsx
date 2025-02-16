import { Loader, LocateFixed, Search } from 'lucide-react';
import SearchPost from '../components/SearchPost';
import { useEffect, useState } from 'react';
import HeaderStatic from '../components/HeaderStatic';
import api from '../services/api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function SearchPage() {
  const [info, setInfo] = useState([]);
  const [users, setUsers] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [isPostView, setIsPostView] = useState(true);
  const navigate = useNavigate();
  const [exclude, setExclude] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const city = (localStorage.getItem('city') || "").trim();
      const res = await api.get(`/post/getsearchresult`, {
        params: { search, city: selectedCity, limit: 50 },
      });
      const serchedPost = res.data?.map(post => post._id).join(',');
      setExclude(serchedPost);
      setInfo(res.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadmore = async () => {
    try {
      setSearchLoading(true);
      const res = await api.get(`/post/getsearchresult`, {
        params: { search, city: selectedCity, excludeIds: exclude, limit: 12 },
      });

      if (!res.data || !Array.isArray(res.data)) {
        throw new Error("Invalid response data");
      }

      const newPostIds = res.data.map(post => post._id);
      setExclude(prevExclude => [...prevExclude, ...newPostIds]); // Append new post IDs to exclude

      setInfo(prevInfo => [...prevInfo, ...res.data]); // Append new posts to the list

    } catch (error) {
      console.error("Error fetching more posts:", error);
    } finally {
      setSearchLoading(false);
    }
  };



  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`post/getuser?search=${search}`);
      setUsers(res.data?.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await api.get(`/post/getcitylist`);
      res.data.value.sort((a, b) => a.city.localeCompare(b.city));
      setCityList(res.data.value || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  let debounceTimeout;

  useEffect(() => {
    setLoading(true);
    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(() => {
      if (isPostView) {
        fetchPosts();
      } else {
        fetchUsers();
      }
    }, 1000);

    return () => clearTimeout(debounceTimeout);
  }, [search, selectedCity, isPostView]);

  const handleChageCity = async (e) => {
    setSelectedCity(e?.target?.value)
    //(e?.target?.value);

    if (e?.target?.value === 'All State') {
      localStorage.removeItem('city')
      setSelectedCity('')
      return
    }
    localStorage.setItem('city', e?.target?.value)
  }

  const SkeletonPostGrid = () => (
    <div className="columns-2 sm:columns-3 gap-4">
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4"
          ></div>
        ))}
    </div>
  );

  const SkeletonUserList = () => (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="space-y-2 w-full">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <>
      <HeaderStatic />
      <div className="mt-8 md:mt-0 bg-gray-100 max-w-4xl mx-auto p-4">
        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="p-1 bg-gray-100 rounded-lg flex items-center gap-1">
            <LocateFixed className="text-sky-600" />
            <select
              value={selectedCity}
              onChange={handleChageCity}
              className="w-32 p-2 bg-inherit dark:text-white text-sm focus:outline-none"
            >
              <option value="">Select City</option>
              <option value={'All State'} >
                All State
              </option>
              {cityList.map((item) => (
                <>
                  <option key={item._id} value={item.city}>
                    {item.city}
                  </option>
                </>
              ))}
            </select>
          </div>

          <div className="relative w-full">
            <Search className="absolute text-xs dark:text-white left-3 top-3" />
            <input
              type="text"
              placeholder="Search posts or users"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg pl-10 focus:outline-none dark:text-white"
            />
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-start gap-4 bg-gray-100 p-2 rounded-md">
          <button
            onClick={() => setIsPostView(true)}
            className={`px-4 py-2 font-semibold text-sm  ${isPostView ? 'bg-[#004969] text-white' : 'bg-white text-gray-700'
              } rounded-md shadow`}
          >
            Post
          </button>
          <button
            onClick={() => setIsPostView(false)}
            className={`px-4 py-2 text-sm font-medium ${!isPostView ? 'bg-[#004969] text-white' : 'bg-white text-gray-700'
              } rounded-md shadow`}
          >
            User
          </button>
        </div>

        {/* Results */}
        {loading ? (
          isPostView ? (
            <SkeletonPostGrid />
          ) : (
            <SkeletonUserList />
          )
        ) : isPostView ? (
          info.length ? (
            < div className=' flex flex-col w-full '>
              <div className="columns-2 sm:columns-3 gap-1">
                <SearchPost info={info} />
              </div>
              {
                searchLoading && (
                  <div className=' flex mt-8 justify-center items-center w-full '>
                    <Loader className=' animate-spin text-2xl text-black' />
                  </div>
                )
              }

              <div onClick={loadmore} className=' mt-3 w-full flex justify-end font-semibold opacity-85 '>  <p className=' cursor-pointer'> Load more ..</p></div>
            </div>

          ) : (
            <div className="text-center text-gray-500">No posts found.</div>
          )
        ) : users.length ? (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                onClick={() => navigate(`/seller/${user._id}`)}
                key={user._id}
                className="p-4 bg-white cursor-pointer dark:bg-gray-800 rounded-lg shadow-md flex items-center gap-4"
              >
                <div className="w-16 h-16">
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                <div>
                  <p className="font-semibold text-lg text-gray-900 dark:text-white">
                    {user.fullName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>

            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No users found.</div>
        )}
      </div>
    </>
  );
}
