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

  pokemonCard.innerHTML = `
    <h3>#${pokemon.id} ${pokemon.name}</h3>
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
  `

  pokemonContainer.appendChild(pokemonCard)
})