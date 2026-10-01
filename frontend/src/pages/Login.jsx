import { useState } from 'react';
import { useAuth } from '../context/AuthContextValue';
import { useNavigate, Link } from 'react-router-dom';

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
      <Link to="/">
        <img 
          className="amz-login-logo" 
          src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
          alt="Amazon Logo" 
        />
      </Link>
      
      <div className="amz-login-container">
        <h1>Sign in</h1>
        
        <form onSubmit={submitHandler}>
          <div className="amz-input-group">
            <label>Email or mobile phone number</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="amz-input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
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
