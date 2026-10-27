// ============================================
// Article Detail & Export Viewer (Protected)
// ============================================

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';
import {
  HiOutlineSparkles,
  HiOutlineArrowLeft,
  HiOutlineClipboardDocument,
  HiOutlineCheck,
  HiOutlineArrowDownTray,
  HiOutlineTrash,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineTag,
} from 'react-icons/hi2';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedMetaTitle, setCopiedMetaTitle] = useState(false);
  const [copiedMetaDesc, setCopiedMetaDesc] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${id}`);
        if (res.data.success && res.data.article) {
          setArticle(res.data.article);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const copyToClipboard = () => {
    if (article?.contentMarkdown) {
      navigator.clipboard.writeText(article.contentMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadMarkdown = () => {
    if (!article?.contentMarkdown) return;
    const blob = new Blob([article.contentMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = article.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    link.setAttribute('href', url);
    link.setAttribute('download', `${safeTitle}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPlainText = () => {
    if (!article?.contentMarkdown) return;
    const plainText = article.contentMarkdown.replace(/#+\s/g, '').replace(/(\*\*|__)(.*?)\1/g, '$2');
    const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = article.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    link.setAttribute('href', url);
    link.setAttribute('download', `${safeTitle}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.delete(`/articles/${id}`);
      navigate('/articles');
    } catch (err) {
      alert('Failed to delete article');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-surface-400 text-sm">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md">
          <h2 className="text-lg font-bold text-white mb-2">Article Not Found</h2>
          <p className="text-sm text-surface-400 mb-6">{error || 'This article could not be loaded.'}</p>
          <Link to="/articles" className="btn-primary !py-2 !px-4 text-xs">
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 text-surface-100 pb-20">
      {/* Top Header */}
      <header className="bg-surface-900/80 backdrop-blur-xl border-b border-surface-800 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/articles"
            className="flex items-center gap-2 text-surface-400 hover:text-white transition-colors text-sm font-medium"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            <span>All Articles</span>
          </Link>

          <div className="flex items-center gap-3">
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
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={downloadMarkdown}
              className="btn-primary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
            >
              <HiOutlineArrowDownTray className="w-3.5 h-3.5" />
              <span>Download .MD</span>
            </button>

            <button
              onClick={downloadPlainText}
              className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5 hidden sm:flex"
            >
              <HiOutlineArrowDownTray className="w-3.5 h-3.5" />
              <span>Download .TXT</span>
            </button>

            <button
              onClick={handleDelete}
              title="Delete Article"
              className="p-2 text-surface-500 hover:text-accent-rose hover:bg-accent-rose/10 rounded-lg transition-colors text-xs"
            >
              <HiOutlineTrash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Reader */}
      <main className="max-w-5xl mx-auto px-4 pt-10">
        {/* Article Metadata Bar */}
        <div className="glass-card p-6 border-surface-700/60 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-300 border border-primary-500/20">
                  {article.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20 flex items-center gap-1">
                  <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                  <span>{article.actualCharacterCount?.toLocaleString()} characters</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                {article.title}
              </h1>
            </div>

            <div className="text-right text-xs text-surface-400 space-y-1">
              <div className="flex items-center gap-1.5 justify-end">
                <HiOutlineCalendar className="w-3.5 h-3.5" />
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              <div>Tone: <span className="text-surface-300">{article.tone}</span></div>
              <div>Engine: <span className="text-primary-400 uppercase">{article.generationDetails?.provider || 'AI'}</span></div>
            </div>
          </div>
        </div>

        {/* SEO Meta Pack Card */}
        {article.seo && (
          <div className="glass-card p-6 border-primary-500/30 mb-8 space-y-4">
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
              <div className="flex flex-wrap items-center gap-2 text-xs">
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
                  className="text-primary-400 hover:text-primary-300 text-xs font-medium flex items-center gap-1 transition-colors"
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
                  className="text-primary-400 hover:text-primary-300 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  {copiedMetaDesc ? <HiOutlineCheck className="w-3 h-3 text-accent-emerald" /> : <HiOutlineClipboardDocument className="w-3 h-3" />}
                  <span>{copiedMetaDesc ? 'Copied' : 'Copy Description'}</span>
                </button>
              </div>
              <p className="text-xs text-surface-200 bg-surface-950/70 p-2.5 rounded-lg border border-surface-800 leading-relaxed">
                {article.seo.metaDescription}
              </p>
            </div>

            {/* Secondary Keywords tags */}
            {article.seo.secondaryKeywords && article.seo.secondaryKeywords.length > 0 && (
              <div className="pt-1 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-surface-400">Secondary Keywords:</span>
                {article.seo.secondaryKeywords.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs bg-surface-800 text-surface-300 border border-surface-700">
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Formatted Article Body */}
        <article className="glass-card p-8 sm:p-12 border-surface-700/60">
          <div className="prose prose-invert max-w-none text-surface-200 text-base leading-relaxed space-y-6">
            <ReactMarkdown>{article.contentMarkdown}</ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  );
};

export default ArticleDetailPage;
