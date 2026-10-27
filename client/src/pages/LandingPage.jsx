// ============================================
// Landing Page
// ============================================
// The first page visitors see. It needs to:
// 1. Instantly communicate what BlogAI does
// 2. Look stunning and professional
// 3. Convince visitors to sign up
//
// Sections:
// - Hero (main headline + CTA)
// - Features (what the product offers)
// - How It Works (step-by-step)
// - Pricing (free tier info)
// - Final CTA
// ============================================

import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { Link } from 'react-router-dom';
import {
  HiOutlineSparkles,
  HiOutlineBuildingOffice2,
  HiOutlinePencilSquare,
  HiOutlineCpuChip,
  HiOutlineDocumentCheck,
  HiOutlineArrowPath,
  HiOutlineShieldCheck,
  HiOutlineCloudArrowDown,
  HiOutlineBolt,
  HiOutlineUserPlus,
  HiOutlineClipboardDocumentList,
  HiOutlineRocketLaunch,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
} from 'react-icons/hi2';

// ============================================
// Features Data
// ============================================
const features = [
  {
    icon: HiOutlineBuildingOffice2,
    title: 'Smart Business Profiles',
    description: 'Save your business info once — industry, audience, brand voice. Our AI uses it every time so your blogs always sound like you.',
    color: 'from-primary-500 to-primary-600',
    glow: 'primary-500',
  },
  {
    icon: HiOutlineCpuChip,
    title: 'Self-Learning AI Agent',
    description: 'Our custom AI agent gets smarter with every article. It learns what works for your industry and optimizes over time.',
    color: 'from-accent-violet to-primary-500',
    glow: 'accent-violet',
  },
  {
    icon: HiOutlineDocumentCheck,
    title: 'Quality Guaranteed',
    description: 'Every article is validated for length (5,000–6,000 characters), structure, and readability before you see it.',
    color: 'from-accent-emerald to-accent-cyan',
    glow: 'accent-emerald',
  },
  {
    icon: HiOutlinePencilSquare,
    title: 'Edit & Customize',
    description: 'Preview your article, make edits, and fine-tune the content. It\'s a draft — you have full control.',
    color: 'from-accent-cyan to-primary-400',
    glow: 'accent-cyan',
  },
  {
    icon: HiOutlineArrowPath,
    title: 'Regenerate Anytime',
    description: 'Not happy? Regenerate with different settings. Our token-optimized engine keeps costs low even with retries.',
    color: 'from-accent-amber to-accent-rose',
    glow: 'accent-amber',
  },
  {
    icon: HiOutlineCloudArrowDown,
    title: 'Save & Export',
    description: 'All articles are saved to your account. Export as Markdown anytime. Your content, your control.',
    color: 'from-accent-rose to-accent-violet',
    glow: 'accent-rose',
  },
];

// ============================================
// How It Works Steps
// ============================================
const steps = [
  {
    step: '01',
    icon: HiOutlineUserPlus,
    title: 'Create Your Account',
    description: 'Sign up in seconds with your email. No credit card required.',
  },
  {
    step: '02',
    icon: HiOutlineBuildingOffice2,
    title: 'Set Up Your Profile',
    description: 'Tell us about your business, audience, and brand voice. You only do this once.',
  },
  {
    step: '03',
    icon: HiOutlineClipboardDocumentList,
    title: 'Choose Your Blog Settings',
    description: 'Enter a topic, pick a category, set the tone. Our AI handles the rest.',
  },
  {
    step: '04',
    icon: HiOutlineRocketLaunch,
    title: 'Generate & Publish',
    description: 'Get a polished 5,000+ character article in seconds. Edit, save, or export.',
  },
];

