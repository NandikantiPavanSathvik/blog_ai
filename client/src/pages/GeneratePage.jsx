// ============================================
// AI Blog Generator Page (Protected)
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';
import {
  HiOutlineSparkles,
  HiOutlineArrowLeft,
  HiOutlineClipboardDocument,
  HiOutlineCheck,
  HiOutlineExclamationCircle,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineTag,
} from 'react-icons/hi2';

const CATEGORIES = [
  'How-To / Tutorial',
  'Industry Insights',
  'Product Showcase',
  'Company News',
  'Tips & Best Practices',
  'Listicle (Top 10 / Best of)',
];

const TONES = [
  'Conversational & Friendly',
  'Professional & Authoritative',
  'Educational & Instructive',
  'Bold & Persuasive',
  'Inspirational & Uplifting',
];

const PIPELINE_STEPS = [
  'Loading your business profile...',
  'Analyzing topic and structuring outline...',
  'Generating in-depth article with AI...',
  'Validating character count (5,000–6,000 target)...',
  'Finalizing formatting and SEO metadata...',
];

const GeneratePage = () => {
  const [profile, setProfile] = useState(null);
  const [topic, setTopic] = useState('');
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState('');
  const [category, setCategory] = useState('Industry Insights');
  const [tone, setTone] = useState('Conversational & Friendly');
  const [provider, setProvider] = useState('groq');

  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedMetaTitle, setCopiedMetaTitle] = useState(false);
  const [copiedMetaDesc, setCopiedMetaDesc] = useState(false);

  // Fetch business profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (res.data.success && res.data.profile) {
          setProfile(res.data.profile);
          if (res.data.profile.brandVoice) {
            setTone(res.data.profile.brandVoice);
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };
    fetchProfile();
  }, []);

  // Progress animation while generating
  useEffect(() => {
    let interval;
    if (loading) {
      setStepIndex(0);
      interval = setInterval(() => {
        setStepIndex((prev) => (prev < PIPELINE_STEPS.length - 1 ? prev + 1 : prev));
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please provide a topic or headline');
      return;
    }

    setError('');
    setLoading(true);
    setArticle(null);

    try {
      const res = await api.post('/articles/generate', {
        topic,
        category,
        tone,
        primaryKeyword,
        secondaryKeywords,
        provider,
      });

      if (res.data.success) {
        setArticle(res.data.article);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to generate article. Please check your AI API key or retry.'
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (article?.contentMarkdown) {
      navigator.clipboard.writeText(article.contentMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 text-surface-100 pb-20">
      {/* Top Header */}
      <header className="bg-surface-900/80 backdrop-blur-xl border-b border-surface-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-surface-400 hover:text-white transition-colors text-sm font-medium"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-lg flex items-center justify-center">
              <HiOutlineSparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-white text-sm">
              Blog<span className="text-gradient">AI</span> Generator
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Settings (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 border-surface-700/60">
              <h2 className="text-xl font-display font-bold text-white mb-1 flex items-center gap-2">
                <HiOutlineSparkles className="w-5 h-5 text-primary-400" />
                <span>Create Blog Article</span>
              </h2>
              <p className="text-xs text-surface-400 mb-6">
                {profile ? (
                  <span>Using profile: <strong className="text-primary-300">{profile.businessName}</strong></span>
                ) : (
                  <span>No profile saved. <Link to="/profile" className="text-primary-400 underline">Set it up now</Link> for tailored articles.</span>
                )}
              </p>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-accent-rose/10 border border-accent-rose/20 text-accent-rose text-xs flex items-center gap-2">
                  <HiOutlineExclamationCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="input-label" htmlFor="topic">
                    Article Topic or Title Idea *
                  </label>
                  <textarea
                    id="topic"
                    rows={3}
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. 10 Essential Cybersecurity Habits Every Remote Medical Clinic Must Adopt"
                    className="input-field text-sm"
                  />
                </div>

                {/* SEO Target Keywords (For Content Creators & Marketers) */}
                <div className="p-4 rounded-xl border border-primary-500/30 bg-primary-500/5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary-300">
                    <HiOutlineMagnifyingGlass className="w-4 h-4 text-primary-400" />
                    <span>SEO Optimization Targets</span>
                  </div>

                  <div>
                    <label className="input-label !text-xs" htmlFor="primaryKeyword">
                      Primary Target Keyword
                    </label>
                    <input
                      id="primaryKeyword"
                      type="text"
                      value={primaryKeyword}
                      onChange={(e) => setPrimaryKeyword(e.target.value)}
                      placeholder="e.g. medical cybersecurity habits"
                      className="input-field text-xs !py-2"
                    />
                    <p className="text-[11px] text-surface-400 mt-1">
                      Woven strategically into H1 title, opening intro, and key subheadings.
                    </p>
                  </div>

                  <div>
                    <label className="input-label !text-xs" htmlFor="secondaryKeywords">
                      Secondary Keywords (Optional, comma-separated)
                    </label>
                    <input
                      id="secondaryKeywords"
                      type="text"
                      value={secondaryKeywords}
                      onChange={(e) => setSecondaryKeywords(e.target.value)}
                      placeholder="e.g. HIPAA compliance, clinic data security, ransomware prevention"
                      className="input-field text-xs !py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label" htmlFor="category">
                    Blog Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-field text-sm"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-surface-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="input-label" htmlFor="tone">
                    Writing Tone
                  </label>
                  <select
                    id="tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="input-field text-sm"
                  >
                    {TONES.map((t) => (
                      <option key={t} value={t} className="bg-surface-900 text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="input-label">AI Engine</label>
                  <div className="p-3.5 rounded-xl border border-primary-500/40 bg-primary-500/10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">Groq AI</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-accent-emerald/20 text-accent-emerald">
                          Free & Unlimited
                        </span>
                      </div>
                      <p className="text-xs text-surface-400 mt-0.5">
                        Llama 3.3 70B Versatile · High-speed long-form generation
                      </p>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-emerald animate-pulse" />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5 text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>AI Agent is Working...</span>
                      </>
                    ) : (
                      <>
                        <HiOutlineSparkles className="w-4 h-4" />
                        <span>Generate 5,000+ Char Article</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Target length info box */}
            <div className="glass-card p-4 text-xs text-surface-400 flex items-center gap-3">
              <HiOutlineClock className="w-5 h-5 text-accent-cyan flex-shrink-0" />
              <span>
                Our agent targets <strong>5,000–6,000 characters</strong> (~1,000 words). If under target, the expansion loop automatically enhances the draft.
              </span>
            </div>
          </div>

          {/* Right Column: Output / Live Progress (7 cols) */}
          <div className="lg:col-span-7">
            {loading ? (
              <div className="glass-card p-10 flex flex-col items-center justify-center min-h-[480px] text-center border-primary-500/30">
                <div className="w-16 h-16 relative flex items-center justify-center mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
                  <HiOutlineSparkles className="w-7 h-7 text-primary-400 animate-pulse" />
                </div>
                <h3 className="text-lg font-display font-semibold text-white mb-2">
                  {PIPELINE_STEPS[stepIndex]}
                </h3>
                <p className="text-xs text-surface-400 max-w-sm mb-6">
                  The AI is researching, writing, and measuring character counts against your business profile.
                </p>
                <div className="w-64 bg-surface-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-accent-cyan h-full transition-all duration-500"
                    style={{ width: `${((stepIndex + 1) / PIPELINE_STEPS.length) * 100}%` }}
                  />
                </div>
              </div>
            ) : article ? (
              <div className="glass-card p-6 sm:p-8 border-surface-700/60 space-y-6">
                {/* Header Stats Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20 flex items-center gap-1">
                      <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                      <span>{article.actualCharacterCount?.toLocaleString()} Characters</span>
                    </span>
                    <span className="text-xs text-surface-400">
                      via {article.generationDetails?.provider?.toUpperCase()} ({article.generationDetails?.modelUsed})
                    </span>
                  </div>

                  <button
                    onClick={copyToClipboard}
                    className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
                  >
                    {copied ? (
                      <>
                        <HiOutlineCheck className="w-3.5 h-3.5 text-accent-emerald" />
                        <span className="text-accent-emerald">Copied!</span>
                      </>
                    ) : (
                      <>
                        <HiOutlineClipboardDocument className="w-3.5 h-3.5" />
                        <span>Copy Markdown</span>
                      </>
                    )}
                  </button>
                </div>

                {/* SEO Meta Pack Card */}
                {article.seo && (
                  <div className="p-5 rounded-2xl bg-surface-900/90 border border-primary-500/30 shadow-lg space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-surface-800">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center">
                          <HiOutlineMagnifyingGlass className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          SEO Meta Pack
                        </span>
                      </div>

                      {/* Stat Badges */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        {article.seo.primaryKeyword && (
                          <span className="px-2.5 py-0.5 rounded-full font-medium bg-primary-500/10 text-primary-300 border border-primary-500/30 flex items-center gap-1">
                            <HiOutlineTag className="w-3 h-3" />
                            <span>Target: {article.seo.primaryKeyword} ({article.seo.primaryKeywordCount || 0}x)</span>
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full font-medium bg-surface-800 text-surface-300 border border-surface-700">
                          {article.seo.wordCount || 0} words · ~{article.seo.readingTimeMinutes || 1} min read
                        </span>
                      </div>
                    </div>

                    {/* Meta Title */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-surface-400 font-medium">Meta Title</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(article.seo.metaTitle || '');
                            setCopiedMetaTitle(true);
                            setTimeout(() => setCopiedMetaTitle(false), 2000);
                          }}
                          className="text-primary-400 hover:text-primary-300 text-[11px] font-medium flex items-center gap-1 transition-colors"
                        >
                          {copiedMetaTitle ? <HiOutlineCheck className="w-3 h-3 text-accent-emerald" /> : <HiOutlineClipboardDocument className="w-3 h-3" />}
                          <span>{copiedMetaTitle ? 'Copied' : 'Copy Title'}</span>
                        </button>
                      </div>
                      <p className="text-xs text-white bg-surface-950/70 p-2.5 rounded-lg border border-surface-800 font-mono">
                        {article.seo.metaTitle}
                      </p>
                    </div>

                    {/* Meta Description */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-surface-400 font-medium">Meta Description</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(article.seo.metaDescription || '');
                            setCopiedMetaDesc(true);
                            setTimeout(() => setCopiedMetaDesc(false), 2000);
                          }}
                          className="text-primary-400 hover:text-primary-300 text-[11px] font-medium flex items-center gap-1 transition-colors"
                        >
                          {copiedMetaDesc ? <HiOutlineCheck className="w-3 h-3 text-accent-emerald" /> : <HiOutlineClipboardDocument className="w-3 h-3" />}
                          <span>{copiedMetaDesc ? 'Copied' : 'Copy Description'}</span>
                        </button>
                      </div>
                      <p className="text-xs text-surface-200 bg-surface-950/70 p-2.5 rounded-lg border border-surface-800 leading-relaxed">
                        {article.seo.metaDescription}
                      </p>
                    </div>

                    {/* Secondary Keywords pills */}
                    {article.seo.secondaryKeywords && article.seo.secondaryKeywords.length > 0 && (
                      <div className="pt-1 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] text-surface-400">Secondary Keywords:</span>
                        {article.seo.secondaryKeywords.map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-surface-800 text-surface-300 border border-surface-700">
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Article Render */}
                <div className="prose prose-invert max-w-none text-surface-200 text-sm leading-relaxed space-y-4">
                  <ReactMarkdown>{article.contentMarkdown}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="glass-card p-10 flex flex-col items-center justify-center min-h-[480px] text-center border-dashed border-surface-800">
                <div className="w-12 h-12 rounded-2xl bg-surface-800 flex items-center justify-center mb-4 text-surface-500">
                  <HiOutlineSparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">
                  Ready to Generate
                </h3>
                <p className="text-xs text-surface-400 max-w-sm">
                  Enter your topic and click Generate. Your 5,000–6,000 character article will appear here in clean formatted Markdown.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GeneratePage;
