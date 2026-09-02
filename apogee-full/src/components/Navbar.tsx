import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import Animate from './Animate';

const PLATFORM_ITEMS = [
  { label: 'Overview', path: '/platform' },
  { label: 'Reasoning Engine', path: '/platform/reasoning' },
  { label: 'Predictive Models', path: '/platform/predictive' },
  { label: 'Data Integration', path: '/platform/integration' },
  { label: 'Dashboards & Analytics', path: '/platform/dashboards' },
  { label: 'Scenario Modeling', path: '/platform/scenarios' },
  { label: 'Security & Compliance', path: '/platform/security' },
];

const NAV_LINKS = [
  { label: 'Pricing', path: '/pricing' },
  { label: 'Resources', path: '/resources' },
  { label: 'Blog', path: '/blog' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const platformRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
    setPlatformOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (platformRef.current && !platformRef.current.contains(e.target as Node)) {
        setPlatformOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] pt-[20px] sm:pt-[30px] flex items-center justify-between relative z-50">
        <Animate delay={0} direction="down">
          <Link to="/" className="flex items-center gap-2.5">
            <svg
              width="28"
              height="28"
              viewBox="0 0 256 256"
              fill="none"
              className="sm:w-[32px] sm:h-[32px]"
            >
              <path
                d="M 256 256 L 178 256 C 150.386 256 128 233.614 128 206 L 128 256 L 0 256 L 0 192 C 0 156.654 28.654 128 64 128 C 99.346 128 128 156.654 128 192 L 128 128 L 256 128 Z M 78 0 C 105.614 0 128 22.386 128 50 L 128 0 L 256 0 L 256 64 C 256 99.346 227.346 128 192 128 C 156.654 128 128 99.346 128 64 L 128 128 L 0 128 L 0 0 Z"
                fill="white"
              />
            </svg>
            <span className="text-white text-[22px] sm:text-[26px] font-[450] leading-none tracking-[-0.02em]">
              Apogee
            </span>
          </Link>
        </Animate>

        <Animate delay={100} direction="down" className="hidden lg:block">
          <div className="h-[52px] px-6 flex items-center gap-[30px] bg-[rgba(10,7,7,0.35)] rounded-[11px] backdrop-blur-[17px]">
            <div className="relative" ref={platformRef}>
              <button
                onClick={() => setPlatformOpen(!platformOpen)}
                className="flex items-center gap-[5px] text-white/80 text-[14px] font-[450] leading-[14px] hover:text-white transition-colors"
              >
                Platform
                <ChevronDown
                  className={`w-[10px] h-[10px] opacity-80 transition-transform duration-200 ${
                    platformOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {platformOpen && (
                <div className="absolute top-full left-0 mt-3 min-w-[220px] py-2 bg-[rgba(10,7,7,0.95)] backdrop-blur-[20px] border border-white/10 rounded-[11px] shadow-xl z-50">
                  {PLATFORM_ITEMS.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setPlatformOpen(false)}
                      className="block w-full text-left px-4 py-2.5 text-white/80 text-[14px] hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-white/80 text-[14px] font-[450] leading-[14px] hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Animate>

        <Animate delay={200} direction="down" className="hidden lg:block">
          <div className="h-[52px] p-[3px] bg-[rgba(0,0,0,0.35)] rounded-[13px] backdrop-blur-[17px] flex items-center gap-[5px]">
            <Link
              to="/login"
              className="h-[46px] px-6 rounded-[11px] text-white text-[14px] font-[450] leading-[14px] hover:bg-white/5 transition-colors flex items-center"
            >
              Login
            </Link>
            <Link
              to="/book-demo"
              className="h-[46px] px-6 bg-[#E9E9E9] rounded-[11px] text-[#0A0707] text-[14px] font-[450] leading-[14px] hover:bg-white transition-colors flex items-center"
            >
              Book a demo
            </Link>
          </div>
        </Animate>

        <Animate delay={100} direction="down" className="lg:hidden">
          <button
            className="w-[44px] h-[44px] flex items-center justify-center rounded-[11px] bg-[rgba(10,7,7,0.35)] backdrop-blur-[17px] transition-colors hover:bg-white/10"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5">
              <Menu
                className={`w-5 h-5 text-white absolute inset-0 transition-all duration-300 ease-out ${
                  isOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
                }`}
              />
              <X
                className={`w-5 h-5 text-white absolute inset-0 transition-all duration-300 ease-out ${
                  isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
                }`}
              />
            </div>
          </button>
        </Animate>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'visible' : 'invisible'
        }`}
      >
        <div
          className={`absolute inset-0 bg-[#080A19]/90 backdrop-blur-[24px] transition-opacity duration-500 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute top-[76px] sm:top-[86px] left-4 right-4 sm:left-6 sm:right-6 bg-[rgba(17,16,15,0.6)] backdrop-blur-[30px] rounded-[20px] border border-white/[0.06] p-6 sm:p-8 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-top ${
            isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-[0.97]'
          }`}
        >
          <div className="flex flex-col gap-1">
            <div className="px-4 py-2 text-white/50 text-[12px] uppercase tracking-wider">Platform</div>
            {PLATFORM_ITEMS.map((item, i) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-[12px] text-white/90 text-[16px] font-[450] hover:bg-white/[0.06] transition-all duration-300 ${
                  isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
                }`}
                style={{ transitionDelay: isOpen ? `${80 + i * 30}ms` : '0ms' }}
              >
                {item.label}
              </Link>
            ))}

            <div className="h-px bg-white/10 my-3" />

            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-4 rounded-[12px] text-white/90 text-[18px] font-[450] hover:bg-white/[0.06] transition-all duration-300 ${
                  isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
                }`}
                style={{ transitionDelay: isOpen ? `${200 + i * 40}ms` : '0ms' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="h-px bg-white/10 my-5" />

          <div
            className={`flex flex-col gap-3 transition-all duration-300 ${
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{ transitionDelay: isOpen ? '350ms' : '0ms' }}
          >
            <Link
              to="/book-demo"
              className="w-full h-[50px] bg-[#E9E9E9] rounded-[12px] text-[#0A0707] text-[15px] font-[450] transition-colors hover:bg-white flex items-center justify-center"
            >
              Book a demo
            </Link>
            <Link
              to="/login"
              className="w-full h-[50px] rounded-[12px] border border-white/30 text-white text-[15px] font-[450] transition-colors hover:bg-white/5 flex items-center justify-center"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
