import { getPokemon, getPokemonList } from "./api.js"

// Get the list of all Pokemon
const pokemonList = await getPokemonList()

// Get the details of each Pokemon in the list
const pokemonDetails = await Promise.all(
  pokemonList.map(pokemon => getPokemon(pokemon.name))
)

// Hides the loading message once all Pokemon details have been fetched */
document.getElementById("loading").style.display = "none"

// Displays the Pokemon details on the page
const pokemonContainer = document.getElementById("pokemon")

pokemonDetails.forEach(pokemon => {
  const pokemonCard = document.createElement("div")
  pokemonCard.classList.add("pokemon-card")

  // Get the types of the Pokemon and create labels for them
  const types = pokemon.types.map(t => t.type.name)
  const typeLabels = types.map(type => `<span class="type ${type}">${type}</span>`).join("")

  pokemonCard.innerHTML = `
  <h3>${pokemon.name}</h3>
  <div class="types">
    ${typeLabels}
  </div>
  <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
  `

  pokemonContainer.appendChild(pokemonCard)
})

// Search functionality
const searchInput = document.getElementById("search")
const noResults = document.getElementById("no-results")

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase()
  const filteredPokemon = pokemonDetails.filter(pokemon => pokemon.name.includes(searchTerm))

  document.querySelectorAll(".pokemon-card").forEach((card, index) => {
    const name = pokemonDetails[index].name
    card.style.display = name.includes(searchTerm) ? "block" : "none"
  })

  // Shows the "No Pokémon were found." message if there are no matches, otherwise hides it
  noResults.style.display = filteredPokemon.length === 0 ? "block" : "none"
})

// Type filter functionality
const types = [
  "all", "fire", "water", "grass", "electric", "normal", "psychic", "dark", "ghost", "ice", "dragon", "fairy", "fighting", "flying", "poison", "ground", "rock", "bug", "steel"
]
const typeFilter = document.getElementById("type-filter")

// Creates buttons for each type and adds them to the type filter container and assigns the type as a data attribute for filtering
types.forEach(type => {
  const button = document.createElement("button")
  button.classList.add("type-btn")
  button.dataset.type = type
  button.textContent = type
  typeFilter.appendChild(button)
})

typeFilter.addEventListener("click", (event) => {
  if (event.target.classList.contains("type-btn")) {
    const selectedType = event.target.getAttribute("data-type")

    document.querySelectorAll(".pokemon-card").forEach((card, index) => {
      const types = pokemonDetails[index].types.map(t => t.type.name)

      // If "All" is selected, shows all Pokemon, otherwise, show only those that match the selected type
      if (selectedType === "all") {
        card.style.display = "block"
      } else {
        card.style.display = types.includes(selectedType) ? "block" : "none"
      }
    })
  }
})