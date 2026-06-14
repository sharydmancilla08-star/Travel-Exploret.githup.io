const compas = document.getElementById("compas");
const barraLateral = document.querySelector(".barra-lateral");
const spans = document.querySelectorAll("span");
const palanca = document.querySelector(".switch");
const circulo = document.querySelector(".circulo");
const menu = document.querySelector(".menu");
const main = document.querySelector("main");
const luna = document.querySelector(".info");
const logoutBtn = document.getElementById("logout-btn");
const searchInput = document.getElementById("country-input");
const filterInput = document.getElementById("filter-input");
const loader = document.getElementById("loader");
const countryListContainer = document.getElementById("country-list-container");
const countryDetailContainer = document.getElementById("country-detail-container");
const historyList = document.getElementById("history-timeline-list");
const welcomeMessage = document.getElementById("welcome-message");
const dashCountriesCount = document.getElementById("dash-countries-count");
const dashFavoritesCount = document.getElementById("dash-favorites-count");
const dashAttractionsCount = document.getElementById("dash-attractions-count");
const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");
const profileCountry = document.getElementById("profile-country");
const weatherCountryInput = document.getElementById("weather-country-input");
const weatherSearchBtn = document.getElementById("weather-search-btn");
const weatherResultContainer = document.getElementById("weather-result-container");
const attractionsSearchInput = document.getElementById("attractions-search-input");
const attractionsSearchBtn = document.getElementById("attractions-search-btn");
const attractionsListContainer = document.getElementById("attractions-list-container");
const attractionsLoader = document.getElementById("attractions-loader");
const currencyAmountInput = document.getElementById("currency-amount-input");
const currencyBaseSelect = document.getElementById("currency-base-select");
const currencyTargetSelect = document.getElementById("currency-target-select");
const currencyConvertBtn = document.getElementById("currency-convert-btn");
const currencyConversionResult = document.getElementById("currency-conversion-result");
const clearHistoryBtn = document.getElementById("clear-history-btn");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".content-section");

let allCountries = [];
let historyItems = [];

menu.addEventListener("click", () => {
  barraLateral.classList.toggle("max-barra-lateral");
  if (barraLateral.classList.contains("max-barra-lateral")) {
    menu.children[0].style.display = "none";
    menu.children[1].style.display = "block";
  } else {
    menu.children[0].style.display = "block";
    menu.children[1].style.display = "none";
  }

  if (window.innerWidth <= 320) {
    barraLateral.classList.add("mini-barra-lateral");
    main.classList.add("min-main");
    spans.forEach((span) => {
      span.classList.add("oculto");
    });
  }
});

palanca.addEventListener("click", () => {
  document.body.classList.toggle("dark-oscuro");
  circulo.classList.toggle("prendido");
  if (circulo.classList.contains("prendido")) {
    luna.children[0].style.display = "none";
    luna.children[1].style.display = "block";
  } else {
    luna.children[0].style.display = "block";
    luna.children[1].style.display = "none";
  }
});

compas.addEventListener("click", () => {
  barraLateral.classList.toggle("mini-barra-lateral");
  main.classList.toggle("min-main");
  spans.forEach((span) => {
    span.classList.toggle("oculto");
  });
});

function showSection(sectionId) {
  sections.forEach((section) => {
    const isActive = section.id === sectionId;
    section.classList.toggle("visible-seccion", isActive);
    section.classList.toggle("oculto-seccion", !isActive);
  });
  navLinks.forEach((link) => {
    link.classList.toggle(
      "active-link",
      link.getAttribute("href") === `#${sectionId}`
    );
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetId = link.getAttribute("href").replace("#", "");
    showSection(targetId);
  });
});

const user = JSON.parse(localStorage.getItem("login_success"));
if (!user) {
  window.location.href = "ingreso.html";
}

function renderProfile(userData) {
  if (!profileName || !profileEmail || !profileCountry || !welcomeMessage) return;
  profileName.textContent = userData.name || "Usuario";
  profileEmail.textContent = userData.email || "No disponible";
  profileCountry.textContent = userData.country || "No disponible";
  welcomeMessage.textContent = `¡Bienvenido ${userData.name || "viajero"}!`;
}

function showLoader(show) {
  if (!loader) return;
  loader.classList.toggle("hidden", !show);
}

