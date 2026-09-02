import Animate from '@/components/Animate';

export default function Terms() {
  return (
    <div className="pt-28 sm:pt-32 pb-20">
      <div className="max-w-[720px] mx-auto px-5 sm:px-8">
        <Animate delay={100} direction="up">
          <h1 className="text-white text-[32px] sm:text-[40px] font-normal mb-6">Terms of Service</h1>
          <div className="space-y-4 text-white/60 text-[15px] leading-relaxed">
            <p>Last updated: August 2026</p>
            <p>
              These Terms of Service govern your use of Apogee. Replace this placeholder with your
              full terms covering acceptable use, accounts, subscriptions, intellectual property,
              limitations of liability, and governing law.
            </p>
          </div>
        </Animate>
      </div>
    </div>
  );
}
