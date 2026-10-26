import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiErrorMessage, userApi } from '../services/api.js';

export default function Register() {
const navigate = useNavigate();

const [form, setForm] = useState({
name: '',
email: '',
password: '',
confirmPassword: '',
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


const name = form.name.trim();
const email = form.email.trim();

if (!name || !email || !form.password || !form.confirmPassword) {
  setError('Please complete all fields.');
  return;
}

// Validate email format
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  setError('Please enter a valid email address.');
  return;
}

if (form.password.length < 8) {
  setError('Password must contain at least 8 characters.');
  return;
}

if (form.password !== form.confirmPassword) {
  setError('Passwords do not match.');
  return;
}

setLoading(true);

try {
  const response = await userApi.post('/user/register', {
    name,
    email,
    password: form.password,
  });

  const registeredName =
    typeof response.data?.name === 'string'
      ? `, ${response.data.name}`
      : '';

  setForm({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  navigate('/login', {
    replace: true,
    state: {
      message: `Your account${registeredName} has been created. Please log in.`,
      email,
    },
  });
} catch (requestError) {
  const status = requestError?.response?.status;
  const message = getApiErrorMessage(
    requestError,
    'Unable to create your account. Please try again.'
  );

  const responseDetails = JSON.stringify(
    requestError?.response?.data ?? ''
  );

  if (
    status === 409 ||
    /email.*(exist|registered|already)|duplicate/i.test(
      `${message} ${responseDetails}`
    )
  ) {
    setError('This email is already registered. Please log in.');
  } else if (!requestError.response) {
    setError(
      'Cannot connect to the User Service. Check that it is running on port 8081.'
    );
  } else {
    setError(message);
  }
} finally {
  setLoading(false);
}

}

return ( <section className="auth-page"> <div className="auth-card"> <div className="auth-mark">T</div>


    <p className="eyebrow">JOIN THE CLUB</p>

    <h1>Create your account</h1>

    <p className="auth-subtitle">
      A better movie night is just around the corner.
    </p>

    {error && (
      <div className="notice notice-error" role="alert">
        {error}
      </div>
    )}

    <form className="auth-form" onSubmit={handleSubmit}>
      <label htmlFor="register-name">Name</label>
      <input
        id="register-name"
        name="name"
        type="text"
        autoComplete="name"
        value={form.name}
        onChange={updateForm}
        maxLength={120}
        required
      />

      <label htmlFor="register-email">Email</label>
      <input
        id="register-email"
        name="email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={updateForm}
        maxLength={254}
        required
      />

      <label htmlFor="register-password">Password</label>
      <input
        id="register-password"
        name="password"
        type="password"
        autoComplete="new-password"
        value={form.password}
        onChange={updateForm}
        minLength={8}
        required
      />

      <label htmlFor="register-confirm-password">
        Confirm password
      </label>
      <input
        id="register-confirm-password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        value={form.confirmPassword}
        onChange={updateForm}
        minLength={8}
        required
      />

      <button
        className="button button-primary auth-submit"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>

    <p className="auth-switch">
      Already have an account? <Link to="/login">Log in</Link>
    </p>
  </div>
</section>
);
}
