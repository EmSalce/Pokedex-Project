'use strict';

const typeButtons = document.getElementById('type-buttons');
const selectedType = document.getElementById('selected-type');
const pokedexGrid = document.getElementById('pokedex-grid');
const loading = document.getElementById('loading');
const typeMatchUp = document.getElementById('type-matchup');

const types = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

const typeChart = {
  normal: {
    strongAgainst: [],
    weakAgainst: ['fighting'],
    resistantTo: [],
    immuneTo: ['ghost'],
  },

  fire: {
    strongAgainst: ['grass', 'ice', 'bug', 'steel'],
    weakAgainst: ['water', 'ground', 'rock'],
    resistantTo: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
    immuneTo: [],
  },

  water: {
    strongAgainst: ['fire', 'ground', 'rock'],
    weakAgainst: ['electric', 'grass'],
    resistantTo: ['fire', 'water', 'ice', 'steel'],
    immuneTo: [],
  },

  electric: {
    strongAgainst: ['water', 'flying'],
    weakAgainst: ['ground'],
    resistantTo: ['electric', 'flying', 'steel'],
    immuneTo: [],
  },

  grass: {
    strongAgainst: ['water', 'ground', 'rock'],
    weakAgainst: ['fire', 'ice', 'poison', 'flying', 'bug'],
    resistantTo: ['water', 'electric', 'grass', 'ground'],
    immuneTo: [],
  },

  ice: {
    strongAgainst: ['grass', 'ground', 'flying', 'dragon'],
    weakAgainst: ['fire', 'fighting', 'rock', 'steel'],
    resistantTo: ['ice'],
    immuneTo: [],
  },

  fighting: {
    strongAgainst: ['normal', 'ice', 'rock', 'dark', 'steel'],
    weakAgainst: ['flying', 'psychic', 'fairy'],
    resistantTo: ['bug', 'rock', 'dark'],
    immuneTo: [],
  },

  poison: {
    strongAgainst: ['grass', 'fairy'],
    weakAgainst: ['ground', 'psychic'],
    resistantTo: ['grass', 'fighting', 'poison', 'bug', 'fairy'],
    immuneTo: [],
  },

  ground: {
    strongAgainst: ['fire', 'electric', 'poison', 'rock', 'steel'],
    weakAgainst: ['water', 'grass', 'ice'],
    resistantTo: [],
    immuneTo: ['electric'],
  },

  flying: {
    strongAgainst: ['grass', 'fighting', 'bug'],
    weakAgainst: ['electric', 'ice', 'rock'],
    resistantTo: ['grass', 'fighting', 'bug'],
    immuneTo: ['ground'],
  },

  psychic: {
    strongAgainst: ['fighting', 'poison'],
    weakAgainst: ['bug', 'ghost', 'dark'],
    resistantTo: ['fighting', 'psychic'],
    immuneTo: [],
  },

  bug: {
    strongAgainst: ['grass', 'psychic', 'dark'],
    weakAgainst: ['fire', 'flying', 'rock'],
    resistantTo: ['grass', 'fighting', 'ground'],
    immuneTo: [],
  },

  rock: {
    strongAgainst: ['fire', 'ice', 'flying', 'bug'],
    weakAgainst: ['water', 'grass', 'fighting', 'ground', 'steel'],
    resistantTo: ['normal', 'fire', 'poison', 'flying'],
    immuneTo: [],
  },

  ghost: {
    strongAgainst: ['psychic', 'ghost'],
    weakAgainst: ['ghost', 'dark'],
    resistantTo: ['poison', 'bug'],
    immuneTo: ['normal', 'fighting'],
  },

  dragon: {
    strongAgainst: ['dragon'],
    weakAgainst: ['ice', 'dragon', 'fairy'],
    resistantTo: ['fire', 'water', 'electric', 'grass'],
    immuneTo: [],
  },

  dark: {
    strongAgainst: ['psychic', 'ghost'],
    weakAgainst: ['fighting', 'bug', 'fairy'],
    resistantTo: ['ghost', 'dark'],
    immuneTo: ['psychic'],
  },

  steel: {
    strongAgainst: ['ice', 'rock', 'fairy'],
    weakAgainst: ['fire', 'fighting', 'ground'],
    resistantTo: [
      'normal',
      'grass',
      'ice',
      'flying',
      'psychic',
      'bug',
      'rock',
      'dragon',
      'steel',
      'fairy',
    ],
    immuneTo: ['poison'],
  },

  fairy: {
    strongAgainst: ['fighting', 'dragon', 'dark'],
    weakAgainst: ['poison', 'steel'],
    resistantTo: ['fighting', 'bug', 'dark'],
    immuneTo: ['dragon'],
  },
};

