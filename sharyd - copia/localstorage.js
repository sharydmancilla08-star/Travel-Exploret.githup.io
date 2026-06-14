// Function to fetch a country by its name
async function getCountryData(countryName) {
  // const baseUrl = 'https://restcountries.com/v3.1';
  fetch(
  'https://api.restcountries.com/countries/v5?limit=1',
  { headers: { 'Authorization': 'Bearer rc_live_48790127287749fbb3ba9674ae9c0474' } }
)
  .then(function (response) { return response.json(); })
  .then(function (data) { console.log(data); });

  try {
    const response = await fetch(`${baseUrl}/name/${encodeURIComponent(countryName)}?fullText=true`);

    if (!response.ok) {
      throw new Error(`Country not found (${response.status})`);
    }

    const data = await response.json();
    const country = data[0];

    console.log("Official Name:", country.name.official || country.name.common);
    console.log("Capital:", (country.capital && country.capital[0]) || "N/A");
    console.log("Population:", country.population);
    console.log("Flag Image URL:", country.flags?.png || country.flags?.svg);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

// Execute the function
getCountryData("Colombia");
