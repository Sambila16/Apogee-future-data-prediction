import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#080A19] text-white flex flex-col">
      <div className="absolute top-6 left-6 sm:top-8 sm:left-10">
        <Link to="/" className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 256 256" fill="none">
            <path
              d="M 256 256 L 178 256 C 150.386 256 128 233.614 128 206 L 128 256 L 0 256 L 0 192 C 0 156.654 28.654 128 64 128 C 99.346 128 128 156.654 128 192 L 128 128 L 256 128 Z M 78 0 C 105.614 0 128 22.386 128 50 L 128 0 L 256 0 L 256 64 C 256 99.346 227.346 128 192 128 C 156.654 128 128 99.346 128 64 L 128 128 L 0 128 L 0 0 Z"
              fill="white"
            />
          </svg>
          <span className="text-white text-[22px] font-[450]">Apogee</span>
        </Link>
      </div>
      <main className="flex-1 flex items-center justify-center px-5 py-20">
        <Outlet />
      </main>
    </div>
  );
}
