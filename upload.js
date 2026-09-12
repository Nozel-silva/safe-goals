// ===== GSP calculator logic (separate from submission logic below) =====
const teamData = { '1': null, '2': null };

function calculateTeam(n) {
  const primaryGoals = n === '1'
    ? parseFloat(document.getElementById('homeGoals1').value) || 0
    : parseFloat(document.getElementById('awayGoals2').value) || 0;

  const secondaryGoals = n === '1'
    ? parseFloat(document.getElementById('awayGoals1').value) || 0
    : parseFloat(document.getElementById('homeGoals2').value) || 0;

  const sum = primaryGoals + secondaryGoals;
  const gsp = sum === 0 ? 0 : (primaryGoals / sum) * 100;

  const formValue = parseFloat(document.getElementById('form' + n + 'Input').value) || 0;
  const trueGsp = (gsp + formValue) / 2;

  document.getElementById('gsp' + n).textContent = gsp.toFixed(2) + '%';
  document.getElementById('ar' + n).textContent = trueGsp.toFixed(2);

  const clubName = document.getElementById('clubName' + n).value || (n === '1' ? 'Home' : 'Away');

  teamData[n] = { club: clubName, ar: trueGsp };

  // Push values into the submission form fields below
  if (n === '1') {
    document.getElementById('homeName').value = clubName;
    document.getElementById('homeGSP').value = trueGsp.toFixed(2);
  } else {
    document.getElementById('awayName').value = clubName;
    document.getElementById('awayGSP').value = trueGsp.toFixed(2);
  }

  updateMatchSummary();
}

function updateMatchSummary() {
  const home = teamData['1'];
  const away = teamData['2'];
  const el = document.getElementById('matchSummary');

  if (!home || !away) {
    el.textContent = 'Calculate both teams to see the comparison.';
    return;
  }

  const diff = Math.abs(home.ar - away.ar).toFixed(2);
  const favoured = home.ar === away.ar
    ? 'Evenly matched'
    : (home.ar > away.ar ? home.club : away.club) + ' favoured';

  el.innerHTML = `${home.club}: ${home.ar.toFixed(2)} &nbsp;|&nbsp; ${away.club}: ${away.ar.toFixed(2)}<br>${favoured} (margin: ${diff})`;
}

// ===== Submission logic (untouched from your original) =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('JS loaded ✅');

  const SUPABASE_URL = 'https://ccmsjcnuyrngqxwrswfe.supabase.co';
  const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjbXNqY251eXJuZ3F4d3Jzd2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MjU2MjgsImV4cCI6MjA2NzIwMTYyOH0.dkjCo2bgDMf923VKESkyMLsULo7IhmsYb6r-4Dn6SRY';

  const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  const form = document.getElementById('fixture-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    alert('Submitting…'); // 🔥 sanity check

    const homeName = document.getElementById('homeName').value.trim();
    const awayName = document.getElementById('awayName').value.trim();
    const homeGSP = Number(document.getElementById('homeGSP').value);
    const awayGSP = Number(document.getElementById('awayGSP').value);

    const { data, error } = await supabase
      .from('fixtures')
      .insert([
        {
          home_name: homeName,
          away_name: awayName,
          home_gsp: homeGSP,
          away_gsp: awayGSP
        }
      ])
      .select();

    if (error) {
      console.error(error);
      alert('❌ Insert failed: ' + error.message);
    } else {
      console.log(data);
      alert('✅ Fixture saved!');
      form.reset();
    }
  });
});
