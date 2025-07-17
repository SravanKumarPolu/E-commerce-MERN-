import { AddIcon, ListIcon, OrdersIcon, DashboardIcon, SalesIcon, ProductsIcon, UsersIcon, SearchIcon } from '../assets/SidebarIcons';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-semibold text-sm group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2 focus:ring-offset-white ${
      isActive
        ? 'active bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white shadow-xl shadow-primary-500/30 transform scale-[1.02] border border-primary-400/20 backdrop-blur-sm'
        : 'text-neutral-700 hover:bg-gradient-to-r hover:from-neutral-50 hover:to-neutral-100 hover:text-neutral-900 hover:shadow-lg hover:shadow-neutral-900/5 hover:transform hover:scale-[1.02] hover:border hover:border-neutral-200/60 hover:backdrop-blur-sm'
    }`;

  return (
    <aside className="w-80 h-screen bg-white/95 backdrop-blur-xl border-r border-neutral-200/60 hidden lg:block shadow-2xl shadow-neutral-900/5 relative flex flex-col">
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/50 pointer-events-none"></div>
      
      <div className="p-8 h-full flex flex-col relative z-10 overflow-hidden">
        {/* Enhanced Logo/Brand Section - Fixed at top */}
        <div className="mb-12 flex-shrink-0">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/30 border border-primary-400/20 hover:scale-105 transition-transform duration-300">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-heading-2 font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent mb-1">
                Admin Panel
              </h1>
              <p className="text-caption text-neutral-500 font-semibold tracking-wide">E-commerce Management</p>
            </div>
          </div>
          
          {/* Enhanced status indicator */}
          <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-success-50 via-white to-success-50 rounded-xl border border-success-200/60 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse shadow-lg shadow-success-500/50"></div>
            <span className="text-sm font-semibold text-success-700">System Online</span>
            <div className="ml-auto">
              <span className="text-xs text-neutral-400 bg-neutral-100 px-3 py-1.5 rounded-lg font-medium">v1.0</span>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation - Scrollable area */}
        <nav className="flex-1 space-y-10 overflow-y-auto overflow-x-hidden px-2">
          {/* Main Navigation */}
          <div className="space-y-4">
            <h2 className="text-caption text-neutral-400 font-bold uppercase tracking-wider mb-8 px-2 flex items-center gap-3">
              <div className="w-2 h-2 bg-gradient-to-r from-neutral-300 to-neutral-400 rounded-full"></div>
              Main Navigation
            </h2>
            
            <NavLink to="/dashboard" className={linkClasses}>
              <div className={`p-3.5 rounded-xl transition-all duration-300 ${
                'bg-white/20 shadow-lg shadow-white/20 border border-white/10 backdrop-blur-sm'
              }`}>
                <DashboardIcon />
              </div>
              <span className="font-semibold">Dashboard</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400/0 to-primary-400/0 group-hover:from-primary-400/5 group-hover:to-primary-400/10 transition-all duration-300 rounded-2xl pointer-events-none"></div>
            </NavLink>
            
            <NavLink to="/add" className={linkClasses}>
              <div className={`p-3.5 rounded-xl transition-all duration-300 ${
                'bg-white/20 shadow-lg shadow-white/20 border border-white/10 backdrop-blur-sm'
              }`}>
                <AddIcon />
              </div>
              <span className="font-semibold">Add Products</span>
              <div className="absolute inset-0 bg-gradient-to-r from-success-400/0 to-success-400/0 group-hover:from-success-400/5 group-hover:to-success-400/10 transition-all duration-300 rounded-2xl pointer-events-none"></div>
            </NavLink>
            
            <NavLink to="/list" className={linkClasses}>
              <div className={`p-3.5 rounded-xl transition-all duration-300 ${
                'bg-white/20 shadow-lg shadow-white/20 border border-white/10 backdrop-blur-sm'
              }`}>
                <ListIcon />
              </div>
              <span className="font-semibold">Product List</span>
              <div className="absolute inset-0 bg-gradient-to-r from-warning-400/0 to-warning-400/0 group-hover:from-warning-400/5 group-hover:to-warning-400/10 transition-all duration-300 rounded-2xl pointer-events-none"></div>
            </NavLink>
            
            <NavLink to="/orders" className={linkClasses}>
              <div className={`p-3.5 rounded-xl transition-all duration-300 ${
                'bg-white/20 shadow-lg shadow-white/20 border border-white/10 backdrop-blur-sm'
              }`}>
                <OrdersIcon />
              </div>
              <span className="font-semibold">Orders</span>
              <div className="absolute inset-0 bg-gradient-to-r from-error-400/0 to-error-400/0 group-hover:from-error-400/5 group-hover:to-error-400/10 transition-all duration-300 rounded-2xl pointer-events-none"></div>
            </NavLink>
          </div>

          {/* Analytics Section */}
          <div className="space-y-4 pt-10 border-t border-neutral-200/60">
            <h2 className="text-caption text-neutral-400 font-bold uppercase tracking-wider mb-8 px-2 flex items-center gap-3">
              <div className="w-2 h-2 bg-gradient-to-r from-neutral-300 to-neutral-400 rounded-full"></div>
              Analytics & Insights
            </h2>
            
            <NavLink to="/analytics/sales" className={linkClasses}>
              <div className={`p-3.5 rounded-xl transition-all duration-300 ${
                'bg-white/20 shadow-lg shadow-white/20 border border-white/10 backdrop-blur-sm'
              }`}>
                <SalesIcon />
              </div>
              <span className="font-semibold">Sales Analytics</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400/0 to-primary-400/0 group-hover:from-primary-400/5 group-hover:to-primary-400/10 transition-all duration-300 rounded-2xl pointer-events-none"></div>
            </NavLink>
            
            <NavLink to="/analytics/products" className={linkClasses}>
              <div className={`p-3.5 rounded-xl transition-all duration-300 ${
                'bg-white/20 shadow-lg shadow-white/20 border border-white/10 backdrop-blur-sm'
              }`}>
                <ProductsIcon />
              </div>
              <span className="font-semibold">Product Performance</span>
              <div className="absolute inset-0 bg-gradient-to-r from-success-400/0 to-success-400/0 group-hover:from-success-400/5 group-hover:to-success-400/10 transition-all duration-300 rounded-2xl pointer-events-none"></div>
            </NavLink>
            
            <NavLink to="/analytics/users" className={linkClasses}>
              <div className={`p-3.5 rounded-xl transition-all duration-300 ${
                'bg-white/20 shadow-lg shadow-white/20 border border-white/10 backdrop-blur-sm'
              }`}>
                <UsersIcon />
              </div>
              <span className="font-semibold">User Behavior</span>
              <div className="absolute inset-0 bg-gradient-to-r from-warning-400/0 to-warning-400/0 group-hover:from-warning-400/5 group-hover:to-warning-400/10 transition-all duration-300 rounded-2xl pointer-events-none"></div>
            </NavLink>
            
            <NavLink to="/analytics/search" className={linkClasses}>
              <div className={`p-3.5 rounded-xl transition-all duration-300 ${
                'bg-white/20 shadow-lg shadow-white/20 border border-white/10 backdrop-blur-sm'
              }`}>
                <SearchIcon />
              </div>
              <span className="font-semibold">Search Analytics</span>
              <div className="absolute inset-0 bg-gradient-to-r from-error-400/0 to-error-400/0 group-hover:from-error-400/5 group-hover:to-error-400/10 transition-all duration-300 rounded-2xl pointer-events-none"></div>
            </NavLink>
          </div>
        </nav>

        {/* Enhanced Footer - Fixed at bottom */}
        <div className="mt-10 pt-8 flex-shrink-0">
          <div className="p-6 bg-gradient-to-r from-neutral-50 via-white to-neutral-50 rounded-2xl border border-neutral-200/60 shadow-xl shadow-neutral-900/5 backdrop-blur-sm hover:shadow-2xl hover:shadow-neutral-900/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse shadow-lg shadow-success-500/50"></div>
                <span className="text-caption font-semibold text-success-600">System Online</span>
              </div>
              <span className="text-caption text-neutral-400 bg-neutral-100 px-3 py-1.5 rounded-lg font-medium">v1.0</span>
            </div>
            <p className="text-caption text-neutral-500 text-center font-semibold mb-4">
              E-commerce Admin Panel
            </p>
            <div className="pt-4 border-t border-neutral-200/60">
              <div className="flex items-center justify-center gap-6 text-xs text-neutral-400">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-success-400 to-success-500 rounded-full"></div>
                  <span className="font-medium">Secure</span>
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"></div>
                  <span className="font-medium">Fast</span>
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-warning-400 to-warning-500 rounded-full"></div>
                  <span className="font-medium">Reliable</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
