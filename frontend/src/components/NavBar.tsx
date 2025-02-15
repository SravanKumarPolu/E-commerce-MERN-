import { Link, NavLink } from 'react-router-dom'

import { assets } from '../assets/assets'
import { useShopContext } from '../context/ShopContext';
import { useState } from 'react'

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch } = useShopContext();
  return (
    <div className='font-outfit flex items-center justify-between py-5 font-medium '>
      <Link to='/'>
        <img src={assets.logo} className="w-10" alt="Logo" />
      </Link>

      <div role="tablist" className="tabs tabs-lifted hidden sm:flex text-sm text-gray-900">
        <NavLink
          to="/"
          role="tab"
          className={({ isActive }) =>
            `tab  flex-col items-center gap-1 ${isActive ? 'tab-active bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-yellow-500' : ''}`
          }
        >
          <p>Home</p>
        </NavLink>

        <NavLink
          to="/about"
          role="tab"
          className={({ isActive }) =>
            `tab  flex-col items-center gap-1 ${isActive ? 'tab-active bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-yellow-500' : ''}`
          }
        >
          <p>About</p>
        </NavLink>

        <NavLink
          to="/collection"
          role="tab"
          className={({ isActive }) =>
            `tab  flex-col items-center gap-1 ${isActive ? 'tab-active bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-yellow-500' : ''}`
          }
        >
          <p>Collection</p>
        </NavLink>

        <NavLink
          to="/contact"
          role="tab"
          className={({ isActive }) =>
            `tab  flex-col items-center gap-1 ${isActive ? 'tab-active bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-yellow-500' : ''}`
          }
        >
          <p>Contact</p>
        </NavLink>
      </div>

      <div className='flex item-center gap-6'>
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon} className="w-6 cursor-pointer " alt="Search" />
        <div className='group relative'>

          <img

            src={assets.profile_icon} className="w-6 cursor-pointer " alt='Profile' />

          <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
            <div className='flex flex-col gap-2 w-36 px-5 bg-slate-100 text-gray-500 rounded '>
              <p className='cursor-pointer hover:text-black'>My Profile</p>
              <p className='cursor-pointer hover:text-black'>Orders</p>
              <p className='cursor-pointer hover:text-black'>Logout</p>
            </div>
          </div>



        </div>
        <Link to={'/cart'} className='relative'>
          <img src={assets.cart_icon} alt='cart' className="w-6 cursor-pointer " />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>0</p>
        </Link>
        <img onClick={() => setVisible(true)} src={assets.menu_icon} alt='menuIcon' className="w-6 cursor-pointer sm:hidden" />
      </div>
      {/* side bar menu for small screen */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img src={assets.dropdown_icon} className='h-4' />
            <p>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to='/'>Home</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to='/collection'>Collection</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to='/about'>About</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to='/contact'>Contact</NavLink>
        </div>
      </div>
    </div>
  )
}

export default NavBar
