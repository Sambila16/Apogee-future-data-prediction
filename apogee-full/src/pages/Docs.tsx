import Animate from '@/components/Animate';
import { Link } from 'react-router-dom';

export default function Docs() {
  return (
    <div className="pt-28 sm:pt-32 pb-20">
      <div className="max-w-[900px] mx-auto px-5 sm:px-8">
        <Animate delay={100} direction="up">
          <p className="text-white/50 text-[14px] font-[450] mb-3 uppercase tracking-wider">Documentation</p>
          <h1 className="text-white text-[36px] sm:text-[48px] font-normal leading-[1.05] mb-5">
            Documentation
          </h1>
          <p className="text-white/70 text-[17px] mb-10 max-w-[520px]">
            Everything you need to integrate, configure, and operate Apogee.
          </p>
        </Animate>

        <Animate delay={200} direction="up">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Getting started', desc: 'Install, connect data, and run your first model.' },
              { title: 'Reasoning Engine', desc: 'How reasoning works and how to configure it.' },
              { title: 'Predictive models', desc: 'Training, evaluation, and deployment.' },
              { title: 'API Reference', desc: 'REST and client SDKs.', path: '/docs/api' },
            ].map((item) => (
              <Link
                key={item.title}
                to={item.path || '/docs'}
                className="p-5 rounded-[16px] bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition-all"
              >
                <h3 className="text-white text-[16px] font-[450] mb-1">{item.title}</h3>
                <p className="text-white/50 text-[14px]">{item.desc}</p>
              </Link>
            ))}
          </div>
        </Animate>
      </div>
    </div>
  );
}
