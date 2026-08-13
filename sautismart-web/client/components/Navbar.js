import Link from 'next/link';
import { useRouter } from 'next/router';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/archive', label: 'Cultural Archive' },
  { href: '/setpieces', label: 'Set Pieces' },
  { href: '/theory', label: 'Theory Revision' },
];

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ backgroundColor: '#0F7173' }}>
      <div className="container">
        <Link href="/" className="navbar-brand fw-bold d-flex align-items-center gap-2">
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-circle"
            style={{ backgroundColor: '#69DC9E', color: '#0C0C0C', width: '36px', height: '36px' }}
          >
            {'♪'}
          </span>
          SautiSmart
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
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
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
          </ul>
        </div>
      </div>
    </nav>
  );
}