function renderTypeButtons() {
  typeButtons.innerHTML = '';

  types.forEach((type) => {
    const button = document.createElement('button');

    button.classList.add('type-button', type);

    button.textContent = type.toUpperCase();

    button.dataset.type = type;

    typeButtons.appendChild(button);
  });
}

function filterByType(type) {
  const filteredPokemon = pokemon.filter((poke) =>
    poke.types.some((pokemonType) => pokemonType.type.name === type),
  );

  return filteredPokemon;
}

function renderTypeMatchup(type) {
  const matchup = typeChart[type];

  if (!matchup) return;

  const createBadges = (typeList) => {
    if (typeList.length === 0) {
      return '<span class="no-matchup">None</span>';
    }

    return typeList
      .map(
        (type) => `
          <span class="type-badge ${type}">
            ${type}
          </span>
        `,
      )
      .join('');
  };

  const typeMatchup = document.getElementById('type-matchup');

  typeMatchup.innerHTML = `
    <div class="matchup-section super-effective">
      <h3>Super Effective Against</h3>
      <div class="matchup-types">
        ${createBadges(matchup.strongAgainst)}
      </div>
    </div>

    <div class="matchup-section weak">
      <h3>Weak Against</h3>
      <div class="matchup-types">
        ${createBadges(matchup.weakAgainst)}
      </div>
    </div>

    <div class="matchup-section resistant">
      <h3>Resistant To</h3>
      <div class="matchup-types">
        ${createBadges(matchup.resistantTo)}
      </div>
    </div>

    <div class="matchup-section immune">
      <h3>Immune To</h3>
      <div class="matchup-types">
        ${createBadges(matchup.immuneTo)}
      </div>
    </div>
  `;
}

function selectType(type) {
  const selectedButton = document.querySelector(
    `.type-button[data-type="${type}"]`,
  );

  // If the selected type is clicked again, clear it
  if (selectedButton.classList.contains('active')) {
    selectedButton.classList.remove('active');

    selectedType.textContent = 'SELECT A TYPE';

    typeMatchUp.innerHTML = ` 
      <p class="matchup-placeholder">
      Select a type to view its matchups.
      </p>`;

    pokedexGrid.innerHTML = '';
    pokedexGrid.style.display = 'none';

    return;
  }

  const filteredPokemon = filterByType(type);

  // Update heading
  selectedType.textContent = `${type.toUpperCase()} POKÉMON`;

  // Display Type Matchup
  renderTypeMatchup(type);

  // Remove active state from all buttons
  document.querySelectorAll('.type-button').forEach((button) => {
    button.classList.remove('active');
  });

  // Activate selected button
  selectedButton.classList.add('active');

  // Display filtered Pokemon
  renderPokemon(filteredPokemon, pokedexGrid, loading);
}

typeButtons.addEventListener('click', (e) => {
  const button = e.target.closest('.type-button');

  if (!button) return;

  const type = button.dataset.type;

  selectType(type);
});

pokedexGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.poke-card');

  if (!card) return;

  const selectedPokemon = pokemon.find((p) => p.name === card.id);

  if (!selectedPokemon) return;

  showDetails(selectedPokemon);
});

renderTypeButtons();
setupModal();

fetchPokemon()
  .then(() => {
    loading.style.display = 'none';
  })
  .catch(() => {
    loading.textContent = 'ERROR LOADING POKEMON';
  });
