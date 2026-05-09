const { createClient } = window.supabase
const supabase = window.supabase.createClient(
  'https://ccmsjcnuyrngqxwrswfe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjbXNqY251eXJuZ3F4d3Jzd2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MjU2MjgsImV4cCI6MjA2NzIwMTYyOH0.dkjCo2bgDMf923VKESkyMLsULo7IhmsYb6r-4Dn6SRY'
)

function switchTab(tab) {
  document.getElementById('tab-login').classList.toggle('active', tab === 'login')
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup')
  document.getElementById('panel-login').classList.toggle('active', tab === 'login')
  document.getElementById('panel-signup').classList.toggle('active', tab === 'signup')
  document.getElementById('page-title').textContent = tab === 'login' ? 'Welcome back' : 'Create account'
  document.getElementById('page-sub').textContent = tab === 'login' ? 'Sign in to your account to continue' : 'Sign up to get started'
  hideError()
}

function showError(msg) {
  const el = document.getElementById('error-msg')
  el.textContent = msg
  el.style.display = 'block'
}

function hideError() {
  document.getElementById('error-msg').style.display = 'none'
}

async function handleGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard'
    }
  })
  if (error) showError(error.message)
}

async function handleLogin() {
  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value
  if (!email || !password) return showError('Please fill in all fields.')
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) showError(error.message)
  else window.location.href = '/dashboard'
}

async function handleSignup() {
  const email = document.getElementById('signup-email').value
  const password = document.getElementById('signup-password').value
  if (!email || !password) return showError('Please fill in all fields.')
  if (password.length < 8) return showError('Password must be at least 8 characters.')
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) showError(error.message)
  else showError('Done! Check your email to confirm your account.')
}

async function handleForgot() {
  const email = document.getElementById('login-email').value
  if (!email) return showError('Enter your email above first, then click Forgot.')
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset-password'
  })
  if (error) showError(error.message)
  else showError('Password reset email sent! Check your inbox.')
}

function showError(msg) {
  const el = document.getElementById('error-msg')
  el.textContent = msg
  el.style.display = 'block'
}

async function handleGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard'
    }
  })
  if (error) showError(error.message)
}

function handleThankYou() {
  alert('Thank you!')
}
