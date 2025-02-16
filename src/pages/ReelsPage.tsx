import { useNavigate } from 'react-router-dom';
import ReelsContainer from '../components/reels/ReelsContainer';
import { ArrowLeft } from 'lucide-react';
export default function ReelsPage() {
  const navigate = useNavigate()
  return (
    <div className="h-[100dvh] w-full relative m-auto ">
      <header className="sm:flex hidden absolute left-2 text-black top-3 items-center gap-4 mb-6">
        <ArrowLeft
          className="w-6 h-6 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-2xl font-bold">Posts</h1>
      </header>
      <ReelsContainer />
    </div>
  );
}