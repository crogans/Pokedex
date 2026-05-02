const BASE_URL = "https://pokeapi.co/api/v2"

const getPokemon = async (name) => {
  let response = await fetch(`${BASE_URL}/pokemon/${name}`)
  let data = await response.json()
  return data
}

export { getPokemon }