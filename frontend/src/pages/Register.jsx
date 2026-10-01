import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContextValue';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // Default to customer
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setSuccess('');
    setSubmitting(true);

    const result = await register(name, email, password, role);
    if (result.success) {
      setSuccess(result.message || 'Registration successful! Verification email sent.');
      setName('');
      setEmail('');
      setPassword('');
      setRole('customer');
    } else {
      setError(result.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="login-container flex-center animate-fade-in" style={{ minHeight: '90vh' }}>
      <div className="login-logo-wrapper">
        <Link to="/" className="login-logo">
          amazon<span>marketplace</span>
        </Link>
      </div>

      <div className="card login-card" style={{ maxWidth: '420px' }}>
        <h2>Create account</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} style={{ marginTop: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">Your name</label>
            <input
              id="register-name"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First and last name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email address</label>
            <input
              id="register-email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-role">Account Type</label>
            <select
              id="register-role"
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customer">Customer (Buy Products)</option>
              <option value="seller">Seller (List Business & Sell Products)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="login-terms">
          By creating an account, you agree to Amazon Clone's Conditions of Use & Sale.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0 1rem 0' }} />

        <p style={{ fontSize: '0.85rem', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: '#0066c0', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
