import { useState } from 'react';
import { Outlet, Link, useLocation, NavLink, useNavigate } from 'react-router-dom';
import { clearAuth, getStoredUser } from '@/lib/api';
import {
  LayoutDashboard,
  FolderKanban,
  Database,
  Brain,
  LineChart,
  Users,
  Settings,
  CreditCard,
  Plug,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', path: '/app', icon: LayoutDashboard, end: true },
  { label: 'Workspaces', path: '/app/workspaces', icon: FolderKanban },
  { label: 'Data Sources', path: '/app/data-sources', icon: Database },
  { label: 'Models', path: '/app/models', icon: Brain },
  { label: 'Analytics', path: '/app/analytics', icon: LineChart },
  { label: 'Integrations', path: '/app/integrations', icon: Plug },
  { label: 'Team', path: '/app/team', icon: Users },
  { label: 'Billing', path: '/app/billing', icon: CreditCard },
  { label: 'Settings', path: '/app/settings', icon: Settings },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();
  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="min-h-screen bg-[#0A0B14] text-white flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[260px] flex-col border-r border-white/[0.06] bg-[#080A19] fixed inset-y-0 left-0 z-30">
        <div className="h-[64px] flex items-center gap-2.5 px-5 border-b border-white/[0.06]">
          <Link to="/app" className="flex items-center gap-2.5">
            <svg width="24" height="24" viewBox="0 0 256 256" fill="none">
              <path
                d="M 256 256 L 178 256 C 150.386 256 128 233.614 128 206 L 128 256 L 0 256 L 0 192 C 0 156.654 28.654 128 64 128 C 99.346 128 128 156.654 128 192 L 128 128 L 256 128 Z M 78 0 C 105.614 0 128 22.386 128 50 L 128 0 L 256 0 L 256 64 C 256 99.346 227.346 128 192 128 C 156.654 128 128 99.346 128 64 L 128 128 L 0 128 L 0 0 Z"
                fill="white"
              />
            </svg>
            <span className="text-white text-[18px] font-[450]">Apogee</span>
          </Link>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-[450] transition-colors ${
                  isActive
                    ? 'bg-white/[0.08] text-white'
                    : 'text-white/55 hover:text-white hover:bg-white/[0.04]'
                }`
              }
            >
              <item.icon className="w-4.5 h-4.5 shrink-0" strokeWidth={1.75} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-[10px]">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-[13px] font-[450]">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[13px] font-[450] truncate">{user?.full_name || 'User'}</p>
              <p className="text-white/40 text-[11px] truncate">{user?.company || user?.email || ''}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              clearAuth();
              navigate('/');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-[10px] text-white/50 text-[13px] hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-[56px] bg-[#080A19]/95 backdrop-blur-md border-b border-white/[0.06] z-40 flex items-center justify-between px-4">
        <Link to="/app" className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 256 256" fill="none">
            <path
              d="M 256 256 L 178 256 C 150.386 256 128 233.614 128 206 L 128 256 L 0 256 L 0 192 C 0 156.654 28.654 128 64 128 C 99.346 128 128 156.654 128 192 L 128 128 L 256 128 Z M 78 0 C 105.614 0 128 22.386 128 50 L 128 0 L 256 0 L 256 64 C 256 99.346 227.346 128 192 128 C 156.654 128 128 99.346 128 64 L 128 128 L 0 128 L 0 0 Z"
              fill="white"
            />
          </svg>
          <span className="text-white text-[16px] font-[450]">Apogee</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-[10px] hover:bg-white/5"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#080A19] border-r border-white/[0.06] flex flex-col pt-[56px]">
            <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
              {SIDEBAR_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-[450] transition-colors ${
                      isActive
                        ? 'bg-white/[0.08] text-white'
                        : 'text-white/55 hover:text-white hover:bg-white/[0.04]'
                    }`
                  }
                >
                  <item.icon className="w-4.5 h-4.5" strokeWidth={1.75} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-3 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => {
                  clearAuth();
                  navigate('/');
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-white/50 text-[13px]"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-[260px] min-h-screen">
        <div className="pt-[56px] lg:pt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
