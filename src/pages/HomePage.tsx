import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
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

const HERO_IMG =
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop';
const MANAGER_IMG =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop';
const TRUST_IMG =
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1600&auto=format&fit=crop';

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
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Kenyan apartments" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-nyumba-navy/85 via-nyumba-navy/60 to-nyumba-navy/20" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-nyumba-cream/0 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 w-full pt-24 pb-20">
          <p className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-6 animate-fade-up">
            <ShieldCheck size={13} className="text-nyumba-emerald" />
            No scams. No ghost apartments.
          </p>

          <h1 className="display text-white font-semibold text-4xl sm:text-6xl lg:text-[4.25rem] leading-[1.05] max-w-3xl animate-fade-up" style={{ animationDelay: '0.05s' }}>
            Find your verified home in Kenya.
          </h1>

          <p className="text-white/80 text-sm sm:text-lg mt-5 max-w-xl leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Every listing on NyumbaPlug is linked to a government ID-verified property manager. Browse
            thousands of real rentals — and only ever reach out to a genuine landlord.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mt-8 max-w-2xl bg-white rounded-2xl shadow-lift p-2 flex items-center gap-2 animate-fade-up"
            style={{ animationDelay: '0.15s' }}
          >
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by estate, location, county, unit type…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none py-2 text-slate-800"
              />
            </div>
            <button type="submit" className="btn-primary !px-5 !py-2.5 shrink-0">
              <Search size={16} />
              Search
            </button>
          </form>

          {/* Trust chips */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-white/80 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <span className="flex items-center gap-1.5"><BadgeCheck size={14} className="text-nyumba-emerald" /> ID-verified property managers</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-nyumba-emerald" /> Scam-checked listings</span>
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-nyumba-emerald" /> Contact only for vacant, verified units</span>
          </div>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3 animate-fade-up" style={{ animationDelay: '0.25s' }}>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 bg-nyumba-emerald hover:bg-nyumba-emeraldDark text-white font-bold text-sm px-7 py-3.5 rounded-full transition shadow-lift"
            >
              Start browsing
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/30 text-white hover:bg-white/20 font-semibold text-sm px-7 py-3.5 rounded-full transition"
            >
              Register property
            </Link>
          </div>
        </div>
      </section>

      {/* ============ TRUST / HOW IT WORKS ============ */}
      <section id="trust" className="section-pad container-px max-w-7xl mx-auto scroll-mt-20">
        <SectionHeading
          kicker="Why NyumbaPlug"
          title="Renting in Kenya shouldn't be a gamble"
          description="We built verification into the platform itself, so trust isn't a promise — it's the product."
        />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {HOW_IT_WORKS.map(item => (
            <div
              key={item.step}
              className="bg-white rounded-2xl border border-nyumba-line p-6 shadow-soft hover:shadow-lift transition relative overflow-hidden"
            >
              <span className="absolute -top-4 -right-2 display text-8xl text-nyumba-sand font-bold select-none">
                {item.step}
              </span>
              <div className="bg-nyumba-emeraldLight text-nyumba-emerald p-3 rounded-xl inline-flex mb-4 relative">
                {item.icon}
              </div>
              <h3 className="display font-semibold text-lg text-nyumba-ink mb-2">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        {/* Stats band */}
        <div className="mt-10 bg-nyumba-navy rounded-2xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: <ShieldCheck size={18} />, value: '100%', label: 'Property managers ID-verified' },
            { icon: <Building2 size={18} />, value: '47', label: 'Counties covered' },
            { icon: <AlertTriangle size={18} />, value: '0', label: 'Ghost apartments' },
            { icon: <Users size={18} />, value: '24h', label: 'Verification turn-around' },
          ].map((s, i) => (
            <div key={i} className="text-white">
              <div className="text-nyumba-emerald flex justify-center mb-2">{s.icon}</div>
              <div className="display font-bold text-2xl">{s.value}</div>
              <div className="text-[11px] text-white/60 uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FEATURED LISTINGS ============ */}
      <section className="section-pad container-px max-w-7xl mx-auto pt-0">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <SectionHeading
            kicker="Featured"
            title="Recently verified rentals"
            description="Fresh, scam-checked listings from verified property managers across Kenya."
          />
          <Link to="/properties" className="btn-outline shrink-0 !py-2.5">
            View all rentals
            <ArrowRight size={16} />
          </Link>
        </div>

        <div ref={featuredRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredLoading
            ? [1, 2, 3].map(n => (
                <div key={n} className="bg-white h-[360px] rounded-2xl animate-pulse border border-nyumba-line" />
              ))
            : featured.slice(0, 3).map(p => (
                <PropertyCard key={p.id} property={p} />
              ))}
        </div>
        {!featuredLoading && featured.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-nyumba-line">
            <ShieldCheck size={32} className="text-nyumba-emerald mx-auto mb-3" />
            <p className="text-slate-600 font-medium text-sm">No verified listings yet.</p>
            <p className="text-xs text-slate-400 mt-1">New verified rentals appear here as property managers get approved.</p>
          </div>
        )}
      </section>

      {/* ============ BROWSE BY COUNTY ============ */}
      <section className="py-16 sm:py-20 bg-nyumba-sand">
        <div className="max-w-7xl mx-auto container-px">
          <SectionHeading
            kicker="Explore"
            title="Browse by county"
            align="center"
          />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COUNTIES.map(c => (
              <Link
                key={c.name}
                to={`/properties?county=${encodeURIComponent(c.name)}`}
                className="group relative h-56 rounded-2xl overflow-hidden shadow-soft hover:shadow-lift transition"
              >
                <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-nyumba-navy/80 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                  <h3 className="display font-semibold text-xl">{c.name}</h3>
                  <p className="text-[11px] text-white/70 mt-0.5">{c.tag}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AGENT CTA ============ */}
      <section id="managers" className="max-w-7xl mx-auto container-px section-pad scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-lift border border-nyumba-line">
          <div className="relative min-h-[280px]">
            <img src={MANAGER_IMG} alt="Property manager" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="bg-white p-8 sm:p-12 flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-nyumba-terracotta mb-3">
              For property managers & landlords
            </p>
            <h2 className="display text-3xl sm:text-4xl leading-[1.1] text-nyumba-ink">
              List your property. Attract serious tenants.
            </h2>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed">
              Become a verified NyumbaPlug property manager. Get your ID checked once, then list unlimited
              properties and receive enquiries from tenants who know they're talking to a real landlord.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-slate-600">
              {['One-time government ID verification', 'Unlimited listings & unit management', 'Direct tenant enquiries, no middlemen'].map(t => (
                <li key={t} className="flex items-center gap-2">
                  <BadgeCheck size={16} className="text-nyumba-emerald shrink-0" />
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
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-16 sm:py-24 bg-nyumba-navy">
        <div className="max-w-7xl mx-auto container-px">
          <SectionHeading
            kicker="Real stories"
            title="Trusted by tenants & property managers"
            light
            align="center"
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map(t => (
              <figure key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-7">
                <div className="flex items-center gap-1 text-nyumba-emerald mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <Quote size={20} className="text-nyumba-emerald/40 mb-3" />
                <blockquote className="text-sm text-white/85 leading-relaxed">{t.quote}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-nyumba-emerald flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-[11px] text-white/50">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="section-pad container-px max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-nyumba-emerald p-10 sm:p-16 text-center">
          <div className="absolute inset-0 opacity-10">
            <img src={TRUST_IMG} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative">
            <h2 className="display text-3xl sm:text-5xl font-semibold text-white leading-[1.1] max-w-2xl mx-auto">
              Your next home is verified and waiting.
            </h2>
            <p className="text-white/80 text-sm sm:text-base mt-4 max-w-xl mx-auto">
              Search thousands of scam-checked rentals from ID-verified property managers across Kenya.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 text-sm font-bold rounded-full bg-white text-nyumba-emerald hover:bg-slate-50 px-7 py-3 transition"
              >
                Start browsing
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-sm font-semibold rounded-full border border-white/40 text-white hover:bg-white/10 px-7 py-3 transition"
              >
                List your property
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
