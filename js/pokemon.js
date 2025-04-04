/* eslint-disable linebreak-style */
/**
 * Pokemon API Service
 * This file contains functions for fetching and manipulating Pokemon data from the PokeAPI
 */

// API Base URL
const API_BASE_URL = 'https://pokeapi.co/api/v2';

// Total number of Pokemon in the API (as of Gen 9)
const TOTAL_POKEMON = 1008;

/**
 * Fetch a random Pokemon from the PokeAPI
 * @returns {Promise<Object>} Pokemon data
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/fetch | MDN: fetch API}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random | MDN: Math.random}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor | MDN: Math.floor}
 */
async function fetchRandomPokemon() {
  // CHALLENGE 1: Implement the random Pokemon fetching function
  // 1. Wrap everything in a try/catch block
  // 2. Generate a random ID between 1 and TOTAL_POKEMON using Math.floor and Math.random
  // 3. Use the fetch API to get data from `${API_BASE_URL}/pokemon/${randomId}`
  // 4. Check if the response is ok (response.ok)
  // 5. If not ok, throw an error with the status code
  // 6. Parse the JSON response (response.json())
  // 7. Process the raw data using the processPokemonData function
  // 8. Return the processed Pokemon data
  // 9. In the catch block, log the error and return null

  try{
    const randomId = Math.floor(Math.random() * TOTAL_POKEMON)+1;
    const response = await fetch(`${API_BASE_URL}/pokemon/${randomId}`);

    if(!response.ok){
      throw new Error(`Failed to fetch Pokemon: ${response.status}`);
    }

    const data = await response.json();
    return processPokemonData(data);
  } catch(error){
    console.error('Error fetching random Pokemon:', error.message);
    return null;
  }

  // DEBUGGING TIP: Track the API request:
  // console.log(`Fetching Pokemon with ID: ${randomId}`);
  // If there are issues, log the raw response:
  // console.log('Raw API response status:', response.status);
  // console.log('Raw API response ok:', response.ok);
  // You can also check the data before processing:
  // console.log('Raw Pokemon data:', data);
}

/**
 * Fetch multiple random Pokemon at once
 * @param {number} count - Number of Pokemon to fetch
 * @returns {Promise<Array<Object>>} Array of Pokemon data
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill | MDN: Array.fill}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map | MDN: Array.map}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all | MDN: Promise.all}
 */
async function fetchMultipleRandomPokemon(count) {
  // CHALLENGE 2: Implement the multiple Pokemon fetching function
  // 1. Wrap everything in a try/catch block.
  // 2. Inside the try block, create an empty array named 'promises'.
  // 3. Use a for loop that iterates from 0 to count-1,
  // and in each iteration, push the result of fetchRandomPokemon()
  // into the 'promises' array.
  // 4. Use Promise.all on the 'promises' array to wait for all the promises
  // to resolve, and assign the result to a variable (e.g. 'pokemonList').
  // 5. Return the 'pokemonList'.
  // 6. In the catch block, log the error using console.error and return an empty array.

  try{
    const promises = [];
    for(let i=0;i<count;i++){
      promises.push(fetchRandomPokemon());
    }
    const pokemonList = await Promise.all(promises);
    return pokemonList;
  } catch(error){
    console.error('Error fetching multiple Pokemon:', error.message);
    return [];
  }

  // DEBUGGING TIP:
  // - Before calling Promise.all,
  // log the 'promises' array to verify it contains
  // the correct number of promises.
  // - After Promise.all resolves, log the length of
  // 'pokemonList' to ensure all Pokemon were fetched.
  // - In the catch block, log the error details to help with debugging.
}

/**
 * Process the raw Pokemon data into a more usable format
 * @param {Object} data - Raw Pokemon data from the API
 * @returns {Object} Processed Pokemon data
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map | MDN: Array.map}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find | MDN: Array.find}
 */
