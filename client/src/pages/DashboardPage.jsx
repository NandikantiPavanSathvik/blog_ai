import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  HiOutlineSparkles,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBuildingOffice2,
  HiOutlinePencilSquare,
  HiOutlineDocumentText,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineLightBulb,
} from 'react-icons/hi2';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (res.data.success && res.data.profile) {
          setProfile(res.data.profile);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-surface-950 text-surface-100">
      {/* Top Navigation */}
      <header className="bg-surface-900/80 backdrop-blur-xl border-b border-surface-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-lg flex items-center justify-center">
              <HiOutlineSparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-white">
              Blog<span className="text-gradient">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-surface-400">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors"
            >
              <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white">
            Welcome back, <span className="text-gradient">{user?.name}</span>!
          </h1>
          <p className="text-surface-400 mt-1">
            Manage your business profile and generate AI-powered blog articles.
          </p>
        </div>

        {/* Onboarding Alert if no profile configured yet */}
        {!loadingProfile && !profile && (
          <div className="glass-card p-6 mb-8 border-accent-amber/30 bg-accent-amber/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-amber/10 border border-accent-amber/20 flex items-center justify-center text-accent-amber flex-shrink-0">
                <HiOutlineExclamationTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Complete your Business Profile</h3>
                <p className="text-xs text-surface-400 mt-0.5">
                  Save your brand details so the AI generates tailored articles matching your voice.
                </p>
              </div>
            </div>
            <Link
              to="/profile"
              className="btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5 flex-shrink-0"
            >
              <span>Setup Profile</span>
              <HiOutlineArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1: Business Profile */}
          <div className="glass-card p-6 border-surface-700/60 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-4">
                <HiOutlineBuildingOffice2 className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Business Profile</h3>
              {profile ? (
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium text-primary-300">{profile.businessName}</p>
                  <p className="text-xs text-surface-400">{profile.industry} · {profile.brandVoice}</p>
                </div>
              ) : (
                <p className="text-surface-400 text-sm mt-1">
                  Save your company info, target audience, and preferred brand voice once.
                </p>
              )}
            </div>
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-surface-800">
              <Link
                to="/profile"
                className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1"
              >
                <span>{profile ? 'Edit Profile' : 'Configure Profile'}</span>
                <HiOutlineArrowRight className="w-3.5 h-3.5" />
              </Link>
              {profile && (
                <span className="flex items-center gap-1 text-xs text-accent-emerald">
                  <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                  <span>Configured</span>
                </span>
              )}
            </div>
          </div>

          {/* Card 2: AI Idea Generator */}
          <div className="glass-card p-6 border-accent-amber/40 bg-accent-amber/5 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-amber/10 border border-accent-amber/20 flex items-center justify-center mb-4">
                <HiOutlineLightBulb className="w-6 h-6 text-accent-amber" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Idea Generator</h3>
              <p className="text-surface-400 text-sm">
                Discover trending blog topics with real Google Trends SEO keywords tailored to your brand.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-surface-800">
              <Link
                to="/ideas"
                className="btn-secondary !py-2.5 !px-4 text-xs flex items-center justify-center gap-1.5 w-full hover:border-accent-amber/50"
              >
                <HiOutlineLightBulb className="w-3.5 h-3.5 text-accent-amber" />
                <span>Generate Ideas</span>
              </Link>
            </div>
          </div>

          {/* Card 3: Generate Blog (Active) */}
          <div className="glass-card p-6 border-accent-violet/40 bg-accent-violet/5 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center mb-4">
                <HiOutlinePencilSquare className="w-6 h-6 text-accent-violet" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">AI Blog Generator</h3>
              <p className="text-surface-400 text-sm">
                Generate 5,000–6,000 character articles using your custom AI agent and Gemini/OpenAI.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-surface-800">
              <Link
                to="/generate"
                className="btn-primary !py-2.5 !px-4 text-xs flex items-center justify-center gap-1.5 w-full"
              >
                <HiOutlineSparkles className="w-3.5 h-3.5" />
                <span>Create New Article</span>
              </Link>
            </div>
          </div>

          {/* Card 4: Articles Library (Active) */}
          <div className="glass-card p-6 border-accent-emerald/40 bg-accent-emerald/5 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center mb-4">
                <HiOutlineDocumentText className="w-6 h-6 text-accent-emerald" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Saved Articles</h3>
              <p className="text-surface-400 text-sm">
                Browse, read, copy, delete, and download your generated blog drafts to your computer.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-surface-800">
              <Link
                to="/articles"
                className="btn-secondary !py-2.5 !px-4 text-xs flex items-center justify-center gap-1.5 w-full hover:border-accent-emerald/50"
              >
                <HiOutlineDocumentText className="w-3.5 h-3.5 text-accent-emerald" />
                <span>View All Articles</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
