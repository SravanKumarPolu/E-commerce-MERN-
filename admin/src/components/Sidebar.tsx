import { AddIcon, ListIcon, OrdersIcon, DashboardIcon, SalesIcon, ProductsIcon, UsersIcon, SearchIcon } from '../assets/SidebarIcons';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
      isActive
        ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200 shadow-sm'
        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 hover:shadow-sm'
    }`;

  return (
    <aside className="w-80 min-h-screen bg-white/80 backdrop-blur-sm border-r border-neutral-200/60 hidden lg:block">
      <div className="p-6">
        {/* Logo/Brand Section */}
        <div className="mb-8">
          <h1 className="text-heading-3 font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-caption text-neutral-500 mt-1">E-commerce Management</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            <h2 className="text-caption text-neutral-400 font-semibold mb-3">Main</h2>
            
            <NavLink to="/dashboard" className={linkClasses}>
              <div className="p-1.5 rounded-lg bg-primary-100/50">
                <DashboardIcon />
              </div>
              <span>Dashboard</span>
            </NavLink>
            
            <NavLink to="/add" className={linkClasses}>
              <div className="p-1.5 rounded-lg bg-success-100/50">
                <AddIcon />
              </div>
              <span>Add Items</span>
            </NavLink>
            
            <NavLink to="/list" className={linkClasses}>
              <div className="p-1.5 rounded-lg bg-warning-100/50">
                <ListIcon />
              </div>
              <span>List Items</span>
            </NavLink>
            
            <NavLink to="/orders" className={linkClasses}>
              <div className="p-1.5 rounded-lg bg-error-100/50">
                <OrdersIcon />
              </div>
              <span>Orders</span>
            </NavLink>
          </div>

          {/* Analytics Section */}
          <div className="space-y-1 pt-6 border-t border-neutral-200/60">
            <h2 className="text-caption text-neutral-400 font-semibold mb-3">Analytics</h2>
            
            <NavLink to="/analytics/sales" className={linkClasses}>
              <div className="p-1.5 rounded-lg bg-primary-100/50">
                <SalesIcon />
              </div>
              <span>Sales Analytics</span>
            </NavLink>
            
            <NavLink to="/analytics/products" className={linkClasses}>
              <div className="p-1.5 rounded-lg bg-success-100/50">
                <ProductsIcon />
              </div>
              <span>Product Performance</span>
            </NavLink>
            
            <NavLink to="/analytics/users" className={linkClasses}>
              <div className="p-1.5 rounded-lg bg-warning-100/50">
                <UsersIcon />
              </div>
              <span>User Behavior</span>
            </NavLink>
            
            <NavLink to="/analytics/search" className={linkClasses}>
              <div className="p-1.5 rounded-lg bg-error-100/50">
                <SearchIcon />
              </div>
              <span>Search Analytics</span>
            </NavLink>
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl border border-neutral-200/60">
            <p className="text-caption text-neutral-500 text-center">
              Admin Panel v1.0
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
