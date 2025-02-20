import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Compass, Film, Heart, PlusSquare, MessageCircle, Menu, User } from 'lucide-react';
import ThemeToggle from './layout/ThemeToggle';
import applogo from '/assets/applogo.png'
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import useGetPosts from '../hooks/post/useGetPost';
// import useGetPosts from '../hooks/post/useGetPost';

export default function Sidebar({ setHomeClick }) {
  const location = useLocation();
  const user = useSelector(state => state.auth?.user);
  const { fetchPosts } = useGetPosts()
  const { pathname = '/' } = useLocation()

  const handleHomeClick = () => {
    if (pathname === '/') {
      //("I am rununto ");
      fetchPosts()
    }
  }
  const navigate = useNavigate();


  return (
    <>
      <div className="fixed bottom-0 z-20 left-0 w-full bg-inherit border-t dark:border-gray-700 md:top-0 md:w-16 lg:w-64 md:h-screen md:border-r ">
        <div className="flex justify-around md:flex-col  h-full md:justify-start md:items-center lg:items-start md:p-4 md:space-y-6">
          <div onClick={() => navigate('/')} className="hidden lg:block p-4">
            <img className=' w-20 scale-110 ' src={applogo} alt="" />
          </div>

          <div className=' w-full' onClick={handleHomeClick}>
            <NavItem to="/" icon={<Home />} label="Home" active={location.pathname === '/'} />
          </div>
          <NavItem to="/search" icon={<Search />} label="Search" />
          {/* <NavItem to="/explore" icon={<Compass />} label="Explore" /> */}
          <NavItem to="/reels" icon={<Film />} label="Reels" active={location.pathname === '/reels'} />
          {/* <NavItem to="/messages" icon={<MessageCircle />} label="Messages" /> */}
          {/* <NavItem to="/notifications" icon={<Heart />} label="Notifications" /> */}

          {user && user?.role === 'seller' ? <NavItem to="/add-product" icon={<PlusSquare />} label="Create" /> : null}
          <NavItem to="/profile" icon={<User />} label="Profile" />

          <div className=' md:w-full w-fit flex lg:flex-row md:flex-col gap-4 justify-between items-center '>
            {/* <div className=' flex items-center justify-center'>
              <NavItem to="/more" icon={<Menu />} label="More" />
            </div> */}

            <div className="hidden md:flex md:items-center h-full  ">
              <ThemeToggle />
            </div>
          </div>

        </div>
      </div>
    </>

  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function NavItem({ to, icon, label, active = false }: NavItemProps) {
  return (
    <Link
      to={to}
      className={`flex items-center w-full justify-center lg:justify-start gap-2 p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ${active ? 'font-bold' : ''
        }`}
    >
      <span className={`text-xl ${active ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
        {icon}
      </span>
      <span className={`hidden lg:block ${active ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
        {label}
      </span>
    </Link>
  );
}