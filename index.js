const SUPABASE_URL = "https://ccmsjcnuyrngqxwrswfe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjbXNqY251eXJuZ3F4d3Jzd2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MjU2MjgsImV4cCI6MjA2NzIwMTYyOH0.dkjCo2bgDMf923VKESkyMLsULo7IhmsYb6r-4Dn6SRY";

const { createClient } = window.supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function teamRisk(gsp) {
  if (gsp < 50)               return { text: "High Risk",   cls: "high"   };
  if (gsp >= 55 && gsp <= 60) return { text: "Medium Risk", cls: "medium" };
  if (gsp >= 61)              return { text: "Low Risk",    cls: "low"    };
  return                             { text: "Unclear",     cls: ""       };
}

function combinedRisk(sum) {
  if (sum >= 140) return { text: "Low Risk",    cls: "low"    };
  if (sum >= 100) return { text: "Medium Risk", cls: "medium" };
  return                 { text: "High Risk",   cls: "high"   };
}

function renderCard(f, i) {
  const home = Number(f.home_gsp) || 0;
  const away = Number(f.away_gsp) || 0;
  const total = home + away;
  const hRisk = teamRisk(home);
  const aRisk = teamRisk(away);
  const cRisk = combinedRisk(total);

  return `
    <div class="fixture-card" style="animation-delay:${i * 0.08}s">
      <div class="fixture-teams">
        ${f.home_name} <span class="vs">vs</span> ${f.away_name}
      </div>
      <div class="sub-label">Over 0.5 Goal – Per Team</div>
      <div class="risk-row">
        <span class="team-name">${f.home_name} (${home}%)</span>
        <span class="risk-pill ${hRisk.cls}">${hRisk.text}</span>
      </div>
      <div class="risk-row">
        <span class="team-name">${f.away_name} (${away}%)</span>
        <span class="risk-pill ${aRisk.cls}">${aRisk.text}</span>
      </div>
      <hr class="card-divider"/>
      <div class="sub-label">Over 1.5 Goals – Combined</div>
      <div class="combined-row">
        <span class="combined-label">Total GSP (${total}%)</span>
        <span class="risk-pill ${cRisk.cls}">${cRisk.text}</span>
      </div>
    </div>
  `;
}

async function loadSamples() {
  const list = document.getElementById('fixture-list');

  const { data, error } = await sb
    .from('fixtures')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  console.log('data:', data);
  console.log('error:', error);

  if (error) {
    list.innerHTML = `<div class="empty-state" style="color:var(--high)">Error: ${error.message}</div>`;
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = '<div class="empty-state">No fixtures in database yet.</div>';
    return;
  }

  list.innerHTML = data.map((f, i) => renderCard(f, i)).join('');
}

window.addEventListener('DOMContentLoaded', loadSamples);
