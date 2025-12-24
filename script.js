const API_URL = 'https://restcountries.com/v3.1';

let allCountries = [];
let filteredCountries = [];
let selectedRegion = '';

const mainPage = document.getElementById('mainPage');
const detailPage = document.getElementById('detailPage');
const countriesGrid = document.getElementById('countriesGrid');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const regionFilter = document.getElementById('regionFilter');
const clearRegionBtn = document.getElementById('clearRegionBtn');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');
const backButton = document.getElementById('backButton');
const detailFlag = document.getElementById('detailFlag');
const detailName = document.getElementById('detailName');
const detailInfo = document.getElementById('detailInfo');
const borderCountries = document.getElementById('borderCountries');

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    fetchCountries();
    themeToggle.addEventListener('click', toggleTheme);
    searchInput.addEventListener('input', filterCountries);
    regionFilter.addEventListener('change', handleRegionChange);
    clearRegionBtn.addEventListener('click', clearRegionFilter);
    backButton.addEventListener('click', (e) => {
        e.preventDefault();
        mainPage.classList.remove('hidden');
        detailPage.classList.add('hidden');
    });
});

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeIcon && themeText) {
            updateThemeToggleUI(true);
        }
    }
}

function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (themeIcon && themeText) {
        updateThemeToggleUI(isDarkMode);
    }
}

