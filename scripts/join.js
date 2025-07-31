import { supabase } from "./superbase.js";

const joinForm = document.getElementById("joinForm");
const roomCodeInput = document.getElementById("roomCodeInput");
const playerNameInput = document.getElementById("playerNameInput");
const playerList = document.getElementById("playerList");
const startGameBtn = document.getElementById("startGameBtn");

let roomCode = "";
let isHost = false;

// Handle join form submit
joinForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    roomCode = roomCodeInput.value.trim().toUpperCase();
    const playerName = playerNameInput.value.trim();

    if (!roomCode || !playerName) return;

    // Add player to the room
    const { error } = await supabase
        .from("players")
        .insert([{ name: playerName, room_code: roomCode }]);
    if (error) {
        alert("Error joining room: " + error.message);
        return;
    }

    // Redirect to room.html after joining
    window.location.href = `room.html?room=${roomCode}&host=false`;

    // Fetch and render players
    async function fetchPlayers() {
        const { data: players, error } = await supabase
            .from("players")
            .select("*")
            .eq("room_code", roomCode);

        if (error) {
            alert("Error fetching players: " + error.message);
            return;
        }

        renderPlayers(players);
    }

    // Render players and manage Start Game button
    function renderPlayers(players) {
        playerList.innerHTML = "";
        players.forEach((player, idx) => {
            const li = document.createElement("li");
            li.textContent = `${idx + 1}. ${player.name}`;
            li.className = "bg-gray-800 px-4 py-2 rounded";
            playerList.appendChild(li);
        });

        // Only show and enable Start Game if host and at least 2 players
        if (isHost) {
            startGameBtn.classList.remove("hidden");
            startGameBtn.disabled = players.length < 2;
        }
    }

    // Listen for real-time player joins
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
            fetchPlayers
        )
        .subscribe();
});
