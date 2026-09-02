import { Link } from 'react-router-dom';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Overview', path: '/platform' },
    { label: 'Reasoning Engine', path: '/platform/reasoning' },
    { label: 'Predictive Models', path: '/platform/predictive' },
    { label: 'Security', path: '/platform/security' },
  ],
  Company: [
    { label: 'About', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', path: '/contact' },
  ],
  Resources: [
    { label: 'Documentation', path: '/docs' },
    { label: 'API Reference', path: '/docs/api' },
    { label: 'Guides', path: '/resources' },
    { label: 'Case Studies', path: '/resources/case-studies' },
  ],
  Legal: [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Cookie Policy', path: '/cookies' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#080A19]">
      <div className="max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <svg width="24" height="24" viewBox="0 0 256 256" fill="none">
                <path
                  d="M 256 256 L 178 256 C 150.386 256 128 233.614 128 206 L 128 256 L 0 256 L 0 192 C 0 156.654 28.654 128 64 128 C 99.346 128 128 156.654 128 192 L 128 128 L 256 128 Z M 78 0 C 105.614 0 128 22.386 128 50 L 128 0 L 256 0 L 256 64 C 256 99.346 227.346 128 192 128 C 156.654 128 128 99.346 128 64 L 128 128 L 0 128 L 0 0 Z"
                  fill="white"
                />
              </svg>
              <span className="text-white text-[20px] font-[450]">Apogee</span>
            </Link>
            <p className="text-white/50 text-[14px] leading-relaxed max-w-[200px]">
              Advanced reasoning systems and predictive models built for the unknown.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white text-[14px] font-[450] mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-white/50 text-[14px] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-[13px]">© {new Date().getFullYear()} Apogee. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-white/40 text-[13px] hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-white/40 text-[13px] hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
