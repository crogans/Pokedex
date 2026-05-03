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

// Search and type filter functionality
const searchInput = document.getElementById("search")
const noResults = document.getElementById("no-results")
const typeFilter = document.getElementById("type-filter")
let activeType = "all"

// Filters the displayed Pokemon based on the search term and active type filter
const filterPokemon = () => {
  const searchTerm = searchInput.value.toLowerCase()
  let matchCount = 0

  document.querySelectorAll(".pokemon-card").forEach((card, index) => {
    const pokemon = pokemonDetails[index]
    const matchesSearch = pokemon.name.includes(searchTerm)
    const matchesType = activeType === "all" || pokemon.types.map(t => t.type.name).includes(activeType)

    // Show the card if it matches both the search term and the active type filter, otherwise hide it
    if (matchesSearch && matchesType) {
      card.style.display = "block"
      matchCount++
    } else {
      card.style.display = "none"
    }
  })

  // Shows the "No Pokémon were found." message if there are no matches, otherwise hides it
  noResults.style.display = matchCount === 0 ? "block" : "none"
}

searchInput.addEventListener("input", () => {
  filterPokemon()
})

const types = [
  "all", "fire", "water", "grass", "electric", "normal", "psychic", "dark", "ghost", "ice", "dragon", "fairy", "fighting", "flying", "poison", "ground", "rock", "bug", "steel"
]

// Creates buttons for each type and adds them to the type filter container and assigns the type as a data attribute for filtering
types.forEach(type => {
  const button = document.createElement("button")
  button.classList.add("type-btn")
  button.dataset.type = type
  button.textContent = type
  typeFilter.appendChild(button)
})

// If a type button is clicked, it is then active and the filterPokemon function is called to update the displayed Pokemon based on the selected type
typeFilter.addEventListener("click", (event) => {
  if (event.target.classList.contains("type-btn")) {
    activeType = event.target.dataset.type
    document.querySelectorAll(".type-btn").forEach(btn => btn.classList.remove("active"))
    event.target.classList.add("active")
    filterPokemon()
  }
})