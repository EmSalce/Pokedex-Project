const pokedexGrid = document.getElementById('pokedex-grid');
const searchList = document.getElementById('search-list');
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');
let pokemon = [];

// Automatically generate a card for each Pokemon
async function fetchPokemon() {
  const promises = [];

  //Loop through the input number of Pokemon
  for (let i = 1; i <= 151; i++) {
    const api = `https://pokeapi.co/api/v2/pokemon/${i}`;
    promises.push(fetch(api).then((res) => res.json()));
  }

  try {
    const data = await Promise.all(promises);
    pokemon = data;
    //Make an empty variable to put our generated HTML into
    let htmlString = '';
    //Make an empty variable to put our search auto-completes into
    // let datalistOptions = '';
    //For each Pokemon, generate a HTML string for the card and inject it into the Pokedex Grid
    data.forEach((poke) => {
      //Seperate types for when Pokemon have two types
      let typeBadges = poke.types
        .map(
          (t) =>
            `<span class="type-badge ${t.type.name}">
          ${t.type.name}
        </span>`,
        )
        .join('');
      //Inject the Pokemon info for the card generation
      htmlString += `
              <div class="poke-card" id="${poke.name}">
              <h3 class="poke-name">${poke.name}</h3>
              <p class="poke-id">#${poke.id}</p>
              <img loading="lazy" class="poke-sprite" src=${poke.sprites.front_default} alt="${poke.name}" />
              <div class="poke-types">
                 ${typeBadges}
              </div>
              </div>`;
    });
    pokedexGrid.innerHTML = htmlString;

    pokedexGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.poke-card');
      if (!card) return;
      const selectedPokemon = pokemon.find((p) => p.name === card.id);
      showDetails(selectedPokemon);
    });
    // searchList.innerHTML = datalistOptions;
  } catch (error) {
    console.error('Error getting data:', error);
  }
}

//Run the function
fetchPokemon();

//Add suggestions when typing in names
let searchTimeout;

searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    const search = searchInput.value.toLowerCase();
    searchList.innerHTML = '';
    if (search.length < 2) return;

    pokemon
      .filter((poke) => poke.name.includes(search))
      .forEach((poke) => {
        const option = document.createElement('option');
        option.value = poke.name.charAt(0).toUpperCase() + poke.name.slice(1);

        searchList.appendChild(option);
      });
  }, 150);
});

//Search for a Pokemon, jump to it, and highlight it
function searchPokemon() {
  const search = searchInput.value.toLowerCase().trim();
  const card = document.getElementById(search);

  if (!card) return;

  card.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });

  card.classList.add('highlight');

  setTimeout(() => {
    card.classList.remove('highlight');
  }, 3000);
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Stop page refresh
  searchPokemon();
});

//Add a Pop-up style Modal to display more information
const modal = document.getElementById('pokemon-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.getElementById('close-modal');
function getStatColor(stat) {
  if (stat < 50) return '#ff5959';
  if (stat < 80) return '#ffc107';
  if (stat < 110) return '#4caf50';
  return '#00e5ff';
}

function showDetails(poke) {
  const stats = poke.stats
    .map(
      (stat) => `
      <div class="stat-row">
        <div class="stat-header">
          <span class="stat-name">${stat.stat.name}</span>
          <span class="stat-value">${stat.base_stat}</span>
        </div>  
        <div class="stat-bar">
          <div class="stat-fill" style="width: ${(stat.base_stat / 255) * 100}%;
          background:${getStatColor(stat.base_stat)};"></div>
          </div>
          </div>`,
    )
    .join('');
  const totalStats = poke.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

  modalBody.innerHTML = `
  <div class="pokemon-layout">

    <div class="pokemon-left">
      <h2>${poke.name.toUpperCase()}</h2>
      <p><strong>#${poke.id}</strong></p>

      <img
        loading="lazy"
        class="modal-artwork"
        id="modal-artwork"
        src="${
          poke.sprites.other['official-artwork'].front_default ||
          poke.sprites.front_default
        }"
        alt="${poke.name}"
      />
    
    <label class="shiny-switch">
      <span class="toggle-text">Normal</span>
      <input type="checkbox" id="shiny-toggle">
      <span class="slider"></span>
      <span class="toggle-text">Shiny</span>
    </label>

      <div class="poke-types">
        ${poke.types
          .map(
            (t) =>
              `<span class="${t.type.name}">
                ${t.type.name}
              </span>`,
          )
          .join('')}
      </div>
    </div>

    <div class="pokemon-right">      
      <p><strong>Height:</strong> ${(poke.height / 10).toFixed(1)} m</p>
      <p><strong>Weight:</strong> ${(poke.weight / 10).toFixed(1)} kg</p>

      <p>
        <strong>Abilities:</strong><br>
        ${poke.abilities.map((a) => a.ability.name).join(', ')}
      </p>

      <h3>Stats</h3>
      <p><strong>Total Stats:</strong> ${totalStats}</p>
      <div class="stats-container">
        ${stats}
      </div>
    </div>

  </div>
`;

  modal.style.display = 'flex';

  const artwork = document.getElementById('modal-artwork');
  const toggle = document.getElementById('shiny-toggle');
  toggle.checked = false;
  const normal =
    poke.sprites.other['official-artwork'].front_default ||
    poke.sprites.front_default;
  const shiny =
    poke.sprites.other['official-artwork'].front_shiny ||
    poke.sprites.front_shiny;

  toggle.addEventListener('change', () => {
    artwork.src = toggle.checked ? shiny : normal;
  });
}
//Close the modal
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});
//Escape key closes modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.style.display = 'none';
  }
});
//Click away from the modal to close it
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
