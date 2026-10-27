// ============================================
// Business Profile Page (Protected)
// ============================================

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  HiOutlineSparkles,
  HiOutlineArrowLeft,
  HiOutlineBuildingOffice2,
  HiOutlineCheck,
} from 'react-icons/hi2';

const INDUSTRIES = [
  'Technology & Software',
  'Health & Wellness',
  'Food & Beverage',
  'E-commerce & Retail',
  'Finance & Real Estate',
  'Education & Training',
  'Marketing & Agency',
  'Travel & Hospitality',
  'Personal Blog / Creator',
  'Other',
];

const BRAND_VOICES = [
  { label: 'Conversational & Friendly', desc: 'Warm, approachable, like talking to a helpful friend.' },
  { label: 'Professional & Authoritative', desc: 'Credible, expert-level, polished business prose.' },
  { label: 'Educational & Instructive', desc: 'Clear step-by-step guidance, explanatory, accessible.' },
  { label: 'Bold & Persuasive', desc: 'Direct, impactful, designed to drive action and sales.' },
  { label: 'Inspirational & Uplifting', desc: 'Motivational, engaging, storytelling-driven.' },
  { label: 'Witty & Playful', desc: 'Clever, lighthearted, with personality and charm.' },
];

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Portuguese'];

const ProfilePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: '',
    industry: 'Technology & Software',
    description: '',
    productsOrServices: '',
    targetAudience: '',
    brandVoice: 'Conversational & Friendly',
    preferredLanguage: 'English',
    websiteUrl: '',
    defaultCta: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Load existing profile on page mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (res.data.success && res.data.profile) {
          setFormData({
            businessName: res.data.profile.businessName || '',
            industry: res.data.profile.industry || 'Technology & Software',
            description: res.data.profile.description || '',
            productsOrServices: res.data.profile.productsOrServices || '',
            targetAudience: res.data.profile.targetAudience || '',
            brandVoice: res.data.profile.brandVoice || 'Conversational & Friendly',
            preferredLanguage: res.data.profile.preferredLanguage || 'English',
            websiteUrl: res.data.profile.websiteUrl || '',
            defaultCta: res.data.profile.defaultCta || '',
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await api.post('/profile', formData);
      if (res.data.success) {
        setStatusMessage({
          type: 'success',
          text: 'Business profile saved! The AI will now use this for all generated articles.',
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to save profile. Please check the fields.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-surface-400 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 text-surface-100 pb-20">
      {/* Top Header */}
      <header className="bg-surface-900/80 backdrop-blur-xl border-b border-surface-800 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-surface-400 hover:text-white transition-colors text-sm font-medium"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-lg flex items-center justify-center">
              <HiOutlineSparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-white text-sm">
              Blog<span className="text-gradient">AI</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-300 text-xs font-medium mb-3">
            <HiOutlineBuildingOffice2 className="w-3.5 h-3.5" />
            <span>AI Knowledge Base</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white">
            Your Business Profile
          </h1>
          <p className="text-surface-400 text-sm mt-1 leading-relaxed">
            Fill in your business details once. When you generate blog articles, our AI agent pulls this information so every piece matches your voice and audience.
          </p>
        </div>

        {statusMessage.text && (
          <div
            className={`mb-6 p-4 rounded-xl border text-sm flex items-center gap-3 ${
              statusMessage.type === 'success'
                ? 'bg-accent-emerald/10 border-accent-emerald/30 text-accent-emerald'
                : 'bg-accent-rose/10 border-accent-rose/30 text-accent-rose'
            }`}
          >
            {statusMessage.type === 'success' && <HiOutlineCheck className="w-5 h-5 flex-shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Business Identity */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-1">1. Business Identity</h2>
            <p className="text-xs text-surface-400 mb-6">Tell us who you are and what you do.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="input-label" htmlFor="businessName">
                  Business or Brand Name *
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="e.g. Apex Cloud Solutions"
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label" htmlFor="industry">
                  Industry / Niche *
                </label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="input-field"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind} className="bg-surface-900 text-white">
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="input-label" htmlFor="description">
                  Business Summary / Mission *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. We provide cybersecurity and cloud backup software designed specifically for dental and medical practices..."
                  className="input-field"
                />
                <p className="text-xs text-surface-500 mt-1">
                  A 1–3 sentence overview of what your business does.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="input-label" htmlFor="productsOrServices">
                  Core Products or Services
                </label>
                <textarea
                  id="productsOrServices"
                  name="productsOrServices"
                  rows={2}
                  value={formData.productsOrServices}
                  onChange={handleChange}
                  placeholder="e.g. HIPAA Compliant Cloud Backup, 24/7 Threat Monitoring, Staff Security Training"
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label" htmlFor="websiteUrl">
                  Website URL (Optional)
                </label>
                <input
                  id="websiteUrl"
                  name="websiteUrl"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label" htmlFor="preferredLanguage">
                  Default Blog Language
                </label>
                <select
                  id="preferredLanguage"
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className="input-field"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang} className="bg-surface-900 text-white">
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Audience & Voice */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-1">2. Target Audience & Brand Voice</h2>
            <p className="text-xs text-surface-400 mb-6">How you want to communicate with your readers.</p>

            <div className="space-y-6">
              <div>
                <label className="input-label" htmlFor="targetAudience">
                  Who is your target reader? *
                </label>
                <textarea
                  id="targetAudience"
                  name="targetAudience"
                  rows={2}
                  required
                  value={formData.targetAudience}
                  onChange={handleChange}
                  placeholder="e.g. Healthcare office managers, clinic owners, IT directors concerned about patient data safety"
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label mb-3">Preferred Brand Voice</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BRAND_VOICES.map((voice) => (
                    <label
                      key={voice.label}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        formData.brandVoice === voice.label
                          ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/10'
                          : 'border-surface-700/60 bg-surface-900/40 hover:border-surface-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="brandVoice"
                        value={voice.label}
                        checked={formData.brandVoice === voice.label}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="font-medium text-sm text-white">{voice.label}</div>
                      <div className="text-xs text-surface-400 mt-1">{voice.desc}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="input-label" htmlFor="defaultCta">
                  Default Call-to-Action (CTA)
                </label>
                <input
                  id="defaultCta"
                  name="defaultCta"
                  type="text"
                  value={formData.defaultCta}
                  onChange={handleChange}
                  placeholder="e.g. Schedule a free 15-minute cybersecurity audit with our team today."
                  className="input-field"
                />
                <p className="text-xs text-surface-500 mt-1">
                  Optional closing phrase added to the bottom of generated articles.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-4">
            <Link to="/dashboard" className="btn-secondary !py-3 !px-6 text-sm">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary !py-3 !px-8 text-sm flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <HiOutlineCheck className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ProfilePage;
