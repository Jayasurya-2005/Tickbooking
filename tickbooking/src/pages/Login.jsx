import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth.js';
import { getApiErrorMessage, userApi } from '../services/api.js';

export default function Login() {
const navigate = useNavigate();
const location = useLocation();
const { acceptLogin } = useAuth();

const [form, setForm] = useState({
email: location.state?.email || '',
password: '',
});

const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

function updateForm(event) {
const { name, value } = event.target;

setForm((current) => ({
  ...current,
  [name]: value,
}));


}

async function handleSubmit(event) {
event.preventDefault();
setError('');


const email = form.email.trim();

if (!email || !form.password) {
  setError('Please enter your email and password.');
  return;
}

setLoading(true);

try {
  const response = await userApi.post('/user/login', {
    email,
    password: form.password,
  });

  const data = response.data;

  if (!data?.token) {
    setError(
      'The login service did not return a JWT token. Check the backend login response.'
    );
    return;
  }

  // Save authentication state using the existing auth context.
  acceptLogin(data);

  // Return to the original protected route, if one exists.
  const destination = location.state?.from?.pathname || '/';

  navigate(destination, { replace: true });
} catch (requestError) {
  const message = getApiErrorMessage(
    requestError,
    'Unable to log in. Please check your credentials and try again.'
  );

  if (!requestError.response) {
    setError(
      'Cannot connect to the User Service. Check that it is running on port 8081.'
    );
  } else {
    setError(message);
  }
} finally {
  setForm((current) => ({
    ...current,
    password: '',
  }));

  setLoading(false);
}


}

return ( <section className="auth-page"> <div className="auth-card"> <div className="auth-mark">T</div>


    <p className="eyebrow">WELCOME BACK</p>

    <h1>Log in to TickBook</h1>

    <p className="auth-subtitle">
      Sign in to keep your movie nights close.
    </p>

    {location.state?.message && (
      <div className="notice notice-success" role="status">
        {location.state.message}
      </div>
    )}

    {error && (
      <div className="notice notice-error" role="alert">
        {error}
      </div>
    )}

    <form className="auth-form" onSubmit={handleSubmit}>
      <label htmlFor="login-email">Email</label>
      <input
        id="login-email"
        name="email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={updateForm}
        maxLength={254}
        required
      />

      <label htmlFor="login-password">Password</label>
      <input
        id="login-password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={form.password}
        onChange={updateForm}
        required
      />

      <button
        className="button button-primary auth-submit"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Log in'}
      </button>
    </form>

    <p className="auth-switch">
      New to TickBook? <Link to="/register">Create an account</Link>
    </p>
  </div>
</section>


);
}