function getFilteredCountries() {
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const selectedRegion = filterInput ? filterInput.value : "All";

  return allCountries.filter((country) => {
    const countryName = (country.name.common || "").toLowerCase();
    const matchName = searchTerm === "" || countryName.includes(searchTerm);
    const matchRegion =
      selectedRegion === "All" ||
      country.region === selectedRegion ||
      (country.continents || []).includes(selectedRegion);
    return matchName && matchRegion;
  });
}

function updateCountryCounters(count) {
  if (dashCountriesCount) dashCountriesCount.textContent = count;
  if (dashFavoritesCount) dashFavoritesCount.textContent = 0;
  if (dashAttractionsCount) dashAttractionsCount.textContent = 0;
}

function formatNumber(value) {
  return Number(value).toLocaleString("es-ES");
}

function getWeatherDescription(code) {
  if (code === 0) return "Cielo despejado";
  if (code >= 1 && code <= 3) return "Parcialmente nublado";
  if (code >= 45 && code <= 48) return "Niebla";
  if (code >= 51 && code <= 57) return "Llovizna";
  if (code >= 61 && code <= 67) return "Lluvia";
  if (code >= 71 && code <= 77) return "Nieve";
  if (code >= 80 && code <= 86) return "Chubascos";
  if (code >= 95 && code <= 99) return "Tormenta eléctrica";
  return "Clima desconocido";
}

function formatWeatherTime(dateTimeString) {
  try {
    return new Date(dateTimeString).toLocaleString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateTimeString;
  }
}

function getCountryCoordinates(country) {
  if (Array.isArray(country.capitalInfo?.latlng) && country.capitalInfo.latlng.length === 2) {
    return country.capitalInfo.latlng;
  }
  if (Array.isArray(country.latlng) && country.latlng.length === 2) {
    return country.latlng;
  }
  return null;
}

async function fetchWeatherForCoordinates(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error al obtener clima: ${response.status}`);
  }
  const data = await response.json();
  return data.current_weather;
}

const OPEN_TRIP_MAP_API_KEY = "5ae2e3f221c38a28845f05b628ae9bb1fadb0a9b84f311adff8d4ead";

function showAttractionsLoader(show) {
  if (!attractionsLoader) return;
  attractionsLoader.classList.toggle("hidden", !show);
}

async function fetchOpenTripMapAttractions(latitude, longitude) {
  const url = `https://api.opentripmap.com/0.1/en/places/radius?apikey=${OPEN_TRIP_MAP_API_KEY}&radius=10000&limit=16&lon=${longitude}&lat=${latitude}&rate=2`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error OpenTripMap: ${response.status}`);
  }
  const data = await response.json();
  return data.features || [];
}

function renderAttractions(places, countryName) {
  if (!attractionsListContainer) return;
  attractionsListContainer.innerHTML = "";

  if (!places || places.length === 0) {
    attractionsListContainer.innerHTML = `
      <div class="empty-state">
        <h3>No se encontraron atracciones para ${countryName || "este país"}.</h3>
        <p>Intenta con otro país o ajusta la búsqueda.</p>
      </div>
    `;
    if (dashAttractionsCount) dashAttractionsCount.textContent = 0;
    return;
  }

  places.forEach((place) => {
    const { name, kinds, dist, xid } = place.properties || {};
    const category = kinds ? kinds.split(",")[0] : "Atracción";

    const card = document.createElement("div");
    card.className = "attraction-card";
    card.innerHTML = `
      <div class="attraction-card-content">
        <h4>${name || "Sin nombre"}</h4>
        <p class="attraction-category">${category}</p>
        <p class="attraction-desc">Distancia: ${dist ? dist.toFixed(0) : "N/A"} m</p>
        <div class="attraction-actions">
          <a href="https://opentripmap.com/en/poi/${xid}" target="_blank" rel="noopener noreferrer" class="logout-btn">Ver en OpenTripMap</a>
        </div>
      </div>
    `;
    attractionsListContainer.appendChild(card);
  });

  if (dashAttractionsCount) dashAttractionsCount.textContent = places.length;
}

async function fetchAvailableCurrencies() {
  const response = await fetch("https://api.frankfurter.app/currencies");
  if (!response.ok) {
    throw new Error(`Error al obtener monedas: ${response.status}`);
  }
  return response.json();
}

