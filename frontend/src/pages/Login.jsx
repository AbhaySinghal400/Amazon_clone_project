import { useState } from 'react';
import { useAuth } from '../context/AuthContextValue';
import { useNavigate, Link } from 'react-router-dom';
import AmazonLogo from '../components/AmazonLogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/'); 
    }
  };

  return (
    <div className="amz-login-wrapper">
      <div style={{ marginBottom: '1.25rem' }}>
        <AmazonLogo variant="dark" size="large" />
      </div>
      
      <div className="amz-login-container">
        <h1>Sign in</h1>
        
        <form onSubmit={submitHandler}>
          <div className="amz-input-group">
            <label htmlFor="login-email">Email or mobile phone number</label>
            <input 
              id="login-email"
              name="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              autoComplete="email"
              required 
            />
          </div>
          
          <div className="amz-input-group">
            <label htmlFor="login-password">Password</label>
            <input 
              id="login-password"
              name="password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              autoComplete="current-password"
              required 
            />
          </div>
          
          <button type="submit" className="amz-login-signInButton">
            Continue
          </button>
        </form>

        <p className="amz-login-terms">
          By continuing, you agree to Amazon's <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
        </p>
        
        <div className="amz-login-divider"></div>
        
        <div className="amz-login-business">
          <strong>Buying for work?</strong>
          <a href="#">Create a free business account</a>
        </div>
      </div>

      <div className="amz-login-new-wrapper">
        <div className="amz-login-divider-text">New to Amazon?</div>
        <button 
          className="amz-login-registerButton" 
          onClick={() => navigate('/register')}
        >
          Create your Amazon account
        </button>
      </div>
    </div>
  );
};

export default Login;
