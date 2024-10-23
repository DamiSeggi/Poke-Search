const content = document.querySelector(".content");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const colorOfName = document.getElementById("character__name");



//Haupteil um alle Pokemon zu speichern
let allPokemon = []; // Array, um alle Pokémon-Daten zu speichern
fetch("https://pokeapi.co/api/v2/pokemon?limit=10000")
    .then(res => res.json())
    .then(res => {
        const pokemonPromises = res.results.map(pokemon => {
            return fetch(pokemon.url)
                .then(res => res.json());
        });

        Promise.all(pokemonPromises)
            .then(pokemonDataArray => {
                allPokemon = pokemonDataArray; // Speichere alle Pokémon-Daten
                displayPokemon(allPokemon); // Zeige alle Pokémon an
            });
    });



















// Funktion zum Anzeigen der Pokémon
function displayPokemon(pokemonArray) {
    content.innerHTML = ""; // Leere den Inhalt
    if (pokemonArray.length === 0) {
        const noResultMessage = document.createElement('p');
        noResultMessage.textContent = "Kein Pokémon mit diesem Typ oder Namen.";
        noResultMessage.style.color = "red"; // Farbe der Fehlermeldung
        content.appendChild(noResultMessage);
        return;
    }
    pokemonArray.forEach(pokemonData => {
        const template = document.getElementById("template-character").content.cloneNode(true);

        const img = template.querySelector(".character__picture img");
        const name = template.querySelector(".character__name");
        const type = template.querySelector(".character__type");
        const size = template.querySelector(".character__size");

        img.src = pokemonData.sprites.front_default;
        name.textContent = pokemonData.name;
        type.textContent = pokemonData.types.map(t => t.type.name).join(", ");
        size.textContent = `Height: ${pokemonData.height / 10} m`;

        content.appendChild(template);
    });
}

// Suchfunktion
function filterPokemon() {
    const query = searchInput.value.toLowerCase(); // Hole den Suchbegriff in Kleinbuchstaben
    const filteredPokemon = allPokemon.filter(pokemon => {
        const nameMatch = pokemon.name.toLowerCase().includes(query); // Suche nach Namen, der den Suchbegriff enthält
        const typeMatch = pokemon.types.some(type => type.type.name.toLowerCase().includes(query)); // Suche nach Typ
        return nameMatch || typeMatch; // Entweder nach Namen oder Typ filtern
    });

    // Alphabetische Sortierung
    filteredPokemon.sort((a, b) => a.name.localeCompare(b.name));

    displayPokemon(filteredPokemon); // Zeige die gefilterten Pokémon an
}

// Event Listener für den Such-Button
searchButton.addEventListener("click", filterPokemon);

// Event Listener für das Eingabefeld (drücken der Enter-Taste)
searchInput.addEventListener("keyup", function (event) {
    if (event.key === 'Enter') {
        filterPokemon(); // Suche ausführen, wenn Enter gedrückt wird
    }
});

