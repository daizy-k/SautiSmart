import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/AuthContext';

/**
 * Custom Next.js App Component (_app.js)
 * Wraps all pages to inject global Bootstrap styles, global navigation layout,
 * AuthProvider context, and the SautiSmart custom color palette & design tokens.
 */
function SautiSmartApp({ Component, pageProps }) {
  // Dynamically load Bootstrap JavaScript components (modals, dropdowns, collapsibles) on client side
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <AuthProvider>
      {/* Shared Header Navigation across all pages */}
      <Navbar />
      <main className="ss-main">
        {/* Render current page component */}
        <Component {...pageProps} />
      </main>
      <footer className="ss-footer">
        <div className="container py-4 text-center">
          <p className="mb-1">SautiSmart &mdash; Interactive Music Education for the Kenyan CBC</p>
          <p className="mb-0 small">&copy; {new Date().getFullYear()} SautiSmart. All rights reserved.</p>
        </div>
      </footer>
      <style jsx global>{`
        :root {
          --ss-teal: #0f7173;
          --ss-bronze: #e59f71;
          --ss-onyx: #0c0c0c;
          --ss-emerald: #69dc9e;
          --ss-white: #ffffff;
        }

        html,
        body {
          background-color: var(--ss-white);
          color: var(--ss-onyx);
          font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          scroll-behavior: smooth;
        }

        .ss-main {
          min-height: 70vh;
        }

        .ss-footer {
          background-color: var(--ss-onyx);
          color: var(--ss-white);
        }

        a {
          color: var(--ss-teal);
          text-decoration: none;
        }

        a:hover {
          color: var(--ss-bronze);
        }

        .btn-ss-primary {
          background-color: var(--ss-teal);
          border-color: var(--ss-teal);
          color: var(--ss-white);
        }

        .btn-ss-primary:hover {
          background-color: #0c5c5e;
          border-color: #0c5c5e;
          color: var(--ss-white);
        }

        .btn-ss-accent {
          background-color: var(--ss-bronze);
          border-color: var(--ss-bronze);
          color: var(--ss-onyx);
        }

        .btn-ss-accent:hover {
          background-color: #d18a5c;
          border-color: #d18a5c;
          color: var(--ss-onyx);
        }

        .btn-ss-play {
          background-color: var(--ss-emerald);
          border-color: var(--ss-emerald);
          color: var(--ss-onyx);
        }

        .btn-ss-play:hover {
          background-color: #4fc985;
          border-color: #4fc985;
        }

        .badge-ss {
          background-color: var(--ss-bronze);
          color: var(--ss-onyx);
        }

        .card {
          background-color: var(--ss-white);
        }

        input[type='range'].form-range {
          accent-color: var(--ss-emerald);
        }
      `}</style>
    </AuthProvider>
  );
}

export default SautiSmartApp;
