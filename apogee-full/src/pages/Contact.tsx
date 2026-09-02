import Animate from '@/components/Animate';

export default function Contact() {
  return (
    <div className="pt-28 sm:pt-32 pb-20">
      <div className="max-w-[560px] mx-auto px-5 sm:px-8">
        <Animate delay={100} direction="up">
          <p className="text-white/50 text-[14px] font-[450] mb-3 uppercase tracking-wider">Contact</p>
          <h1 className="text-white text-[32px] sm:text-[42px] font-normal leading-[1.05] mb-4">
            Talk with the team
          </h1>
          <p className="text-white/70 text-[16px] mb-10">
            Questions about the platform, pricing, or partnerships? We are here to help.
          </p>
        </Animate>

        <Animate delay={200} direction="up">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-white/70 text-[13px] mb-1.5">Name</label>
              <input type="text" className="w-full h-[48px] px-4 rounded-[12px] bg-white/[0.06] border border-white/10 text-white text-[15px] focus:outline-none focus:border-white/25" />
            </div>
            <div>
              <label className="block text-white/70 text-[13px] mb-1.5">Email</label>
              <input type="email" className="w-full h-[48px] px-4 rounded-[12px] bg-white/[0.06] border border-white/10 text-white text-[15px] focus:outline-none focus:border-white/25" />
            </div>
            <div>
              <label className="block text-white/70 text-[13px] mb-1.5">Message</label>
              <textarea rows={4} className="w-full px-4 py-3 rounded-[12px] bg-white/[0.06] border border-white/10 text-white text-[15px] focus:outline-none focus:border-white/25 resize-none" />
            </div>
            <button type="submit" className="w-full h-[50px] bg-[#E9E9E9] rounded-[12px] text-[#0A0707] text-[15px] font-[450] hover:opacity-90 transition-opacity">
              Send message
            </button>
          </form>
        </Animate>
      </div>
    </div>
  );
}
