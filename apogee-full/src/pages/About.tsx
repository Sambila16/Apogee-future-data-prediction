import Animate from '@/components/Animate';

export default function About() {
  return (
    <div className="pt-28 sm:pt-32 pb-20">
      <div className="max-w-[800px] mx-auto px-5 sm:px-8">
        <Animate delay={100} direction="up">
          <p className="text-white/50 text-[14px] font-[450] mb-3 uppercase tracking-wider">About</p>
          <h1 className="text-white text-[36px] sm:text-[48px] font-normal leading-[1.05] mb-6">
            Built for the unknown
          </h1>
          <div className="space-y-5 text-white/65 text-[16px] sm:text-[17px] leading-relaxed">
            <p>
              Apogee exists to help organizations elevate their essential data when the future is uncertain.
              We combine advanced reasoning systems with predictive models designed for noisy, incomplete, and changing environments.
            </p>
            <p>
              Our mission is simple: turn critical data into forward-looking intelligence that teams can trust —
              whether they are forecasting revenue, modeling scenarios, or making high-stakes decisions.
            </p>
            <p>
              Replace this section with your company story, founding team, values, and vision.
            </p>
          </div>
        </Animate>
      </div>
    </div>
  );
}
