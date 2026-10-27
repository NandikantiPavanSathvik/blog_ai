// ============================================
// Articles History & Library Page (Protected)
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  HiOutlineSparkles,
  HiOutlineArrowLeft,
  HiOutlineDocumentText,
  HiOutlineMagnifyingGlass,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineArrowDownTray,
  HiOutlinePlusCircle,
} from 'react-icons/hi2';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchArticles = async () => {
    try {
      const res = await api.get('/articles');
      if (res.data.success) {
        setArticles(res.data.articles);
      }
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await api.delete(`/articles/${id}`);
      if (res.data.success) {
        setArticles(articles.filter((art) => art._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete article');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (id, title) => {
    try {
      const res = await api.get(`/articles/${id}`);
      if (res.data.success && res.data.article) {
        const content = res.data.article.contentMarkdown;
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.md`;
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      alert('Failed to download article');
    }
  };

  const filteredArticles = articles.filter(
    (art) =>
      art.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.seo?.primaryKeyword?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Blog<span className="text-gradient">AI</span> Library
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Page Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              Saved Articles
            </h1>
            <p className="text-surface-400 text-sm mt-1">
              Browse, view, export, or delete your generated blog drafts ({articles.length} total).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <HiOutlineMagnifyingGlass className="w-4 h-4 text-surface-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field !pl-10 !py-2 text-xs"
              />
            </div>

            <Link
              to="/generate"
              className="btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5 flex-shrink-0"
            >
              <HiOutlinePlusCircle className="w-4 h-4" />
              <span>New Article</span>
            </Link>
          </div>
        </div>

        {/* Article Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
            <p className="text-surface-400 text-sm">Loading your articles...</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article._id}
                className="glass-card p-6 border-surface-700/60 flex flex-col justify-between hover:border-surface-600 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary-500/10 text-primary-300 border border-primary-500/20">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-surface-500">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-white text-base line-clamp-2 mb-2">
                    {article.title}
                  </h3>

                  <p className="text-surface-400 text-xs line-clamp-2 mb-3">
                    Topic: {article.topic}
                  </p>

                  {article.seo?.primaryKeyword && (
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-primary-500/10 text-primary-300 border border-primary-500/20">
                        SEO: {article.seo.primaryKeyword}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-surface-800 flex items-center justify-between">
                  <span className="text-xs font-medium text-accent-emerald">
                    {article.actualCharacterCount?.toLocaleString()} chars
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(article._id, article.title)}
                      title="Download as Markdown (.md)"
                      className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors text-xs"
                    >
                      <HiOutlineArrowDownTray className="w-4 h-4" />
                    </button>

                    <Link
                      to={`/articles/${article._id}`}
                      title="Read Article"
                      className="p-2 text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 rounded-lg transition-colors text-xs"
                    >
                      <HiOutlineEye className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDelete(article._id, article.title)}
                      disabled={deletingId === article._id}
                      title="Delete Article"
                      className="p-2 text-surface-500 hover:text-accent-rose hover:bg-accent-rose/10 rounded-lg transition-colors text-xs"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center border-dashed border-surface-800 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto mb-4 text-surface-500">
              <HiOutlineDocumentText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              {searchTerm ? 'No matching articles' : 'No articles generated yet'}
            </h3>
            <p className="text-xs text-surface-400 mb-6">
              {searchTerm
                ? 'Try searching with a different keyword or clear your search.'
                : 'Click below to generate your first professional 5,000+ character blog article!'}
            </p>
            <Link to="/generate" className="btn-primary !py-2.5 !px-5 text-xs inline-flex items-center gap-1.5">
              <HiOutlineSparkles className="w-4 h-4" />
              <span>Generate First Article</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default ArticlesPage;
