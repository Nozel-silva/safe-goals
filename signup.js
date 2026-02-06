// signup.js

import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const SUPABASE_URL = 'https://ccmsjcnuyrngqxwrswfe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjbXNqY251eXJuZ3F4d3Jzd2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MjU2MjgsImV4cCI6MjA2NzIwMTYyOH0.dkjCo2bgDMf923VKESkyMLsULo7IhmsYb6r-4Dn6SRY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const msgEl = document.getElementById('msg');
const successBox = document.getElementById('successBox');

function showMessage(text, color = '#aaa') {
  msgEl.textContent = text;
  msgEl.style.color = color;
}

document.getElementById('signupBtn').addEventListener('click', async () => {
  const username = document.getElementById('username').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !email || !password) {
    showMessage('All fields are required.', 'red');
    return;
  }

  if (username.length < 3) {
    showMessage('Username must be at least 3 characters.', 'red');
    return;
  }

  showMessage('Creating account...', '#aaa');

  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });

    if (authError) throw authError;

    // 2. Check if profile was created by the trigger
    const { data: profile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', authData.user.id)
      .single();

    if (checkError || !profile) {
      throw new Error('Profile was not created. Contact support.');
    }

    // Success
    showMessage('Account created! Check your email to confirm.', '#00ff99');
    successBox.style.display = 'block';

    setTimeout(() => {
      successBox.style.display = 'none';
      window.location.href = 'login.html';
    }, 2000);

  } catch (err) {
    console.error('Signup error:', err);
    let msg = err.message || 'Something went wrong.';

    if (msg.includes('duplicate key')) msg = 'Username or email already taken.';
    if (msg.includes('security')) msg = 'Permission issue – contact support.';
    if (msg.includes('weak password')) msg = 'Password is too weak.';

    showMessage(msg, 'red');
  }
});
