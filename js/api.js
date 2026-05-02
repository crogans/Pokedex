const BASE_URL = "https://pokeapi.co/api/v2"

// Get a single Pokemon by name
const getPokemon = async (name) => {
  let response = await fetch(`${BASE_URL}/pokemon/${name}`)
  let data = await response.json()
  return data
}

// Get a list of all Pokemon that exist (1025 with Gen 9)
const getPokemonList = async () => {
  let response = await fetch(`${BASE_URL}/pokemon?limit=1025`);
  let data = await response.json();
  return data.results;
};

export { getPokemon, getPokemonList }