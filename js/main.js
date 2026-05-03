import { getPokemon, getPokemonList } from "./api.js"

// Get the list of all Pokémon
const pokemonList = await getPokemonList()

// Get the details of each Pokémon in the list
const pokemonDetails = await Promise.all(
  pokemonList.map(pokemon => getPokemon(pokemon.name))
)

// Hides the loading message once all Pokemon details have been fetched */
document.getElementById("loading").style.display = "none"

// Displays the Pokémon details on the page
const pokemonContainer = document.getElementById("pokemon")

pokemonDetails.forEach(pokemon => {
  const pokemonCard = document.createElement("div")
  pokemonCard.classList.add("pokemon-card")

  // Get the types of the Pokémon and create labels for them
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

// Filters the displayed Pokémon based on the search term and active type filter
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

// Pokémon Detail Popup functionality
const popupContainer = document.getElementById("pokemon-popup-container")
const popupInfo = document.getElementById("pokemon-popup-info")
const popupClose = document.getElementById("pokemon-popup-close")

// Opens the popup with the clicked Pokemon's details
pokemonContainer.addEventListener("click", (event) => {
  const card = event.target.closest(".pokemon-card")
  if (!card) return

  // Get the index of the clicked card and use it to get the corresponding Pokemon details
  const index = Array.from(pokemonContainer.children).indexOf(card)
  const pokemon = pokemonDetails[index]

  // Get the types of the Pokémon and create labels for them
  const types = pokemon.types.map(t => t.type.name)
  const typeLabels = types.map(type => `<span class="type ${type}">${type}</span>`).join("")

  // Get the normal and shiny images for the Pokémon
  const normalImage = pokemon.sprites.other['official-artwork'].front_default
  const shinyImage = pokemon.sprites.other['official-artwork'].front_shiny

  // Height and weight are divided by 10 to convert from decimeters to meters and hectograms to kilograms
  popupInfo.innerHTML = `
    <img id="popup-sprite" src="${normalImage}" alt="${pokemon.name}">
    <div id="popup-name">
      <h2>${pokemon.name}</h2>
      <button id="shiny-toggle">✨</button>
    </div>
    <div class="types">${typeLabels}</div>
    <p><strong>Pokédex:</strong> #${pokemon.id}</p>
    <p><strong>Height:</strong> ${pokemon.height / 10}m</p>
    <p><strong>Weight:</strong> ${pokemon.weight / 10}kg</p>
  `

  // Toggle between normal and shiny images when the shiny button is clicked
  let isShiny = false
  document.getElementById("shiny-toggle").addEventListener("click", () => {
    isShiny = !isShiny
    document.getElementById("popup-sprite").src = isShiny ? shinyImage : normalImage
  })

  popupContainer.classList.add("active")
})

// Closes the popup when the close button is clicked
popupClose.addEventListener("click", () => {
  popupContainer.classList.remove("active")
})

// Closes the popup when clicking outside of it
popupContainer.addEventListener("click", (event) => {
  if (event.target === popupContainer) {
    popupContainer.classList.remove("active")
  }
})