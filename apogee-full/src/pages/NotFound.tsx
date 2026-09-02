import { Link } from 'react-router-dom';
import Animate from '@/components/Animate';

export default function NotFound() {
  return (
    <div className="pt-28 sm:pt-32 pb-20 min-h-[60vh] flex items-center justify-center">
      <Animate delay={100} direction="up" className="text-center px-5">
        <h1 className="text-white text-[64px] font-normal mb-2">404</h1>
        <p className="text-white/60 text-[18px] mb-8">Page not found</p>
        <Link
          to="/"
          className="inline-flex h-[48px] px-6 bg-[#E9E9E9] rounded-[12px] text-[#0A0707] text-[15px] font-[450] items-center hover:opacity-90 transition-opacity"
        >
          Back to home
        </Link>
      </Animate>
    </div>
  );
}