function populateCurrencySelectors(currencies) {
  if (!currencyBaseSelect || !currencyTargetSelect) return;

  const entries = Object.entries(currencies);
  entries.sort((a, b) => a[0].localeCompare(b[0]));

  currencyBaseSelect.innerHTML = entries
    .map(([code, name]) => `<option value="${code}">${code} - ${name}</option>`)
    .join("");
  currencyTargetSelect.innerHTML = currencyBaseSelect.innerHTML;
  currencyBaseSelect.value = "EUR";
  currencyTargetSelect.value = "USD";
}

async function convertCurrency(amount, from, to) {
  const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error al convertir moneda: ${response.status}`);
  }
  return response.json();
}

function showCurrencyResult(text) {
  if (!currencyConversionResult) return;
  currencyConversionResult.innerHTML = `<p>${text}</p>`;
}

function renderCountryList(countries) {
  if (!countryListContainer || !countryDetailContainer) return;
  countryListContainer.innerHTML = "";
  countryDetailContainer.classList.add("hidden");
  countryListContainer.classList.remove("hidden");

  if (countries.length === 0) {
    countryListContainer.innerHTML = `
      <div class="empty-state">
        <h3>No se encontraron países.</h3>
        <p>Intenta otra búsqueda o selecciona un continente diferente.</p>
      </div>
    `;
    updateCountryCounters(0);
    return;
  }

  countries.forEach((country) => {
    const card = document.createElement("button");
    card.className = "country-card";
    const capital = Array.isArray(country.capital) && country.capital.length > 0 ? country.capital[0] : "N/A";
    const flagUrl = country.flags?.png || country.flags?.svg || "";

    card.innerHTML = `
      <img src="${flagUrl}" alt="Bandera de ${country.name.common}">
      <div class="country-card-info">
        <h3>${country.name.common}</h3>
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Región:</strong> ${country.region || "N/A"}</p>
        <p><strong>Población:</strong> ${formatNumber(country.population || 0)}</p>
      </div>
    `;

    card.addEventListener("click", () => {
      displayCountryDetail(country);
      addHistoryEntry(country);
    });

    countryListContainer.appendChild(card);
  });

  updateCountryCounters(countries.length);
}

function getNativeName(country) {
  const nativeNames = country.name.nativeName;
  if (!nativeNames) return country.name.common;
  const nativeValue = Object.values(nativeNames)[0];
  return nativeValue?.common || country.name.common;
}

function getCurrencyText(country) {
  const currencies = country.currencies;
  if (!currencies) return "N/A";
  return Object.values(currencies)
    .map((currency) => currency.name || currency.symbol)
    .join(", ");
}

function getLanguageText(country) {
  const languages = country.languages;
  if (!languages) return "N/A";
  return Object.values(languages).join(", ");
}

function displayCountryDetail(country) {
  if (!countryDetailContainer || !countryListContainer) return;
  const capital = Array.isArray(country.capital) && country.capital.length > 0 ? country.capital[0] : "N/A";
  const nativeName = getNativeName(country);
  const currencyText = getCurrencyText(country);
  const languageText = getLanguageText(country);
  const topLevelDomain = Array.isArray(country.tld) ? country.tld.join(", ") : "N/A";
  const borders = Array.isArray(country.borders) && country.borders.length > 0 ? country.borders.join(", ") : "N/A";
  const flagUrl = country.flags?.png || country.flags?.svg || "";

  countryDetailContainer.innerHTML = `
    <div class="detail-header">
      <div>
        <h2>${country.name.common}</h2>
        <p>${nativeName}</p>
      </div>
      <button id="back-btn" class="logout-btn">Volver</button>
    </div>
    <div class="country-detail-grid">
      <div class="country-flag-large">
        <img src="${flagUrl}" alt="Bandera de ${country.name.common}">
      </div>
      <div class="country-details-panel">
        <ul>
          <li><strong>Capital:</strong> ${capital}</li>
          <li><strong>Región:</strong> ${country.region || "N/A"}</li>
          <li><strong>Subregión:</strong> ${country.subregion || "N/A"}</li>
          <li><strong>Dominio:</strong> ${topLevelDomain}</li>
          <li><strong>Moneda(s):</strong> ${currencyText}</li>
          <li><strong>Idioma(s):</strong> ${languageText}</li>
          <li><strong>Fronteras:</strong> ${borders}</li>
          <li><strong>Población:</strong> ${formatNumber(country.population || 0)}</li>
        </ul>
      </div>
    </div>
    <div id="weather-info" class="weather-card">
      <h3>Clima</h3>
      <p>Cargando clima...</p>
    </div>
  `;

  countryDetailContainer.classList.remove("hidden");
  countryListContainer.classList.add("hidden");

  const backBtn = document.getElementById("back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      countryDetailContainer.classList.add("hidden");
      countryListContainer.classList.remove("hidden");
    });
  }

  const coordinates = getCountryCoordinates(country);
  const weatherInfo = document.getElementById("weather-info");

  if (!coordinates || !weatherInfo) {
    if (weatherInfo) {
      weatherInfo.innerHTML = `
        <h3>Clima</h3>
        <p>Coordenadas no disponibles para esta ubicación.</p>
      `;
    }
    return;
  }

  fetchWeatherForCoordinates(coordinates[0], coordinates[1])
    .then((currentWeather) => {
      const weatherText = getWeatherDescription(currentWeather.weathercode);
      weatherInfo.innerHTML = `
        <h3>Clima en ${capital}</h3>
        <p><strong>Temperatura:</strong> ${currentWeather.temperature}°C</p>
        <p><strong>Viento:</strong> ${currentWeather.windspeed} km/h</p>
        <p><strong>Dirección del viento:</strong> ${currentWeather.winddirection}°</p>
        <p><strong>Condición:</strong> ${weatherText}</p>
        <p><small>Actualizado: ${formatWeatherTime(currentWeather.time)}</small></p>
      `;
    })
    .catch((error) => {
      console.error(error);
      if (weatherInfo) {
        weatherInfo.innerHTML = `
          <h3>Clima</h3>
          <p>No se pudo cargar el clima.</p>
          <p>${error.message}</p>
        `;
      }
    });
}

function renderHistory() {
  if (!historyList) return;
  historyList.innerHTML = "";
  if (historyItems.length === 0) {
    historyList.innerHTML = `<li>No hay búsquedas recientes.</li>`;
    return;
  }

  historyItems.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} — ${item.time}`;
    historyList.appendChild(li);
  });
}

