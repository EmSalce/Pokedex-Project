# Pokédex Project

A Gen 1-inspired interactive Pokédex built with HTML, CSS, and JavaScript.

This project uses the [PokéAPI](https://pokeapi.co/) to retrieve information about the original 151 Pokémon and presents it through a retro-inspired Pokédex interface.

## 📖 About the Project

The Pokédex Project was created as a front-end web development project to practice working with APIs, asynchronous JavaScript, DOM manipulation, responsive design, and interactive user interfaces.

The project is limited to the original 151 Pokémon and includes two main sections:

- **Pokédex** — Browse and search through all 151 Pokémon.
- **Type Explorer** — Explore Pokémon by type and view type matchups.

The design is inspired by the classic Pokémon Pokédex while using a custom interface and modern responsive layout.

## ✨ Features

### Pokédex

- Displays all original 151 Pokémon.
- Pokémon data is retrieved from PokéAPI.
- Pokémon cards display:
  - Name
  - Pokédex number
  - Sprite
  - Pokémon types
- Search Pokémon by name.
- Search suggestions appear while typing.
- Search results smoothly scroll to the selected Pokémon.
- Selected Pokémon cards are highlighted.
- Interactive Pokémon detail modal.
- Normal and Shiny artwork toggle.
- Displays:
  - Height
  - Weight
  - Abilities
  - Individual stats
  - Total stats
- Animated modal interface.

### Type Explorer

- Browse all 18 Pokémon types.
- Select a type to display Pokémon belonging to that type.
- Displays type effectiveness information.
- Shows:
  - Super Effective Against
  - Weak Against
  - Resistant To
  - Immune To
- Pokémon cards can be selected to open the same detail modal used by the main Pokédex.

### Responsive Design

- Mobile-friendly layout.
- Responsive Pokémon card grid.
- Responsive type selector.
- Navigation between the Pokédex and Type Explorer.
- Footer and controls adapt to smaller screens.

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Fetch API
- PokéAPI

## 🔌 API

Pokémon information is provided by:

[PokéAPI](https://pokeapi.co/)

The project retrieves data for Pokémon #1–#151 from the PokéAPI.

## 📁 Project Structure

Pokedex-Project/
│
├── index.html
├── types.html
│
├── pokemon-data.js
├── script.js
├── types.js
│
├── style.css
│
└── README.md

This ReadMe was created using AI
