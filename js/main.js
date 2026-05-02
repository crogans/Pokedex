import { getPokemon } from "./api.js";

const data = await getPokemon("pikachu");
console.log(data);