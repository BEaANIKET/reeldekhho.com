import React, { useState, useEffect } from "react";
import { FaBars, FaBell, FaFacebook, FaInstagram, FaTimes, FaYoutube } from "react-icons/fa";
import axios from "axios";
import { BiLogoPlayStore } from "react-icons/bi";
import { FaX } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BsChat } from "react-icons/bs";
import NotificationSidebar from "./notifications";
import useNotifications from "../hooks/useNotifications";

const Header = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const adminUrl = import.meta.env.VITE_ADMIN_URL;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [value, setValue] = useState([])
  const [settin, setSettin] = useState([])
  const user = useSelector(state => state?.auth?.user)
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);
  const { unseenCount, } = useNotifications();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const fetchheader = async () => {
    const res = await axios.get(`${backendUrl}/post/fetchheader`)
    setValue(res.data.value)
    setSettin(res.data.settin)
  }
  useEffect(() => {
    if (!value || !value.length) {
      fetchheader();
    }
  }, [value])

  const handleLogout = async () => {
    localStorage.clear();
    window.location.reload();
  }

  const unseenMsg = useSelector(state => state?.chat?.unSeenCount);
  const [unSeenMsgCount, setUnSeenMsgCount] = useState(0)

  useEffect(() => {
    //(unseenMsg);
    const totalUnseen = Object.values(unseenMsg).reduce((sum, count) => sum + count, 0);
    //(totalUnseen);
    setUnSeenMsgCount(totalUnseen)
  }, [unseenMsg])

  return (
    <header className="relative top-0 left-0 w-full z-50 bg-white dark:bg-black shadow-md fixedtio">
      <div className="flex items-center justify-between px-4 py-2 md:px-8">
        {/* Hamburger Menu */}
        <div>
          <button
            onClick={toggleMenu}
            className="text-gray-800 focus:outline-none"
          >
            <FaBars className="text-2xl dark:text-white " />
          </button>
        </div>

        {/* Logo */}
        <div className="text-center">
          <img
            src={`${adminUrl}/public/Images/${settin.rectangleLogo}`}
            alt="Logo"
            className="h-8 object-contain mx-auto bg-blend-color-burn bg-black"
          />
        </div>

        {/* Notification Icon */}
        <div className=" flex gap-2 items-center">
          <div onClick={() => setIsOpen(true)} className=" relative flex items-center h-full ">
            <button className="text-gray-800 focus:outline-none">
              <FaBell className="text-2xl dark:text-white " />
            </button>

            {unseenCount ? (
              <p className=" absolute top-[-13px] left-[-6px] font-bold text-md flex items-center justify-center p-2 text-white bg-red-500 h-5 w-5 rounded-full "> {unseenCount} </p>
            ) : (
              null
            )}
          </div>

          <div className=" relative flex items-center h-full  ">
            <BsChat
              onClick={() => navigate("/messages")}
              className="w-6 h-6 text-gray-500 cursor-pointer"
            />
            {unSeenMsgCount ? (
              <p className=" absolute top-[-13px] left-[-6px] font-bold text-md flex items-center justify-center p-2 text-white bg-red-500 h-5 w-5 rounded-full "> {unSeenMsgCount} </p>

            ) : (
              null
            )}
          </div>
        </div>

      </div>

      {/* Off-Canvas Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-lg font-bold">Menu</h2>
          <button
            onClick={toggleMenu}
            className="text-gray-800 focus:outline-none"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>
        <ul className="flex flex-col mt-4">
          <li onClick={() => navigate('/')} className="py-3 px-4 hover:bg-gray-100 cursor-pointer">
            Home
          </li>
          {
            !user ? (
              <>
                <li className="py-3 px-4 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/login')} > Login </li>
                <li className="py-3 px-4 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/signup')} > Sign-up </li>
              </>
            ) : (
              <>
                <Link to='/forget' className="py-3 px-4 hover:bg-gray-100 cursor-pointer">
                  Change Password
                </Link>
                <li onClick={handleLogout} className="py-3 px-4 hover:bg-gray-100 cursor-pointer">
                  Logout
                </li>
                <Link to='/saved'>
                  <li className="py-3 px-4 hover:bg-gray-100 cursor-pointer">
                    Saved
                  </li>
                </Link>
                <li className="py-3 px-4 hover:bg-gray-100 cursor-pointer">
                  Delete Account
                </li>
              </>
            )
          }

          <Link to='/faq'>
            <li className="py-3 px-4 hover:bg-gray-100 cursor-pointer">
              FAQ
            </li>
          </Link>

          {value.map((item, index) => (
            <Link to={`/page/${item.Title}`}><li key={index} className="py-3 px-4 hover:bg-gray-100 cursor-pointer">
              {item.Title}
            </li></Link>

          ))}
        </ul>

        <div className="relative h-screen">
          <ul className="absolute flex justify-center w-full space-x-4 p-4 bg-white" style={{ marginBottom: '1px' }}>
            <Link to={settin.facebook}>
              <li>
                <FaFacebook className="text-xl text-blue-600 cursor-pointer" />
              </li>
            </Link>

            <Link to={settin.instagram}>
              <li>
                <FaInstagram className="text-xl text-red-600 cursor-pointer" />
              </li>
            </Link>

            <Link to={settin.twitter}>
              <li>
                <FaX className="text-xl text-black-600 cursor-pointer" />
              </li>
            </Link>

            <Link to={settin.youtube}>
              <li>
                <FaYoutube className="text-xl text-red-600 cursor-pointer" />
              </li>
            </Link>
            <Link to={settin.playstore}>
              <li>
                <BiLogoPlayStore className="text-xl text-gray-800 cursor-pointer" />
              </li>
            </Link>

          </ul>
        </div>

      </div >

      {/* Overlay */}
      {
        isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={toggleMenu}
          >

          </div>
        )
      }

      <NotificationSidebar setIsOpen={setIsOpen} isOpen={isOpen} />

    </header >
  );
};

export default Header;
