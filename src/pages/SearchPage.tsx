import { LocateFixed, Search } from 'lucide-react';
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
  const navigate = useNavigate()


  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/post/getsearchresult`, {
        params: { search, city: selectedCity },
      });
      setInfo(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`post/getuser?search=${search}`);
      setUsers(res.data?.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await api.get(`/post/getcitylist`);
      setCityList(res.data.value || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  let debounceTimeout;

  useEffect(() => {
    setLoading(true)
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

  return (
    <>
      <HeaderStatic />
      <div className=" mt-8 md:mt-0 max-w-4xl mx-auto p-4 ">
        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="p-1 bg-gray-100 rounded-lg flex items-center gap-1">
            <LocateFixed className="text-sky-600" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-32 p-2 bg-inherit dark:text-white text-sm focus:outline-none"
            >
              <option value="">Select City</option>
              {cityList.map((item) => (
                <option key={item._id} value={item.city}>
                  {item.city}
                </option>
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
            {loading && (
              <div className="h-6 w-6 absolute right-3 top-3 rounded-full border-4 dark:border-white border-black border-t-transparent animate-spin"></div>
            )}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-start gap-4 bg-gray-100 p-2 rounded-md">
          <button
            onClick={() => setIsPostView(true)}
            className={`px-4 py-2 text-sm font-medium ${isPostView ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
              } rounded-md shadow`}
          >
            Post
          </button>
          <button
            onClick={() => setIsPostView(false)}
            className={`px-4 py-2 text-sm font-medium ${!isPostView ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
              } rounded-md shadow`}
          >
            User
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-black dark:border-white border-t-transparent"></div>
        ) : isPostView ? (
          info.length ? (
            <div className="columns-2 sm:columns-3 gap-4">
              <SearchPost info={info} />
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
                {/* Profile Picture */}
                < div className="w-16 h-16" >
                  <img
                    src={user.profilePicture}
                    alt={`Load..`}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                {/* User Details */}
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
          </div >

        ) : (
          <div className="text-center text-gray-500">No users found.</div>
        )
        }
      </div >
    </>
  );
}
