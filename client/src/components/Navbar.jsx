// ============================================
// Navbar Component
// ============================================
// The navigation bar at the top of the page.
// Shows the logo, navigation links, and auth buttons.
// Changes appearance when the user scrolls down (gets a backdrop blur).
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineSparkles, HiOutlineBars3, HiOutlineXMark } from 'react-icons/hi2';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Listen for scroll events to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface-900/80 backdrop-blur-xl border-b border-surface-700/50 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-xl flex items-center justify-center
                            group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all duration-300">
                <HiOutlineSparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-xl opacity-0 
                            group-hover:opacity-20 blur transition-opacity duration-300" />
            </div>
            <span className="text-xl font-display font-bold text-white">
              Blog<span className="text-gradient">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-surface-400 hover:text-white transition-colors duration-200 text-sm font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-surface-400 hover:text-white transition-colors duration-200 text-sm font-medium">
              How It Works
            </a>
            <a href="#pricing" className="text-surface-400 hover:text-white transition-colors duration-200 text-sm font-medium">
              Pricing
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn-primary !py-2 !px-5 text-sm"
              >
                Go to Dashboard ({user?.name?.split(' ')[0]})
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-surface-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary !py-2 !px-5 text-sm"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-surface-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <HiOutlineXMark className="w-6 h-6" />
            ) : (
              <HiOutlineBars3 className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-slide-down pb-6 border-t border-surface-700/50 mt-2 pt-4">
            <div className="flex flex-col gap-4">
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)}
                className="text-surface-300 hover:text-white transition-colors text-sm font-medium">
                Features
              </a>
              <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}
                className="text-surface-300 hover:text-white transition-colors text-sm font-medium">
                How It Works
              </a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}
                className="text-surface-300 hover:text-white transition-colors text-sm font-medium">
                Pricing
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-surface-700/50">
                <Link to="/login" className="btn-secondary text-center text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-center text-sm">Get Started Free</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
