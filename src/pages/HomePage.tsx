import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  SearchIcon,
  ArrowForward,
  StarIcon,
  QuoteIcon,
  VerifiedIcon,
  ShieldIcon,
  LockIcon,
} from '../utils/icons';
import { SectionHeading } from '../components/common/SectionHeading';
import { Reveal } from '../components/common/Reveal';

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Verified property managers',
    body: 'Property managers are reviewed and verified before their properties are listed on NyumbaPlug.',
  },
  {
    step: '02',
    title: 'Scam-checked listings',
    body: 'Every listing is reviewed before it goes live, and tenants can report suspicious activity in one tap.',
  },
  {
    step: '03',
    title: 'Available homes',
    body: 'Only verified and available properties are promoted, so you can focus on homes that are actually ready to rent.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'After two scams on another site, NyumbaPlug was the first place where the property manager actually showed up to the viewing. The verified badge means something.',
    name: 'Wanjiku M.',
    role: 'Tenant · Nairobi',
  },
  {
    quote:
      'I list my apartments here and the tenants I get are serious. The verification process took two days but it keeps the tire kickers and scammers away.',
    name: 'Dennis K.',
    role: 'Property Manager · Kilimani',
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/properties${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  };

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-page">
        {/* Decorative blue halos (Google Material, no photo overlay) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-24 w-[30rem] h-[30rem] rounded-full bg-primary/10 blur-3xl hidden sm:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-40 -left-32 w-[24rem] h-[24rem] rounded-full bg-primary/5 blur-3xl hidden sm:block"
        />

        <div className="relative max-w-7xl mx-auto container-px pt-16 sm:pt-24 pb-16 sm:pb-24">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-6 animate-fade-up">
            The smarter way to find your next home.
          </p>

          <h1
            className="display text-fg font-bold text-4xl sm:text-6xl lg:text-[4.25rem] leading-[1.02] max-w-3xl animate-fade-up"
            style={{ animationDelay: '0.05s' }}
          >
            Find a place you can <span className="text-primary">trust.</span>
          </h1>

          <p
            className="text-fg/60 text-sm sm:text-lg mt-5 max-w-xl leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            Verified units from verified property managers across Kenya. Browse genuine homes, confirm
            availability, and connect directly with the people managing them.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mt-8 max-w-2xl bg-panel border border-line rounded-lg shadow-soft hover:shadow-lift p-2 flex items-center gap-2 animate-fade-up focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition"
            style={{ animationDelay: '0.15s' }}
          >
            <div className="flex-1 flex items-center gap-2 px-3">
              <SearchIcon size={18} className="text-fg/40 shrink-0" />
              <input
                type="text"
                aria-label="Search properties"
                placeholder="Search by estate, location, county, unit type…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-fg placeholder:text-fg/40 focus:outline-none py-2"
              />
            </div>
            <button type="submit" className="btn-primary !px-5 !py-2.5 shrink-0">
              <SearchIcon size={16} />
              Search
            </button>
          </form>

          {/* Trust chips */}
          <div
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-fg/60 animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="inline-flex items-center gap-1.5">
              <VerifiedIcon size={14} className="text-primary" />
              Verified property managers
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldIcon size={14} className="text-primary" />
              Scam checked listings
            </span>
            <span className="inline-flex items-center gap-1.5">
              <LockIcon size={14} className="text-primary" />
              Contact only for vacant, verified units
            </span>
          </div>

          {/* CTA buttons */}
          <div
            className="mt-8 flex flex-wrap items-center gap-3 animate-fade-up"
            style={{ animationDelay: '0.25s' }}
          >
            <Link to="/properties" className="btn-primary">
              Start browsing
              <ArrowForward size={16} />
            </Link>
            <Link to="/register" className="btn-outline">
              Register property
            </Link>
          </div>
        </div>
      </section>

      {/* ============ TRUST / HOW IT WORKS ============ */}
      <section id="trust" className="section-pad container-px max-w-7xl mx-auto scroll-mt-20">
        <Reveal>
          <SectionHeading
            kicker="Why NyumbaPlug"
            title="A better way to rent in Kenya."
            description="We make it easier to find genuine properties, deal with trusted managers, and avoid common scams."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {HOW_IT_WORKS.map(item => (
            <Reveal key={item.step} delay={0}>
              <div className="bg-panel border border-line rounded-2xl p-7 shadow-soft hover:shadow-lift transition-all hover:-translate-y-1 relative overflow-hidden group h-full">
                <span className="absolute -top-4 -right-2 display text-8xl text-fg/10 font-bold select-none">
                  {item.step}
                </span>
                <h3 className="display font-bold text-xl text-fg mb-3">{item.title}</h3>
                <p className="text-sm text-fg/60 leading-relaxed">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Stats band */}
        <Reveal delay={100}>
          <div className="mt-10 bg-panel border border-line rounded-2xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: 'Verified managers', label: 'Trusted property managers on the platform' },
              { value: '47', label: 'Counties covered' },
              { value: 'Verified listings', label: 'Properties reviewed before publishing' },
              { value: '24h', label: 'Average verification turnaround' },
            ].map((s, i) => (
              <div key={i} className="text-fg">
                <div className="display font-bold text-2xl">{s.value}</div>
                <div className="text-[11px] text-fg/50 uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-16 sm:py-24 bg-page">
        <div className="max-w-7xl mx-auto container-px">
          <Reveal>
            <SectionHeading
              kicker="Real stories"
              title="Trusted by tenants & property managers"
              align="center"
            />
          </Reveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 150}>
                <figure className="bg-panel border border-line rounded-2xl p-7 hover:border-primary/40 transition-colors h-full">
                  <div className="flex items-center gap-1 text-primary mb-4">
                    {[...Array(5)].map((_, s) => (
                      <StarIcon key={s} size={14} filled />
                    ))}
                  </div>
                  <QuoteIcon size={20} className="text-primary/40 mb-3" />
                  <blockquote className="text-sm text-fg/85 leading-relaxed">{t.quote}</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-fg">{t.name}</div>
                      <div className="text-[11px] text-fg/50">{t.role}</div>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="section-pad container-px max-w-7xl mx-auto">
        <Reveal direction="zoom">
          <div className="rounded-2xl border border-line bg-panel p-10 sm:p-16 text-center">
            <div className="relative">
              <h2 className="display text-3xl sm:text-5xl font-bold text-fg leading-[1.1] max-w-2xl mx-auto">
                Your next home is verified and waiting.
              </h2>
              <p className="text-fg/60 text-sm sm:text-base mt-4 max-w-xl mx-auto">
                Search thousands of scam-checked rentals from ID-verified property managers across Kenya.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/properties" className="btn-primary">
                  Start browsing
                  <ArrowForward size={16} />
                </Link>
                <Link to="/register" className="btn-outline">
                  List your property
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
};
