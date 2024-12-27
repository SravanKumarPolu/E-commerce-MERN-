

const NewsletterBox = () => {
  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }
  return (
    <div className='flex flex-col text-center'>
      <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>

      <p className="text-gray-500 mt-3 mb-6 text-lg">Sign up for the best deals and updates.</p>
      <form onSubmit={onSubmitHandler} className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3">
        <input className="w-full sm:flex-1 outline-none" type="email" placeholder="Enter your Email" required />
        <button type="submit" className="bg-black text-white text-xs px-10 py-4">Subscribe</button>
      </form>

    </div>
  )
}

export default NewsletterBox