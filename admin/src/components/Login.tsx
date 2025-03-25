import React from 'react'

function Login
  () {
  return (
    <div>
      <div className='min-h-screen flex justify-center items-center'>
        <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
          <h1 className='mb-4 font-bold text-2xl'>Admin Panel</h1>
          <form >
            <div className='mb-3 min-w-72'>
              <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
              <input


                className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
                type="email"
                placeholder='your@email.com'
                required
              />
            </div>
            <div className='mb-3 min-w-72'>
              <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
              <input


                className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
                type="password"
                placeholder='Enter your password'
                required
              />
            </div>
            <button
              className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black'
              type='submit'
            >
              Login
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}

export default Login
