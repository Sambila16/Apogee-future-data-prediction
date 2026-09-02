import { Link } from 'react-router-dom';
import Animate from '@/components/Animate';
import { Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter',
    price: '$49',
    period: '/mo',
    description: 'For small teams getting started with predictive insights.',
    features: ['Up to 3 workspaces', 'Core dashboards', 'Basic predictive models', 'Email support', '1 data source'],
    cta: 'Start free trial',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$149',
    period: '/mo',
    description: 'For growing teams that need advanced reasoning and scale.',
    features: ['Unlimited workspaces', 'Advanced reasoning engine', 'Custom models', 'Priority support', '10 data sources', 'Scenario modeling', 'Team collaboration'],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For organizations with complex data and compliance needs.',
    features: ['Everything in Pro', 'Dedicated success manager', 'SSO & advanced security', 'Custom integrations', 'SLA & on-prem options', 'Audit logs', 'Unlimited data sources'],
    cta: 'Contact sales',
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <div className="pt-28 sm:pt-32 pb-20">
      <div className="max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px]">
        <Animate delay={100} direction="up" className="text-center mb-14">
          <p className="text-white/50 text-[14px] font-[450] mb-3 uppercase tracking-wider">Pricing</p>
          <h1 className="text-white text-[36px] sm:text-[48px] md:text-[56px] font-normal leading-[1.05] mb-5">
            Simple, transparent pricing
          </h1>
          <p className="text-white/70 text-[17px] sm:text-[19px] max-w-[480px] mx-auto">
            Choose the plan that matches your data ambitions. Upgrade or downgrade anytime.
          </p>
        </Animate>

        <div className="grid md:grid-cols-3 gap-5 max-w-[1100px] mx-auto">
          {PLANS.map((plan, i) => (
            <Animate key={plan.name} delay={200 + i * 100} direction="up">
              <div
                className={`h-full flex flex-col p-7 sm:p-8 rounded-[24px] border transition-all ${
                  plan.highlighted
                    ? 'bg-white/[0.08] border-white/20'
                    : 'bg-white/[0.03] border-white/[0.06]'
                }`}
              >
                {plan.highlighted && (
                  <span className="self-start text-[12px] px-2.5 py-1 rounded-full bg-white/15 text-white mb-4">
                    Most popular
                  </span>
                )}
                <h3 className="text-white text-[20px] font-[450] mb-1">{plan.name}</h3>
                <p className="text-white/50 text-[14px] mb-5">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-white text-[36px] font-[450]">{plan.price}</span>
                  <span className="text-white/50 text-[16px]">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-white/70 text-[14px]">
                      <Check className="w-4 h-4 text-white/60 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                  className={`h-[48px] rounded-[12px] text-[15px] font-[450] flex items-center justify-center transition-opacity hover:opacity-90 ${
                    plan.highlighted
                      ? 'bg-[#E9E9E9] text-[#0A0707]'
                      : 'border border-white/25 text-white hover:bg-white/5'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </Animate>
          ))}
        </div>
      </div>
    </div>
  );
}
