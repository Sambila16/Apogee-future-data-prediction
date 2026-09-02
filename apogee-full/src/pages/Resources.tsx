import { Link } from 'react-router-dom';
import Animate from '@/components/Animate';
import { BookOpen, Code, FileText, Users } from 'lucide-react';

const RESOURCES = [
  { icon: BookOpen, title: 'Documentation', description: 'Guides, concepts, and how-tos to get the most from Apogee.', path: '/docs' },
  { icon: Code, title: 'API Reference', description: 'Full API docs for integrating Apogee into your stack.', path: '/docs/api' },
  { icon: FileText, title: 'Case Studies', description: 'How teams use reasoning and predictive models in production.', path: '/resources/case-studies' },
  { icon: Users, title: 'Guides & Tutorials', description: 'Step-by-step tutorials for common workflows.', path: '/resources' },
];

export default function Resources() {
  return (
    <div className="pt-28 sm:pt-32 pb-20">
      <div className="max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px]">
        <Animate delay={100} direction="up">
          <p className="text-white/50 text-[14px] font-[450] mb-3 uppercase tracking-wider">Resources</p>
          <h1 className="text-white text-[36px] sm:text-[48px] font-normal leading-[1.05] mb-5 max-w-[600px]">
            Learn, build, and go further
          </h1>
          <p className="text-white/70 text-[17px] max-w-[480px] mb-14">
            Documentation, APIs, case studies, and guides to help you elevate your data.
          </p>
        </Animate>

        <div className="grid sm:grid-cols-2 gap-5 max-w-[900px]">
          {RESOURCES.map((r, i) => (
            <Animate key={r.title} delay={200 + i * 80} direction="up">
              <Link
                to={r.path}
                className="flex gap-5 p-6 rounded-[20px] bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition-all"
              >
                <div className="w-11 h-11 rounded-[12px] bg-white/10 flex items-center justify-center shrink-0">
                  <r.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white text-[17px] font-[450] mb-1">{r.title}</h3>
                  <p className="text-white/55 text-[14px] leading-relaxed">{r.description}</p>
                </div>
              </Link>
            </Animate>
          ))}
        </div>
      </div>
    </div>
  );
}