function addHistoryEntry(country) {
  historyItems.unshift({
    name: country.name.common,
    time: new Date().toLocaleString("es-ES"),
  });
  if (historyItems.length > 8) {
    historyItems.pop();
  }
  renderHistory();
}

function clearHistory() {
  historyItems = [];
  renderHistory();
}

if (clearHistoryBtn) {
  clearHistoryBtn.addEventListener("click", clearHistory);
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("login_success");
    window.location.href = "ingreso.html";
  });
}

if (searchInput) {
  searchInput.addEventListener("input", () => renderCountryList(getFilteredCountries()));
}

if (filterInput) {
  filterInput.addEventListener("change", () => renderCountryList(getFilteredCountries()));
}

if (weatherSearchBtn) {
  weatherSearchBtn.addEventListener("click", async () => {
    const searchTerm = weatherCountryInput?.value.trim().toLowerCase();
    const country = allCountries.find((item) =>
      item.name.common.toLowerCase().includes(searchTerm)
    );

    if (!weatherResultContainer) return;

    if (!country) {
      weatherResultContainer.innerHTML = `
        <div class="empty-state">
          <h3>País no encontrado.</h3>
          <p>Revisa el nombre e intenta de nuevo.</p>
        </div>
      `;
      return;
    }

    const coordinates = getCountryCoordinates(country);
    if (!coordinates) {
      weatherResultContainer.innerHTML = `
        <div class="empty-state">
          <h3>Coordenadas no disponibles.</h3>
          <p>No se puede obtener el clima para este país.</p>
        </div>
      `;
      return;
    }

    weatherResultContainer.innerHTML = `
      <div class="weather-card">
        <h3>Clima en ${country.name.common}</h3>
        <p>Cargando...</p>
      </div>
    `;

    try {
      const currentWeather = await fetchWeatherForCoordinates(coordinates[0], coordinates[1]);
      const weatherText = getWeatherDescription(currentWeather.weathercode);
      weatherResultContainer.innerHTML = `
        <div class="weather-card">
          <h3>Clima en ${country.name.common}</h3>
          <p><strong>Temperatura:</strong> ${currentWeather.temperature}°C</p>
          <p><strong>Viento:</strong> ${currentWeather.windspeed} km/h</p>
          <p><strong>Dirección del viento:</strong> ${currentWeather.winddirection}°</p>
          <p><strong>Condición:</strong> ${weatherText}</p>
          <p><small>Actualizado: ${formatWeatherTime(currentWeather.time)}</small></p>
        </div>
      `;
    } catch (error) {
      console.error(error);
      weatherResultContainer.innerHTML = `
        <div class="empty-state">
          <h3>No se pudo cargar el clima.</h3>
          <p>${error.message}</p>
        </div>
      `;
    }
  });
}