function processPokemonData(data) {
  // CHALLENGE 3: Implement the data processing function
  // 1. Return an object with the following properties:
  //    - id: the Pokemon's ID
  //    - name: the capitalized Pokemon name (use capitalizeFirstLetter)
  //    - sprite: the official artwork image URL (or front_default as fallback)
  //    - types: an array of type names
  //    - height: the height converted to meters (divide by 10)
  //    - weight: the weight converted to kilograms (divide by 10)
  //    - abilities: an array of ability names (use capitalizeFirstLetter)
  //    - stats: an object with hp, attack, defense and speed (use findStat)
  //    - speciesUrl: the URL to the Pokemon's species data

  return {
    id: data.id,
    name: capitalizeFirstLetter(data.name),
    sprite: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
    types: data.types.map(type => type.type.name),
    height: data.height/10,
    weight: data.weight/10,
    abilities: data.abilities.map(ability => capitalizeFirstLetter(ability.ability.name)),
    stats: {
      hp: findStat(data.stats, 'hp'),
      attack: findStat(data.stats, 'attack'),
      defense: findStat(data.stats, 'defense'),
      speed: findStat(data.stats, 'speed'),
    },
    speciesUrl: data.species.url,
  };

  // DEBUGGING TIP: Log the raw vs processed data:
  // console.log('Raw Pokemon data structure:', {
  //   id: data.id,
  //   name: data.name,
  //   sprites: data.sprites,
  //   types: data.types,
  //   height: data.height,
  //   weight: data.weight,
  //   abilities: data.abilities,
  //   stats: data.stats
  // });
  // console.log('Processed Pokemon data:', processedData);
  // Check specific transformations:
  // console.log('Types transformation:', data.types, '->', types);
}

/**
 * Find a specific stat from the stats array
 * @param {Array<Object>} stats - Stats array from the API
 * @param {string} statName - Name of the stat to find
 * @returns {number} Stat value
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find | MDN: Array.find}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining | MDN: Optional chaining}
 */
function findStat(stats, statName) {
  // CHALLENGE 4: Implement the stat finder function
  // 1. Use the find method to locate the stat object with stat.name === statName
  // 2. Return the base_stat value if found or 0 if not found

  const stat = stats.find(s => s.stat.name === statName);

  return stat || 0;

  // DEBUGGING TIP: Trace the stat search:
  // console.log(`Looking for stat "${statName}" in:`, stats);
  // console.log(`Found stat:`, stat);
  // console.log(`Returning value:`, stat ? stat.base_stat : 0);
}

/**
 * Capitalize the first letter of a string
 * @param {string} string - String to capitalize
 * @returns {string} Capitalized string
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt | MDN: String.charAt}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice | MDN: String.slice}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace | MDN: String.replace}
 */
function capitalizeFirstLetter(string) {
  // CHALLENGE 5: Implement the string capitalization function
  // 1. Take the first character of the string using charAt(0)
  // 2. Convert it to uppercase
  // 3. Replace all hyphens with spaces using replace('-', ' ')
  // 4. Get the rest of the string using slice(1)
  // 5. Combine and return the uppercase first letter with the rest of the string

  return string.charAt(0).toUpperCase() + string.replace('-', ' ').slice(1);

  // DEBUGGING TIP: Track string transformation:
  // console.log(`Input string: "${string}"`);
  // const firstChar = string.charAt(0).toUpperCase();
  // console.log(`First character (uppercase): "${firstChar}"`);
  // const restOfString = string.replace('-', ' ').slice(1);
  // console.log(`Rest of string (with hyphens replaced): "${restOfString}"`);
  // console.log(`Final result: "${firstChar + restOfString}"`);
}

// CHALLENGE 6: Export the service functions
// 1. Expose the Pokemon service functions through the window object
// 2. Create a PokemonService object with fetchRandomPokemon and fetchMultipleRandomPokemon

window.PokemonService = {
  fetchRandomPokemon,
  fetchMultipleRandomPokemon
};

// DEBUGGING TIP: Verify the global export:
// console.log('PokemonService exposed to window:', !!window.PokemonService);
// console.log('Available methods:', Object.keys(window.PokemonService));