function updateThemeToggleUI(isDarkMode) {
    const icon = document.getElementById('themeIcon');
    const text = document.getElementById('themeText');
    
    if (icon) {
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
    if (text) {
        text.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
    }
}

async function fetchCountries() {
    try {
        const fields = 'name,flags,population,region,subregion,capital,borders,tld,currencies,languages';
        const response = await fetch(`${API_URL}/all?fields=${fields}`);
        const data = await response.json();
        
        allCountries = data.sort((a, b) => 
            a.name.common.localeCompare(b.name.common)
        );
        
        filteredCountries = [...allCountries];
        renderCountries();
    } catch (error) {
        console.error('Error fetching countries:', error);
        if (countriesGrid) {
            countriesGrid.innerHTML = '<p>Error loading countries</p>';
        }
    }
}

function renderCountries() {
    countriesGrid.innerHTML = '';

    if (filteredCountries.length === 0) {
        noResults.classList.remove('hidden');
        return;
    }

    noResults.classList.add('hidden');

    filteredCountries.forEach(country => {
        const card = createCountryCard(country);
        countriesGrid.appendChild(card);
    });
}

function createCountryCard(country) {
    const card = document.createElement('a');
    card.href = '#';
    card.className = 'country-card';
    
    const population = formatPopulation(country.population);
    const region = country.region || 'N/A';

    card.innerHTML = `
        <img src="${country.flags.svg}" alt="${country.name.common}" class="country-flag">
        <div class="country-info">
            <h2 class="country-name">${country.name.common}</h2>
            <div class="country-detail">
                <span class="country-detail-label">Population:</span>
                <span class="country-detail-value">${population}</span>
            </div>
            <div class="country-detail">
                <span class="country-detail-label">Region:</span>
                <span class="country-detail-value">${region}</span>
            </div>
            <div class="country-detail">
                <span class="country-detail-label">Capital:</span>
                <span class="country-detail-value">${country.capital?.[0] || 'N/A'}</span>
            </div>
        </div>
    `;

    card.addEventListener('click', (e) => {
        e.preventDefault();
        showDetailPage(country);
    });

    return card;
}

function showDetailPage(country) {
    detailFlag.src = country.flags.svg;
    detailFlag.alt = country.name.common;
    detailName.textContent = country.name.common;

    detailInfo.innerHTML = `
        <div>
            <div class="detail-info-item">
                <span class="detail-info-label">Native Name:</span>
                <span class="detail-info-value">${getNativeName(country)}</span>
            </div>
            <div class="detail-info-item">
                <span class="detail-info-label">Population:</span>
                <span class="detail-info-value">${formatPopulation(country.population)}</span>
            </div>
            <div class="detail-info-item">
                <span class="detail-info-label">Region:</span>
                <span class="detail-info-value">${country.region || 'N/A'}</span>
            </div>
            <div class="detail-info-item">
                <span class="detail-info-label">Sub Region:</span>
                <span class="detail-info-value">${country.subregion || 'N/A'}</span>
            </div>
            <div class="detail-info-item">
                <span class="detail-info-label">Capital:</span>
                <span class="detail-info-value">${country.capital?.[0] || 'N/A'}</span>
            </div>
        </div>
        <div>
            <div class="detail-info-item">
                <span class="detail-info-label">Top Level Domain:</span>
                <span class="detail-info-value">${country.tld?.[0] || 'N/A'}</span>
            </div>
            <div class="detail-info-item">
                <span class="detail-info-label">Currencies:</span>
                <span class="detail-info-value">${getCurrencies(country)}</span>
            </div>
            <div class="detail-info-item">
                <span class="detail-info-label">Languages:</span>
                <span class="detail-info-value">${getLanguages(country)}</span>
            </div>
        </div>
    `;

    renderBorderCountries(country);

    mainPage.classList.add('hidden');
    detailPage.classList.remove('hidden');
}

function getNativeName(country) {
    const nativeNames = country.name.nativeName;
    if (!nativeNames) return country.name.common;
    
    const firstKey = Object.keys(nativeNames)[0];
    return nativeNames[firstKey]?.common || country.name.common;
}

function getCurrencies(country) {
    if (!country.currencies) return 'N/A';
    return Object.values(country.currencies)
        .map(c => c.name)
        .join(', ');
}

function getLanguages(country) {
    if (!country.languages) return 'N/A';
    return Object.values(country.languages).join(', ');
}

async function renderBorderCountries(country) {
    borderCountries.innerHTML = '';

    if (!country.borders || country.borders.length === 0) {
        return;
    }

    const borderCodesHTML = `
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <h3 style="margin: 0; font-size: 1rem; font-weight: 600; white-space: nowrap;">Border Countries:</h3>
            <div class="border-countries-list" id="borderList"></div>
        </div>
    `;
    borderCountries.innerHTML = borderCodesHTML;

    const borderList = document.getElementById('borderList');

    try {
        const fields = 'name,flags,population,region,subregion,capital,borders,tld,currencies,languages';
        const borderCountryNames = await Promise.all(
            country.borders.map(async (code) => {
                const response = await fetch(`${API_URL}/alpha/${code}?fields=${fields}`);
                const data = await response.json();
                return data;
            })
        );

        borderCountryNames.forEach(borderCountry => {
            const btn = document.createElement('a');
            btn.href = '#';
            btn.className = 'border-country-btn';
            btn.textContent = borderCountry.name.common;
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                showDetailPage(borderCountry);
            });

            borderList.appendChild(btn);
        });
    } catch (error) {
        console.error('Error loading border countries:', error);
    }
}

function handleRegionChange() {
    selectedRegion = regionFilter.value;
    updateClearButtonVisibility();
    filterCountries();
}

function clearRegionFilter(e) {
    e.preventDefault();
    regionFilter.value = '';
    selectedRegion = '';
    updateClearButtonVisibility();
    filterCountries();
}

function updateClearButtonVisibility() {
    if (selectedRegion) {
        clearRegionBtn.style.display = 'block';
        regionFilter.classList.add('with-clear-btn');
    } else {
        clearRegionBtn.style.display = 'none';
        regionFilter.classList.remove('with-clear-btn');
    }
}

function filterCountries() {
    const searchTerm = searchInput.value.toLowerCase();
    const currentRegion = selectedRegion || regionFilter.value;

    filteredCountries = allCountries.filter(country => {
        const matchesSearch = country.name.common.toLowerCase().includes(searchTerm);
        const matchesRegion = !currentRegion || country.region === currentRegion;
        return matchesSearch && matchesRegion;
    });

    renderCountries();
}

function formatPopulation(population) {
    if (!population) return '0';
    return population.toLocaleString();
}
