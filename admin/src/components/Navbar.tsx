import { assets } from '../assets/assets';

interface NavbarProps {
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

const Navbar: React.FC<NavbarProps> = ({ setToken }) => {
  return (
    <div className="flex items-center justify-between py-3 px-[4%] bg-white shadow-md sticky top-0 z-50  " >
      <img className="w-[max(10%,70px)]" alt="Logo" src={assets.logo} />


      <button onClick={() => setToken('')} className="btn btn-sm sm:btn-md bg-gray-800 hover:bg-gray-700 text-white rounded-full">
        Logout
      </button>
    </div >
  );
}

export default Navbar;
