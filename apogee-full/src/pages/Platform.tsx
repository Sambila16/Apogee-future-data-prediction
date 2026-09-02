import { Link } from 'react-router-dom';
import Animate from '@/components/Animate';
import { Brain, LineChart, Database, LayoutDashboard, GitBranch, Shield } from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    title: 'Reasoning Engine',
    description: 'AI that reasons over your data — understanding context, relationships, and implications beyond simple metrics.',
    path: '/platform/reasoning',
  },
  {
    icon: LineChart,
    title: 'Predictive Models',
    description: 'Forecasting built for uncertainty. Models that perform even when the future is unknown or data is noisy.',
    path: '/platform/predictive',
  },
  {
    icon: Database,
    title: 'Data Integration',
    description: 'Connect sources across your stack. Unify, clean, and prepare essential data in one place.',
    path: '/platform/integration',
  },
  {
    icon: LayoutDashboard,
    title: 'Dashboards & Analytics',
    description: 'Real-time, customizable views of the metrics that matter — revenue, growth, risk, and more.',
    path: '/platform/dashboards',
  },
  {
    icon: GitBranch,
    title: 'Scenario Modeling',
    description: 'Run what-if simulations. Explore outcomes under different assumptions before you commit.',
    path: '/platform/scenarios',
  },
  {
    icon: Shield,
    title: 'Security & Compliance',
    description: 'Enterprise-grade encryption, access controls, and compliance ready for SOC2 and GDPR.',
    path: '/platform/security',
  },
];

export default function Platform() {
  return (
    <div className="pt-28 sm:pt-32 pb-20">
      <div className="max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px]">
        <Animate delay={100} direction="up">
          <p className="text-white/50 text-[14px] font-[450] mb-3 uppercase tracking-wider">Platform</p>
          <h1 className="text-white text-[36px] sm:text-[48px] md:text-[56px] font-normal leading-[1.05] max-w-[700px] mb-5">
            Everything you need to elevate essential data
          </h1>
          <p className="text-white/70 text-[17px] sm:text-[19px] max-w-[540px] mb-14 leading-relaxed">
            From advanced reasoning to predictive models and secure integrations — one platform built for the unknown.
          </p>
        </Animate>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <Animate key={f.path} delay={200 + i * 80} direction="up">
              <Link
                to={f.path}
                className="block h-full p-6 sm:p-7 rounded-[20px] bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-[12px] bg-white/10 flex items-center justify-center mb-5 group-hover:bg-white/15 transition-colors">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white text-[18px] font-[450] mb-2">{f.title}</h3>
                <p className="text-white/55 text-[14px] leading-relaxed">{f.description}</p>
              </Link>
            </Animate>
          ))}
        </div>
      </div>
    </div>
  );
}
