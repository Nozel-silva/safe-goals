document.getElementById('fixture-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const homeName = document.getElementById('homeName').value;
  const awayName = document.getElementById('awayName').value;
  const homeGSP = parseInt(document.getElementById('homeGSP').value);
  const awayGSP = parseInt(document.getElementById('awayGSP').value);

  const { error } = await supabase.from('fixtures').insert([
    {
      home_name: homeName,
      away_name: awayName,
      home_gsp: homeGSP,
      away_gsp: awayGSP,
    }
  ]);

  if (error) {
    alert('Error saving fixture.');
    console.error(error);
  } else {
    alert('Fixture saved!');
    document.getElementById('fixture-form').reset();
  }
});
