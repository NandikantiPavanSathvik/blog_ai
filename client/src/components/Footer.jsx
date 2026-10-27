// ============================================
// Footer Component
// ============================================

import { Link } from 'react-router-dom';
import { HiOutlineSparkles } from 'react-icons/hi2';

const Footer = () => {
  return (
    <footer className="relative bg-surface-950 border-t border-surface-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-lg flex items-center justify-center">
                <HiOutlineSparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-display font-bold text-white">
                Blog<span className="text-gradient">AI</span>
              </span>
            </Link>
            <p className="text-surface-400 text-sm leading-relaxed max-w-sm">
              Generate professional blog articles powered by AI. Save your business profile once,
              create unlimited content that matches your brand voice.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-surface-200 mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li><a href="#features" className="text-sm text-surface-400 hover:text-primary-400 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-sm text-surface-400 hover:text-primary-400 transition-colors">How It Works</a></li>
              <li><a href="#pricing" className="text-sm text-surface-400 hover:text-primary-400 transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-surface-200 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-surface-400 hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-surface-400 hover:text-primary-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-surface-400 hover:text-primary-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-surface-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-500">
            © {new Date().getFullYear()} BlogAI. All rights reserved.
          </p>
          <p className="text-xs text-surface-600">
            Powered by AI · Built with purpose
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