// ============================================
// Landing Page Component
// ============================================
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-surface-950 relative overflow-hidden">
      <Navbar />

      {/* ==========================================
          HERO SECTION
          ========================================== */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-grid" />
        <div className="orb w-[600px] h-[600px] bg-primary-500 -top-48 -right-48" />
        <div className="orb w-[400px] h-[400px] bg-accent-violet -bottom-32 -left-32" />
        <div className="orb w-[300px] h-[300px] bg-accent-cyan top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 
                        rounded-full text-primary-300 text-sm font-medium mb-8 animate-fade-in">
            <HiOutlineSparkles className="w-4 h-4" />
            <span>AI-Powered Blog Generation</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight 
                       text-white leading-[1.1] mb-6 animate-slide-up">
            Create Blog Articles
            <br />
            <span className="text-gradient">That Sound Like You</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up stagger-1"
             style={{ animationFillMode: 'both' }}>
            Save your business profile once. Generate professional, on-brand blog articles
            in seconds. Our AI agent learns your style and gets smarter over time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2"
               style={{ animationFillMode: 'both' }}>
            <Link to="/register" className="btn-primary text-base !px-8 !py-4 group flex items-center gap-2">
              Start Writing for Free
              <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#how-it-works" className="btn-secondary text-base !px-8 !py-4">
              See How It Works
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 
                        text-sm text-surface-500 animate-fade-in stagger-3"
               style={{ animationFillMode: 'both' }}>
            <div className="flex items-center gap-2">
              <HiOutlineCheckCircle className="w-5 h-5 text-accent-emerald" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineShieldCheck className="w-5 h-5 text-accent-emerald" />
              <span>Your data stays private</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineBolt className="w-5 h-5 text-accent-emerald" />
              <span>Articles in under 60 seconds</span>
            </div>
          </div>

          {/* Hero visual - Article preview mockup */}
          <div className="mt-16 lg:mt-20 max-w-4xl mx-auto animate-slide-up stagger-4"
               style={{ animationFillMode: 'both' }}>
            <div className="glass-card p-1 relative">
              <div className="absolute -inset-px bg-gradient-to-r from-primary-500/30 via-accent-violet/30 to-accent-cyan/30 
                            rounded-2xl blur-sm" />
              <div className="relative bg-surface-900 rounded-2xl overflow-hidden">
                {/* Mock browser header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-surface-800/80 border-b border-surface-700/50">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-accent-rose/60" />
                    <div className="w-3 h-3 rounded-full bg-accent-amber/60" />
                    <div className="w-3 h-3 rounded-full bg-accent-emerald/60" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-surface-700/50 rounded-md px-3 py-1.5 text-xs text-surface-400 text-center max-w-xs mx-auto">
                      app.blogai.com/generate
                    </div>
                  </div>
                </div>
                {/* Mock content */}
                <div className="p-6 lg:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Form */}
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-surface-500 mb-1.5">Topic</div>
                        <div className="bg-surface-800 rounded-lg px-3 py-2.5 text-sm text-surface-200 border border-surface-700">
                          10 Ways AI Is Transforming Small Businesses in 2027
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-surface-500 mb-1.5">Category</div>
                          <div className="bg-surface-800 rounded-lg px-3 py-2.5 text-sm text-primary-400 border border-primary-500/30">
                            Industry Insights
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-surface-500 mb-1.5">Tone</div>
                          <div className="bg-surface-800 rounded-lg px-3 py-2.5 text-sm text-surface-200 border border-surface-700">
                            Professional
                          </div>
                        </div>
                      </div>
                      <button className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm 
                                       font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2">
                        <HiOutlineSparkles className="w-4 h-4" />
                        Generate Article
                      </button>
                    </div>
                    {/* Right: Generated preview */}
                    <div className="bg-surface-800/50 rounded-xl p-4 border border-surface-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-accent-emerald">✓ Generated · 5,420 characters</span>
                        <span className="text-xs text-surface-500">2.3s</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-5 bg-surface-700/60 rounded w-3/4" />
                        <div className="h-3 bg-surface-700/40 rounded w-full" />
                        <div className="h-3 bg-surface-700/40 rounded w-5/6" />
                        <div className="h-3 bg-surface-700/40 rounded w-full" />
                        <div className="h-4 bg-surface-700/60 rounded w-1/2 mt-4" />
                        <div className="h-3 bg-surface-700/40 rounded w-full" />
                        <div className="h-3 bg-surface-700/40 rounded w-4/5" />
                        <div className="h-3 bg-surface-700/40 rounded w-full" />
                        <div className="h-3 bg-surface-700/40 rounded w-3/4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          FEATURES SECTION
          ========================================== */}
      <section id="features" className="relative py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16 lg:mb-20">
            <span className="inline-block text-sm font-semibold text-primary-400 tracking-wider uppercase mb-3">
              Features
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Everything You Need to
              <span className="text-gradient"> Create Great Content</span>
            </h2>
            <p className="text-surface-400 text-lg max-w-2xl mx-auto">
              From smart profiles to self-learning AI, we've built every feature to save you time and produce better articles.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 lg:p-8 group hover:border-surface-600/50 transition-all duration-300
                         hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} 
                              flex items-center justify-center mb-5
                              group-hover:shadow-lg group-hover:shadow-${feature.glow}/20 transition-shadow duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-surface-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          HOW IT WORKS SECTION
          ========================================== */}
      <section id="how-it-works" className="relative py-24 lg:py-32 bg-surface-900/30">
        {/* Background decoration */}
        <div className="orb w-[500px] h-[500px] bg-primary-500 -right-64 top-1/2 -translate-y-1/2 opacity-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16 lg:mb-20">
            <span className="inline-block text-sm font-semibold text-accent-cyan tracking-wider uppercase mb-3">
              How It Works
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              From Idea to Article
              <span className="text-gradient"> in 4 Simple Steps</span>
            </h2>
            <p className="text-surface-400 text-lg max-w-2xl mx-auto">
              No complicated setup. No writing expertise needed. Just tell us about your business and start generating.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Connector line (not on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[calc(100%+1px)] w-full h-px 
                                bg-gradient-to-r from-surface-600/50 to-transparent z-0" />
                )}

                <div className="glass-card p-6 relative z-10 h-full">
                  {/* Step number */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-display font-bold text-gradient opacity-60">
                      {step.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 
                                  flex items-center justify-center
                                  group-hover:bg-primary-500/20 transition-colors duration-300">
                      <step.icon className="w-5 h-5 text-primary-400" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-surface-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          PRICING SECTION
          ========================================== */}
      <section id="pricing" className="relative py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-accent-emerald tracking-wider uppercase mb-3">
              Pricing
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Start Free.
              <span className="text-gradient"> Scale When You're Ready.</span>
            </h2>
            <p className="text-surface-400 text-lg max-w-2xl mx-auto">
              No credit card needed. Generate your first articles today.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="glass-card p-8">
              <h3 className="text-lg font-semibold text-surface-300 mb-1">Free</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-display font-bold text-white">$0</span>
                <span className="text-surface-500">/forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  '10 articles per day',
                  '1 business profile',
                  'All blog categories',
                  'All tone options',
                  'Markdown export',
                  'Article history',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-surface-300">
                    <HiOutlineCheckCircle className="w-5 h-5 text-accent-emerald flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-secondary w-full text-center block">
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="relative glass-card p-8 border-primary-500/30">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-primary-600 to-primary-500 
                            rounded-full text-xs font-semibold text-white">
                Coming Soon
              </div>
              <h3 className="text-lg font-semibold text-primary-300 mb-1">Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-display font-bold text-white">$19</span>
                <span className="text-surface-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  '100 articles per day',
                  'Unlimited profiles',
                  'SEO optimization',
                  'Priority AI models',
                  'Multiple export formats',
                  'Article versioning',
                  'API access',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-surface-300">
                    <HiOutlineCheckCircle className="w-5 h-5 text-primary-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="btn-primary w-full opacity-60 cursor-not-allowed" disabled>
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          FINAL CTA SECTION
          ========================================== */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-primary-950/20 to-surface-950" />
        <div className="orb w-[600px] h-[600px] bg-primary-500 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Create Content
            <br />
            <span className="text-gradient">That Actually Sounds Like You?</span>
          </h2>
          <p className="text-surface-400 text-lg mb-10 max-w-xl mx-auto">
            Join BlogAI today. Set up your profile in 2 minutes, and generate your first article for free.
          </p>
          <Link to="/register" className="btn-primary text-base !px-10 !py-4 group inline-flex items-center gap-2">
            Create Your Free Account
            <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
