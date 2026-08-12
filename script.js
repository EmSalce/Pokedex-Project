const pokedexGrid = document.getElementById('pokedex-grid');
const searchList = document.getElementById('search-list');
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');
const loading = document.getElementById('loading');

// Load and display the original 151 Pokemon
fetchPokemon()
  .then(() => {
    renderPokemon(pokemon, pokedexGrid, loading);
  })
  .catch(() => {
    loading.textContent = 'ERROR LOADING POKEMON';
  });

// Setup the Modal cards
setupModal();

//Add suggestions when typing in names
let searchTimeout;

searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    const search = searchInput.value.toLowerCase().trim();

    //Clear the older searches
    searchList.innerHTML = '';

    // Wait for 2 characters before showing suggestions
    if (search.length < 2) return;

    const matches = pokemon.filter((poke) => poke.name.includes(search));

    // Create a suggestion for each match
    matches.forEach((poke) => {
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

pokedexGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.poke-card');

  if (!card) return;

  const selectedPokemon = pokemon.find((p) => p.name === card.id);

  if (!selectedPokemon) return;

  showDetails(selectedPokemon);
});
