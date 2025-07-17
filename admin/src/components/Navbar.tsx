import { assets } from '../assets/assets';

interface NavbarProps {
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

const Navbar: React.FC<NavbarProps> = ({ setToken }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200/60">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <img 
            className="h-10 w-auto" 
            alt="Logo" 
            src={assets.logo} 
          />
          <div className="hidden sm:block">
            <h2 className="text-heading-4 font-semibold text-neutral-900">
              E-commerce Admin
            </h2>
            <p className="text-caption text-neutral-500">
              Management Dashboard
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* User Info */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-neutral-50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">Admin User</p>
              <p className="text-xs text-neutral-500">Administrator</p>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={() => setToken('')} 
            className="btn-modern btn-secondary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
