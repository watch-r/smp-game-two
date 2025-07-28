// /scripts/room.js
import { supabase } from "./superbase.js";

// 📌 Get DOM elements
const roomCodeDisplay = document.getElementById("roomCode");
const playerList = document.getElementById("playerList");
const startGameBtn = document.getElementById("startGameBtn");

// 📦 Get room code and isHost from query parameters
const urlParams = new URLSearchParams(window.location.search);
const roomCode = urlParams.get("room");
const isHost = urlParams.get("host") === "true";

// 🖊️ Display room code
roomCodeDisplay.textContent = roomCode;
console.log("Room Code:", urlParams);

// 🔄 Fetch and show all players
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

// 👥 Render players
function renderPlayers(players) {
    playerList.innerHTML = "";
    players.forEach((player, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${player.name}`;
        li.className = "bg-gray-800 px-4 py-2 rounded";
        playerList.appendChild(li);
    });
}

// 🔔 Subscribe to realtime player join
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
        (payload) => {
            fetchPlayers(); // update player list on new join
        }
    )
    .subscribe();

// 🚀 Show start button if host
if (isHost) {
    startGameBtn.classList.remove("hidden");
    startGameBtn.addEventListener("click", async () => {
        const { error } = await supabase
            .from("rooms")
            .update({ game_status: "started" })
            .eq("code", roomCode);

        if (error) {
            alert("Error starting game: " + error.message);
        } else {
            // Redirect all players to the game page
            window.location.href = `../game/play.html?room=${roomCode}&host=true`;
        }
    });
}

// 🏁 Initial fetch
fetchPlayers();
