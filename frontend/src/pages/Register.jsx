import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContextValue';
import AmazonLogo from '../components/AmazonLogo';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
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
      setError(result.message || 'Registration failed. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="amz-login-wrapper" style={{ minHeight: '85vh', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <AmazonLogo variant="dark" size="large" />
      </div>
      
      <div className="amz-login-container" style={{ width: '380px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.25rem' }}>Create account</h1>
        
        {error && <div className="alert alert-danger" style={{ marginBottom: '1rem', padding: '10px', background: '#fdf2f2', color: '#b91c1c', borderRadius: '4px', fontSize: '0.85rem' }}>{error}</div>}
        {success && <div className="alert alert-success" style={{ marginBottom: '1rem', padding: '10px', background: '#f0fdf4', color: '#15803d', borderRadius: '4px', fontSize: '0.85rem' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="amz-input-group">
            <label htmlFor="reg-name">Your name</label>
            <input
              id="reg-name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First and last name"
              autoComplete="name"
              required
            />
          </div>

          <div className="amz-input-group">
            <label htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="amz-input-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="amz-input-group">
            <label htmlFor="reg-role">Account Type</label>
            <select
              id="reg-role"
              name="role"
              className="amz-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                height: '35px',
                borderRadius: '3px',
                border: '1px solid #a6a6a6',
                padding: '0 8px',
                fontSize: '0.9rem',
                backgroundColor: '#f7f7f7'
              }}
            >
              <option value="customer">Customer (Buy Products)</option>
              <option value="seller">Seller (Sell Products & Business)</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="amz-login-signInButton" 
            style={{ fontWeight: 600, marginTop: '1rem' }} 
            disabled={submitting}
          >
            {submitting ? 'Creating account...' : 'Create your Amazon account'}
          </button>
        </form>

        <p className="amz-login-terms" style={{ fontSize: '0.75rem', marginTop: '1rem', color: '#555' }}>
          By creating an account, you agree to Amazon Clone's <a href="#" style={{ color: '#0066c0' }}>Conditions of Use & Sale</a> and <a href="#" style={{ color: '#0066c0' }}>Privacy Notice</a>.
        </p>

        <div style={{ borderTop: '1px solid #e7e7e7', marginTop: '1.5rem', paddingTop: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#0066c0', fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
