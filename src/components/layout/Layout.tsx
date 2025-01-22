import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
export default function Layout() {
  return (
    <>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="pl-0  m-auto overflow-hidden md:pl-16 lg:pl-64 pb-8">
        <div className=" w-full ">
          <Outlet />
        </div>
      </main>
    </div>
    </>
  );
}