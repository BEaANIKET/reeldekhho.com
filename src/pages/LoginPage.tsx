import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../public/file_svg.png';
import useAuth from '../hooks/useAuth';
import leftarrow from '/assets/arrow.svg'

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, loginErr } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email, password);
    setLoading(true);
    const success = await login(email, password)
    setLoading(false);
    if (success) {
      navigate('/');
    }
    setLoading(false);
  };

  const handleGoogleClick = async () => {
    try {
      const redirectUri = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
      // console.log(redirectUri);

      window.location.href = redirectUri;
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">

      <div onClick={() => navigate('/')} className=' absolute flex flex-col  items-center gap-1 underline text-blue-600 top-2 left-3  dark:text-white '>
        {/* <Link className=' ml-5 mb-[-50px] ' to={'/'}> Home </Link> */}
        <img className=' h-10 w-20 ' src={leftarrow} alt="" />
      </div>
      <div className="max-w-md w-full space-y-8">

        <div className="flex flex-col items-center">
          <img src={logo} alt='logo' className='h-20 w-20 object-cover' />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="flex flex-col gap-2">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className=' text-red-500 text-center'> {loginErr ? loginErr : ''}  </div>
          <div>
            <button
              disabled={loading}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
            >
              {loading ? 'Loading...' : 'Sign in'}
            </button>


          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="w-[20%] h-px bg-[#71717ab9]"></div>
            <span className="text-xs text-[#71717a] capitalize">or continue with socials</span>
            <div className="w-[20%] h-px bg-[#71717a]"></div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="p-1 rounded-md active:scale-95 border shadow-sm font-semibold"
              onClick={handleGoogleClick}
            >
              Google
            </button>

            <p className="text-sm text-center mt-2">
              Do not have an account?
              <Link to={'/signup'} className="text-blue-600 cursor-pointer font-semibold"> Signup</Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}




