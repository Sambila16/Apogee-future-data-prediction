import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import AppLayout from '@/layouts/AppLayout';

import Home from '@/pages/Home';
import Platform from '@/pages/Platform';
import Reasoning from '@/pages/platform/reasoning';
import Predictive from '@/pages/platform/predictive';
import Integration from '@/pages/platform/integration';
import Dashboards from '@/pages/platform/dashboards';
import Scenarios from '@/pages/platform/scenarios';
import Security from '@/pages/platform/security';
import Pricing from '@/pages/Pricing';
import Resources from '@/pages/Resources';
import Blog from '@/pages/Blog';
import BookDemo from '@/pages/BookDemo';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Docs from '@/pages/Docs';
import NotFound from '@/pages/NotFound';

import Dashboard from '@/pages/app/Dashboard';
import Workspaces from '@/pages/app/Workspaces';
import DataSources from '@/pages/app/DataSources';
import Models from '@/pages/app/Models';
import Analytics from '@/pages/app/Analytics';
import Integrations from '@/pages/app/Integrations';
import Team from '@/pages/app/Team';
import Billing from '@/pages/app/Billing';
import Settings from '@/pages/app/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public marketing site */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/platform/reasoning" element={<Reasoning />} />
          <Route path="/platform/predictive" element={<Predictive />} />
          <Route path="/platform/integration" element={<Integration />} />
          <Route path="/platform/dashboards" element={<Dashboards />} />
          <Route path="/platform/scenarios" element={<Scenarios />} />
          <Route path="/platform/security" element={<Security />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/case-studies" element={<Resources />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/book-demo" element={<BookDemo />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Privacy />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/docs/api" element={<Docs />} />
          <Route path="/careers" element={<About />} />
        </Route>

        {/* Auth pages */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Logged-in App (protected area — UI only for now) */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="workspaces" element={<Workspaces />} />
          <Route path="data-sources" element={<DataSources />} />
          <Route path="models" element={<Models />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="team" element={<Team />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
