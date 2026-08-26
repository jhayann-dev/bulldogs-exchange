import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/img/nubdexchange_logo.png';
import Button from './Button';
import { useAuth } from '../context/authContext.jsx';

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Products', to: '/products' },
];

const navLinkClassName = ({ isActive }) =>
  [
    'rounded-full border-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition',
    isActive
      ? 'border-zinc-900 bg-zinc-900 text-zinc-50'
      : 'border-transparent text-zinc-500 hover:border-zinc-900 hover:bg-zinc-50 hover:text-zinc-900',
  ].join(' ');

const profileLinkClassName = ({ isActive }) =>
  [
    'rounded-full border-2 px-4 py-2 text-xs font-medium transition',
    isActive
      ? 'border-zinc-900 bg-zinc-900 text-zinc-50'
      : 'border-transparent text-zinc-600 hover:border-zinc-900 hover:bg-zinc-50 hover:text-zinc-900',
  ].join(' ');

const NavBar = () => {
  const { user, hasRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminZone = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-zinc-900 bg-zinc-100/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <img src={logo} alt="BulldogEx" className="h-9 w-9 rounded-full border-2 border-zinc-900 bg-zinc-50 object-contain" />
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-zinc-900">BulldogEx Shop</p>
            {isAdminZone && (
              <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                Admin Mode
              </span>
            )}
          </div>
        </NavLink>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-2 md:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={navLinkClassName}>
                {link.label}
              </NavLink>
            ))}

            {user && (
              <NavLink to="/orders" className={navLinkClassName}>
                Orders
              </NavLink>
            )}

            {hasRole('admin') && (
              <NavLink to="/admin" className={navLinkClassName}>
                Admin
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <NavLink to="/profile" className={profileLinkClassName}>
                  Hi, {user.firstName}
                </NavLink>
                <Button type="button" variant="secondary" className="rounded-full" onClick={handleLogout}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button to="/auth/signin" variant="secondary" className="rounded-full">
                  Log In
                </Button>
                <Button to="/auth/signup" variant="primary" className="rounded-full">
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;