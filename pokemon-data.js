'use strict';

let pokemon = [];

// Fetch the original 151 Pokemon
async function fetchPokemon() {
  try {
    const promises = [];

    // Fetch each Pokemon from the PokeAPI
    for (let i = 1; i <= 151; i++) {
      const api = `https://pokeapi.co/api/v2/pokemon/${i}`;

      promises.push(
        fetch(api).then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch Pokemon #${i}`);
          }

          return response.json();
        }),
      );
    }

    // Wait for all 151 requests to finish
    pokemon = await Promise.all(promises);

    return pokemon;
  } catch (error) {
    console.error('Error fetching Pokemon:', error);

    throw error;
  }
}

// Render Pokemon cards
function renderPokemon(pokemonList, grid, loading) {
  let htmlString = '';

  pokemonList.forEach((poke) => {
    // Create type badges
    const typeBadges = poke.types
      .map(
        (type) => `
          <span class="type-badge ${type.type.name}">
            ${type.type.name}
          </span>
        `,
      )
      .join('');

    // Generate the card
    htmlString += `
      <div class="poke-card" id="${poke.name}">

        <h3 class="poke-name">
          ${poke.name}
        </h3>

        <p class="poke-id">
          #${String(poke.id).padStart(3, '0')}
        </p>

        <img
          loading="lazy"
          class="poke-sprite"
          src="${poke.sprites.front_default}"
          alt="${poke.name}"
        />

        <div class="poke-types">
          ${typeBadges}
        </div>

      </div>
    `;
  });

  // Hide loading
  loading.style.display = 'none';

  // Show grid
  grid.style.display = 'grid';

  // Add cards to grid
  grid.innerHTML = htmlString;
}

// Determine the color for each stat
function getStatColor(stat) {
  if (stat < 50) return '#ff5959';
  if (stat < 80) return '#ffc107';
  if (stat < 110) return '#4caf50';

  return '#00e5ff';
}

// Show Pokemon details in the modal
function showDetails(poke) {
  const modal = document.getElementById('pokemon-modal');
  const modalBody = document.getElementById('modal-body');

  // Make sure the modal exists on the current page
  if (!modal || !modalBody) return;

  const stats = poke.stats
    .map(
      (stat) => `
        <div class="stat-row">
          <div class="stat-header">
            <span class="stat-name">${stat.stat.name}</span>
            <span class="stat-value">${stat.base_stat}</span>
          </div>

          <div class="stat-bar">
            <div
              class="stat-fill"
              style="
                width: ${(stat.base_stat / 255) * 100}%;
                background: ${getStatColor(stat.base_stat)};
              "
            ></div>
          </div>
        </div>
      `,
    )
    .join('');

  // Calculate total stats
  const totalStats = poke.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

  // Get normal and shiny artwork
  const normal =
    poke.sprites.other['official-artwork'].front_default ||
    poke.sprites.front_default;

  const shiny =
    poke.sprites.other['official-artwork'].front_shiny ||
    poke.sprites.front_shiny;

  // Add Pokemon details to the modal
  modalBody.innerHTML = `
    <div class="pokemon-layout">

      <div class="pokemon-left">

        <h2>${poke.name.toUpperCase()}</h2>

        <p>
          <strong>#${poke.id}</strong>
        </p>

        <img
          loading="lazy"
          class="modal-artwork"
          id="modal-artwork"
          src="${normal}"
          alt="${poke.name}"
        />

        <label class="shiny-switch">
          <span class="toggle-text">Normal</span>

          <input
            type="checkbox"
            id="shiny-toggle"
          />

          <span class="slider"></span>

          <span class="toggle-text">Shiny</span>
        </label>

        <div class="poke-types">
          ${poke.types
            .map(
              (t) => `
                <span class="${t.type.name}">
                  ${t.type.name}
                </span>
              `,
            )
            .join('')}
        </div>

      </div>

      <div class="pokemon-right">

        <div class="detail-section">
          <p>
            Height: ${(poke.height / 10).toFixed(1)} m
          </p>

          <p>
            Weight: ${(poke.weight / 10).toFixed(1)} kg
          </p>
        </div>

        <div class="detail-section">
          <h3>Abilities</h3>

          <p>
            ${poke.abilities.map((a) => a.ability.name).join(', ')}
          </p>
        </div>

        <div class="detail-section">
          <h3>Stats</h3>

          <p>
            <strong>Total Stats:</strong> ${totalStats}
          </p>

          <div class="stats-container">
            ${stats}
          </div>
        </div>

      </div>

    </div>
  `;

  // Show the modal
  modal.classList.add('show');

  // Shiny toggle
  const artwork = document.getElementById('modal-artwork');
  const toggle = document.getElementById('shiny-toggle');

  toggle.checked = false;

  toggle.addEventListener('change', () => {
    artwork.src = toggle.checked ? shiny : normal;
  });
}

// Set up modal controls
function setupModal() {
  const modal = document.getElementById('pokemon-modal');
  const closeModal = document.getElementById('close-modal');

  // Make sure the modal exists on the current page
  if (!modal || !closeModal) return;

  // Close button
  closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.classList.remove('show');
    }
  });

  // Click outside the modal
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });
}
