import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Top Section */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-white">BulldogEx Shop</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Campus essentials made easy. Fast ordering, smooth pickup.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Navigation
            </p>
           <ul className="space-y-2 text-sm text-zinc-400">
  <li>
    <Link to="/" className="hover:text-white">Home</Link>
  </li>
  <li>
    <Link to="/products" className="hover:text-white">Products</Link>
  </li>
  <li>
    <Link to="/about" className="hover:text-white">About</Link>
  </li>
</ul>
          </div>

          {/* Support */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Support
            </p>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="hover:text-white cursor-pointer">Help Center</li>
              <li className="hover:text-white cursor-pointer">Contact Us</li>
              <li className="hover:text-white cursor-pointer">FAQs</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Follow Us
            </p>
            <div className="flex gap-4 text-zinc-400">
              <span className="cursor-pointer hover:text-white">Facebook</span>
              <span className="cursor-pointer hover:text-white">Instagram</span>
              <span className="cursor-pointer hover:text-white">Twitter</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-zinc-800" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} BulldogEx Shop. All rights reserved.</p>
          <p className="uppercase tracking-widest">
            Simple • Fast • Reliable
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer