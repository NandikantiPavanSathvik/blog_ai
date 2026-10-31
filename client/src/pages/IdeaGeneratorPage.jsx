// ============================================
// AI Blog Idea Generator Page (Protected)
// ============================================
// Generates trending blog ideas with real SEO
// keywords based on the user's business profile
// and live Google Trends data.
// ============================================

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  HiOutlineLightBulb,
  HiOutlineArrowLeft,
  HiOutlineSparkles,
  HiOutlineArrowTrendingUp,
  HiOutlineTag,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowRight,
  HiOutlineExclamationCircle,
  HiOutlineClock,
  HiOutlineSignal,
  HiOutlineBolt,
  HiOutlineClipboardDocument,
  HiOutlineCheck,
} from 'react-icons/hi2';

const PIPELINE_STEPS = [
  'Fetching trending topics from Google Trends...',
  'Gathering autocomplete keyword suggestions...',
  'Analyzing your business profile & audience...',
  'Generating blog ideas with SEO keywords...',
  'Finalizing and ranking ideas...',
];

const TREND_COLORS = {
  high: { bg: 'bg-accent-emerald/10', text: 'text-accent-emerald', border: 'border-accent-emerald/30', label: 'High Trend' },
  medium: { bg: 'bg-accent-amber/10', text: 'text-accent-amber', border: 'border-accent-amber/30', label: 'Medium Trend' },
  low: { bg: 'bg-surface-700/50', text: 'text-surface-400', border: 'border-surface-700', label: 'Low Trend' },
};

const DIFFICULTY_COLORS = {
  easy: { bg: 'bg-accent-emerald/10', text: 'text-accent-emerald', label: 'Easy' },
  medium: { bg: 'bg-accent-amber/10', text: 'text-accent-amber', label: 'Medium' },
  hard: { bg: 'bg-accent-rose/10', text: 'text-accent-rose', label: 'Hard' },
};

const IdeaGeneratorPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [topicHint, setTopicHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [ideas, setIdeas] = useState(null);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Fetch business profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (res.data.success && res.data.profile) {
          setProfile(res.data.profile);
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
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setIdeas(null);
    setMeta(null);

    try {
      const res = await api.post('/ideas/generate', {
        topicHint: topicHint.trim(),
        provider: 'groq',
      });

      if (res.data.success) {
        setIdeas(res.data.ideas);
        setMeta(res.data.meta);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to generate ideas. Please check your API key or try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Navigate to Generate page with pre-filled data from an idea
  const useIdea = (idea) => {
    const params = new URLSearchParams({
      topic: idea.title,
      primaryKeyword: idea.primaryKeyword,
      secondaryKeywords: idea.secondaryKeywords.join(', '),
      category: idea.category,
    });
    navigate(`/generate?${params.toString()}`);
  };

  // Copy all keywords for an idea
  const copyKeywords = (idea) => {
    const allKeywords = [idea.primaryKeyword, ...idea.secondaryKeywords].join(', ');
    navigator.clipboard.writeText(allKeywords);
    setCopiedId(idea.id);
    setTimeout(() => setCopiedId(null), 2000);
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
            <div className="w-7 h-7 bg-gradient-to-br from-accent-amber to-accent-rose rounded-lg flex items-center justify-center">
              <HiOutlineLightBulb className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-white text-sm">
              Blog<span className="text-gradient">AI</span> Ideas
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Input Section */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="glass-card p-6 sm:p-8 border-surface-700/60">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-amber/20 to-accent-rose/20 border border-accent-amber/30 flex items-center justify-center mx-auto mb-4">
                <HiOutlineLightBulb className="w-7 h-7 text-accent-amber" />
              </div>
              <h1 className="text-2xl font-display font-bold text-white mb-1">
                AI Idea Generator
              </h1>
              <p className="text-sm text-surface-400">
                {profile ? (
                  <span>
                    Generating ideas for <strong className="text-primary-300">{profile.businessName}</strong> · {profile.industry}
                  </span>
                ) : (
                  <span>
                    <Link to="/profile" className="text-primary-400 underline">Set up your profile</Link> for personalized suggestions.
                  </span>
                )}
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-accent-rose/10 border border-accent-rose/20 text-accent-rose text-xs flex items-center gap-2">
                <HiOutlineExclamationCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="input-label" htmlFor="topicHint">
                  Topic Interest (Optional)
                </label>
                <input
                  id="topicHint"
                  type="text"
                  value={topicHint}
                  onChange={(e) => setTopicHint(e.target.value)}
                  placeholder="e.g. AI in healthcare, social media strategy, remote work tips..."
                  className="input-field text-sm"
                />
                <p className="text-[11px] text-surface-500 mt-1.5">
                  Leave empty for diverse ideas, or type a theme to focus the suggestions.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !profile}
                className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5 text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Generating Ideas...</span>
                  </>
                ) : (
                  <>
                    <HiOutlineSparkles className="w-4 h-4" />
                    <span>Generate Blog Ideas with SEO Keywords</span>
                  </>
                )}
              </button>
            </form>

            {/* Info strip */}
            <div className="mt-4 p-3 rounded-xl bg-surface-900/80 border border-surface-800 flex items-center gap-3 text-[11px] text-surface-400">
              <HiOutlineArrowTrendingUp className="w-4 h-4 text-accent-cyan flex-shrink-0" />
              <span>
                Uses live <strong className="text-surface-300">Google Trends</strong> data + <strong className="text-surface-300">Google Autocomplete</strong> to suggest real, trending SEO keywords.
              </span>
            </div>
          </div>
        </div>

        {/* Loading Animation */}
        {loading && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-card p-10 flex flex-col items-center justify-center min-h-[320px] text-center border-accent-amber/30">
              <div className="w-16 h-16 relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-accent-amber/20 border-t-accent-amber animate-spin" />
                <HiOutlineLightBulb className="w-7 h-7 text-accent-amber animate-pulse" />
              </div>
              <h3 className="text-lg font-display font-semibold text-white mb-2">
                {PIPELINE_STEPS[stepIndex]}
              </h3>
              <p className="text-xs text-surface-400 max-w-sm mb-6">
                Combining real-time trending data with your business profile to find the best blog opportunities.
              </p>
              <div className="w-64 bg-surface-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-accent-amber to-accent-rose h-full transition-all duration-500"
                  style={{ width: `${((stepIndex + 1) / PIPELINE_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && ideas && ideas.length > 0 && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <HiOutlineLightBulb className="w-5 h-5 text-accent-amber" />
                  <span>{ideas.length} Blog Ideas Generated</span>
                </h2>
                <p className="text-xs text-surface-400 mt-0.5">
                  Click "Use This Idea" to jump straight to the blog generator with pre-filled SEO keywords.
                </p>
              </div>
              {meta && (
                <div className="flex items-center gap-2 text-[11px] text-surface-400">
                  <HiOutlineClock className="w-3.5 h-3.5" />
                  <span>
                    Generated in {(meta.generationDurationMs / 1000).toFixed(1)}s via {meta.provider?.toUpperCase()} ({meta.model})
                  </span>
                </div>
              )}
            </div>

            {/* Trending Data Stats */}
            {meta?.trendingDataUsed && (
              <div className="grid grid-cols-3 gap-3">
                <div className="glass-card p-3 text-center border-surface-700/60">
                  <p className="text-lg font-bold text-accent-cyan">{meta.trendingDataUsed.dailyTrendsCount}</p>
                  <p className="text-[10px] text-surface-400 mt-0.5">Trending Topics</p>
                </div>
                <div className="glass-card p-3 text-center border-surface-700/60">
                  <p className="text-lg font-bold text-accent-violet">{meta.trendingDataUsed.relatedQueriesFound}</p>
                  <p className="text-[10px] text-surface-400 mt-0.5">Related Queries</p>
                </div>
                <div className="glass-card p-3 text-center border-surface-700/60">
                  <p className="text-lg font-bold text-accent-emerald">{meta.trendingDataUsed.autocompleteCount}</p>
                  <p className="text-[10px] text-surface-400 mt-0.5">Autocomplete Keywords</p>
                </div>
              </div>
            )}

            {/* Idea Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {ideas.map((idea) => {
                const trend = TREND_COLORS[idea.trendRelevance] || TREND_COLORS.medium;
                const difficulty = DIFFICULTY_COLORS[idea.estimatedDifficulty] || DIFFICULTY_COLORS.medium;

                return (
                  <div
                    key={idea.id}
                    className="glass-card p-5 sm:p-6 border-surface-700/60 hover:border-primary-500/40 transition-all duration-300 flex flex-col"
                  >
                    {/* Top badges */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${trend.bg} ${trend.text} border ${trend.border} flex items-center gap-1`}>
                        <HiOutlineArrowTrendingUp className="w-3 h-3" />
                        <span>{trend.label}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${difficulty.bg} ${difficulty.text}`}>
                        {difficulty.label} Difficulty
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-surface-800 text-surface-400 border border-surface-700">
                        {idea.searchIntent}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-white mb-2 leading-snug">
                      {idea.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-surface-400 leading-relaxed mb-4 flex-grow">
                      {idea.description}
                    </p>

                    {/* Category */}
                    <div className="flex items-center gap-1.5 mb-3 text-[11px]">
                      <HiOutlineSignal className="w-3.5 h-3.5 text-primary-400" />
                      <span className="text-surface-400">Category:</span>
                      <span className="text-primary-300 font-medium">{idea.category}</span>
                    </div>

                    {/* Primary Keyword */}
                    <div className="p-3 rounded-xl bg-primary-500/5 border border-primary-500/20 mb-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <HiOutlineMagnifyingGlass className="w-3.5 h-3.5 text-primary-400" />
                        <span className="text-[11px] font-semibold text-primary-300">Primary Keyword</span>
                      </div>
                      <p className="text-sm font-medium text-white">{idea.primaryKeyword}</p>
                    </div>

                    {/* Secondary Keywords */}
                    {idea.secondaryKeywords.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] text-surface-400 flex items-center gap-1">
                            <HiOutlineTag className="w-3 h-3" />
                            SEO Keywords
                          </span>
                          <button
                            onClick={() => copyKeywords(idea)}
                            className="text-[10px] text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"
                          >
                            {copiedId === idea.id ? (
                              <>
                                <HiOutlineCheck className="w-3 h-3 text-accent-emerald" />
                                <span className="text-accent-emerald">Copied!</span>
                              </>
                            ) : (
                              <>
                                <HiOutlineClipboardDocument className="w-3 h-3" />
                                <span>Copy All</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {idea.secondaryKeywords.map((kw, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-[10px] bg-surface-800 text-surface-300 border border-surface-700"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={() => useIdea(idea)}
                      className="btn-primary !py-2.5 !px-4 text-xs flex items-center justify-center gap-1.5 w-full mt-auto"
                    >
                      <HiOutlineBolt className="w-3.5 h-3.5" />
                      <span>Use This Idea</span>
                      <HiOutlineArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Regenerate Button */}
            <div className="text-center pt-4">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="btn-secondary !py-2.5 !px-6 text-xs inline-flex items-center gap-2"
              >
                <HiOutlineSparkles className="w-3.5 h-3.5 text-accent-amber" />
                <span>Generate More Ideas</span>
              </button>
            </div>
          </div>
        )}

        {/* Empty state (before first generation) */}
        {!loading && !ideas && !error && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-card p-10 flex flex-col items-center justify-center min-h-[280px] text-center border-dashed border-surface-800">
              <div className="w-12 h-12 rounded-2xl bg-surface-800 flex items-center justify-center mb-4 text-surface-500">
                <HiOutlineLightBulb className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">
                Ready to Discover Ideas
              </h3>
              <p className="text-xs text-surface-400 max-w-sm">
                Click "Generate Blog Ideas" above to get 5 trending blog topic suggestions with real SEO keywords from Google Trends.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default IdeaGeneratorPage;

