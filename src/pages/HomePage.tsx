import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShieldCheck,
  BadgeCheck,
  AlertTriangle,
  PhoneCall,
  ArrowRight,
  Building2,
  Users,
  Quote,
  Star,
} from 'lucide-react';
import { Property } from '../types';
import { api } from '../services/api';
import { PropertyCard } from '../components/tenant/PropertyCard';
import { SectionHeading } from '../components/common/SectionHeading';
import { Reveal } from '../components/common/Reveal';

const HERO_IMG =
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop';
const MANAGER_IMG =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop';

const COUNTIES = [
  { name: 'Nairobi', tag: 'Kilimani · Westlands · Ruaka', img: 'https://images.unsplash.com/photo-1570168007204-dfb528e6958d?q=80&w=800&auto=format&fit=crop' },
  { name: 'Mombasa', tag: 'Nyali · Bamburi · Tudor', img: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=800&auto=format&fit=crop' },
  { name: 'Kisumu', tag: 'Milimani · Kibos', img: 'https://images.unsplash.com/photo-1506280754576-f6fa8a873550?q=80&w=800&auto=format&fit=crop' },
  { name: 'Nakuru', tag: 'Section 58 · Milimani', img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800&auto=format&fit=crop' },
];

const HOW_IT_WORKS = [
  {
    icon: <BadgeCheck size={22} />,
    step: '01',
    title: 'Property managers are ID-verified',
    body: 'Every property manager submits their national ID and is manually checked by our team before they can list a single property.',
  },
  {
    icon: <ShieldCheck size={22} />,
    step: '02',
    title: 'Listings are scam-checked',
    body: 'We cross-check prices and photos against market reality, and flag anything that looks too good to be true.',
  },
  {
    icon: <PhoneCall size={22} />,
    step: '03',
    title: 'Contact is only revealed for real units',
    body: 'Property manager phone numbers are shown only when a unit is vacant and the listing is verified — no ghost apartments.',
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
  const [featured, setFeatured] = useState<Property[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const featuredRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api
      .getProperties({})
      .then(setFeatured)
      .catch(() => setFeatured([]))
      .finally(() => setFeaturedLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/properties${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  };

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-nyumba-ink">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Kenyan apartments" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-nyumba-ink via-nyumba-ink/85 to-nyumba-navy/60" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-nyumba-ink to-transparent" />
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 w-full pt-24 pb-20">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-6 animate-fade-up">


            The smarter way to find your next home.
          </p>


          <h1 className="display text-white font-bold text-4xl sm:text-6xl lg:text-[4.25rem] leading-[1.02] max-w-3xl animate-fade-up" style={{ animationDelay: '0.05s' }}>
            Find a place you can trust.
          </h1>

          <p className="text-white/70 text-sm sm:text-lg mt-5 max-w-xl leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Verified units from verified property managers across Kenya. Browse genuine homes, confirm
            availability, and connect directly with the people managing them.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mt-8 max-w-2xl bg-white rounded-2xl shadow-lift p-2 flex items-center gap-2 animate-fade-up"
            style={{ animationDelay: '0.15s' }}
          >
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search size={18} className="text-nyumba-ink/40 shrink-0" />
              <input
                type="text"
                placeholder="Search by estate, location, county, unit type…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-nyumba-ink placeholder:text-nyumba-ink/40 focus:outline-none py-2"
              />
            </div>
            <button type="submit" className="btn-primary !px-5 !py-2.5 shrink-0">
              <Search size={16} />
              Search
            </button>
          </form>

          {/* Trust chips */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-white/70 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <span>Verified property managers</span>
            <span>Scam checked listings</span>
            <span>
              Contact only for vacant, verified units
            </span>
          </div>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3 animate-fade-up" style={{ animationDelay: '0.25s' }}>
            <Link
              to="/properties"
              className="inline-flex items-centThe smarter way to find your next home.er gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-sm px-7 py-3.5 rounded-full transition shadow-glow"
            >
              Start browsing
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/25 text-white hover:bg-white/20 font-semibold text-sm px-7 py-3.5 rounded-full transition"
            >
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
            title="Renting in Kenya shouldn't be a gamble"
            description="We built verification into the platform itself, so trust isn't a promise — it's the product."
            light
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {HOW_IT_WORKS.map(item => (
            <Reveal key={item.step} delay={0}>
              <div className="bg-panel border border-line rounded-3xl p-6 shadow-soft hover:shadow-lift transition-all hover:-translate-y-1 relative overflow-hidden group h-full">
                <span className="absolute -top-4 -right-2 display text-8xl text-fg/10 font-bold select-none">
                  {item.step}
                </span>
                <div className="bg-primary text-white p-3 rounded-2xl inline-flex mb-4 relative transition-colors group-hover:bg-primary-light group-hover:text-primary-dark">
                  {item.icon}
                </div>
                <h3 className="display font-bold text-lg text-fg mb-2">{item.title}</h3>
                <p className="text-xs text-fg/60 leading-relaxed">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Stats band */}
        <Reveal delay={100}>
          <div className="mt-10 bg-panel border border-line rounded-3xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <ShieldCheck size={18} />, value: '100%', label: 'Property managers ID-verified' },
              { icon: <Building2 size={18} />, value: '47', label: 'Counties covered' },
              { icon: <AlertTriangle size={18} />, value: '0', label: 'Ghost apartments' },
              { icon: <Users size={18} />, value: '24h', label: 'Verification turn-around' },
            ].map((s, i) => (
              <div key={i} className="text-fg">
                <div className="text-primary flex justify-center mb-2">{s.icon}</div>
                <div className="display font-bold text-2xl">{s.value}</div>
                <div className="text-[11px] text-fg/50 uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ============ FEATURED LISTINGS ============ */}
      <section className="section-pad container-px max-w-7xl mx-auto pt-0">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <Reveal>
            <SectionHeading
              kicker="Featured"
              title="Recently verified rentals"
              description="Fresh, scam-checked listings from verified property managers across Kenya."
              light
            />
          </Reveal>
          <Reveal delay={150}>
            <Link to="/properties" className="btn-outline shrink-0 !py-2.5">
              View all rentals
              <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>

        <div ref={featuredRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredLoading
            ? [1, 2, 3].map(n => (
                <div key={n} className="bg-panel-strong h-[360px] rounded-3xl animate-pulse border border-line" />
              ))
            : featured.slice(0, 3).map((p, i) => (
                <Reveal key={p.id} delay={i * 120} className="h-full">
                  <PropertyCard property={p} />
                </Reveal>
              ))}
        </div>
        {!featuredLoading && featured.length === 0 && (
          <div className="text-center py-16 bg-panel rounded-3xl border border-line">
            <ShieldCheck size={32} className="text-primary mx-auto mb-3" />
            <p className="text-fg/80 font-medium text-sm">No verified listings yet.</p>
            <p className="text-xs text-fg/50 mt-1">New verified rentals appear here as property managers get approved.</p>
          </div>
        )}
      </section>

      {/* ============ BROWSE BY COUNTY ============ */}
      <section className="section-pad container-px max-w-7xl mx-auto">
        <Reveal>
          <SectionHeading
            kicker="Explore"
            title="Browse by county"
            align="center"
            light
          />
        </Reveal>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {COUNTIES.map((c, i) => (
            <Reveal key={c.name} delay={i * 100}>
              <Link
                to={`/properties?county=${encodeURIComponent(c.name)}`}
                className="group relative h-56 rounded-3xl overflow-hidden shadow-soft hover:shadow-lift transition-all block"
              >
                <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-0 inset-x-0 p-4 text-fg">
                  <h3 className="display font-bold text-xl">{c.name}</h3>
                  <p className="text-[11px] text-fg/60 mt-0.5">{c.tag}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ AGENT CTA ============ */}
      <section id="managers" className="max-w-7xl mx-auto container-px section-pad scroll-mt-20">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-lift border border-line bg-panel">
            <div className="relative min-h-[280px] overflow-hidden">
              <img src={MANAGER_IMG} alt="Property manager" className="absolute inset-0 w-full h-full object-cover opacity-40" />
              <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-primary/20 blur-[120px]" />
            </div>
            <div className="bg-panel p-8 sm:p-12 flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
                For property managers & landlords
              </p>
              <h2 className="display text-3xl sm:text-4xl leading-[1.1] text-fg font-bold">
                List your property. Attract serious tenants.
              </h2>
              <p className="mt-4 text-sm text-fg/60 leading-relaxed">
                Become a verified NyumbaPlug property manager. Get your ID checked once, then list unlimited
                properties and receive enquiries from tenants who know they're talking to a real landlord.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-fg/70">
                {['One-time government ID verification', 'Unlimited listings & unit management', 'Direct tenant enquiries, no middlemen'].map(t => (
                  <li key={t} className="flex items-center gap-2">
                    <BadgeCheck size={16} className="text-primary shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register" className="btn-primary">
                  Register property
                  <ArrowRight size={16} />
                </Link>
                <Link to="/#trust" className="btn-outline">
                  How verification works
                </Link>
              </div>
            </div>
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
              light
              align="center"
            />
          </Reveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 150}>
                <figure className="bg-panel border border-line rounded-3xl p-7 hover:border-primary/40 transition-colors h-full">
                  <div className="flex items-center gap-1 text-primary mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <Quote size={20} className="text-primary/40 mb-3" />
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
          <div className="rounded-3xl border border-line bg-panel p-10 sm:p-16 text-center">
            <div className="relative">
              <h2 className="display text-3xl sm:text-5xl font-bold text-fg leading-[1.1] max-w-2xl mx-auto">
                Your next home is verified and waiting.
              </h2>
              <p className="text-fg/60 text-sm sm:text-base mt-4 max-w-xl mx-auto">
                Search thousands of scam-checked rentals from ID-verified property managers across Kenya.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 text-sm font-bold rounded-full bg-primary text-white hover:bg-primary-dark px-7 py-3 transition shadow-glow"
                >
                  Start browsing
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 text-sm font-semibold rounded-full border border-white/40 text-fg hover:bg-panel-strong px-7 py-3 transition"
                >
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
