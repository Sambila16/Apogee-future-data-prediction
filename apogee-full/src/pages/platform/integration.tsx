import Animate from '@/components/Animate';
import { Link } from 'react-router-dom';

export default function Integration() {
  return (
    <div className="pt-28 sm:pt-32 pb-20">
      <div className="max-w-[900px] mx-auto px-5 sm:px-8">
        <Animate delay={100} direction="up">
          <Link to="/platform" className="text-white/50 text-[14px] hover:text-white transition-colors mb-6 inline-block">
            ← Platform
          </Link>
          <h1 className="text-white text-[36px] sm:text-[48px] font-normal leading-[1.05] mb-5">
            Data Integration
          </h1>
          <p className="text-white/70 text-[17px] sm:text-[19px] leading-relaxed mb-10">
            Detailed overview of Data Integration capabilities within Apogee. This page is ready for product content, screenshots, and technical deep-dives.
          </p>
        </Animate>

        <Animate delay={250} direction="up">
          <div className="space-y-6 text-white/60 text-[15px] leading-relaxed">
            <p>
              Apogee's Data Integration helps teams turn essential data into actionable intelligence.
              Replace this placeholder with feature details, benefits, and use cases specific to your product.
            </p>
            <div className="p-6 rounded-[16px] bg-white/[0.04] border border-white/[0.06]">
              <p className="text-white/80 text-[14px]">
                Content placeholder — add architecture diagrams, performance metrics, customer examples, and CTAs here.
              </p>
            </div>
          </div>
        </Animate>
      </div>
    </div>
  );
}
