import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
export default function Layout({ setHomeClick }) {
  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Sidebar setHomeClick={setHomeClick} />
        <main className="pl-0  m-auto overflow-hidden md:pl-16 lg:pl-64">
          <div className=" w-full relative ">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}