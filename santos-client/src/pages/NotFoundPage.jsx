import Button from '../components/Button';

const NotFoundPage = () => {
  return (
    <div className="flex w-full flex-col">

      <section className="relative border-b-2 border-blue-900 bg-blue-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-yellow-400">
            Error 404
          </p>

          <h1 className="text-7xl font-extrabold leading-none sm:text-8xl">
            Lost?
          </h1>

          <p className="mt-6 max-w-xl text-lg text-blue-100">
            The page you're looking for doesn’t exist or may have been moved.
            Let’s get you back on track.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button 
              to="/" 
              className="bg-yellow-500 text-blue-900 hover:bg-yellow-400"
            >
              Back Home
            </Button>

            <Button 
              to="/products" 
              className="border border-white text-white hover:bg-white hover:text-blue-900"
            >
              View Products
            </Button>
          </div>
        </div>

        <h1 className="pointer-events-none absolute right-6 top-6 text-[120px] font-black text-white/10 sm:text-[180px]">
          404
        </h1>
      </section>

      {/* QUICK LINKS */}
      <section className="bg-zinc-50 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-900">
            Quick Links
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-900">
            Explore the site
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            
            {/* HOME CARD */}
            <div className="group rounded-3xl border-2 border-blue-900 bg-white p-6 transition hover:shadow-xl">
              <h3 className="text-lg font-semibold text-blue-900">Home</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Return to the homepage and continue browsing.
              </p>
              <Button 
                to="/" 
                className="mt-4 bg-blue-900 text-white group-hover:bg-yellow-500 group-hover:text-blue-900"
              >
                Go Home
              </Button>
            </div>

            {/* PRODUCTS CARD */}
            <div className="group rounded-3xl border-2 border-blue-900 bg-white p-6 transition hover:shadow-xl">
              <h3 className="text-lg font-semibold text-blue-900">Products</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Check out all available campus essentials.
              </p>
              <Button 
                to="/products" 
                className="mt-4 bg-blue-900 text-white group-hover:bg-yellow-500 group-hover:text-blue-900"
              >
                View Products
              </Button>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}

export default NotFoundPage