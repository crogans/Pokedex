import { getPokemon, getPokemonList } from "./api.js"

// Get the list of all Pokemon
const pokemonList = await getPokemonList()

// Get the details of each Pokemon in the list
const pokemonDetails = await Promise.all(
    pokemonList.map(pokemon => getPokemon(pokemon.name))
)

const pokemonContainer = document.getElementById("pokemon")

// Displays the Pokemon details on the page
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