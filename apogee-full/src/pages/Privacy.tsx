import Animate from '@/components/Animate';

export default function Privacy() {
  return (
    <div className="pt-28 sm:pt-32 pb-20">
      <div className="max-w-[720px] mx-auto px-5 sm:px-8">
        <Animate delay={100} direction="up">
          <h1 className="text-white text-[32px] sm:text-[40px] font-normal mb-6">Privacy Policy</h1>
          <div className="space-y-4 text-white/60 text-[15px] leading-relaxed">
            <p>Last updated: August 2026</p>
            <p>
              This Privacy Policy describes how Apogee collects, uses, and protects your information.
              Replace this placeholder with your full legal privacy policy covering data collection,
              processing purposes, retention, rights, and contact details.
            </p>
            <p>
              Key sections typically include: Information we collect, How we use data, Sharing,
              Security measures, International transfers, Your rights, and Contact.
            </p>
          </div>
        </Animate>
      </div>
    </div>
  );
}
