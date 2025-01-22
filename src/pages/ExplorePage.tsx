import SearchPost from '../components/SearchPost';
import { useEffect, useState } from 'react';
import HeaderStatic from '../components/HeaderStatic'
import api from '../services/api/axiosConfig';
export default function ExplorePage() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [info, setInfo] = useState (false)
  const fetchposts = async() =>{
    const res = await axios.get(`${backendUrl}/post/getsearchresult`)

    setInfo(res.data)
  }
  useEffect(() => {
    fetchposts()
  }, [])
  return (
    <>
      <HeaderStatic />
      <div className="mt-12 md:mt-0 max-w-6xl mx-auto p-4">
        <div className="columns-2 sm:columns-3 md:gap-2 gap-[8px]">
          {info ? <SearchPost info={info} /> : null}
        </div>
      </div>
    </>
  );
}
