import { Link } from 'react-router-dom';
import Animate from '@/components/Animate';

const POSTS = [
  { title: 'Why predictive models fail in uncertain environments', date: 'Aug 12, 2026', category: 'Product', excerpt: 'Most forecasting tools assume stability. Here is how we built for the opposite.' },
  { title: 'Introducing the Reasoning Engine', date: 'Jul 28, 2026', category: 'Announcement', excerpt: 'A new layer that turns raw metrics into contextual, actionable intelligence.' },
  { title: 'How teams use scenario modeling for revenue planning', date: 'Jul 10, 2026', category: 'Customer story', excerpt: 'From quarterly targets to what-if stress tests — real workflows from our customers.' },
  { title: 'Data elevation: a practical framework', date: 'Jun 22, 2026', category: 'Guide', excerpt: 'Steps to move from scattered data to essential, decision-ready datasets.' },
];

export default function Blog() {
  return (
    <div className="pt-28 sm:pt-32 pb-20">
      <div className="max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px]">
        <Animate delay={100} direction="up">
          <p className="text-white/50 text-[14px] font-[450] mb-3 uppercase tracking-wider">Blog</p>
          <h1 className="text-white text-[36px] sm:text-[48px] font-normal leading-[1.05] mb-12">
            Insights & updates
          </h1>
        </Animate>

        <div className="grid md:grid-cols-2 gap-6 max-w-[1000px]">
          {POSTS.map((post, i) => (
            <Animate key={post.title} delay={180 + i * 70} direction="up">
              <article className="p-6 sm:p-7 rounded-[20px] bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-white/40 text-[12px]">{post.date}</span>
                  <span className="text-white/30">·</span>
                  <span className="text-white/50 text-[12px]">{post.category}</span>
                </div>
                <h2 className="text-white text-[18px] sm:text-[20px] font-[450] mb-2 leading-snug">
                  {post.title}
                </h2>
                <p className="text-white/55 text-[14px] leading-relaxed mb-4">{post.excerpt}</p>
                <span className="text-white/70 text-[14px] hover:text-white transition-colors">Read more →</span>
              </article>
            </Animate>
          ))}
        </div>
      </div>
    </div>
  );
}
