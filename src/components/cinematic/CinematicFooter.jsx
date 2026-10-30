import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Mail, CheckCircle2, ArrowUp } from 'lucide-react';
import { useT } from '../../context/I18nContext';
import { useCart } from '../../context/CartContext';

export default function CinematicFooter() {
  const { lang } = useT();
  const { setIsAgentOpen } = useCart();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const SECTIONS = [
    {
      num: '01',
      title: lang === 'hi' ? 'कैटलॉग' : 'Catalog & Swaps',
      links: [
        { label: lang === 'hi' ? 'दुकान' : 'All Products', to: '/shop' },
        { label: lang === 'hi' ? 'सामान बदलें' : 'Swap My List', to: '/transform' },
        { label: lang === 'hi' ? 'सच्चाई जांच' : 'Check a Claim', to: '/truth-lab' },
        { label: lang === 'hi' ? 'उत्पाद तुलना' : 'Product Duel', to: '/duel' },
        { label: lang === 'hi' ? 'प्रभाव डैशबोर्ड' : 'My Impact', to: '/impact' }
      ]
    },
    {
      num: '02',
      title: lang === 'hi' ? 'स्मार्ट टूल्स' : 'AI & Scanners',
      links: [
        {
          label: lang === 'hi' ? 'इको एजेंट' : 'Eco Agent Helper',
          action: () => setIsAgentOpen(true)
        },
        { label: lang === 'hi' ? 'बारकोड स्कैनर' : 'Barcode Scanner', to: '/barcodes' },
        { label: lang === 'hi' ? 'लेबल स्कैनर' : 'Label Scanner', to: '/scan' },
        { label: lang === 'hi' ? 'किराना मोड' : 'Desi Kirana Mode', to: '/kirana' },
        { label: lang === 'hi' ? 'प्राथमिकता प्लेग्राउंड' : 'Decision Playground', to: '/playground' }
      ]
    },
    {
      num: '03',
      title: lang === 'hi' ? 'पारदर्शिता' : 'Integrity & Ethics',
      links: [
        { label: lang === 'hi' ? 'यह कैसे काम करता है' : 'How It Works', to: '/how-it-works' },
        { label: lang === 'hi' ? 'AI कोर्टरूम' : 'AI Courtroom', to: '/courtroom' },
        { label: lang === 'hi' ? 'AI सेल्फ-ऑडिट' : 'AI Self-Audit', to: '/self-audit' },
        { label: lang === 'hi' ? 'नैतिक दुविधाएं' : 'Moral Dilemmas', to: '/dilemmas' },
        { label: lang === 'hi' ? 'सीखें' : 'Learn Hub', to: '/learn' }
      ]
    },
    {
      num: '04',
      title: lang === 'hi' ? 'संसाधन' : 'Platform & Help',
      links: [
        { label: lang === 'hi' ? 'समुदाय' : 'Community Pledges', to: '/community' },
        { label: lang === 'hi' ? 'टूल्स' : 'Tools & Bundles', to: '/tools' },
        { label: lang === 'hi' ? 'समाचार' : 'Eco News', to: '/news' },
        { label: lang === 'hi' ? 'संपर्क करें' : 'Contact Us', to: '/contact' },
        { label: lang === 'hi' ? 'सेटिंग्स' : 'Settings & Display', to: '/settings' },
        {
          label: lang === 'hi' ? 'प्राइवेसी सेंटर' : 'Privacy Center',
          action: () => window.dispatchEvent(new CustomEvent('open-privacy-center'))
        }
      ]
    }
  ];

  return (
    <footer className="relative isolate overflow-hidden mt-28 border-t border-line bg-surface text-secondary transition-colors">
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-12">
        {/* Top Manifesto Statement */}
        <div className="pb-16 border-b border-line space-y-6">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-focus rounded-xl"
              aria-label="Eco Sense Home"
            >
              <img
                src="/images/logo.png"
                alt="Eco Sense - Shop with sense. Shop with purpose."
                width="145"
                height="45"
                className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105 dark:hidden"
              />
              <img
                src="/images/logo-dark.png"
                alt="Eco Sense - Shop with sense. Shop with purpose."
                width="145"
                height="45"
                className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105 hidden dark:block"
              />
            </Link>

            <button
              type="button"
              onClick={scrollToTop}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-heading transition-colors focus-visible:outline-2 focus-visible:outline-focus px-3 py-1.5 rounded-full border border-line cursor-pointer"
            >
              <span>{lang === 'hi' ? 'शीर्ष पर जाएं' : 'Back to top'}</span>
              <ArrowUp className="w-3.5 h-3.5 text-primary" />
            </button>
          </div>

          <p className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-heading max-w-3xl leading-snug">
            {lang === 'hi'
              ? 'उद्देश्य के साथ खरीदारी करें। सोच-समझकर और प्रकृति-हितैषी उपभोग को आसान बनाना।'
              : 'Shop with purpose. Making thoughtful, restorative consumption effortless.'}
          </p>

          <p className="text-xs font-mono text-text-muted max-w-xl leading-relaxed">
            {lang === 'hi'
              ? 'स्कूल प्रोजेक्ट के लिए नमूना उत्पाद। कीमतें और प्रभाव संख्याएं अनुमानित हैं।'
              : 'Sample products for a school project. Prices and impact numbers are estimates.'}
          </p>
        </div>

        {/* Ruled Categorized Index Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-14 border-b border-line">
          {SECTIONS.map((sec) => (
            <div key={sec.num} className="space-y-4">
              <div className="flex items-baseline gap-2 border-b border-line/60 pb-2">
                <span className="font-mono text-xs text-primary font-bold">{sec.num}</span>
                <span className="font-mono text-xs uppercase tracking-wider text-heading font-semibold">
                  {sec.title}
                </span>
              </div>
              <ul className="space-y-2 text-xs font-sans text-text-secondary">
                {sec.links.map((link, idx) => (
                  <li key={idx}>
                    {link.action ? (
                      <button
                        type="button"
                        onClick={link.action}
                        className="hover:text-heading transition-colors py-0.5 text-left cursor-pointer"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        to={link.to}
                        className="hover:text-heading transition-colors py-0.5 inline-block"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Trust Marks & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-text-muted gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1 text-primary">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Offline First</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-primary">
              <Zap className="w-3.5 h-3.5" />
              <span>Zero-PII Local Telemetry</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-primary">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>WCAG AA Calibrated</span>
            </span>
          </div>

          <div>
            © 2026 Eco Sense.
          </div>
        </div>

        {/* Newsletter Signup in Minimal ruled row */}
        <div className="mt-8 pt-6 border-t border-line/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <span className="text-text-muted font-sans">
            {lang === 'hi' ? 'मासिक प्रभाव डाइजेस्ट और केस स्टडीज' : 'Monthly impact digest & seasonal conscious shopping notes'}
          </span>
          {newsletterSubscribed ? (
            <span className="text-primary font-mono font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {lang === 'hi' ? 'धन्यवाद! आप जुड़ चुके हैं।' : 'Thank you for subscribing!'}
            </span>
          ) : (
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={lang === 'hi' ? 'अपना ईमेल दर्ज करें' : 'name@example.com'}
                required
                className="px-3 py-1.5 rounded-xl border border-line bg-surface-raised text-xs text-heading placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-focus"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-primary text-primary-contrast hover:bg-primary-hover font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
              >
                {lang === 'hi' ? 'जुड़ें' : 'Join'}
              </button>
            </form>
          )}
        </div>
      </div>
    </footer>
  );
}

