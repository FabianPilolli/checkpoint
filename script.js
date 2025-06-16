// script.js

const RAWG_API_KEY = '65229518335b475fb5c88c308153cf0c'; // Tu API Key
const RAWG_BASE_URL = 'https://api.rawg.io/api';
const gameIconsContainer = document.getElementById('game-icons-container');

// Lista de juegos para buscar sus íconos (ajusta los nombres para una mejor búsqueda)
// Es crucial que estos nombres sean lo/ultimate/characters más parecido posible a cómo aparecen en RAWG.io
// Algunos juegos pueden requerir ajuste manual o un mapeo si el nombre no coincide exactamente.
const gameNames = [
    "A Hat in Time",
    "ARMS",
    "Batman Arkham Knight", // Ajustado para búsqueda
    "Bread and Fred",
    "Cave Story+",
    "DRAGON BALL FighterZ",
    "Fallout 4",
    "Guilty Gear Strive", // Ajustado para búsqueda
    "Hollow Knight",
    "HUNTERxHUNTER NENxIMPACT", // Ajustado para búsqueda
    "It Takes Two",
    "Kill la Kill IF", // Ajustado para búsqueda
    "KING OF FIGHTERS XIII GLOBAL MATCH",
    "Kirby Fighters 2",
    "Mario Kart 8 Deluxe",
    "Mario Party Jamboree",
    "Mario Tennis Aces",
    "METAL SLUG XX",
    "Metal Slug",
    "Minecraft Dungeons",
    "Mortal Kombat 11",
    "Nintendo 64", // Este es una consola, no un juego en sí, es probable que no tenga un ícono de juego. Podrías buscar juegos de N64 en su lugar.
    "ONE PIECE PIRATE WARRIORS 4", // Ajustado para búsqueda
    "Persona 4 Arena Ultimax",
    "Resident Evil 4",
    "Resident Evil 5",
    "Resident Evil 6",
    "Saint Seiya Soldiers' Soul", // Ajustado para búsqueda
    "Scott Pilgrim Vs the World: The Game", // Nombre completo para mayor precisión
    "Smash Bros Ultimate", // Ajustado para búsqueda si te refieres a Ultimate
    "Sonic Superstars",
    "Stray",
    "Street Fighter 6",
    "Super Mario Bros Wonder", // Ajustado para búsqueda
    "Super Mario Party Jamboree", // Ajustado para búsqueda
    "TEKKEN 8",
    "The Binding of Isaac Afterbirth+",
    "Undernight In-Birth ExeLate[cl-r]", // Nombre más preciso
    "Vampire Survivors",
    "Wonderlands" // Asumiendo Tiny Tina's Wonderlands
];

async function fetchGameIcon(gameName) {
    try {
        // Codificar el nombre del juego para la URL
        const encodedGameName = encodeURIComponent(gameName);
        const url = `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&search=${encodedGameName}&page_size=1`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const game = data.results[0]; // Tomar el primer resultado como el más relevante
            // RAWG.io no tiene un campo 'icon_url' directo para el logo del juego en todas las respuestas de búsqueda.
            // La mejor imagen disponible suele ser 'background_image' o 'short_screenshots'.
            // Vamos a usar background_image para este ejemplo, pero ten en cuenta que no es un "ícono" pequeño.
            // Para íconos pequeños, a veces se requiere una búsqueda más específica o una imagen que crees tú.
            const imageUrl = game.background_image || game.short_screenshots?.[0]?.image;

            if (imageUrl) {
                return {
                    name: game.name,
                    imageUrl: imageUrl
                };
            }
        }
        return null; // No se encontró imagen
    } catch (error) {
        console.error(`Error fetching icon for ${gameName}:`, error);
        return null;
    }
}

async function displayGameIcons() {
    gameIconsContainer.innerHTML = '<p>Cargando íconos...</p>'; // Mensaje de carga

    const fetchedIcons = [];
    for (const name of gameNames) {
        const iconData = await fetchGameIcon(name);
        if (iconData) {
            fetchedIcons.push(iconData);
        }
    }

    // Limpiar el mensaje de carga
    gameIconsContainer.innerHTML = '';

    if (fetchedIcons.length === 0) {
        gameIconsContainer.innerHTML = '<p>No se pudieron cargar los íconos de los juegos.</p>';
        return;
    }

    fetchedIcons.forEach(game => {
        const gameDiv = document.createElement('div');
        gameDiv.classList.add('game-icon-item');
        gameDiv.innerHTML = `
            <img src="${game.imageUrl}" alt="${game.name} icon">
            <p>${game.name}</p>
        `;
        gameIconsContainer.appendChild(gameDiv);
    });
}

// Ejecutar la función cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', displayGameIcons);