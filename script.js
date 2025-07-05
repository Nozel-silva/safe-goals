console.log("script.js loaded ✅");
alert("Script is running!");// Confirm the file loads
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('fixture-form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    alert("🚀 Submit button clicked!"); // <-- this confirms the button is connected
  });
});

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded ✅");

  const form = document.getElementById('fixture-form');
  if (!form) {
    console.error("❌ Form with id 'fixture-form' not found!");
    return;
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log("✅ Submit clicked!");

    const homeName = document.getElementById('homeName').value.trim();
    const awayName = document.getElementById('awayName').value.trim();
    const homeGSP = parseInt(document.getElementById('homeGSP').value);
    const awayGSP = parseInt(document.getElementById('awayGSP').value);

    console.log("Collected values:", { homeName, awayName, homeGSP, awayGSP });

    if (!homeName || !awayName || isNaN(homeGSP) || isNaN(awayGSP)) {
      alert('❌ Please fill in all fields correctly.');
      return;
    }

    const { error } = await supabase.from('fixtures').insert([
      {
        home_name: homeName,
        away_name: awayName,
        home_gsp: homeGSP,
        away_gsp: awayGSP
      }
    ]);

    if (error) {
      console.error('❌ Supabase insert error:', error);
      alert('❌ Something went wrong while saving.');
    } else {
      alert('✅ Fixture saved successfully!');
      form.reset();
    }
  });
});
