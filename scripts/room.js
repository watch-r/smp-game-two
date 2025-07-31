// /scripts/room.js
import { supabase } from "./superbase.js";

// DOM elements
const roomCodeDisplay = document.getElementById("roomCode");
const playerList = document.getElementById("playerList");
const startGameBtn = document.getElementById("startGameBtn");

// Get room info from URL
const urlParams = new URLSearchParams(window.location.search);
const roomCode = urlParams.get("room");
const isHost = urlParams.get("host") === "true";

// Display room code
roomCodeDisplay.textContent = roomCode;

// Fetch and display current players
async function fetchPlayers() {
    const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("room_code", roomCode);

    if (error) {
        console.error("Error fetching players:", error.message);
        return;
    }

    renderPlayers(data);
}

// Render players in list
function renderPlayers(players) {
    playerList.innerHTML = "";
    players.forEach((player, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${player.name}`;
        li.className = "bg-gray-800 px-4 py-2 rounded";
        playerList.appendChild(li);
    });
}

// Shuffle roles
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Host starts the game
if (isHost) {
    startGameBtn.classList.remove("hidden");

    startGameBtn.addEventListener("click", async () => {
        // 1. Fetch players
        const { data: players, error: fetchError } = await supabase
            .from("players")
            .select("*")
            .eq("room_code", roomCode);

        if (fetchError) {
            alert("Error fetching players: " + fetchError.message);
            return;
        }

        // 2. Create and shuffle roles
        let roles = Array(players.length).fill("villager");
        roles[0] = "killer"; // 1 killer
        roles = shuffleArray(roles);

        // 3. Assign roles
        for (let i = 0; i < players.length; i++) {
            await supabase
                .from("players")
                .update({ role: roles[i] })
                .eq("id", players[i].id);
        }

        // 4. Mark game as started
        const { error: updateError } = await supabase
            .from("rooms")
            .update({ game_status: "started" })
            .eq("code", roomCode);

        if (updateError) {
            alert("Error starting game: " + updateError.message);
        } else {
            // 5. Go to play.html
            window.location.href = `../game/play.html?room=${roomCode}`;
        }
    });
}

// Subscribe to player joins in real time
supabase
    .channel("players-room-" + roomCode)
    .on(
        "postgres_changes",
        {
            event: "INSERT",
            schema: "public",
            table: "players",
            filter: `room_code=eq.${roomCode}`,
        },
        () => {
            fetchPlayers(); // Refresh on join
        }
    )
    .subscribe();

// Initial player fetch
fetchPlayers();