if (attractionsSearchBtn) {
  attractionsSearchBtn.addEventListener("click", async () => {
    const searchTerm = attractionsSearchInput?.value.trim().toLowerCase();
    const country = allCountries.find((item) =>
      item.name.common.toLowerCase().includes(searchTerm)
    );

    if (!attractionsListContainer) return;
    showAttractionsLoader(true);

    if (!country) {
      attractionsListContainer.innerHTML = `
        <div class="empty-state">
          <h3>País no encontrado.</h3>
          <p>Revisa el nombre e intenta de nuevo.</p>
        </div>
      `;
      showAttractionsLoader(false);
      return;
    }

    const coordinates = getCountryCoordinates(country);
    if (!coordinates) {
      attractionsListContainer.innerHTML = `
        <div class="empty-state">
          <h3>Coordenadas no disponibles.</h3>
          <p>No se puede obtener atracciones para este país.</p>
        </div>
      `;
      showAttractionsLoader(false);
      return;
    }

    try {
      const places = await fetchOpenTripMapAttractions(coordinates[0], coordinates[1]);
      renderAttractions(places, country.name.common);
    } catch (error) {
      console.error(error);
      attractionsListContainer.innerHTML = `
        <div class="empty-state">
          <h3>No se pudieron cargar las atracciones.</h3>
          <p>${error.message}</p>
        </div>
      `;
    } finally {
      showAttractionsLoader(false);
    }
  });
}

if (currencyConvertBtn) {
  currencyConvertBtn.addEventListener("click", async () => {
    const amount = Number(currencyAmountInput?.value);
    const fromCurrency = currencyBaseSelect?.value;
    const toCurrency = currencyTargetSelect?.value;

    if (!currencyConversionResult) return;

    if (!amount || amount <= 0) {
      showCurrencyResult("Introduce una cantidad válida mayor a 0.");
      return;
    }
    if (!fromCurrency || !toCurrency) {
      showCurrencyResult("Selecciona las monedas de origen y destino.");
      return;
    }

    showCurrencyResult("Calculando conversión...");

    try {
      const data = await convertCurrency(amount, fromCurrency, toCurrency);
      const convertedValue = data.rates[toCurrency];
      showCurrencyResult(
        `${amount} ${fromCurrency} = ${convertedValue.toFixed(2)} ${toCurrency}`
      );
    } catch (error) {
      console.error(error);
      showCurrencyResult(`No se pudo convertir: ${error.message}`);
    }
  });
}

async function fetchCountries() {
  showLoader(true);
  
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    
    // 1. Validar el éxito de la petición HTTP
    if (!response.ok) {
      throw new Error(`Error al obtener países: ${response.status}`);
    }

    // 2. Extraer los datos una sola vez
    const data = await response.json();
    
    // Opcional: ver el primer elemento en consola para pruebas
    console.log("Primer país:", data.slice(0, 1));
    
    // 3. Ordenar alfabéticamente
    allCountries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
    
    // 4. Renderizar la lista en la pantalla
    renderCountryList(getFilteredCountries());
    
  } catch (error) {
    // Captura cualquier error de red, de ordenamiento o de renderizado
    console.error('Error:', error);
    
    if (typeof countryListContainer !== 'undefined' && countryListContainer) {
      countryListContainer.innerHTML = `
        <div class="empty-state">
          <h3>Error al cargar países</h3>
          <p>${error.message}</p>
        </div>
      `;
    }
  } finally {
    // Se ejecuta SIEMPRE, garantizando que el loader desaparezca
    showLoader(false);
  }
} // <-- Llave de cierre de la función corregida

// Ejecución del flujo del programa
renderProfile(user);
renderHistory();
fetchCountries();
fetchAvailableCurrencies()
  .then(populateCurrencySelectors)
  .catch((error) => {
    console.error("No se pudieron cargar las monedas:", error);
    showCurrencyResult("No se pudieron cargar las monedas en este momento.");
  });
