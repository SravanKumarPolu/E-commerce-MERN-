import './App.css'

import { Route, Routes } from 'react-router-dom'

import About from './pages/About'
import Cart from './pages/Cart'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import NavBar from './components/NavBar'
import Orders from './pages/Orders'
import PlaceOrder from './pages/PlaceOrder'
import Product from './pages/Product'
import SearchBar from './components/SearchBar'

function App() {


  return (
    <>
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-screen-xl mx-auto">
        <NavBar />

        <SearchBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/Contact' element={<Contact />} />
          <Route path='/Product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/place-order' element={<PlaceOrder />} />

          <Route path='/orders' element={<Orders />} />
        </Routes>
        <Footer />
      </div>

    </>
  )
}

export default App
