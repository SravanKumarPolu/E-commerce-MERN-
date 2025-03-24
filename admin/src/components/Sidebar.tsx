import { AddIcon, ListIcon, OrdersIcon } from '../assets/SidebarIcons';

import { NavLink } from 'react-router-dom';

function Sidebar() {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
      ? 'bg-gray-200 text-pink-900 font-semibold'
      : 'hover:bg-gray-100 text-gray-700'
    }`;

  return (
    <aside className="w-[18%] min-h-screen bg-white shadow-md  hidden md:block">
      <nav className="menu p-4 text-sm">
        <ul className="space-y-2">
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
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
