import Animate from '@/components/Animate';

export default function BookDemo() {
  return (
    <div className="pt-28 sm:pt-32 pb-20">
      <div className="max-w-[560px] mx-auto px-5 sm:px-8">
        <Animate delay={100} direction="up">
          <p className="text-white/50 text-[14px] font-[450] mb-3 uppercase tracking-wider">Book a demo</p>
          <h1 className="text-white text-[32px] sm:text-[42px] font-normal leading-[1.05] mb-4">
            See Apogee in action
          </h1>
          <p className="text-white/70 text-[16px] mb-10 leading-relaxed">
            Get a personalized walkthrough of reasoning systems, predictive models, and dashboards tailored to your data.
          </p>
        </Animate>

        <Animate delay={200} direction="up">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-[13px] mb-1.5">First name</label>
                <input type="text" className="w-full h-[48px] px-4 rounded-[12px] bg-white/[0.06] border border-white/10 text-white text-[15px] focus:outline-none focus:border-white/25" />
              </div>
              <div>
                <label className="block text-white/70 text-[13px] mb-1.5">Last name</label>
                <input type="text" className="w-full h-[48px] px-4 rounded-[12px] bg-white/[0.06] border border-white/10 text-white text-[15px] focus:outline-none focus:border-white/25" />
              </div>
            </div>
            <div>
              <label className="block text-white/70 text-[13px] mb-1.5">Work email</label>
              <input type="email" className="w-full h-[48px] px-4 rounded-[12px] bg-white/[0.06] border border-white/10 text-white text-[15px] focus:outline-none focus:border-white/25" />
            </div>
            <div>
              <label className="block text-white/70 text-[13px] mb-1.5">Company</label>
              <input type="text" className="w-full h-[48px] px-4 rounded-[12px] bg-white/[0.06] border border-white/10 text-white text-[15px] focus:outline-none focus:border-white/25" />
            </div>
            <div>
              <label className="block text-white/70 text-[13px] mb-1.5">Role</label>
              <input type="text" placeholder="e.g. Head of Data" className="w-full h-[48px] px-4 rounded-[12px] bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 text-[15px] focus:outline-none focus:border-white/25" />
            </div>
            <div>
              <label className="block text-white/70 text-[13px] mb-1.5">Message (optional)</label>
              <textarea rows={3} className="w-full px-4 py-3 rounded-[12px] bg-white/[0.06] border border-white/10 text-white text-[15px] focus:outline-none focus:border-white/25 resize-none" />
            </div>
            <button type="submit" className="w-full h-[50px] bg-[#E9E9E9] rounded-[12px] text-[#0A0707] text-[15px] font-[450] hover:opacity-90 transition-opacity">
              Request demo
            </button>
          </form>
        </Animate>
      </div>
    </div>
  );
}
