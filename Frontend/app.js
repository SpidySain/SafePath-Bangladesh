// Simple SPA for login/signup
const $ = id => document.getElementById(id);

const switchTab = (t) => {
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.form').forEach(el => el.classList.remove('active'));
  $("tab-"+t).classList.add('active');
  if (t === 'login') $("login-form").classList.add('active');
  else $("signup-form").classList.add('active');
}

$('tab-login').addEventListener('click', () => switchTab('login'));
$('tab-signup').addEventListener('click', () => switchTab('signup'));

const api = '/api/auth';

const showMsg = (id, message, success = false) => {
  const el = $(id);
  el.textContent = message;
  el.style.color = success ? 'var(--green)' : '';
}

const setProfile = (user) => {
  if (!user) {
    document.querySelector('#profile').classList.remove('active');
    document.querySelector('#login-form').classList.add('active');
    document.querySelector('#signup-form').classList.remove('active');
    return;
  }
  $('user-name').textContent = user.name;
  $('user-email').textContent = user.email;
  document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
  document.querySelector('#profile').classList.add('active');
}

// Check stored token and try to fetch /me
const token = localStorage.getItem('token');
if (token) {
  fetch('/api/auth/me', { headers: { Authorization: 'Bearer '+token } })
    .then(r => r.json())
    .then(data => {
      if (data && data.user) setProfile(data.user);
      else setProfile(null);
    }).catch(() => setProfile(null));
}

// Signup
$('btn-signup').addEventListener('click', async () => {
  const name = $('signup-name').value.trim();
  const email = $('signup-email').value.trim();
  const password = $('signup-password').value;
  showMsg('signup-msg', '');
  if (!name || !email || !password) return showMsg('signup-msg', 'Please fill all fields');
  const res = await fetch(api + '/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ name, email, password }) });
  const data = await res.json();
  if (!res.ok) return showMsg('signup-msg', data.message || 'Error creating account');
  localStorage.setItem('token', data.token);
  setProfile(data.user);
});

// Login
$('btn-login').addEventListener('click', async () => {
  const email = $('login-email').value.trim();
  const password = $('login-password').value;
  showMsg('login-msg', '');
  if (!email || !password) return showMsg('login-msg', 'Please fill all fields');
  const res = await fetch(api + '/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
  const data = await res.json();
  if (!res.ok) return showMsg('login-msg', data.message || 'Invalid credentials');
  localStorage.setItem('token', data.token);
  setProfile(data.user);
});

// Logout
$('btn-logout').addEventListener('click', () => {
  localStorage.removeItem('token');
  setProfile(null);
  switchTab('login');
});

// initial UI
switchTab('login');
