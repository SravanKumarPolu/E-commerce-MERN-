import { AddIcon, ListIcon, OrdersIcon, DashboardIcon, SalesIcon, ProductsIcon, UsersIcon, SearchIcon } from '../assets/SidebarIcons';

import { NavLink } from 'react-router-dom';

function Sidebar() {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 border border-gray-300 shadow-md border-r-0 px-3 py-2 rounded-l transition-colors duration-200 ${isActive
      ? 'bg-gray-200 text-gray-900 font-semibold'
      : 'hover:bg-gray-100 text-gray-700'
    }`;

  return (
    <aside className="w-[18%] min-h-screen bg-white shadow-md  hidden md:block">
      <nav className="flex flex-col  pt-6 pl-[20%] text-[15px]'">
        <ul className="space-y-1">
          <li>
            <NavLink to="/dashboard" className={linkClasses}>
              <DashboardIcon />
              <span className="hidden md:block">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/add" className={linkClasses}>
              <AddIcon />
              <span className="hidden md:block">Add Items</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/list" className={linkClasses}>
              <ListIcon />
              <span className="hidden md:block">List Items</span> 
            </NavLink>
          </li>
          <li>
            <NavLink to="/orders" className={linkClasses}>
              <OrdersIcon />
              <span className="hidden md:block">Order Items</span>
            </NavLink>
          </li>
          <li className="pt-4 border-t border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Analytics</span>
          </li>
          <li>
            <NavLink to="/analytics/sales" className={linkClasses}>
              <SalesIcon />
              <span className="hidden md:block">Sales Analytics</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics/products" className={linkClasses}>
              <ProductsIcon />
              <span className="hidden md:block">Product Performance</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics/users" className={linkClasses}>
              <UsersIcon />
              <span className="hidden md:block">User Behavior</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics/search" className={linkClasses}>
              <SearchIcon />
              <span className="hidden md:block">Search Analytics</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
