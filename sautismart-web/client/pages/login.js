import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, user } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if already logged in
  if (user) {
    if (user.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/');
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const loggedUser = await login(formData.email, formData.password);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          if (loggedUser.role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/');
          }
        }, 1000);
      } else {
        const signedUser = await signup(formData);
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          if (signedUser.role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/');
          }
        }, 1000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{isLogin ? 'Log In' : 'Sign Up'} | SautiSmart</title>
      </Head>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              {/* Header Banner */}
              <div className="py-4 text-center text-white" style={{ backgroundColor: '#0F7173' }}>
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                  style={{ backgroundColor: '#69DC9E', color: '#0C0C0C', width: '48px', height: '48px' }}
                >
                  <span className="fs-3">♪</span>
                </div>
                <h2 className="h4 fw-bold mb-1">Welcome to SautiSmart</h2>
                <p className="small mb-0 opacity-75">Kenyan CBC Music Education Platform</p>
              </div>

              {/* Tab Selector */}
              <div className="d-flex border-bottom bg-light">
                <button
                  type="button"
                  className={`btn flex-fill rounded-0 py-3 fw-semibold ${isLogin ? 'active-tab' : ''}`}
                  style={{
                    backgroundColor: isLogin ? '#FFFFFF' : 'transparent',
                    color: isLogin ? '#0F7173' : '#6c757d',
                    borderBottom: isLogin ? '3px solid #0F7173' : 'none',
                  }}
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                    setSuccess('');
                  }}
                >
                  Log In
                </button>
                <button
                  type="button"
                  className={`btn flex-fill rounded-0 py-3 fw-semibold ${!isLogin ? 'active-tab' : ''}`}
                  style={{
                    backgroundColor: !isLogin ? '#FFFFFF' : 'transparent',
                    color: !isLogin ? '#0F7173' : '#6c757d',
                    borderBottom: !isLogin ? '3px solid #0F7173' : 'none',
                  }}
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                    setSuccess('');
                  }}
                >
                  Sign Up
                </button>
              </div>

              {/* Card Body Form */}
              <div className="card-body p-4">
                {error && (
                  <div className="alert alert-danger p-2 small mb-3" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success p-2 small mb-3" style={{ backgroundColor: '#69DC9E', color: '#0C0C0C', borderColor: '#69DC9E' }} role="alert">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {!isLogin && (
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label fw-semibold small" style={{ color: '#0C0C0C' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="e.g. Wanjiku Omondi"
                        value={formData.name}
                        onChange={handleChange}
                        required={!isLogin}
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold small" style={{ color: '#0C0C0C' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold small" style={{ color: '#0C0C0C' }}>
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={6}
                      required
                    />
                  </div>

                  {!isLogin && (
                    <div className="mb-4">
                      <label htmlFor="role" className="form-label fw-semibold small" style={{ color: '#0C0C0C' }}>
                        Account Role
                      </label>
                      <select
                        id="role"
                        name="role"
                        className="form-select"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="student">Student (Read-only learner access)</option>
                        <option value="admin">Admin (Content Manager)</option>
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn w-100 py-2 fw-bold text-white shadow-sm mt-2"
                    style={{ backgroundColor: '#0F7173', borderColor: '#0F7173' }}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    ) : isLogin ? (
                      'Log In'
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
