import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/archive', label: 'Cultural Archive' },
  { href: '/setpieces', label: 'Set Pieces' },
  { href: '/theory', label: 'Theory Revision' },
];

export default function Navbar() {
  const router = useRouter();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm" style={{ backgroundColor: '#0F7173' }}>
      <div className="container">
        <Link href="/" className="navbar-brand fw-bold d-flex align-items-center gap-2">
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-circle"
            style={{ backgroundColor: '#69DC9E', color: '#0C0C0C', width: '36px', height: '36px' }}
          >
            {'♪'}
          </span>
          <div className="d-flex flex-column">
            <span>SautiSmart</span>
            <small className="fw-normal opacity-75" style={{ fontSize: '0.65rem', lineHeight: '1' }}>
              Music Learning App for CBC Students
            </small>
          </div>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sautiSmartNavbar"
          aria-controls="sautiSmartNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="sautiSmartNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            {NAV_LINKS.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <li className="nav-item" key={link.href}>
                  <Link
                    href={link.href}
                    className="nav-link px-3"
                    style={isActive ? { color: '#E59F71', fontWeight: 600 } : { color: '#FFFFFF' }}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}

            {isAdmin && (
              <li className="nav-item">
                <Link
                  href="/admin/dashboard"
                  className="nav-link px-3 fw-semibold"
                  style={router.pathname.startsWith('/admin') ? { color: '#E59F71' } : { color: '#69DC9E' }}
                >
                  Admin Dashboard
                </Link>
              </li>
            )}

            {user ? (
              <li className="nav-item ms-lg-3 d-flex align-items-center gap-2 mt-2 mt-lg-0">
                <div className="d-flex align-items-center gap-2 px-3 py-1 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF' }}>
                  <span className="fw-semibold small">{user.name}</span>
                  <span
                    className="badge rounded-pill text-uppercase"
                    style={{
                      backgroundColor: user.role === 'admin' ? '#E59F71' : '#69DC9E',
                      color: '#0C0C0C',
                      fontSize: '0.65rem',
                    }}
                  >
                    {user.role} &middot; Music Learning App for CBC Students
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-sm text-white border-0 px-2"
                  style={{ backgroundColor: 'transparent' }}
                  title="Log Out"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                <Link
                  href="/login"
                  className="btn btn-sm px-3 fw-semibold"
                  style={{ backgroundColor: '#E59F71', color: '#0C0C0C' }}
                >
                  Log In / Sign Up
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
